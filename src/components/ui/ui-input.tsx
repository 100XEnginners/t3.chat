"use client";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChatCircleDotsIcon,
  MicrophoneIcon,
  SpinnerGapIcon,
} from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import TabsSuggestion from "./tabs-suggestion";
import { useFont } from "@/contexts/font-context";

const UIInput = () => {
  const session = useSession();
  const [model, setModel] = useState<string>("gpt-3.5-turbo");
  const [query, setQuery] = useState<string>("");
  const { mutate: createChat, isPending } = api.chat.createChat.useMutation();

  const handleCreateChat = async (e: any) => {
    e.preventDefault();
    try {
      const response = createChat({ message: query, model: model });
      console.log(response);
      setQuery("");
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const { selectedFont } = useFont();
  console.log(selectedFont);

  return (
    <div className={`flex h-screen max-h-svh w-full p-4`}>
      <div className="relative flex h-full w-full flex-col gap-4">
        <div className="mt-20 flex w-full flex-col">
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
        {/* Fixed Input */}
        <div className="bg-muted absolute -bottom-2 w-full rounded-2xl p-2">
          <form
            onSubmit={handleCreateChat}
            className="bg-accent/30 flex w-full flex-col rounded-xl p-3 pb-6"
          >
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

export default UIInput;
