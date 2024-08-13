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

export const getDocumentUsers = async({currentUser, roomId, text} :{ currentUser:string; roomId:string; text:string}) =>{
    try {
        const room = await liveblocks.getRoom(roomId)

        const users = Object.keys(room.usersAccesses).filter((email)=> email !== currentUser);

        if(text.length){
            const lowText = text.toLowerCase()

            const filteredUser  = users.filter((email:string)=> email.toLowerCase().includes(lowText))

            return parseStringify(filteredUser)
        }

        return parseStringify(users)
    } catch (error) {
        console.error(`error fetching users: ${error}`);
    }
}