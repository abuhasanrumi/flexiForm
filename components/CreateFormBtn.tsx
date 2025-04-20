'use client'

import { CreateForm } from '@/actions/form'
import { formSchema, formSchemaType } from '@/schemas/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FilePlusIcon } from '@radix-ui/react-icons'
import { LoaderCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const CreateFormBtn = () => {
  const router = useRouter()

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema)
  })

  async function onSubmit(values: formSchemaType) {
    try {
      const formId = await CreateForm(values)
      toast.success('Form created successfully')
      router.push(`/builder/${formId}`)
    } catch {
      toast.error('Something went wrong, please try again.')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='group w-full flex flex-col items-center justify-center border border-border hover:border-primary hover:shadow-md border-dashed gap-4 bg-background hover:bg-muted transition-colors min-h-[200px] h-full'>
          <FilePlusIcon className='h-16 w-16 text-muted-foreground group-hover:text-primary transition-colors' />
          <p className='font-bold text-xl text-muted-foreground group-hover:text-primary transition-colors'>
            Create new form
          </p>
        </Button>
      </DialogTrigger>

      <DialogContent className='bg-background text-foreground'>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Create a new form to start collecting responses
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 pt-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className='bg-background border-border focus-visible:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      {...field}
                      className='bg-background border-border focus-visible:ring-primary'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='submit'
                disabled={form.formState.isSubmitting}
                className='w-full mt-2'>
                {!form.formState.isSubmitting && <span>Save</span>}
                {form.formState.isSubmitting && (
                  <LoaderCircleIcon className='animate-spin w-4 h-4' />
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFormBtn
