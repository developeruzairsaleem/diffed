"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createReview(formData: FormData) {
  const starRating = parseInt(formData.get("starRating") as string);
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const name = formData.get("name") as string;

  if (isNaN(starRating) || !description || !image || !name) {
    throw new Error("All fields are required and star rating must be a number");
  }

  if (starRating < 1 || starRating > 5) {
    throw new Error("Star rating must be between 1 and 5");
  }

  await prisma.review.create({
    data: {
      starRating,
      description,
      image,
      name,
    },
  });

  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, formData: FormData) {
  const starRating = parseInt(formData.get("starRating") as string);
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const name = formData.get("name") as string;

  if (isNaN(starRating) || !description || !image || !name) {
    throw new Error("All fields are required and star rating must be a number");
  }

  if (starRating < 1 || starRating > 5) {
    throw new Error("Star rating must be between 1 and 5");
  }

  await prisma.review.update({
    where: { id },
    data: {
      starRating,
      description,
      image,
      name,
    },
  });

  revalidatePath("/admin/reviews");
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  await prisma.review.delete({
    where: { id },
  });

  revalidatePath("/admin/reviews");
}
