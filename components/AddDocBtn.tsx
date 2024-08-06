'use client'

import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import { createDocument } from '@/lib/actions/room.action'
import { useRouter } from 'next/navigation'

export default function AddDocBtn({userId, email}: AddDocumentBtnProps) {
    const router = useRouter()
    const addDocHandle = async() =>{
        try {
            const room = await createDocument({userId, email})
            if(room) router.push(`/documents/${room.id}`)
        } catch (error) {
            console.error(error);
            
        }
    }



  return (
    <Button type='submit' onClick={addDocHandle} className=' gradient-blue flex gap-1 shadow-md'>
        <Image src={'/assets/icons/add.svg'} alt='add' height={24} width={24}/>
        <p className='hidden sm:block'>Start blank document</p>
    </Button>
  )
}
