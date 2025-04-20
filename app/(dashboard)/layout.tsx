import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { UserButton } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen w-full bg-background text-foreground dark:text-white relative overflow-hidden rounded-md'>
      {/* Background Layers */}
      <div className='absolute inset-0 z-0 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-slate-900 dark:to-slate-800' />
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('/grid.svg')] dark:opacity-5" />

      {/* Top Navbar */}
      <nav className='flex items-center justify-between border-b border-border dark:border-border-dark h-16 px-6 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-md shadow-sm z-50'>
        <div className='flex items-center gap-4'>
          <Logo />
        </div>
        <div className='flex items-center gap-4'>
          <ThemeSwitcher />
          <UserButton afterSignOutUrl='/' />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className='flex-grow w-full flex justify-center px-4 py-10 relative z-10'>
        <div className='w-full max-w-5xl bg-white dark:bg-[#0f172a] border dark:border-slate-500 rounded-2xl shadow-xl p-6'>
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
