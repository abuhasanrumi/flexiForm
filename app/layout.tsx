import DesignerContextProvider from '@/components/context/DesignerContext'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlexiForm',
  description: 'A drag and drop form builder app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <ClerkProvider afterSignOutUrl='/sign-in'>
          <DesignerContextProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='system'
              enableSystem
              disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </DesignerContextProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
