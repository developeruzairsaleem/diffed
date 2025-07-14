'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createService(formData: FormData) {
  console.log('formData',formData)
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const image = formData.get('image') as string

  if (!title || !description) {
    throw new Error('Title and description are required')
  }

  await prisma.service.create({
    data: {
      title,
      description,
      image,
    },
  })

  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function updateService(id: string, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const image = formData.get('image') as string

  if (!title || !description) {
    throw new Error('Title and description are required')
  }

  await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      image,
    },
  })

  revalidatePath('/admin/services')
  redirect('/admin/services')
}

export async function deleteService(id: string) {
  await prisma.service.delete({
    where: { id },
  })

  revalidatePath('/admin/services')
}