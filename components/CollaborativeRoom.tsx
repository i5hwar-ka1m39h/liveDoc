'use client'

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React, { ReactNode } from 'react'
import Header from './Header'
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs'
import { Editor } from './editor/Editor'

export default function CollaborativeRoom() {
  return (
    <RoomProvider id="my-room">
    <ClientSideSuspense fallback={<div>Loading…</div>}>
    <div className='collaborative-room'>
        <Header>
            <div className=' flex w-fit justify-center items-center gap-2'>
                <p className='document-title'>fake title</p>
            </div>

            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </Header>

        <Editor/>

    </div>
    </ClientSideSuspense>
  </RoomProvider>
  )
}
