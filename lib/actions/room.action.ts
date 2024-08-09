'use server'

import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import {nanoid} from 'nanoid'
import { parseStringify } from "../utils";

export const createDocument = async({userId, email}:CreateDocumentParams) => {

    const roomId = nanoid()

    try {
        const metadata = {
            creatorId: userId,
            email,
            title: "Untitled"
        }

        const userAccess: RoomAccesses = {
            [email]:['room:write']
        }

        const room = await liveblocks.createRoom(roomId, {
            metadata,
            usersAccesses: userAccess,
            defaultAccesses:['room:write']
        } );

        revalidatePath('/')

        return parseStringify(room)
    } catch (error) {
        console.log(`error happend while creating a room: ${error} `);
        
    }
}

export const getDocument = async({ roomId, userId }: {roomId:string; userId:string})=>{
    try {
        const room  =  await liveblocks.getRoom(roomId)

        // const hasAccess = Object.keys(room.usersAccesses).includes(userId)

        // if(!hasAccess){
        //     throw new Error('you do not have access to this room')
        // }

        return parseStringify(room)
    } catch (error) {
        console.error(`error fetching  document: ${error}`);
    }
}


export const updateDocument = async(roomId:string, title:string)=>{
    try {
        const updateRoom = await liveblocks.updateRoom(roomId,{metadata:{title:title}})

        revalidatePath(`/documents/${roomId}`)

        return parseStringify(updateRoom)
    } catch (error) {
        console.log(`error happend while updating the doc: ${error} `);
    }
}