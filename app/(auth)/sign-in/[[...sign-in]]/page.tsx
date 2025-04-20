'use client'

import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          cardBox: 'shadow-none border-none',
          footer: 'hidden'
        }
      }}
    />
  )
}
