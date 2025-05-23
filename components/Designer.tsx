'use client'

import { idGenerator } from '@/lib/idGenerator'
import { cn } from '@/lib/utils'
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable
} from '@dnd-kit/core'
import { useState } from 'react'
import { BiSolidTrash } from 'react-icons/bi'
import DesignerSidebar from './DesignerSidebar'
import { ElementsType, FormElementInstance, FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'

export default function Designer() {
  const {
    elements,
    addElement,
    removeElement,
    selectedElement,
    setSelectedElement
  } = useDesigner()

  const droppable = useDroppable({
    id: 'designer-drop-area',
    data: { isDesignerDropArea: true }
  })

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event
      if (!active || !over) return

      const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement
      const isDroppingOverDesignerDropArea =
        over?.data?.current?.isDesignerDropArea
      const isDroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement
      const isDroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement

      if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        const type = active?.data?.current?.type
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator()
        )
        addElement(elements.length, newElement)
        return
      }

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf
      if (isDesignerBtnElement && isDroppingOverDesignerElement) {
        const type = active?.data?.current?.type
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator()
        )
        const overElementIndex = elements.findIndex(
          (el) => el.id === over.data?.current?.elementId
        )
        if (overElementIndex === -1) throw new Error('Element not found')

        let indexForNewElement = overElementIndex
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1
        }
        addElement(indexForNewElement, newElement)
        return
      }

      const isDraggingDesignerElement = active.data?.current?.isDesignerElement
      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId
        const overId = over.data?.current?.elementId
        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId
        )
        const overElementIndex = elements.findIndex((el) => el.id === overId)

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error('Element not found')
        }

        const activeElement = { ...elements[activeElementIndex] }
        removeElement(activeId)

        let indexForNewElement = overElementIndex
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1
        }
        addElement(indexForNewElement, activeElement)
      }
    }
  })

  return (
    <div className='flex w-full h-[100vh]'>
      {/* Left Preview (Fixed Height) */}
      <div
        className='p-4 w-full h-full overflow-y-auto'
        onClick={() => {
          if (selectedElement) {
            setSelectedElement(null)
          }
        }}>
        <div
          ref={droppable.setNodeRef}
          className={cn(
            'bg-white/80 max-w-[920px] h-full m-auto rounded-lg flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto shadow-sm border border-zinc-200 transition-all ease-in-out duration-300',
            droppable.isOver && 'ring-2 ring-primary/50'
          )}>
          {!droppable.isOver && elements.length === 0 && (
            <p className='text-2xl text-zinc-400 flex flex-grow items-center font-normal'>
              Drag and drop elements here to design your form
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className='p-4 w-full'>
              <div className='h-[120px] rounded-lg bg-primary/10 border-2 border-primary/20 border-dashed'></div>
            </div>
          )}
          {elements?.length > 0 && (
            <div className='flex flex-col w-full gap-3 p-6'>
              {elements?.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <DesignerSidebar />
    </div>
  )
}

export function DesignerElementWrapper({
  element
}: {
  element: FormElementInstance
}) {
  const { removeElement, setSelectedElement } = useDesigner()
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)

  const topHalf = useDroppable({
    id: element.id + '-top',
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  })

  const bottomHalf = useDroppable({
    id: element.id + '-bottom',
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  })

  const draggable = useDraggable({
    id: element.id + '-drag-handler',
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true
    }
  })

  if (draggable.isDragging) return null

  const DesignerElement = FormElements[element.type].designerComponent
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-lg border border-zinc-200 hover:border-primary/30 transition-all ease-in-out duration-300'
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}>
      <div
        ref={topHalf.setNodeRef}
        className='absolute w-full h-1/2 rounded-t-md'
      />
      <div
        ref={bottomHalf.setNodeRef}
        className='absolute w-full bottom-0 h-1/2 rounded-b-md'
      />
      {mouseIsOver && (
        <>
          <div className='absolute right-0 h-full'>
            <Button
              className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500'
              variant={'outline'}
              onClick={(e) => {
                e.stopPropagation()
                removeElement(element.id)
              }}>
              <BiSolidTrash />
            </Button>
          </div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
            <p className='text-muted-foreground text-sm'>
              Click to edit or drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className='absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none' />
      )}
      <div
        className={cn(
          'flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100 bg-white',
          mouseIsOver && 'opacity-30'
        )}>
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (
        <div className='absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none' />
      )}
    </div>
  )
}
