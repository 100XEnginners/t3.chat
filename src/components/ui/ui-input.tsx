"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ChatCircleDotsIcon,
  MicrophoneIcon,
  RobotIcon,
  SpinnerGapIcon,
  UserIcon,
  CopyIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  SpeakerHighIcon,
  SpeakerXIcon,
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import TabsSuggestion from "./tabs-suggestion";
import { useFont } from "@/contexts/font-context";
import { ModelSelector } from "@/components/ui/model-selector";
import { DEFAULT_MODEL_ID } from "@/models/constants";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import { toast } from "sonner";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: true,
  display: "swap",
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const UIInput = () => {
  const session = useSession();
  const [model, setModel] = useState<string>(DEFAULT_MODEL_ID);
  const [modeOfChatting, setModeOfChatting] = useState<"text" | "voice">("text");
  const [query, setQuery] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const welcomeSpokenRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const { speak, cancel, speaking, supported: ttsSupported, voices } = useSpeechSynthesis();
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (modeOfChatting === "voice" && !ttsSupported) {
      toast.error("Text-to-speech not supported in your browser");
      setModeOfChatting("text");
    }
  }, [modeOfChatting, ttsSupported]);

  useEffect(() => {
    if (ttsSupported && voices.length > 0) {
      const defaultVoice = voices.find(v => v.default) || voices[0];
      setSelectedVoice(defaultVoice!);
    }
  }, [voices, ttsSupported]);

  useEffect(() => {
    if (listening) {
      setQuery(transcript);
    }
  }, [listening, transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (showWelcome && messages.length === 0 && modeOfChatting === "voice" && ttsSupported && selectedVoice && !welcomeSpokenRef.current) {
      welcomeSpokenRef.current = true;
      speak({
        text: `Hello mate, how may I help you today?`,
        voice: selectedVoice
      });
    }
  }, [showWelcome, messages.length, modeOfChatting, ttsSupported, selectedVoice, speak]);

  const createChat = api.chat.createChat.useMutation({
    onError: (error) => {
      console.error("Error saving chat:", error);
    },
  });

  const processStream = async (response: Response, userMessage: string) => {
    if (!response.ok) {
      console.error("Error from API:", response.statusText);
      setIsLoading(false);
      return;
    }

    const tempMessageId = `ai-${Date.now()}`;

    try {
      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No reader available");
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: tempMessageId, role: "assistant", content: "" },
      ]);

      let accumulatedContent = "";
      let buffer = "";
      let updateTimeout: NodeJS.Timeout | null = null;

      const updateMessage = (content: string) => {
        if (updateTimeout) {
          clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempMessageId ? { ...msg, content } : msg,
            ),
          );
        }, 50);
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempMessageId
                ? { ...msg, content: accumulatedContent }
                : msg,
            ),
          );

          if (updateTimeout) {
            clearTimeout(updateTimeout);
          }

          if (modeOfChatting === "voice" && ttsSupported && selectedVoice) {
            speak({
              text: accumulatedContent,
              voice: selectedVoice
            });
          }

          break;
        }

        const chunk = new TextDecoder().decode(value);

        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let hasNewContent = false;

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const data = line.substring(6);

            if (data === "[DONE]") {
              continue;
            }

            try {
              const parsedData = JSON.parse(data) as {
                choices?: Array<{
                  delta?: {
                    content?: string;
                  };
                }>;
                error?: string;
              };

              if (parsedData.error) {
                console.error("Stream error:", parsedData.error);
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempMessageId
                      ? { ...msg, content: `Error: ${parsedData.error}` }
                      : msg,
                  ),
                );
                break;
              }

              const content = parsedData.choices?.[0]?.delta?.content;
              if (content) {
                accumulatedContent += content;
                hasNewContent = true;
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }

        if (hasNewContent) {
          updateMessage(accumulatedContent);
        }
      }
    } catch (error) {
      console.error("Error processing stream:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId
            ? { ...msg, content: "Error: Failed to process response" }
            : msg,
        ),
      );
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setShowWelcome(false);

    const currentQuery = query.trim();

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: currentQuery,
    };

    setQuery("");
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const { chatId } = await createChat.mutateAsync();
      setTimeout(() => {
        void (async () => {
          try {
            const response = await fetch("/api/ask", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                messages: [{ role: "user", content: currentQuery }],
                model: model,
                chatId: chatId,
              }),
              signal: abortControllerRef.current?.signal,
            });

            await processStream(response, currentQuery);
          } catch (error) {
            if ((error as Error).name !== "AbortError") {
              console.error("Error sending message:", error);
            }
            setIsLoading(false);
          }
        })();
      }, 0);
    } catch (error) {
      console.error("Error preparing request:", error);
      setIsLoading(false);
    }
  };

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    toast.success("Listening...", {
      description: "Speak now...",
      duration: 5000,
    });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    toast.success("Stopped listening", {
      description: "Processing your voice input...",
    });
  };

  const toggleMode = () => {
    if (modeOfChatting === "voice" && speaking) {
      cancel();
    }
    setModeOfChatting(modeOfChatting === "text" ? "voice" : "text");
  };

  const { selectedFont } = useFont();

  return (
    <div className="flex h-[96vh] w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col">
        {showWelcome && messages.length === 0 ? (
          <div className="flex h-full w-full flex-col">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <div className="drop-shadow-primary/60 bg-primary relative mb-6 size-[4.5rem] overflow-hidden rounded-xl drop-shadow-2xl">
                <div className="bg-foreground absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
                  <ChatCircleDotsIcon className="text-background text-2xl" />
                </div>
              </div>
              <h1 className="text-2xl">
                Hello{" "}
                <span className="font-semibold">
                  {session.data?.user.name?.split(" ")[0]},
                </span>
              </h1>
              <p className="text-3xl">How may I help you today?</p>
              <TabsSuggestion />
            </div>
          </div>
        ) : (
          <div className="no-scrollbar mt-6 flex h-full w-full flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-10 md:px-8">
            <div className="mx-auto h-full w-full max-w-4xl">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-8 flex w-fit flex-col gap-2`}
                >
                  <div className="font-medium">
                    {message.role === "user" ? (
                      <div className="flex w-fit items-center gap-2 text-base font-semibold">
                        <div className="bg-accent flex size-6 items-center justify-center rounded-md">
                          <UserIcon weight="bold" />
                        </div>
                        <div>You</div>
                      </div>
                    ) : (
                      <div className="flex w-fit items-center gap-2 text-base font-semibold">
                        <div className="bg-accent flex size-6 items-center justify-center rounded-md">
                          <RobotIcon weight="bold" />
                        </div>
                        <div>AI</div>
                      </div>
                    )}
                  </div>
                  <div
                    className={cn(
                      "prose dark:prose-invert max-w-none rounded-lg px-4 py-2",
                      message.role === "user"
                        ? "bg-primary w-fit max-w-full font-bold"
                        : "bg-muted w-full border",
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code(props) {
                          const { children, className, ...rest } = props;
                          const match = /language-(\w+)/.exec(className ?? "");
                          const isInline = !match;

                          return isInline ? (
                            <code
                              className={cn(
                                "rounded-sm bg-[#231f2e] px-1 py-0.5 text-zinc-300",
                                geistMono.className,
                              )}
                              {...rest}
                            >
                              {children}
                            </code>
                          ) : (
                            <div className="my-4 overflow-hidden rounded-md">
                              <div className="bg-[#231f2e] px-4 py-2 text-sm text-zinc-400">
                                {match ? match[1] : "bash"}
                              </div>
                              <SyntaxHighlighter
                                language={match ? match[1] : "bash"}
                                style={{
                                  hljs: { background: "#231f2e" },
                                  "hljs-comment": { color: "#6c7086" },
                                  "hljs-keyword": { color: "#9d7cd8" },
                                  "hljs-built_in": { color: "#7aa2f7" },
                                  "hljs-string": { color: "#c4a7e7" },
                                  "hljs-variable": { color: "#7dcfff" },
                                  "hljs-title": { color: "#7aa2f7" },
                                  "hljs-attr": { color: "#ff9e64" },
                                  "hljs-symbol": { color: "#bb9af7" },
                                  "hljs-bullet": { color: "#73daca" },
                                  "hljs-literal": { color: "#ff9e64" },
                                  "hljs-number": { color: "#ff9e64" },
                                  "hljs-regexp": { color: "#b4f9f8" },
                                  "hljs-meta": { color: "#7dcfff" },
                                }}
                                customStyle={{
                                  background: "#231f2e",
                                  padding: "1rem",
                                  margin: 0,
                                  borderBottomLeftRadius: "0.375rem",
                                  borderBottomRightRadius: "0.375rem",
                                  fontSize: "0.9rem",
                                }}
                                codeTagProps={{
                                  className: geistMono.className,
                                }}
                                PreTag="div"
                                showLineNumbers={false}
                              >
                                {Array.isArray(children)
                                  ? children.join("")
                                  : typeof children === "string"
                                    ? children
                                    : ""}
                              </SyntaxHighlighter>
                            </div>
                          );
                        },
                        strong: (props) => (
                          <span className="font-bold">{props.children}</span>
                        ),
                        a: (props) => (
                          <a
                            className="text-primary underline"
                            href={props.href}
                          >
                            {props.children}
                          </a>
                        ),
                        h1: (props) => (
                          <h1 className="my-4 text-2xl font-bold">
                            {props.children}
                          </h1>
                        ),
                        h2: (props) => (
                          <h2 className="my-3 text-xl font-bold">
                            {props.children}
                          </h2>
                        ),
                        h3: (props) => (
                          <h3 className="my-2 text-lg font-bold">
                            {props.children}
                          </h3>
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <div className="font-medium">
                    {message.role === "assistant" && (
                      <div className="flex w-fit items-center gap-2 text-base font-semibold">
                        <button className="hover:bg-accent flex size-7 items-center justify-center rounded-lg">
                          <ThumbsUpIcon weight="bold" />
                        </button>
                        <button className="hover:bg-accent flex size-7 items-center justify-center rounded-lg">
                          <ThumbsDownIcon weight="bold" />
                        </button>
                        <button className="hover:bg-accent flex size-7 items-center justify-center rounded-lg">
                          <CopyIcon weight="bold" />
                        </button>
                        {modeOfChatting === "voice" && (
                          <button 
                            className="hover:bg-accent flex size-7 items-center justify-center rounded-lg"
                            onClick={() => {
                              if (speaking) {
                                cancel();
                              } else if (ttsSupported && selectedVoice) {
                                speak({
                                  text: message.content,
                                  voice: selectedVoice
                                });
                              }
                            }}
                          >
                            {speaking ? (
                              <SpeakerXIcon weight="bold" />
                            ) : (
                              <SpeakerHighIcon weight="bold" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="bg-muted mb-4 flex w-full items-start gap-2 self-start rounded-lg p-4 md:w-5/6 lg:w-3/4">
                  <div className="font-medium">AI</div>
                  <SpinnerGapIcon className="h-5 w-5 animate-spin" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <div className="bg-muted border-border/20 w-full rounded-2xl border-t p-2">
          <div className="mx-auto w-full max-w-4xl">
            <form
              onSubmit={handleCreateChat}
              className="bg-accent/30 flex w-full flex-col rounded-xl p-3 pb-3"
            >
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void handleCreateChat(e as any);
                  }
                }}
                placeholder={
                  modeOfChatting === "voice" 
                    ? "Or type here..." 
                    : "Ask whatever you want to be"
                }
                className="h-[2rem] resize-none rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
                disabled={isLoading}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMode}
                    className="text-xs"
                  >
                    {modeOfChatting === "text" ? "Switch to Voice" : "Switch to Text"}
                  </Button>
                  {modeOfChatting === "voice" && (
                    <div className="bg-accent flex size-8 items-center justify-center rounded-lg border">
                      <button 
                        onClick={listening ? handleStopListening : handleStartListening}
                        disabled={!browserSupportsSpeechRecognition}
                      >
                        <MicrophoneIcon 
                          weight="bold"  
                          className={`text-foreground size-4 hover:text-primary cursor-pointer ${
                            listening ? "text-red-500 animate-pulse" : ""
                          }`}
                        />
                      </button>
                    </div>
                  )}
                  <ModelSelector
                    value={model}
                    onValueChange={setModel}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-fit"
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <SpinnerGapIcon className="animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIInput;