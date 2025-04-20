import React from 'react'
import { ImSpinner2 } from 'react-icons/im'

const Loading = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm'>
      <ImSpinner2 className='animate-spin h-12 w-12 text-primary' />
    </div>
  )
}

export default Loading
