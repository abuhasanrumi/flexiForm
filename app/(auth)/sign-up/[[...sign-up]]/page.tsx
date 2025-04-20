import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          cardBox: 'shadow-none border-none',
          footer: 'hidden'
        }
      }}
    />
  )
}
