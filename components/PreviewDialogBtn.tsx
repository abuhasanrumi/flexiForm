import { MdPreview } from 'react-icons/md'
import { FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle
} from './ui/dialog'
import { X } from 'lucide-react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function PreviewDialogBtn() {
  const { elements } = useDesigner()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='gap-2'>
          <MdPreview className='h-6 w-6' />
          Preview
        </Button>
      </DialogTrigger>

      <DialogContent className='w-screen h-screen max-h-screen max-w-full flex flex-col flex-grow p-0 gap-0'>
        {/* Visually hidden DialogTitle for accessibility */}
        <DialogTitle asChild>
          <VisuallyHidden>Form Preview</VisuallyHidden>
        </DialogTitle>

        <div className='px-6 py-4 border-b bg-background sticky top-0 z-10 shadow-sm flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-foreground tracking-tight'>
              Form Preview
            </h2>
            <p className='text-sm text-muted-foreground mt-1'>
              This is how your form will appear to users.
            </p>
          </div>
          <DialogClose asChild>
            <Button
              size='icon'
              variant='ghost'
              className='text-muted-foreground hover:text-foreground'>
              <X className='w-5 h-5' />
            </Button>
          </DialogClose>
        </div>

        <div className='bg-accent flex flex-col flex-grow items-center justify-center p-4 bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] overflow-y-auto'>
          <div className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto'>
            {elements.map((el) => {
              const FormComponent = FormElements[el.type].formComponent
              return <FormComponent key={el.id} elementInstance={el} />
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
