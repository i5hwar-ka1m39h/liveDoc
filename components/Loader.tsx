import Image from 'next/image'
import React from 'react'

export default function Loader() {
  return (
    <div className='loader'>
        <Image src={'/assets/icons/loader.svg'} alt='loader' height={32} width={32} className=' animate-spin'/>
        Loading...
    </div>
  )
}
