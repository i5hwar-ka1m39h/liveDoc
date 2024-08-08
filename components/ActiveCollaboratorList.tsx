import { useOthers } from '@liveblocks/react/suspense'
import Image from 'next/image';
import React from 'react'

export default function ActiveCollaboratorList() {
    const others = useOthers();

    const collaborators = others.map((sigle)=>(sigle.info))
  return (
    <ul className='collaborators-list'>
      {collaborators.map((single)=>(
        <li key={single.id}>
          <Image src={single.avatar} height={100} width={100} alt={single.name}
          className=' inline-block size-8 ring-2 rounded-full'
          style={{border: `3px solid ${single.color}`}}/>
        </li>
      ))}

    </ul>
  )
}
