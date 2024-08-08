'use client'

import { ClientSideSuspense, RoomProvider } from '@liveblocks/react/suspense'
import React, { ReactNode } from 'react'
import Header from './Header'
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs'
import { Editor } from './editor/Editor'
import ActiveCollaboratorList from './ActiveCollaboratorList'

export default function CollaborativeRoom({roomId, roomMetadata}:CollaborativeRoomProps) {
  return (
    <RoomProvider id={roomId}>
    <ClientSideSuspense fallback={<div>Loading…</div>}>
    <div className='collaborative-room'>
        <Header>
            <div className=' flex w-fit justify-center items-center gap-2'>
                <p className='document-title'>fake title</p>
            </div>

            <div className=' flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                <ActiveCollaboratorList/>

                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>


        </Header>

        <Editor/>

    </div>
    </ClientSideSuspense>
  </RoomProvider>
  )
}
