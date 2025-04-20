import { FormElements } from './FormElements'
import SidebarBtnElement from './SidebarBtnElement'
import { Separator } from './ui/separator'

function FormElementsSidebar() {
  return (
    <div className='space-y-8 text-zinc-800 dark:text-zinc-100'>
      <div>
        <p className='text-lg font-semibold mb-2'>Add elements</p>
        <p className='text-sm text-zinc-500 dark:text-zinc-400 mb-6'>
          Drag and drop or click to add elements to your form
        </p>
        <Separator className='mb-6 bg-zinc-200 dark:bg-zinc-700' />
      </div>

      <div className='space-y-6'>
        {/* Layout Elements Section */}
        <div>
          <p className='text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-3'>
            Layout elements
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <SidebarBtnElement formElement={FormElements.TitleField} />
            <SidebarBtnElement formElement={FormElements.SubtitleField} />
            <SidebarBtnElement formElement={FormElements.ParagraphField} />
            <SidebarBtnElement formElement={FormElements.SeparatorField} />
            <SidebarBtnElement formElement={FormElements.SpacerField} />
          </div>
        </div>

        {/* Form Elements Section */}
        <div>
          <p className='text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-3'>
            Form elements
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            <SidebarBtnElement formElement={FormElements.TextField} />
            <SidebarBtnElement formElement={FormElements.NumberField} />
            <SidebarBtnElement formElement={FormElements.TextareaField} />
            <SidebarBtnElement formElement={FormElements.DateField} />
            <SidebarBtnElement formElement={FormElements.SelectField} />
            <SidebarBtnElement formElement={FormElements.CheckboxField} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormElementsSidebar
