import { GetFormStats } from "@/actions/form";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { PersonIcon } from "@radix-ui/react-icons";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { ReactNode, Suspense } from "react";

export default function Home() {
  return (
    <div className='container pt-4'>
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>

      <Separator className="my-6"/>
      <h2 className="text-4xl font-bold col-span-2">Your Forms</h2>
      <Separator className="my-6"/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
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

function StatsCards(props: StatsCardProps){
  const {data, loading} = props

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        icon={<PersonIcon className="text-blue-600"/>}
        helperText="All time form visits"
        value={data?.visits?.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total submissions"
        icon={<Crosshair2Icon className="text-yellow-600"/>}
        helperText="All time form submissions"
        value={data?.submissions?.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Submission rate"
        icon={<CheckCircledIcon className="text-blue-600"/>}
        helperText="Visits that result in form submission"
        value={data?.submissionRate?.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Bounce rate"
        icon={<CrossCircledIcon className="text-red-600"/>}
        helperText="Visits that leave without interaction"
        value={data?.bounceRate?.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  )
}

function StatsCard({
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
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {loading && (
            <Skeleton>
              <span className='opacity-0'>0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
      </CardContent>
    </Card>
  )
}