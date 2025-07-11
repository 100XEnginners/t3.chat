"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
import {
  BookmarkIcon,
  DotsThreeVertical,
  MagnifyingGlassIcon,
  ShareFatIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Separator } from "./separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T3Chat } from "../svgs/t3chat";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Share, ShareIcon } from "lucide-react";

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
  const [hoverChatId, setHoverChatId] = useState<string>("");
  const { data: chatsData } = api.chat.getAllChats.useQuery();
  const saveChat = api.chat.saveChat.useMutation();
  const removeFromSaved = api.chat.removeFromSaved.useMutation();
  const deleteChat = api.chat.deleteChat.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (chatsData) {
      setChats(chatsData as unknown as Chat[]);
    }
  }, [chatsData]);

  const handleSaveChat = (chatId: string) => {
    try {
      saveChat.mutate({ chatId: chatId });
      toast.success("Chat saved successfully");
      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, isSaved: true } : chat,
        ),
      );
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const handleRemoveFromSaved = (chatId: string) => {
    try {
      removeFromSaved.mutate({ chatId: chatId });
      toast.success("Chat removed from saved successfully");
      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, isSaved: false } : chat,
        ),
      );
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

  const session = useSession();
  const user = session.data?.user;

  return (
    <Sidebar className={`border py-2 pl-2`}>
      <SidebarContent className="rounded-2xl">
        <SidebarGroup className="flex flex-col gap-8 pt-3">
          <SidebarGroupLabel className="h-fit p-0">
            <div className="flex h-12 w-full flex-col items-center gap-2 rounded-lg">
              <div className="flex w-full items-center gap-2 rounded-lg p-1 text-lg">
                <SidebarTrigger className="shrink-0" />
                <div className="dark:text-primary-foreground flex size-4 w-full flex-1 items-center justify-center rounded-lg">
                  <T3Chat />
                </div>
                <span className="size-6"></span>
              </div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/ask");
                }}
                variant="t3"
                className="w-full"
              >
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
              {chatsData === undefined
                ? // Skeleton loader while loading saved chats
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-primary/15 mb-2 h-7 w-full animate-pulse rounded-md"
                    />
                  ))
                : chats
                    ?.filter((chat: Chat) => chat.isSaved)
                    .map((chat: Chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          className="group hover:bg-primary/20 relative"
                          onMouseEnter={() => setHoverChatId(chat.id)}
                          onMouseLeave={() => setHoverChatId("")}
                          asChild
                        >
                          <div className="flex w-full items-center justify-between">
                            <Link href={`/ask/${chat.id}`}>
                              <span className="z-[-1]">
                                {chat.messages[0]?.content.slice(0, 30)}...
                              </span>
                              <div
                                className={`absolute top-0 right-0 z-[5] h-full w-12 rounded-r-md blur-[2em] ${chat.id === hoverChatId ? "bg-primary" : ""}`}
                              />
                              <div
                                className={`absolute top-1/2 -right-16 z-[10] flex h-full -translate-y-1/2 items-center justify-center gap-1.5 rounded-r-md bg-transparent px-1 backdrop-blur-xl transition-all duration-200 ease-in-out ${chat.id === hoverChatId ? "group-hover:right-0" : ""}`}
                              >
                                <div
                                  className="flex items-center justify-center rounded-md"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveFromSaved(chat.id);
                                  }}
                                >
                                  <BookmarkIcon
                                    weight="fill"
                                    className="hover:text-foreground size-4"
                                  />
                                </div>
                                <div
                                  className="flex items-center justify-center rounded-md"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const shareLink = process.env.NEXT_PUBLIC_APP_URL + `/chat/share/${chat.id}`
                                    navigator.clipboard.writeText(shareLink)
                                    toast.success("Share link copied to clipboard")
                                  }}
                                >
                                  <ShareFatIcon
                                    weight="fill"
                                    className="hover:text-foreground size-4"
                                  />
                                </div>
                                <div
                                  className="flex items-center justify-center rounded-md"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteChat(chat.id);
                                  }}
                                >
                                  <TrashIcon
                                    weight="bold"
                                    className="hover:text-foreground size-4"
                                  />
                                </div>
                              </div>
                            </Link>
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

            <SidebarMenu className="mt-2 w-full p-0">
              {chatsData === undefined
                ? // Skeleton loader while loading saved chats
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-primary/15 mb-2 h-7 w-full animate-pulse rounded-md"
                    />
                  ))
                : chats
                    ?.filter((chat: Chat) => !chat.isSaved)
                    .map((chat: Chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          className="group hover:bg-primary/20 relative"
                          onMouseEnter={() => setHoverChatId(chat.id)}
                          onMouseLeave={() => setHoverChatId("")}
                          asChild
                        >
                          <div className="flex w-full items-center justify-between">
                            <Link href={`/ask/${chat.id}`}>
                              <span className="z-[-1]">
                                {chat.messages[0]?.content.slice(0, 30)}
                              </span>
                              <div
                                className={`absolute top-0 right-0 z-[5] h-full w-12 rounded-r-md blur-[2em] ${chat.id === hoverChatId ? "bg-primary" : ""}`}
                              />
                              <div
                                className={`absolute top-1/2 -right-16 z-[10] flex h-full -translate-y-1/2 items-center justify-center gap-1.5 rounded-r-md bg-transparent px-1 backdrop-blur-xl transition-all duration-200 ease-in-out ${chat.id === hoverChatId ? "group-hover:right-0" : ""}`}
                              >
                                <div
                                  className="flex items-center justify-center rounded-md"
                                  onClick={() => handleSaveChat(chat.id)}
                                >
                                  <BookmarkIcon
                                    weight={"bold"}
                                    className="hover:text-foreground size-4"
                                  />
                                </div>

                                <div
                                  className="flex items-center justify-center rounded-md"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const shareLink = process.env.NEXT_PUBLIC_APP_URL + `/chat/share/${chat.id}`
                                    navigator.clipboard.writeText(shareLink)
                                    toast.success("Share link copied to clipboard")
                                  }}
                                >
                                  <ShareFatIcon
                                    weight="fill"
                                    className="hover:text-foreground size-4"
                                  />
                                </div>

                                <div
                                  className="flex items-center justify-center rounded-md"
                                  onClick={() => handleDeleteChat(chat.id)}
                                >
                                  <TrashIcon
                                    weight={"bold"}
                                    className="hover:text-foreground size-4"
                                  />
                                </div>
                              </div>
                              {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <DotsThreeVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleSaveChat(chat.id)}
                              >
                                Add to Saved
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteChat(chat.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu> */}
                            </Link>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="bg-background absolute bottom-0 z-[70] h-20 w-full px-4 py-3">
          {user && (
            <div className="flex items-center space-x-3">
              <img
                src={user.image ?? "/default-avatar.png"}
                alt={user.name ?? "User"}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col text-sm text-white">
                <span className="font-medium">{user.name ?? "Anonymous"}</span>
                <span className="w-36 truncate text-xs text-gray-300">
                  {user.email ?? ""}
                </span>
              </div>
            </div>
          )}
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
