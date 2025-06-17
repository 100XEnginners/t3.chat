"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Geist } from "next/font/google";
import { Button } from "./button";
import { api } from "@/trpc/react";
import { useState } from "react";
import { useEffect } from "react";


const giest = Geist({
  display: "swap",
  subsets: ["latin"],
});

interface Chat {
  id: string;
  updatedAt: Date;
  userId: string;
  messages: {
    content: string;
  }[];
}

export function UIStructure() {
  const [chats, setChats] = useState<Chat[]>([]);
  const { data: chatsData } = api.chat.getAllChats.useQuery();

  useEffect(() => {
    if (chatsData) {
      setChats(chatsData as unknown as  Chat[]);
    }
  }, [chatsData]);
  return (
    <Sidebar className={`py-2 pl-2`}>
      <SidebarContent className="rounded-2xl">
        <SidebarGroup className="flex flex-col gap-8 pt-3">
          <SidebarGroupLabel className="h-fit p-0">
            <div className="flex h-12 w-full flex-col items-center gap-2 rounded-lg">
              <div className="flex w-full items-center gap-2 rounded-lg p-1 text-lg">
                <SidebarTrigger className="shrink-0" />
                <span className="dark:text-primary-foreground flex w-full flex-1 items-center justify-center rounded-lg">
                  T3.Chat
                </span>
                <span className="size-6"></span>
              </div>
              <Button variant="t3" className="w-full">
                New Chat
              </Button>
              {/* <SidebarTrigger /> */}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-4">
            <SidebarGroupLabel className="p-0">
              <Badge
                variant="secondary"
                className="text-foreground flex items-center gap-2 rounded-lg"
              >
                <span className="font-semibold">Chats</span>
              </Badge>
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2 p-0">
              {chats?.map((chat: Chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <a href={`/ask/${chat.id}`}>
                      <span>{chat.messages[0]?.content}...</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
