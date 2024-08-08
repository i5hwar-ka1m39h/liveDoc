"use client";

import  { ReactNode } from "react";
import {
  LiveblocksProvider,
  
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/components/Loader";
import { getClerkUser } from "@/lib/actions/users.action";

export default function Provider({children}:{children:ReactNode}) {
  return (
    <LiveblocksProvider 
    resolveUsers={async({userIds})=>{
      const users = await getClerkUser({userIds})

      return users
    }} 
    
    authEndpoint={'/api/liveblocks-auth'}>
   
      <ClientSideSuspense fallback={<Loader/>}>
        {children}
      </ClientSideSuspense>
    
  </LiveblocksProvider>
  )
}
