import { GetForms, GetFormStats } from '@/actions/form'
import CreateFormBtn from '@/components/CreateFormBtn'
import DeleteFormBtn from '@/components/DeleteFormBtn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Form } from '@prisma/client'
import {
  ArrowRightIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  Crosshair2Icon,
  EyeOpenIcon,
  FilePlusIcon,
  Pencil2Icon,
  PersonIcon
} from '@radix-ui/react-icons'
import clsx from 'clsx'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { ReactNode, Suspense } from 'react'

export default function Home() {
  return (
    <div className='container'>
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>

      <section className='my-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <FilePlusIcon className='w-6 h-6 text-primary' />
            <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight'>
              Your Forms
            </h2>
          </div>
        </div>
        <p className='text-sm text-muted-foreground mt-1'>
          Manage, edit, and track your form submissions.
        </p>
        <Separator className='mt-4 mb-6' />
      </section>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        <CreateFormBtn />

        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  )
}

async function CardStatsWrapper() {
  const stats = await GetFormStats()
  return <StatsCards loading={false} data={stats} />
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>
  loading: boolean
}

function StatsCards(props: StatsCardProps) {
  const { data, loading } = props

  return (
    <div className='w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
      <StatsCard
        title='Total Visits'
        icon={
          <div className='bg-blue-100 dark:bg-blue-900 p-2 rounded-full'>
            <PersonIcon className='text-blue-600 dark:text-blue-400' />
          </div>
        }
        helperText='All-time form visits'
        value={data?.visits?.toLocaleString() || ''}
        loading={loading}
        className='bg-card border border-border text-foreground'
      />

      <StatsCard
        title='Total Submissions'
        icon={
          <div className='bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full'>
            <Crosshair2Icon className='text-yellow-600 dark:text-yellow-400' />
          </div>
        }
        helperText='All-time form submissions'
        value={data?.submissions?.toLocaleString() || ''}
        loading={loading}
        className='bg-card border border-border text-foreground'
      />

      <StatsCard
        title='Submission Rate'
        icon={
          <div className='bg-green-100 dark:bg-green-900 p-2 rounded-full'>
            <CheckCircledIcon className='text-green-600 dark:text-green-400' />
          </div>
        }
        helperText='Visits that resulted in form submission'
        value={data?.submissionRate?.toLocaleString() + '%' || ''}
        loading={loading}
        className='bg-card border border-border text-foreground'
      />

      <StatsCard
        title='Bounce Rate'
        icon={
          <div className='bg-red-100 dark:bg-red-900 p-2 rounded-full'>
            <CrossCircledIcon className='text-red-600 dark:text-red-400' />
          </div>
        }
        helperText='Visits that leave without interaction'
        value={data?.bounceRate?.toLocaleString() + '%' || ''}
        loading={loading}
        className='bg-card border border-border text-foreground'
      />
    </div>
  )
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className
}: {
  title: string
  value: string
  icon: ReactNode
  helperText: string
  loading: boolean
  className?: string
}) {
  return (
    <Card
      className={clsx(
        'transition-shadow hover:shadow-lg dark:hover:shadow-gray-900 shadow-md border border-border bg-card dark:bg-gray-800 dark:text-white',
        'flex flex-col justify-between p-5 rounded-2xl min-h-[160px]',
        className
      )}>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-sm font-medium text-muted-foreground'>{title}</h3>
        <div className='p-2 bg-muted rounded-full text-xl'>{icon}</div>
      </div>

      <div className='text-3xl font-semibold text-foreground'>
        {loading ? <Skeleton className='h-8 w-3/4 rounded-md' /> : <>{value}</>}
      </div>

      <p className='text-xs text-muted-foreground mt-2'>{helperText}</p>
    </Card>
  )
}

function FormCardSkeleton() {
  return (
    <Skeleton className='border-2 border-gray-300 h-[200px] w-full rounded-md dark:border-gray-700' />
  )
}

async function FormCards() {
  const forms = await GetForms()
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  )
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card className='bg-white border shadow-sm rounded-lg dark:bg-gray-800 dark:text-white'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
            {form.name}
          </span>
          {form.published ? (
            <Badge className='bg-green-500 text-white dark:bg-green-600'>
              Published
            </Badge>
          ) : (
            <Badge variant='secondary'>Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true
          })}
          <span className='flex items-center gap-2'>
            <EyeOpenIcon className='text-muted-foreground' />
            {form.visits.toLocaleString()}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[40px] truncate text-sm text-muted-foreground'>
        {form.description || 'No description'}
      </CardContent>
      <CardFooter>
        <div className='flex items-center gap-2 w-full'>
          {form.published ? (
            <Button asChild className='w-full text-md gap-4'>
              <Link href={`/forms/${form.id}`}>
                View submissions <ArrowRightIcon />
              </Link>
            </Button>
          ) : (
            <div className='flex items-center gap-2 w-full'>
              <Button asChild variant='default' className='w-full gap-2'>
                <Link href={`/builder/${form.id}`}>
                  <Pencil2Icon className='h-4 w-4' />
                  Edit
                </Link>
              </Button>
              <DeleteFormBtn id={form.id} />
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
