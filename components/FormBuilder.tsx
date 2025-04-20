'use client'

import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { Form } from '@prisma/client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { BiSolidArrowToLeft, BiSolidArrowToRight } from 'react-icons/bi'
import Designer from './Designer'
import DragOverlayWrapper from './DragOverlayWrapper'
import PreviewDialogBtn from './PreviewDialogBtn'
import PublishFormBtn from './PublishFormBtn'
import SaveFormBtn from './SaveFormBtn'
import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'sonner'
import Loading from '@/app/loading'

const FormBuilder = ({ form }: { form: Form }) => {
  const { setElements, setSelectedElement } = useDesigner()
  const [isReady, setIsReady] = useState(false)

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5
    }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  useEffect(() => {
    if (isReady) return
    const elements = JSON.parse(form.content)
    setElements(elements)
    setSelectedElement(null)
    const readyTimeout = setTimeout(() => setIsReady(true), 500)
    return () => clearTimeout(readyTimeout)
  }, [form, setElements, isReady, setSelectedElement])

  if (!isReady) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-full'>
        <Loading />
      </div>
    )
  }

  const shareUrl = `${window.location.origin}/submit/${form.shareURL}`
  if (form.published) {
    return (
      <>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1000}
        />
        <div className='min-h-screen w-full flex items-center justify-center px-6 py-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors'>
          <div className='max-w-xl w-full bg-background shadow-xl rounded-2xl p-10 border border-zinc-200 dark:border-zinc-700'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl font-bold text-primary mb-2'>
                🎉 Form Published!
              </h1>
              <p className='text-base text-muted-foreground'>
                Share the form link below to collect responses.
              </p>
            </div>

            <div className='mb-6'>
              <label className='text-sm font-medium text-muted-foreground mb-2 block'>
                Shareable Link
              </label>
              <div className='flex items-center gap-2'>
                <Input className='flex-1' readOnly value={shareUrl} />
                <Button
                  variant='secondary'
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    toast.success('Link copied to clipboard')
                  }}>
                  Copy
                </Button>
              </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between gap-4 mt-10'>
              <Link href='/' className='w-full md:w-auto'>
                <Button
                  variant='outline'
                  className='w-full justify-center gap-2'>
                  <BiSolidArrowToLeft className='w-4 h-4' />
                  Go Home
                </Button>
              </Link>

              <Link href={`/forms/${form.id}`} className='w-full md:w-auto'>
                <Button className='w-full justify-center gap-2'>
                  View Form Details
                  <BiSolidArrowToRight className='w-4 h-4' />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <DndContext sensors={sensors}>
      <main className='flex flex-col w-full'>
        <nav className='flex justify-between items-center mb-6'>
          <h2 className='truncate font-semibold text-lg'>
            <span className='text-muted-foreground mr-2'>Form: </span>
            {form.name}
          </h2>
          <div className='flex items-center gap-3'>
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>

        <div className='flex flex-col w-full flex-grow items-center justify-center relative overflow-y-auto bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)] rounded-md'>
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  )
}

export default FormBuilder
