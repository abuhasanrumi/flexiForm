'use client'

import { SubmitForm } from '@/actions/form'
import { useCallback, useRef, useState, useTransition } from 'react'
import { HiCursorClick } from 'react-icons/hi'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'sonner'
import { FormElementInstance, FormElements } from './FormElements'
import { Button } from './ui/button'

function FormSubmitComponent({
  formUrl,
  content
}: {
  content: FormElementInstance[]
  formUrl: string
}) {
  const formValues = useRef<{ [key: string]: string }>({})
  const formErrors = useRef<{ [key: string]: boolean }>({})
  const [renderKey, setRenderKey] = useState(new Date().getTime())

  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || ''
      const valid = FormElements[field.type].validate(field, actualValue)

      if (!valid) {
        formErrors.current[field.id] = true
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false
    }
    return true
  }, [content])

  const submitValue = (key: string, value: string) => {
    formValues.current[key] = value
  }
  const submitForm = async () => {
    formErrors.current = {}
    const validForm = validateForm()
    if (!validForm) {
      setRenderKey(new Date().getTime())
      toast.error('Please check the form for errors')
      return
    }

    try {
      const jsonContent = JSON.stringify(formValues.current)
      await SubmitForm(formUrl, jsonContent)
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong')
    }

    console.log('form vales', formValues.current)
  }

  if (submitted)
    return (
      <div className='flex items-center justify-center w-full h-full p-6 sm:p-8 bg-accent/50'>
        <div className='w-full max-w-xl bg-background border border-border shadow-md rounded-xl p-6 sm:p-10 text-center space-y-4'>
          <div className='mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-green-600'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>

          <h1 className='text-2xl font-semibold text-foreground'>
            Form Submitted Successfully!
          </h1>
          <p className='text-muted-foreground'>
            Thanks for submitting the form. You can safely close this page now.
          </p>
        </div>
      </div>
    )

  return (
    <div className='flex justify-center items-center w-full h-full p-4 sm:p-8 bg-accent/30'>
      <div
        key={renderKey}
        className='w-full max-w-2xl bg-background border border-border rounded-xl px-6 py-8 sm:px-10 sm:py-10 overflow-y-auto flex flex-col gap-6'>
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          )
        })}

        <Button
          className='mt-6 self-end w-full sm:w-auto transition-colors'
          onClick={() => {
            startTransition(submitForm)
          }}
          disabled={pending}>
          {!pending ? (
            <span className='flex items-center gap-2'>
              <HiCursorClick />
              Submit
            </span>
          ) : (
            <ImSpinner2 className='animate-spin text-lg' />
          )}
        </Button>
      </div>
    </div>
  )
}

export default FormSubmitComponent
