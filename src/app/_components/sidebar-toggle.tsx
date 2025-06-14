"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export const SidebarToggle = () => {
  const { open } = useSidebar();
  return <SidebarTrigger className={open ? "invisible" : "flex"} />;
};
