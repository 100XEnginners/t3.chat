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
import { Input } from "./input";
import { DotsThreeVertical, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Separator } from "./separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const giest = Geist({
  display: "swap",
  subsets: ["latin"],
});

interface Chat {
  id: string;
  updatedAt: Date;
  isSaved: boolean;
  userId: string;
  messages: {
    content: string;
  }[];
}

export function UIStructure() {
  const [chats, setChats] = useState<Chat[]>([]);
  const { data: chatsData } = api.chat.getAllChats.useQuery();
  const saveChat = api.chat.saveChat.useMutation();
  const removeFromSaved = api.chat.removeFromSaved.useMutation();
  const deleteChat = api.chat.deleteChat.useMutation();
  
  useEffect(() => {
    if (chatsData) {
      setChats(chatsData as unknown as Chat[]);
    }
  }, [chatsData]);

  console.log(chats);

  const handleSaveChat = (chatId: string) => {
    try {
      saveChat.mutate({ chatId: chatId });
      toast.success("Chat saved successfully");
      setChats(chats.map((chat) => chat.id === chatId ? { ...chat, isSaved: true } : chat));
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleRemoveFromSaved = (chatId: string) => {

    try {
      removeFromSaved.mutate({ chatId: chatId });
      toast.success("Chat removed from saved successfully");
      setChats(chats.map((chat) => chat.id === chatId ? { ...chat, isSaved: false } : chat));
    } catch (error) {
      console.error("Error removing chat from saved:", error);
    }
  };

  const handleDeleteChat = (chatId: string) => {

    try {
      deleteChat.mutate({ chatId: chatId });
      toast.success("Chat deleted successfully");
      setChats(chats.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

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
            <div className="mb-4 flex items-center gap-2 border-b">
              <MagnifyingGlassIcon className="text-foreground" weight="bold" />
              <Input
                placeholder="Search for chats"
                className="rounded-none border-none bg-transparent px-0 py-1 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
            <SidebarGroupLabel className="p-0">
              <Badge
                variant="secondary"
                className="text-foreground flex items-center gap-2 rounded-lg"
              >
                <span className="font-semibold">Saved Chats</span>
              </Badge>
            </SidebarGroupLabel>
            <SidebarMenu className="mt-2 p-0">
              {chats?.filter((chat: Chat) => chat.isSaved).map((chat: Chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center justify-between w-full">    
                    <a href={`/ask/${chat.id}`}>
                      <span>{chat.messages[0]?.content.slice(0, 20)}...</span>
                    </a>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <DotsThreeVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRemoveFromSaved(chat.id)}>Remove from Saved</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Separator className="my-2" />
            <SidebarGroupLabel className="p-0">
              <Badge
                variant="secondary"
                className="text-foreground flex items-center gap-2 rounded-lg"
              >
                <span className="font-semibold">Recent Chats</span>
              </Badge>
            </SidebarGroupLabel>

            <SidebarMenu className="mt-2 p-0 w-full">
              {chats?.filter((chat: Chat) => !chat.isSaved).map((chat: Chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild>
                      <div className="flex items-center justify-between w-full">
                    <a href={`/ask/${chat.id}`}>
                        <span>{chat.messages[0]?.content.slice(0, 20)}...</span>
                      <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <DotsThreeVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSaveChat(chat.id)}>Add to Saved</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                    </a>
                      </div>
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
