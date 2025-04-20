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
import { format, formatDistance } from 'date-fns'
import { StatsCard } from '../../page'
import { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

async function FormDetailsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const form = await GetFormById(Number(id))

  if (!form) throw new Error('Form not found')

  const { visits, submissions } = form
  const submissionRate = visits > 0 ? (submissions / visits) * 100 : 0
  const bounceRate = 100 - submissionRate

  return (
    <>
      {/* Header (Google Form style) */}
      <div className='container flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-4xl font-semibold text-foreground tracking-tight'>
            {form.name}
          </h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Form analytics & submission insights
          </p>
        </div>
        <VisitBtn shareUrl={form.shareURL} />
      </div>

      {/* Share Section */}
      <div className='container py-6'>
        <div className='bg-muted/20 border border-muted rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='text-muted-foreground text-sm font-medium'>
            Share your form with others
          </div>
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className='container grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Total visits'
          icon={<PersonIcon className='text-blue-600 w-5 h-5' />}
          helperText='All-time form visits'
          value={visits?.toLocaleString() || ''}
          loading={false}
          className='bg-white rounded-2xl shadow hover:shadow-lg transition p-4 ring-1 ring-muted/10'
        />
        <StatsCard
          title='Total submissions'
          icon={<Crosshair2Icon className='text-yellow-600 w-5 h-5' />}
          helperText='All-time form submissions'
          value={submissions?.toLocaleString() || ''}
          loading={false}
          className='bg-white rounded-2xl shadow hover:shadow-lg transition p-4 ring-1 ring-muted/10'
        />
        <StatsCard
          title='Submission rate'
          icon={<CheckCircledIcon className='text-green-600 w-5 h-5' />}
          helperText='Visits resulting in form submission'
          value={submissionRate.toFixed(2) + '%' || ''}
          loading={false}
          className='bg-white rounded-2xl shadow hover:shadow-lg transition p-4 ring-1 ring-muted/10'
        />
        <StatsCard
          title='Bounce rate'
          icon={<CrossCircledIcon className='text-red-600 w-5 h-5' />}
          helperText='Visitors who left without submitting'
          value={bounceRate.toFixed(2) + '%' || ''}
          loading={false}
          className='bg-white rounded-2xl shadow hover:shadow-lg transition p-4 ring-1 ring-muted/10'
        />
      </div>

      {/* Submissions Table */}
      <div className='container'>
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
  if (!form) throw new Error('Form not found')

  const formElements = JSON.parse(form.content) as FormElementInstance[]

  const columns: {
    id: string
    label: string
    required: boolean
    type: ElementsType
  }[] = []

  formElements.forEach((element) => {
    const isValidType = [
      'TextField',
      'NumberField',
      'TextareaField',
      'CheckboxField',
      'DateField',
      'SelectField',
      'ParagraphField'
    ].includes(element.type)

    if (isValidType) {
      columns.push({
        id: element.id,
        label: String(element.extraAttributes?.label || ''),
        required: Boolean(element.extraAttributes?.required),
        type: element.type
      })
    }
  })

  const rows: Row[] = form.FormSubmissions.map((submission) => ({
    ...JSON.parse(submission.content),
    submittedAt: submission.createdAt
  }))

  return (
    <>
      <h2 className='text-2xl font-semibold my-8 tracking-tight'>
        Submissions
      </h2>

      {/* Show a message if no submissions */}
      {rows.length === 0 ? (
        <div className='p-6 text-center bg-muted/20 rounded-xl border border-muted'>
          <p className='text-lg text-muted-foreground'>
            No submissions yet for this form.
          </p>
        </div>
      ) : (
        <div className='overflow-x-auto rounded-xl border border-muted shadow-sm'>
          <Table className='min-w-[800px]'>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
                    className='text-sm font-medium text-muted-foreground uppercase tracking-wider px-4 py-2'>
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className='text-sm font-medium text-muted-foreground uppercase tracking-wider text-right px-4 py-2'>
                  Submitted At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  className='hover:bg-muted/20 transition-colors duration-200'>
                  {columns.map((column) => (
                    <RowCell
                      key={column.id}
                      type={column.type}
                      value={row[column.id]}
                    />
                  ))}
                  <TableCell className='text-muted-foreground text-right px-4 py-2'>
                    {formatDistance(row.submittedAt, new Date(), {
                      addSuffix: true
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value

  switch (type) {
    case 'DateField':
      if (!value) break
      const date = new Date(value)
      node = (
        <Badge variant='outline' className='text-xs px-2 py-1 rounded-md'>
          {format(date, 'dd MMM yyyy')}
        </Badge>
      )
      break

    case 'CheckboxField':
      const checked = value === 'true'
      node = (
        <div className='flex justify-center items-center'>
          <Checkbox checked={checked} disabled />
        </div>
      )
      break

    default:
      node = <span className='text-sm text-foreground'>{value}</span>
      break
  }

  return <TableCell className='px-4 py-2'>{node}</TableCell>
}
