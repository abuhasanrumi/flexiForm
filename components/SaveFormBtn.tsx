import { UpdateFormContent } from '@/actions/form'
import { useTransition } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { HiSaveAs } from 'react-icons/hi'
import { toast } from 'sonner'
import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'

export default function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition()

  const updateFormContent = async () => {
    try {
      const JSONElements = JSON.stringify(elements)
      await UpdateFormContent(id, JSONElements)
      toast.success('Form saved successfully')
    } catch (error) {
      toast.error('Something went wrong', error)
    }
  }
  return (
    <Button
      variant={'outline'}
      className='gap-2'
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent)
      }}>
      <HiSaveAs className='h-4 w-4' />
      Save
      {loading && <FaSpinner className='animate-spin' />}
    </Button>
  )
}
