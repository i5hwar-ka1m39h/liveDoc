import CollaborativeRoom from '@/components/CollaborativeRoom'
import { getDocument } from '@/lib/actions/users.action'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Document({params: {id}}: SearchParamProps) {

  const clekUser = await currentUser()
  if(!clekUser) redirect('/sign-in')

  const room = await getDocument({roomId:id, userId:clekUser.emailAddresses[0].emailAddress})
  if(!room) redirect('/')

  return (
    <main className=' flex w-full flex-col items-center'> 
        <CollaborativeRoom roomId={id} roomMetadata={room.metadata}/>
    </main>
  )
}
