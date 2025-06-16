"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatCircleDotsIcon, MicrophoneIcon } from "@phosphor-icons/react";
import remarkGfm from "remark-gfm";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Geist_Mono } from "next/font/google";
import { SpinnerGapIcon } from "@phosphor-icons/react/dist/ssr";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: true,
  display: "swap",
});

const Chat = () => {
  const session = useSession();
  const [model, setModel] = useState<string>("gpt-3.5-turbo");
  const [isPending, setIsPending] = useState<boolean>(false);

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
  } = useChat({
    api: "/api/ask",
    onFinish: () => {
      // db calls
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  useEffect(() => {
    const query = localStorage.getItem("chatQuery");
    if (query) {
      setMessages([
        {
          id: `temp-${Date.now()}`,
          role: "user",
          content: query,
        },
      ]);
      localStorage.removeItem("chatQuery"); // Clear to avoid reuse
    }
  }, []);

  // useEffect(() => {
  //   const query = localStorage.getItem("chatQuery");
  //   if (query) {
  //     setMessages([
  //       {
  //         id: `temp-${Date.now()}`,
  //         role: "user",
  //         content: query,
  //       },
  //     ]);
  //     localStorage.removeItem("chatQuery"); // Clear to avoid reuse
  //   }
  // }, []);

  // const handleSendMessage = async () => {
  //   const response = await axios.post(
  //     "https://fast.typegpt.net/v1/chat/completions",
  //     {
  //       model: "gpt-3.5-turbo",
  //       messages: [{ role: "user", content: messages }],
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_TYPEGPT_API_KEY}`,
  //       },
  //     }
  //   );
  //   setResponse(response.data.choices[0].message.content)
  // }
  return (
    <div className="h-full">
      <div className="relative flex h-full w-full flex-col gap-4">
        {/* Fixed Input */}
        <div className="bg-muted absolute -bottom-10 w-full rounded-2xl p-2">
          <form
            onSubmit={handleFormSubmit}
            className="bg-accent/30 flex w-full flex-col rounded-xl p-3 pb-6"
          >
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask whatever you want to be"
              className="h-[2rem] resize-none rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-accent flex size-8 items-center justify-center rounded-lg border">
                  <MicrophoneIcon />
                </div>
                <Select
                  value={model}
                  onValueChange={(value) => setModel(value)}
                >
                  <SelectTrigger className="bg-accent max-h-8 active:ring-0">
                    <SelectValue className="h-5" placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Models</SelectLabel>
                      <SelectItem value="gemini-2.0-flash">
                        Gemini 2.0 Flash
                      </SelectItem>
                      <SelectItem value="gpt-3.5-turbo">
                        GPT 3.5 Turbo
                      </SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT 4o Mini</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-fit" disabled={isPending}>
                {isPending ? (
                  <SpinnerGapIcon className="animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
              {isPending && (
                <div className="absolute top-0 left-0 z-10 h-full w-full bg-black/50">
                  <div className="flex h-full items-center justify-center">
                    <SpinnerGapIcon className="animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
