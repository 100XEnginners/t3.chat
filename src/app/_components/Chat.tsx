"use client"

import React, { useState } from 'react'
import axios from 'axios'

const Chat = () => {
    const [messages, setMessages] = useState<string>("") 
    const [response, setResponse] = useState<string>("")
    console.log(process.env.NEXT_PUBLIC_TYPEGPT_API_KEY)
    const handleSendMessage = async () => {
        const response = await axios.post(
            "https://fast.typegpt.net/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: messages }],
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TYPEGPT_API_KEY}`,
              },
            }
          );
          setResponse(response.data.choices[0].message.content)
    }

  return (
    <div className='flex flex-col gap-4'>
        <input type="text" className='bg-white/10 text-white' value={messages} onChange={(e) => setMessages(e.target.value)} />
        <button onClick={handleSendMessage}>Send</button>
        <div className='bg-white/10 text-white'>{response}</div>
    </div>
  )
}

export default Chat