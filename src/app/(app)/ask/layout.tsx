import { SidebarToggle } from "@/app/_components/sidebar-toggle";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SelectTheme } from "@/components/ui/theme-toggler";
import { UIStructure } from "@/components/ui/ui-structure";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UIStructure />
      <SidebarInset className="!h-svh p-2">
        <div className="bg-muted/80 relative h-full max-h-svh w-full rounded-xl p-4">
          <div className="absolute top-0 left-0 flex h-12 w-full items-center justify-between px-3">
            <SidebarToggle />
            <div className="flex items-center gap-2">
              <Link
                className="hover:bg-accent flex size-7 items-center justify-center rounded-lg"
                href="/settings/subscription"
              >
                <SlidersHorizontalIcon weight="bold" className="size-5" />
              </Link>
              <SelectTheme />
            </div>
          </div>
          <div className="mx-auto flex max-h-fit w-full max-w-3xl overflow-y-hidden">
            {children}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
