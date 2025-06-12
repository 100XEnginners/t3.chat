"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useSession } from "next-auth/react"
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChatCircleDotsIcon, MicrophoneIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Geist_Mono } from 'next/font/google'
import { api } from '@/trpc/react'

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    preload: true,
    display: 'swap',
});

const UIInput = () => {
    const session = useSession();
    const [model, setModel] = useState<string>("gpt-3.5-turbo")
    const [query, setQuery] = useState<string>("")
    const { mutate: createChat, isPending } = api.chat.createChat.useMutation();

    const handleCreateChat = async (e: any) => {
        e.preventDefault()
        try {
            const response = createChat({ message: query, model: model })
            console.log(response)
            setQuery("")
        } catch (error) {
            console.error('Failed to create chat:', error);
            // alert('Error creating chat');
        }
    };
    return (
        <div className='flex h-full max-h-svh w-1/2 p-4 bg'>
            <div className='max-w-3xl flex flex-col gap-4 mx-auto w-full h-full'>
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
                {/* Fixed Input */}
                <form onSubmit={handleCreateChat} className='border-2 rounded-xl p-3 flex flex-col'>
                    <Textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Ask whatever you want to be'
                        className="ring-0 focus-visible:ring-0 dark:bg-transparent h-[6rem] resize-none border-none rounded-none px-0 py-1 shadow-none bg-transparent"
                    />
                    <div className='flex items-center justify-between mt-2'>
                        <div className='flex items-center gap-2'>
                            <div className='bg-accent size-8 border flex items-center justify-center rounded-lg'>
                                <MicrophoneIcon />
                            </div>
                            <Select value={model} onValueChange={(value) => setModel(value)}>
                                <SelectTrigger className="bg-accent active:ring-0 max-h-8">
                                    <SelectValue className='h-5' placeholder="Select Model" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Models</SelectLabel>
                                        <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                                        <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
                                        <SelectItem value="gpt-4o-mini">GPT 4o Mini</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type='submit' className='w-fit' disabled={isPending}>{isPending ? <SpinnerGapIcon className='animate-spin' /> : "Send"}</Button>
                        {isPending && <div className='absolute top-0 left-0 w-full h-full bg-black/50 z-10'>
                            <div className='flex items-center justify-center h-full'>
                                <SpinnerGapIcon className='animate-spin' />
                            </div>
                        </div>}
                    </div>
                </form>

                <div className='mb-1 pt-2 text-xs flex items-center justify-center text-neutral-400'>
                    AI can make mistakes, we recommend checking the important info
                </div>
            </div >
        </div >
    )

}

export default UIInput;