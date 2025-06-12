"use client";
import Chat from "@/app/_components/Chat"
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { UIStructure } from "@/components/ui/ui-structure"

export default function SingleChatPage() {
    const { open } = useSidebar();
    return (
        <>
            <UIStructure />
            <SidebarInset className="border-2 p-2 max-h-svh overflow-hidden rounded-xl bg-accent/40">
                <SidebarTrigger className={open ? "hidden" : "flex"} />
                {/* <nav
                        className="flex items-center bg-gradient-to-b from-accent/20 h-[50px] px-2 rounded-t-2xl justify-between">
                        <SidebarTrigger />
                        <div>Title</div>

                    </nav> */}
                {/* <div className="h-[calc(100%-50px)]"> */}
                <Chat />
                {/* </div> */}
            </SidebarInset>

        </>
    )
}