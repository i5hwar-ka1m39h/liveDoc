"use server";

import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { nanoid } from "nanoid";
import { getAccessType, parseStringify } from "../utils";
import { redirect } from 'next/navigation'

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const userAccess: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses: userAccess,
      defaultAccesses: [],
    });

    revalidatePath("/");

    return parseStringify(room);
  } catch (error) {
    console.log(`error happend while creating a room: ${error} `);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId)

    if(!hasAccess){
        throw new Error('you do not have access to this room')
    }

    return parseStringify(room);
  } catch (error) {
    console.error(`error fetching  document: ${error}`);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updateRoom = await liveblocks.updateRoom(roomId, {
      metadata: { title: title },
    });

    revalidatePath(`/documents/${roomId}`);

    return parseStringify(updateRoom);
  } catch (error) {
    console.log(`error happend while updating the doc: ${error} `);
  }
};

export const fetchDoc = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });
    return parseStringify(rooms);
  } catch (error) {
    console.log(`error happend while fetching the docs: ${error} `);
  }
};

export const updateDocumentAccess = async ({
  roomId,
  email,
  userType,
  updatedBy,
}: ShareDocumentParams) => {
    try {
        const usersAccesses:RoomAccesses = {
            [email]: getAccessType(userType) as AccessType
        }

        const room = await liveblocks.updateRoom(roomId, {usersAccesses})

        if(room){
            //send notification to invited user
            const notificationId = nanoid()

            await liveblocks.triggerInboxNotification({
              userId:email,
              kind: '$documentAccess',
              subjectId:notificationId,
              activityData: {
                userType,
                title: `you have been granted ${userType} access to the the document  `,
                updatedBy: updatedBy.name,
                avatar: updatedBy.avatar,
                email:updatedBy.email
              },
              roomId
            })
        }

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(room)
    } catch (error) {
        console.log(`error happend while updating the user access: ${error} `);
    }
};


export const removeCollaborator = async({roomId, email}:{roomId : string; email : string}) =>{
    try {
        const room = await liveblocks.getRoom(roomId);

        if(room.metadata.email === email){
            throw new Error('you cannot remove yourself from the document')
        }

        const updatedRoom = await liveblocks.updateRoom(roomId, {
            usersAccesses:{
                [email]: null
            }
        })

        revalidatePath(`/documents/${roomId}`)
        return parseStringify(updatedRoom)
    } catch (error) {
        console.log(`error happend while updating the user access: ${error} `);
    }
}

export const deleteDocument = async(roomId:string)=>{
    try {
        await liveblocks.deleteRoom(roomId)
        revalidatePath('/')
        redirect('/')
    } catch (error) {
        console.log(`error happend while deleting the document: ${error} `);
    }
}