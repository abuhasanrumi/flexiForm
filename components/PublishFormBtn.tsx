import { PublishForm } from '@/actions/form'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { MdOutlinePublish } from 'react-icons/md'
import { toast } from 'sonner'
import useDesigner from './hooks/useDesigner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { Button } from './ui/button'
import { ImSpinner2 } from 'react-icons/im'

export default function PublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition()
  const router = useRouter()
  const { elements } = useDesigner()

  async function publishForm() {
    if (elements.length === 0) {
      toast.error('Please add at least one element before publishing')
      return
    }
    try {
      await PublishForm(id)
      toast.success('Form published successfully')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'>
          <MdOutlinePublish className='h-4 w-4' />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. After publishing you will not be able
            to edit this form. <br /> <br />
            <span className='font-medium'>
              By publishing this form you will make it available to the public
              and you will be able to collect submission
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault()
              startTransition(publishForm)
            }}>
            Proceed {loading && <ImSpinner2 className='animate-spin' />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
