import { GetFormById, getFormWithSubmissions } from '@/actions/form'
import { ElementsType, FormElementInstance } from '@/components/FormElements'
import FormLinkShare from '@/components/FormLinkShare'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import VisitBtn from '@/components/VisitBtn'
import {
  CheckCircledIcon,
  CrossCircledIcon,
  Crosshair2Icon,
  PersonIcon
} from '@radix-ui/react-icons'
import { formatDistance } from 'date-fns'
import { StatsCard } from '../../page'

async function FormDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const form = await GetFormById(Number(id))

  if (!form) {
    throw new Error('Form not found')
  }

  const { visits, submissions } = form

  let submissionRate = 0

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100
  }

  const bounceRate = 100 - submissionRate
  console.log('form', form)

  return (
    <>
      <div className='py-10 border-b border-muted'>
        <div className='flex justify-between container'>
          <h1 className='text-4xl font-bold truncate'>{form.name}</h1>
          <VisitBtn shareUrl={form.shareURL} />
        </div>
      </div>

      <div className='py-4 border-b border-muted'>
        <div className='container flex gap-2 items-center justify-between'>
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>

      <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container'>
        <StatsCard
          title='Total visits'
          icon={<PersonIcon className='text-blue-600' />}
          helperText='All time form visits'
          value={visits?.toLocaleString() || ''}
          loading={false}
          className='shadow-md shadow-blue-600'
        />

        <StatsCard
          title='Total submissions'
          icon={<Crosshair2Icon className='text-yellow-600' />}
          helperText='All time form submissions'
          value={submissions?.toLocaleString() || ''}
          loading={false}
          className='shadow-md shadow-yellow-600'
        />

        <StatsCard
          title='Submission rate'
          icon={<CheckCircledIcon className='text-blue-600' />}
          helperText='Visits that result in form submission'
          value={submissionRate?.toLocaleString() + '%' || ''}
          loading={false}
          className='shadow-md shadow-blue-600'
        />

        <StatsCard
          title='Bounce rate'
          icon={<CrossCircledIcon className='text-red-600' />}
          helperText='Visits that leave without interaction'
          value={bounceRate?.toLocaleString() + '%' || ''}
          loading={false}
          className='shadow-md shadow-red-600'
        />
      </div>

      <div className='container pt-18'>
        <SubmissionTable id={form.id} />
      </div>
    </>
  )
}

export default FormDetailsPage

type Row = {
  [key: string]: string
} & {
  submittedAt: Date
}

async function SubmissionTable({ id }: { id: number }) {
  const form = await getFormWithSubmissions(id)
  if (!form) {
    throw new Error('Form not found')
  }
  const formElements = JSON.parse(form.content) as FormElementInstance[]
  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []

  formElements.forEach((element) => {
    switch (element.type) {
      case 'TextField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type
        })
        break
      default:
        break
    }
  })

  const rows: Row[] = []

  form.FormSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content)
    rows.push({
      ...content,
      submittedAt: submission.createdAt
    })
  })

  return (
    <>
      <h1 className='text-2xl font-bold my-4'>Submissions</h1>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className='uppercase'>
                  {column.label}
                </TableHead>
              ))}
              <TableHead className='text-muted-foreground text-right uppercase'>
                Submitted at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className='text-muted-foreground text-right'>
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  const node: ReactNode = value
  return <TableCell>{node}</TableCell>
}
