'use server'

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUser = async({userIds}:{userIds: string[]})=>{
    try {
        const {data} = await clerkClient.users.getUserList({
            emailAddress: userIds
        })

        const users = data.map((single)=>({
            id: single.id,
            name: `${single.firstName} ${single.lastName}`,
            avatar: single.imageUrl,
            email: single.emailAddresses[0].emailAddress
        }))

        const sortedUsers = userIds.map((email)=> users.find((users)=> users.email === email))

        return parseStringify(sortedUsers)
    } catch (error) {
        console.error(`error fetching users: ${error}`);
        
    }
}

export const getDocument = async({ roomId, userId }: {roomId:string; userId:string})=>{
    try {
        const room  =  await liveblocks.getRoom(roomId)

        const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        if(!hasAccess){
            throw new Error('you do not have access to this room')
        }

        return parseStringify(room)
    } catch (error) {
        console.error(`error fetching  document: ${error}`);
    }
}