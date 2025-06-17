"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MicrophoneIcon } from "@phosphor-icons/react";
import { useParams } from "next/navigation";

import { SpinnerGapIcon } from "@phosphor-icons/react/dist/ssr";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ModelSelector } from "@/components/ui/model-selector";
import { DEFAULT_MODEL_ID } from "@/models/constants";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: true,
  display: "swap",
});

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const { data: sessionData } = useSession();
  const [model, setModel] = useState<string>(DEFAULT_MODEL_ID);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const chatId = params?.chatId as string | undefined;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const processStream = async (response: Response, userMessage: string) => {
    if (!response.ok) {
      console.error("Error from API:", response.statusText);
      setIsLoading(false);
      return;
    }

    try {
      const reader = response.body?.getReader();
      if (!reader) {
        console.error("No reader available");
        setIsLoading(false);
        return;
      }

      const tempMessageId = `ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: tempMessageId, role: "assistant", content: "" },
      ]);

      let accumulatedContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log("Stream complete");
          break;
        }

        const chunk = new TextDecoder().decode(value);
        console.log("Received chunk:", chunk);

        buffer += chunk;

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const data = line.substring(6);

            if (data === "[DONE]") {
              console.log("Stream ended with [DONE]");
              continue;
            }

            try {
              console.log("Parsing JSON:", data);
              const parsedData = JSON.parse(data) as {
                choices?: Array<{
                  delta?: {
                    content?: string;
                  };
                }>;
              };

              const content = parsedData.choices?.[0]?.delta?.content;
              if (content) {
                console.log("Received content:", content);
                accumulatedContent += content;

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempMessageId
                      ? { ...msg, content: accumulatedContent }
                      : msg,
                  ),
                );
              }
            } catch (e) {
              console.error("Error parsing JSON:", e, line);
            }
          }
        }
      }

      console.log("Saving chat to database:", userMessage, accumulatedContent);
    } catch (error) {
      console.error("Error processing stream:", error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = input.trim();

    setInput("");

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: currentMessage }],
          model: model,
        }),
        signal: abortControllerRef.current.signal,
      });

      await processStream(response, currentMessage);
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Error sending message:", error);
      }
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const query = localStorage.getItem("chatQuery");
    if (query) {
      setInput(query);
      localStorage.removeItem("chatQuery");
    }
  }, []);

  return (
    <div className="h-full">
      <div className="relative flex h-full w-full flex-col">

        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-40 md:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-4xl py-4">
            {messages.length === 0 ? (
              <div className="text-muted-foreground flex h-[50vh] items-center justify-center">
                Start a conversation by typing a message below
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex flex-col gap-2 rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-primary/10 w-full self-end md:w-5/6 lg:w-3/4"
                        : "bg-muted w-full self-start md:w-5/6 lg:w-3/4"
                    }`}
                  >
                    <div className="font-medium">
                      {message.role === "user" ? "You" : "AI"}
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code(props) {
                            const { children, className } = props;
                            const match = /language-(\w+)/.exec(
                              className ?? "",
                            );
                            const isInline = !match;

                            return isInline ? (
                              <code
                                className={cn(
                                  "rounded-sm bg-[#231f2e] px-1 py-0.5 text-zinc-300",
                                  geistMono.className,
                                )}
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
                          strong(props) {
                            return (
                              <span className="font-bold">
                                {props.children}
                              </span>
                            );
                          },
                          h1(props) {
                            return (
                              <h1 className="my-4 text-2xl font-bold">
                                {props.children}
                              </h1>
                            );
                          },
                          h2(props) {
                            return (
                              <h2 className="my-3 text-xl font-bold">
                                {props.children}
                              </h2>
                            );
                          },
                          h3(props) {
                            return (
                              <h3 className="my-2 text-lg font-bold">
                                {props.children}
                              </h3>
                            );
                          },
                          a(props) {
                            return (
                              <a
                                className="text-primary underline"
                                href={props.href}
                              >
                                {props.children}
                              </a>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="bg-muted mb-4 flex w-full items-start gap-2 self-start rounded-lg p-4 md:w-5/6 lg:w-3/4">
                    <div className="font-medium">AI</div>
                    <SpinnerGapIcon className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="bg-muted border-border/20 absolute bottom-0 w-full border-t p-2">
          <div className="mx-auto w-full max-w-4xl">
            <form
              onSubmit={handleSubmit}
              className="bg-accent/30 flex w-full flex-col rounded-xl p-3 pb-6"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask whatever you want to be"
                className="h-[2rem] resize-none rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
                disabled={isLoading}
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-accent flex size-8 items-center justify-center rounded-lg border">
                    <MicrophoneIcon />
                  </div>
                  <ModelSelector
                    value={model}
                    onValueChange={setModel}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-fit"
                  disabled={isLoading || !input.trim()}
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

export default Chat;
