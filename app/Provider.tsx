"use client";

import  { ReactNode } from "react";
import {
  LiveblocksProvider,
  
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUser, getDocumentUsers } from "@/lib/actions/users.action";
import { getDocument } from "@/lib/actions/room.action";
import { useUser } from "@clerk/nextjs";

export default function Provider({children}:{children:ReactNode}) {
  const {user: clerkUser} = useUser()
  return (
    <LiveblocksProvider 
    resolveUsers={async({userIds})=>{
      const users = await getClerkUser({userIds})

      return users
    }} 

    resolveMentionSuggestions={async({text, roomId})=>{

      const roomUsers = await getDocumentUsers({roomId, text, currentUser: clerkUser?.emailAddresses[0].emailAddress!})

      return roomUsers
    }}
    
    authEndpoint={'/api/liveblocks-auth'}>
   
      <ClientSideSuspense fallback={<Loader/>}>
        {children}
      </ClientSideSuspense>
    
  </LiveblocksProvider>
  )
}
