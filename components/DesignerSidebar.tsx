import FormElementsSidebar from './FormElementsSidebar'
import useDesigner from './hooks/useDesigner'
import PropertiesFormSidebar from './PropertiesFormSidebar'

export default function DesignerSidebar() {
  const { selectedElement } = useDesigner()

  return (
    <aside
      className='w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 
                 border border-zinc-200 dark:border-zinc-700 
                 rounded-md p-6 
                 bg-white dark:bg-zinc-900 
                 text-zinc-800 dark:text-zinc-100
                 overflow-y-auto h-full transition-colors'>
      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <PropertiesFormSidebar />}
    </aside>
  )
}
