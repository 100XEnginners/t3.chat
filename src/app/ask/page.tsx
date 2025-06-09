import React from 'react'
import Chat from '../_components/Chat'
import { HydrateClient } from '@/trpc/server'

const page = () => {
  return (
    <HydrateClient>
        <div className='flex flex-col gap-4 text-white bg-black'>
            <Chat />
        </div>
    </HydrateClient>
  )
}

export default page