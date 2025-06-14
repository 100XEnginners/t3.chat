import React from "react";
import { HydrateClient } from "@/trpc/server";
import UIInput from "@/components/ui/ui-input";

const page = () => {
  return (
    <HydrateClient>
      <div className="flex w-full max-w-screen flex-col items-center justify-center">
        <UIInput />
      </div>
    </HydrateClient>
  );
};

export default page;
