"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGame(formData: FormData) {
  const image = formData.get("image") as string;
  const teammates = parseInt(formData.get("teammates") as string);
  const sessions = parseInt(formData.get("sessions") as string);
  const name = formData.get("name") as string;

  if (!image || !name || isNaN(teammates) || isNaN(sessions)) {
    throw new Error(
      "All fields are required and teammates/sessions must be numbers"
    );
  }

  await prisma.game.create({
    data: {
      image,
      teammates,
      sessions,
      name,
    },
  });

  revalidatePath("/admin/games");
  redirect("/admin/games");
}

export async function updateGame(id: string, formData: FormData) {
  const image = formData.get("image") as string;
  const teammates = parseInt(formData.get("teammates") as string);
  const sessions = parseInt(formData.get("sessions") as string);
  const name = formData.get("name") as string;

  if (!image || !name || isNaN(teammates) || isNaN(sessions)) {
    throw new Error(
      "All fields are required and teammates/sessions must be numbers"
    );
  }

  await prisma.game.update({
    where: { id },
    data: {
      image,
      teammates,
      sessions,
      name,
    },
  });

  revalidatePath("/admin/games");
  redirect("/admin/games");
}

export async function deleteGame(id: string) {
  await prisma.game.delete({
    where: { id },
  });

  revalidatePath("/admin/games");
}
