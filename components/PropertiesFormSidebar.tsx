import { AiOutlineClose } from 'react-icons/ai'
import { FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner()

  if (!selectedElement) return null

  const PropertiesForm = FormElements[selectedElement?.type].propertiesComponent

  return (
    <div className='flex flex-col bg-white dark:bg-zinc-900 h-full'>
      <div className='flex justify-between items-center'>
        <h4 className='text-lg text-zinc-800 dark:text-zinc-100'>
          Element Properties
        </h4>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => setSelectedElement(null)}>
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className='mb-4' />
      <PropertiesForm elementInstance={selectedElement} />
    </div>
  )
}

export default PropertiesFormSidebar
