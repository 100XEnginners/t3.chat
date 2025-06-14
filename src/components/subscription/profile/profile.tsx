"use client";
import { Badge } from "@/components/ui/badge";
import { useBlur } from "@/contexts/blur-context";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Profile = ({ image }: { image: string }) => {
  const { isBlurred } = useBlur();
  console.log("isBlurred in profile:", isBlurred);
  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-4",
        isBlurred && "blur-sm",
      )}
    >
      <div className="relative">
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-600 text-4xl font-bold text-white">
          <Image
            src={image}
            alt="Profile"
            width={1280}
            height={1280}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-2xl font-bold">
          Aman Kumar Bairagi
        </h1>
        <p className="text-muted-foreground">amanbairagi1089@gmail.com</p>
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Free Plan
        </Badge>
      </div>
    </div>
  );
};
