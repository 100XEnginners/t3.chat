"use client"

import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatCircleDotsIcon, MicrophoneIcon } from '@phosphor-icons/react'
import remarkGfm from "remark-gfm";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Geist_Mono } from 'next/font/google'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  preload: true,
  display: 'swap',
});

const Chat = () => {
  const session = useSession()

  const { messages, setMessages, input, handleInputChange, handleSubmit, status } =
    useChat({
      api: "/api/ask",
      onFinish: () => {
        // db calls
      }
    });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  useEffect(() => {
    const query = localStorage.getItem("chatQuery");
    if (query) {
      setMessages([
        {
          id: `temp-${Date.now()}`,
          role: "user",
          content: query,
        },
      ]);
      localStorage.removeItem("chatQuery"); // Clear to avoid reuse
    }
  }, []);

  // useEffect(() => {
  //   const query = localStorage.getItem("chatQuery");
  //   if (query) {
  //     setMessages([
  //       {
  //         id: `temp-${Date.now()}`,
  //         role: "user",
  //         content: query,
  //       },
  //     ]);
  //     localStorage.removeItem("chatQuery"); // Clear to avoid reuse
  //   }
  // }, []);
  console.log(process.env.NEXT_PUBLIC_TYPEGPT_API_KEY)

  // const handleSendMessage = async () => {
  //   const response = await axios.post(
  //     "https://fast.typegpt.net/v1/chat/completions",
  //     {
  //       model: "gpt-3.5-turbo",
  //       messages: [{ role: "user", content: messages }],
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_TYPEGPT_API_KEY}`,
  //       },
  //     }
  //   );
  //   setResponse(response.data.choices[0].message.content)
  // }
  return (
    <div className='flex h-full max-h-svh p-4'>
      <div className='max-w-3xl flex flex-col mx-auto w-full h-full'>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {messages.length ? (
            <>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "animate-fade-in mb-4",
                    message.role === "user" ? "text-right" : "text-left"
                  )}
                >
                  <div
                    className={cn(
                      "inline-block break-words rounded-lg px-3 overflow-hidden py-2 text-sm max-w-full text-left prose dark:prose-invert",
                      message.role === "user"
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-foreground break-words pb-4"
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ href, children, ...props }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                            {...props}
                          >
                            {children}
                          </a>
                        ),
                        // Other markdown overrides...
                        code: ({ children, className, language }: any) => {
                          const lang = /language-(\w+)/.exec(className || '')?.[1] || '';
                          console.log(lang)
                          return (
                            <div className="">
                              <div className="bg-background p-2 rounded-t-xl flex items-center justify-between h-12 w-full">
                                <div className="text-sm text-muted-foreground">{lang}</div>
                                <Badge
                                  onClick={() => {
                                    navigator.clipboard.writeText(String(children));
                                  }}
                                  className="text-sm rounded-lg font-semibold"
                                >
                                  Copy
                                </Badge>
                              </div>
                              <pre className="whitespace-pre text-sm">
                                <SyntaxHighlighter
                                  language={lang}
                                  // style={theme === 'dark' ? oneDark : oneLight}
                                  customStyle={{
                                    margin: 0,
                                    padding: '0.75rem 0.25rem 0.75rem',
                                    backgroundColor: '#171717',
                                    borderRadius: 0,
                                    borderBottomLeftRadius: '0.375rem',
                                    borderBottomRightRadius: '0.375rem',
                                    fontFamily: geistMono.style.fontFamily,
                                  }}
                                  showLineNumbers={true}
                                  lineNumberStyle={{
                                    textAlign: 'right',
                                    // color: theme === 'dark' ? '#6b7280' : '#808080',
                                    backgroundColor: 'transparent',
                                    fontStyle: 'normal',
                                    marginRight: '1em',
                                    paddingRight: '0.5em',
                                    fontFamily: geistMono.style.fontFamily,
                                    minWidth: '2em'
                                  }}
                                  lineNumberContainerStyle={{
                                    backgroundColor: '#171717',
                                    float: 'left'
                                  }}
                                  // wrapLongLines={isWrapped}
                                  codeTagProps={{
                                    style: {
                                      fontFamily: geistMono.style.fontFamily,
                                      fontSize: '0.85em',
                                      // whiteSpace: isWrapped ? 'pre-wrap' : 'pre',
                                      // overflowWrap: isWrapped ? 'break-word' : 'normal',
                                      // wordBreak: isWrapped ? 'break-word' : 'keep-all'
                                    }
                                  }}
                                  style={atomOneDark}
                                >
                                  {String(children)}
                                </SyntaxHighlighter>
                              </pre>
                            </div>
                          )
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <p className="text-xs mt-2 mx-2 text-muted-foreground">
                    {message.role === "user" ? "You" : "T3"}
                  </p>
                </div>
              ))}
              {status === "submitted" && (
                <div className="flex items-start">
                  <div className="flex space-x-2 items-center my-4 rounded-lg animate-pulse">
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='h-full flex flex-col items-center justify-center flex-1'>
              <div className='h-full flex flex-col items-center justify-center flex-1'>
                <div className='drop-shadow-2xl drop-shadow-primary/60 size-20 mb-6 bg-primary rounded-xl relative overflow-hidden'>
                  <div className='absolute left-1/2 -translate-x-1/2 flex items-center justify-center size-12 top-1/2 -translate-y-1/2 bg-foreground rounded-full'>
                    <ChatCircleDotsIcon className='text-background text-2xl' />
                  </div>
                </div>
                <h1 className='text-2xl'>Hello <span className='font-secondary italic'>{session.data?.user.name?.split(" ")[0]},</span></h1>
                <p className='text-3xl'>How may I help you today?</p>
                <div className='flex flex-wrap gap-2 mt-4'>
                  <Badge className='h-8' variant="secondary">Explain rocket science</Badge>
                  <Badge className='h-8' variant="secondary">How AI works</Badge>
                  <Badge className='h-8' variant="secondary">Suggest diet plans</Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input */}
        <form onSubmit={handleFormSubmit} className='border-2 rounded-xl p-3 flex flex-col'>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder='Ask whatever you want to be'
            className="ring-0 focus-visible:ring-0 dark:bg-transparent h-[6rem] resize-none border-none rounded-none px-0 py-1 shadow-none bg-transparent"
          />
          <div className='flex items-center justify-between mt-2'>
            <div className='flex items-center gap-2'>
              <div className='bg-accent size-8 border flex items-center justify-center rounded-lg'>
                <MicrophoneIcon />
              </div>
              <Select>
                <SelectTrigger className="bg-accent active:ring-0 max-h-8">
                  <SelectValue className='h-5' placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Models</SelectLabel>
                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                    <SelectItem value="gpt-4o">GPT 4o</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button type='submit' className='w-fit'>Send</Button>
          </div>
        </form>

        <div className='mb-1 pt-2 text-xs flex items-center justify-center text-neutral-400'>
          AI can make mistakes, we recommend checking the important info
        </div>
      </div >
    </div >
  )

}

export default Chat