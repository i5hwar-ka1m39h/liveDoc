import { Composer } from '@liveblocks/react-ui'
import { useThreads } from '@liveblocks/react/suspense'
import React from 'react'
import ThreadWrapper from './ThreadWrapper'

export default function Comments() {
    const {threads} = useThreads()
  return (
    <div className='comments-container'>
        <Composer className='comment-composer'/>

        {threads.map((each) => (
            <ThreadWrapper key={each.id} thread={each}/>
        ))}
    </div>
  )
}
