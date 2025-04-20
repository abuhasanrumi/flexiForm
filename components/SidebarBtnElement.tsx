import React from 'react'
import { FormElement } from './FormElements'
import { Button } from './ui/button'
import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

export default function SidebarBtnElement({
  formElement
}: {
  formElement: FormElement
}) {
  const { label, icon: Icon } = formElement.designerBtnElement

  const draggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true
    }
  })
  return (
    <Button
      ref={draggable.setNodeRef}
      variant={'outline'}
      className={cn(
        'flex flex-col gap-2 h-[120px] w-auto cursor-grab bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-colors p-2',
        'hover:border-primary/30 active:border-primary/50',
        draggable.isDragging && 'ring-2 ring-primary/50'
      )}
      {...draggable.listeners}
      {...draggable.attributes}>
      <Icon className='h-12 w-12 text-zinc-700 cursor-grab' />
      <p className='text-sm text-zinc-600 text-wrap'>{label}</p>
    </Button>
  )
}

export function SidebarBtnElementDragOverlay({
  formElement
}: {
  formElement: FormElement
}) {
  const { label, icon: Icon } = formElement.designerBtnElement

  return (
    <Button
      variant={'outline'}
      className='flex flex-col gap-2 h-[120px] w-auto cursor-grab bg-white border border-zinc-200 rounded-lg'>
      <Icon className='h-12 w-12 text-zinc-700 cursor-grab' />
      <p className='text-sm text-zinc-600'>{label}</p>
    </Button>
  )
}
