import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link
      href={'/'}
      className='flex items-center gap-2 font-medium text-xl hover:cursor-pointer'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='text-purple-600'>
        <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
        <path d='M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z' />
        <path d='M8 10h8' />
        <path d='M8 14h8' />
        <path d='M8 18h8' />
      </svg>
      <span className='text-purple-600'>FlexiForm</span>
    </Link>
  )
}

export default Logo
