'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LucideSeparatorHorizontal } from 'lucide-react'
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
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'

const type: ElementsType = 'SpacerField'

const extraAttributes = {
  height: 20
}

const propertiesSchema = z.object({
  height: z.number().min(5).max(200)
})

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: LucideSeparatorHorizontal,
    label: 'Spacer Field'
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
  const { height } = element.extraAttributes
  return (
    <div className='flex flex-col gap-2 w-full items-center'>
      <Label className='text-muted-foreground'>Spacer Field: {height}px</Label>
      <LucideSeparatorHorizontal className='h-8 w-8 text-slate-500 dark:text-slate-500' />
    </div>
  )
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance

  const { height } = element.extraAttributes
  return <div style={{ height, width: '100%' }}></div>
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
      height: element.extraAttributes.height
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { height } = values

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        height
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
          name='height'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px): {form.watch('height')}</FormLabel>
              <FormControl className='pt-2'>
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => {
                    field.onChange(value[0])
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
