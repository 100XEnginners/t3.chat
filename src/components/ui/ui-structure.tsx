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

const items = [
    {
        title: "Chat-1",
        url: "#",
    },
    {
        title: "Chat-2",
        url: "#",
    },
    {
        title: "Chat-3",
        url: "#",
    },
    {
        title: "Chat-4",
        url: "#",
    },
];

const giest = Geist({
    display: "swap",
    subsets: ["latin"],
})

export function UIStructure() {
    return (
        <Sidebar className={`bg-transparent ${giest.className} py-2 pl-2`}>
            <SidebarContent className="bg-transparent rounded-2xl">
                <SidebarGroup className="flex flex-col gap-2 pt-4">
                    <SidebarGroupLabel className="p-0">
                        <div className="flex w-full px-2 h-12 bg-accent items-center rounded-lg justify-center">
                            <div className="text-xl font-semibold flex-1">T3.Chat</div>
                            <SidebarTrigger />
                        </div>
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="mt-5">
                        <SidebarGroupLabel className="p-0">
                            <Badge
                                variant="secondary"
                                className="rounded-lg flex items-center text-foreground gap-2"
                            >
                                <span className="font-semibold">Chats</span>
                            </Badge>
                        </SidebarGroupLabel>
                        <SidebarMenu className="mt-2 p-0">
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <span>{item.title}</span>
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
