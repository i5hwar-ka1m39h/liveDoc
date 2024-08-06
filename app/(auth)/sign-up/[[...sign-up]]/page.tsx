import { SignUp } from '@clerk/nextjs'
import React from 'react'

export default function SingUpPage() {
  return (
    <main className='auth-page'>
        <SignUp/>
    </main>
  )
}
