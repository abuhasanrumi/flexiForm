'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LucideHeading2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ElementsType, FormElement, FormElementInstance } from '../FormElements'
import useDesigner from '../hooks/useDesigner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const type: ElementsType = 'SubtitleField'

const extraAttributes = {
  title: 'Subtitle Field'
}

const propertiesSchema = z.object({
  title: z.string().min(2).max(50)
})

export const SubtitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: LucideHeading2,
    label: 'Subtitle Field'
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: () => true
}

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { title } = element.extraAttributes
  return (
    <div className='flex flex-col gap-2 w-full'>
      <Label className='text-zinc-500 font-normal'>Subtitle Field</Label>
      <p className='text-lg font-normal text-zinc-800'>{title}</p>
    </div>
  )
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance

  const { title } = element.extraAttributes
  return <p className='text-xl'>{title}</p>
}

function PropertiesComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      title: element.extraAttributes.title
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { title } = values

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        title
      }
    })
  }
  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault()
        }}
        className='space-y-3'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
