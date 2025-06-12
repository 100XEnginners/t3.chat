import React from 'react'
import Chat from '../../_components/Chat'
import { HydrateClient } from '@/trpc/server'
import UIInput from '@/components/ui/ui-input'

const page = () => {
  return (
    <HydrateClient>
      <div className='flex flex-col max-w-screen min-h-screen justify-center items-center'>
        <UIInput />
      </div>
    </HydrateClient>
  )
}

export default page