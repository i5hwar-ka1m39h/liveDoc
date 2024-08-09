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

