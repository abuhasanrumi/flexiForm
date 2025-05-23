'use server'

import { prisma } from '@/lib/prisma'
import { formSchema, formSchemaType } from '@/schemas/form'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

class UserNotFoundError extends Error {}

export async function GetFormStats() {
  const user = await currentUser()

  if (!user) {
    throw new UserNotFoundError()
  }

  const stats = await prisma.form.aggregate({
    where: {
      userId: user.id
    },
    _sum: {
      visits: true,
      submissions: true
    }
  })

  const visits = stats._sum.visits || 0
  const submissions = stats._sum.submissions || 0

  let submissionRate = 0

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100
  }

  const bounceRate = 100 - submissionRate

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate
  }
}

export async function CreateForm(data: formSchemaType) {
  const validation = formSchema.safeParse(data)
  if (!validation.success) {
    throw new Error('Invalid form data')
  }

  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }

  const { name, description } = data
  const form = await prisma.form.create({
    data: {
      name,
      description,
      userId: user.id
    }
  })

  if (!form) {
    throw new Error('Failed to create form')
  }

  return form.id
}

export async function GetForms() {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }

  const forms = await prisma.form.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return forms
}

export async function GetFormById(id: number) {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }

  const form = await prisma.form.findUnique({
    where: {
      id,
      userId: user.id
    }
  })
  return form
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser()

  if (!user) {
    throw new UserNotFoundError()
  }

  return await prisma.form.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      content: jsonContent
    }
  })
}

export async function PublishForm(id: number) {
  const user = await currentUser()

  if (!user) {
    throw new UserNotFoundError()
  }

  return await prisma.form.update({
    data: {
      published: true
    },
    where: {
      id,
      userId: user.id
    }
  })
}

export async function GetFormContentByUrl(formUrl: string) {
  return await prisma.form.update({
    select: {
      content: true
    },
    data: {
      visits: {
        increment: 1
      }
    },
    where: {
      shareURL: formUrl
    }
  })
}

export async function SubmitForm(formUrl: string, content: string) {
  return await prisma.form.update({
    data: {
      submissions: {
        increment: 1
      },
      FormSubmissions: {
        create: {
          content
        }
      }
    },
    where: {
      shareURL: formUrl,
      published: true
    }
  })
}

export async function getFormWithSubmissions(id: number) {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }
  return await prisma.form.findUnique({
    where: {
      id,
      userId: user.id
    },
    include: {
      FormSubmissions: true
    }
  })
}

export async function deleteForm(id: number) {
  const user = await currentUser()
  if (!user) {
    throw new UserNotFoundError()
  }

  const form = await prisma.form.findUnique({
    where: {
      id,
      userId: user.id
    }
  })

  if (!form) {
    throw new Error('Form not found')
  }

  if (form.published) {
    throw new Error('Cannot delete published forms')
  }

  await prisma.form.delete({
    where: {
      id,
      userId: user.id
    }
  })

  revalidatePath('/forms')
  return { message: 'Form deleted successfully' }
}
