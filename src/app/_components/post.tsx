"use client";

import { api } from "@/trpc/react";
import { useState } from "react";

export const CreateChat = () => {
  const { mutate: createChat } = api.chat.createChat.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });
  const [message, setMessage] = useState("");
  return (
    <div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={() => createChat({ message: message })}>Create Chat</button>
    </div>
  );
};