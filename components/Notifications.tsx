'use client'

import React from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image'
import { useInboxNotifications, useUnreadInboxNotificationsCount } from '@liveblocks/react/suspense'
import { InboxNotification, InboxNotificationList, LiveblocksUIConfig } from '@liveblocks/react-ui'


export default function Notifications() {
    const {inboxNotifications } = useInboxNotifications()
    // const {count} = useUnreadInboxNotificationsCount()
    let count =4
    const unreadNotification = inboxNotifications.filter((each)=> !each.readAt)
    return (
        <Popover>
            <PopoverTrigger className=' relative flex size-10 items-center justify-center rounded-lg'>
                <Image src={'/assets/icons/bell.svg'} alt='notification' height={24} width={24} />
                {count > 0 && (<div className='absolute top-2 left-2 z-10 rounded-full bg-blue-500 size-2'/>)}
            </PopoverTrigger>
            <PopoverContent align='end' className='shad-popover'>
                <LiveblocksUIConfig
                overrides={{
                    INBOX_NOTIFICATION_TEXT_MENTION:(user:React.ReactNode)=>(
                        <>{user} has mentioned you</>
                    )
                }}>
                    <InboxNotificationList>
                        {unreadNotification.length <= 0 && (
                            <p className=' py-2 text-center text-dark-500'>No new Notifications</p>
                        ) }

                        {unreadNotification.length > 0 && 
                            unreadNotification.map((each)=>(
                                <InboxNotification key={each.id} inboxNotification={each}
                                className=' bg-dark-200 text-white' href={`/documents/${each.roomId}`}
                                showActions={false}
                                kinds={{
                                    thread:(props)=>(
                                        <InboxNotification.Thread {...props} showActions={false} showRoomName={false} />
                                    ),

                                    textMention:(props)=>(
                                        <InboxNotification.TextMention {...props}  showRoomName={false} />
                                    ),

                                    $documentAccess: (props) => (
                                        <InboxNotification.Custom {...props} title={props.inboxNotification.activities[0].data.title} aside={<InboxNotification.Icon className="bg-transparent">
                                          <Image 
                                            src={props.inboxNotification.activities[0].data.avatar as string || ''}
                                            width={36}
                                            height={36}
                                            alt="avatar"
                                            className="rounded-full"
                                          />
                                        </InboxNotification.Icon>}>
                                          {props.children}
                                        </InboxNotification.Custom>
                                      )
                                }}/>
                            ))
                        }
                    </InboxNotificationList>
                </LiveblocksUIConfig>


            </PopoverContent>
        </Popover>
    )
}
