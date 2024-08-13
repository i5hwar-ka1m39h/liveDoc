'use client'

import { useSelf } from '@liveblocks/react/suspense'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import Image from 'next/image';
import { Label } from './ui/label';
import { Input } from './ui/input';
import UserTypeSelector from './UserTypeSelector';
import Collaborator from './Collaborator';
import { updateDocumentAccess } from '@/lib/actions/room.action';


export default function ShareModal({ roomId, currentUserType, creatorId, collaborators }: ShareDocumentDialogProps) {

  const user = useSelf();

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('');
  const [userType, SetUserType] = useState<UserType>('viewer')

  const shareDocumentHandle = async () => {
    setLoading(true)

    await updateDocumentAccess({ roomId, email, userType: userType as UserType, updatedBy: user.info })

    setLoading(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className=' gradient-blue px-4 h-9 gap-1' disabled={currentUserType !== 'editor'}>
          <Image src={'/assets/icons/share.svg'} alt='shareImage' height={20} width={20} 
          className=' min-w-4 md:size-5'/>
          <p className='mr-1 hidden sm:block'>
            Share 
          </p>
        </Button>
      </DialogTrigger>


      <DialogContent className='shad-dialog'>
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which user can view and edit this document
          </DialogDescription>
        </DialogHeader>

        <Label htmlFor='email' className=' mt-6 text-blue-100'>
          Email address
        </Label>
        
        <div className=' flex items-center gap-3'>
          <div className=' flex flex-1 bg-dark-400 rounded-md'>
            <Input 
            id='email' value={email} placeholder='enter email address' onChange={(e)=>setEmail(e.target.value)} className='share-input'/>
            <UserTypeSelector userType={userType} setUserType={SetUserType}/>
          </div>
          <Button type='submit' onClick={shareDocumentHandle} className=' gradient-blue flex h-full gap-1 px-5' disabled={loading}>
            {loading ? 'Sending' : 'Invite'}
          </Button>
        </div>

        <div className=' my-2 space-y-2'>
          <ul className=' flex flex-col'>
            {collaborators.map((each)=>(
              <Collaborator key={each.id} roomId={roomId} creatorId={creatorId} collaborator={each} email={each.email} user={user.info} />
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>

  )
}
