'use client'

import React, { ReactNode } from 'react'
import Image from 'next/image'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted px-4 py-8'>
      <div className='w-full max-w-5xl h-[600px] rounded-2xl overflow-hidden shadow-xl bg-background flex flex-col md:flex-row border border-border'>
        <div className='w-full md:w-1/2 p-8 flex flex-col justify-center items-center h-full space-y-8'>
          {/* Styled Demo Credentials Notice */}
          <div className='w-full bg-gradient-to-r from-purple-100 to-indigo-100 border border-indigo-200 rounded-xl px-6 py-4 text-sm text-gray-800 shadow-sm text-center'>
            <h3 className='font-semibold text-indigo-700 mb-1'>
              💡 Demo Credentials
            </h3>
            <p>
              <span className='font-medium text-gray-700'>Username:</span>{' '}
              <span className='font-mono text-gray-900'>
                vilid22568@agiuse.com
              </span>
            </p>
            <p>
              <span className='font-medium text-gray-700'>Password:</span>{' '}
              <span className='font-mono text-gray-900'>vilid22568</span>
            </p>
            <p className='text-xs text-gray-600 mt-2'>
              Use these to log in without creating an account.
            </p>
          </div>

          {children}
        </div>

        {/* Right Panel - Unsplash Image + Overlay Text */}
        <div className='hidden md:flex md:w-1/2 relative text-white'>
          <Image
            src='https://images.unsplash.com/photo-1524337676612-18e579b62f4a'
            alt='Login illustration'
            layout='fill'
            objectFit='cover'
            className='brightness-75'
            priority
          />
          <div className='absolute inset-0 bg-black/40' />
          <div className='z-10 relative flex flex-col items-center justify-center text-center px-10'>
            <h2 className='text-2xl font-semibold mb-2'>
              Connect. Build. Simplify.
            </h2>
            <p className='text-sm opacity-80'>
              Create beautiful forms in minutes with FlexiForm — your next-gen
              form builder.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
