'use client'

import { useTransition } from 'react'
import { MdDelete } from 'react-icons/md'
import { toast } from 'sonner'
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
import { deleteForm as deleteFormAction } from '@/actions/form'

export default function DeleteFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition()

  async function deleteForm() {
    try {
      await deleteFormAction(id)
      toast.success('Form deleted successfully')
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' className='gap-2 w-full'>
          <MdDelete className='h-4 w-4' />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your form
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault()
              startTransition(deleteForm)
            }}
            className='bg-red-600 focus:ring-red-600'>
            {loading ? (
              <>
                <ImSpinner2 className='animate-spin mr-2' />
                Deleting...
              </>
            ) : (
              'Delete Form'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
