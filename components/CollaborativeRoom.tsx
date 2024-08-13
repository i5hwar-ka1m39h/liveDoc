'use client'

import { ClientSideSuspense, RoomProvider, } from '@liveblocks/react/suspense'
import React, {  useEffect, useRef, useState } from 'react'
import Header from './Header'
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs'
import { Editor } from './editor/Editor'
import ActiveCollaboratorList from './ActiveCollaboratorList'
import { Input } from './ui/input'
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.action'
import Loader from './Loader'
import ShareModal from './ShareModal'


export default  function CollaborativeRoom({roomId, roomMetadata, users, currentUserType}:CollaborativeRoomProps) {

    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title)

    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleKey = async(e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === 'Enter'){
            setLoading(true);
        }

        try {
            if(documentTitle !== roomMetadata.title){
                const updatedTitle = await updateDocument(roomId, documentTitle)
            
            if(updatedTitle){
                setEditing(false);
            }
            }
        } catch (error) {
            console.error(error);
            
        }

        setLoading(false)
    }

    useEffect(()=>{
        const clickOut = (e:MouseEvent) =>{
            if(containerRef.current && !containerRef.current.contains(e.target as Node)){
                setEditing(false)
                updateDocument(roomId, documentTitle)
            }

            
        }

        document.addEventListener('mousedown', clickOut)

        return ()=>{
            document.removeEventListener('mousedown', clickOut)
        }
    },[documentTitle, roomId])

    useEffect(()=>{
        if(editing && inputRef.current){
            inputRef.current.focus()
        }
    },[editing])

    

  return (
    <RoomProvider id={roomId}>
    <ClientSideSuspense fallback={<Loader/>}>
    <div className='collaborative-room'>
        <Header>
            <div ref={containerRef} className=' flex w-fit justify-center items-center gap-2'>
                {editing && !loading ? (
                    <Input type="text"  value={documentTitle} 
                    onChange={e=>setDocumentTitle(e.target.value)}
                    onKeyDown={handleKey} 
                    placeholder='enter the heading'
                    ref={inputRef} 
                    disabled={!editing} 
                    className='document-title-input'/>  
                ): (<p className='document-title'> {documentTitle}</p>)}

                {currentUserType === 'editor' && !editing && (
                    <Image src={'/assets/icons/edit.svg'} alt='editbutton' width={24} height={24} onClick={()=>setEditing(true)} 
                    className=' cursor-pointer'/>
                )}

                {currentUserType !== 'editor' && !editing && (
                    <p className='view-only-tag'>view only</p>
                )}
                
                {loading && <p className=' text-sm text-gray-400'>saving...</p>}
                


            </div>

            <div className=' flex w-full flex-1 justify-end gap-2 sm:gap-3'>
                <ActiveCollaboratorList/>

                <ShareModal roomId={roomId} collaborators={users} creatorId={roomMetadata.creatorId} currentUserType={currentUserType}/>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>


        </Header>

        <Editor roomId={roomId} currentUserType={currentUserType}/>

    </div>
    </ClientSideSuspense>
  </RoomProvider>
  )
}
