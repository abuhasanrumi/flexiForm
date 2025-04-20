'use client'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdTextFields } from 'react-icons/md'
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

const type: ElementsType = 'TextField'

const extraAttributes = {
  label: 'Text Field',
  helperText: 'Helper Text',
  required: false,
  placeholder: 'Value here...'
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeholder: z.string().max(50)
})

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes
  }),
  designerBtnElement: {
    icon: MdTextFields,
    label: 'Text Field'
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
      return currentValue.length > 0
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
  const { label, required, placeholder, helperText } = element.extraAttributes
  return (
    <div className='flex flex-col gap-2 w-full shadow-sm'>
      <Label className='text-base font-medium text-[#202124]'>
        {label}
        {required && <span className='text-[#d93025] ml-1'>*</span>}
      </Label>
      <Input
        readOnly
        disabled
        placeholder={placeholder}
        className='bg-transparent border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 focus-visible:border-[#673ab7] text-[#202124] px-0 h-9 placeholder:text-zinc-400'
      />
      {helperText && (
        <p className='text-[#5f6368] text-sm mt-1.5'>{helperText}</p>
      )}
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
  const [value, setValue] = useState(defaultValue || '')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!isInvalid) return
    setError(true)
  }, [isInvalid])

  const { label, required, placeholder, helperText } = element.extraAttributes
  return (
    <div className='flex flex-col gap-2 w-full transition-shadow'>
      <Label
        className={cn(
          'text-base font-medium text-[#202124]',
          error && 'text-[#d93025]'
        )}>
        {label}
        {required && <span className='text-[#d93025] ml-1'>*</span>}
      </Label>
      <Input
        className={cn(
          'bg-transparent border-b border-t-0 border-x-0 rounded-none focus-visible:ring-0 focus-visible:border-[#673ab7] text-[#202124] px-0 h-9 placeholder:text-zinc-400',
          error && 'border-[#d93025] focus-visible:border-[#d93025]'
        )}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          if (!submitValue) return
          const valid = TextFieldFormElement.validate(element, e.target.value)
          setError(!valid)
          if (!valid) return
          submitValue(element.id, e.target.value)
        }}
        value={value || ''}
      />
      {helperText && (
        <p
          className={cn(
            'text-sm text-[#5f6368] mt-1.5',
            error && 'text-[#d93025]'
          )}>
          {helperText}
        </p>
      )}
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
      required: element.extraAttributes.required,
      placeholder: element.extraAttributes.placeholder
    }
  })

  useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { label, helperText, required, placeholder } = values

    updateElement(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeholder
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
          name='placeholder'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
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
              <FormDescription>The placeholder of the field</FormDescription>
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
