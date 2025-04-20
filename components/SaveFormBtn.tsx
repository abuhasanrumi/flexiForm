import { UpdateFormContent } from '@/actions/form'
import { useTransition } from 'react'
import { HiSaveAs } from 'react-icons/hi'
import { toast } from 'sonner'
import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'
import { ImSpinner2 } from 'react-icons/im'

export default function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition()

  const updateFormContent = async () => {
    try {
      const JSONElements = JSON.stringify(elements)
      await UpdateFormContent(id, JSONElements)
      toast.success('Form saved successfully')
    } catch {
      toast.error('Something went wrong')
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
      {loading && <ImSpinner2 className='animate-spin' />}
    </Button>
  )
}
