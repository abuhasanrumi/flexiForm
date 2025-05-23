'use client'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoMdCheckbox } from 'react-icons/io'
import { z } from 'zod'
import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction
} from '../FormElements'
import useDesigner from '../hooks/useDesigner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Checkbox } from '../ui/checkbox'

const type: ElementsType = 'CheckboxField'

const extraAttributes = {
  label: 'Checkbox Field',
  helperText: 'Helper Text',
  required: false
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false)
})

export const CheckboxFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: IoMdCheckbox,
    label: 'Checkbox Field'
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (
    formElement: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElement as CustomInstance
    if (element.extraAttributes.required) {
      return currentValue === 'true'
    }
    return true
  }
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
  const { label, required, helperText } = element.extraAttributes
  const id = `checkbox-${element.id}`
  return (
    <div className='flex flex-col gap-2 w-full shadow-sm'>
      <div className='flex items-start space-x-3'>
        <Checkbox
          id={id}
          className='mt-1 border-zinc-300 data-[state=checked]:bg-[#673ab7] data-[state=checked]:border-[#673ab7]'
        />
        <div className='grid gap-1.5 leading-none'>
          <Label htmlFor={id} className='text-base font-medium text-[#202124]'>
            {label}
            {required && <span className='text-[#d93025] ml-1'>*</span>}
          </Label>
          {helperText && <p className='text-[#5f6368] text-sm'>{helperText}</p>}
        </div>
      </div>
    </div>
  )
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue
}: {
  elementInstance: FormElementInstance
  submitValue?: SubmitFunction
  isInvalid?: boolean
  defaultValue?: string
}) {
  const element = elementInstance as CustomInstance
  const [value, setValue] = useState<boolean>(
    defaultValue === 'true' ? true : false
  )
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!isInvalid) return
    setError(true)
  }, [isInvalid])

  const { label, required, helperText } = element.extraAttributes
  const id = `checkbox-${element.id}`
  return (
    <div className='flex flex-col gap-2 w-full transition-shadow'>
      <div className='flex items-start space-x-3'>
        <Checkbox
          id={id}
          checked={value}
          className={cn(
            'mt-1 border-zinc-300 data-[state=checked]:bg-[#673ab7] data-[state=checked]:border-[#673ab7]',
            error && 'border-[#d93025]'
          )}
          onCheckedChange={(checked) => {
            let value = false
            if (checked == true) value = true
            setValue(value)
            if (!submitValue) return
            const stringValue = value ? 'true' : 'false'
            const valid = CheckboxFieldFormElement.validate(
              element,
              stringValue
            )
            setError(!valid)
            submitValue(element.id, stringValue)
          }}
        />
        <div className='grid gap-1.5 leading-none'>
          <Label
            htmlFor={id}
            className={cn(
              'text-base font-medium text-[#202124]',
              error && 'text-[#d93025]'
            )}>
            {label}
            {required && <span className='text-[#d93025] ml-1'>*</span>}
          </Label>
          {helperText && (
            <p
              className={cn(
                'text-sm text-[#5f6368]',
                error && 'text-[#d93025]'
              )}>
              {helperText}
            </p>
          )}
        </div>
      </div>
    </div>
  )
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
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required } = values

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required
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
          name='label'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
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
              <FormDescription>
                This is label of the field <br /> It will be displayed above the
                field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='helperText'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
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
              <FormDescription>
                The helper text of the field <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='required'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
              <div className='space-y-0.5'>
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  If this field is required, the user will not be able to submit
                  the form until this field is filled.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
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
