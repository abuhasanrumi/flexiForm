import { GetFormContentByUrl } from '@/actions/form'
import { FormElementInstance } from '@/components/FormElements'
import FormSubmitComponent from '@/components/FormSubmitComponent'

async function SubmitPage({
  params
}: {
  params: Promise<{ formUrl: string }>
}) {
  const resolvedParams = await params
  console.log('resolvedParams', resolvedParams)
  const { formUrl } = resolvedParams
  const form = await GetFormContentByUrl(formUrl)
  if (!form) {
    throw new Error('Form not found')
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[]
  return <FormSubmitComponent formUrl={formUrl} content={formContent} />
}

export default SubmitPage
