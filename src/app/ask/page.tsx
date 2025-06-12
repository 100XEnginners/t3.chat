import React from 'react'
import Chat from '../_components/Chat'
import { HydrateClient } from '@/trpc/server'
import UIInput from '@/components/ui/ui-input'

const page = () => {
  return (
    <HydrateClient>
      <div className='flex flex-col w-full max-h-svh gap-4'>
        <UIInput />
      </div>
    </HydrateClient>
  )
}

export default page