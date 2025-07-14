import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import ReviewsTable from "./ReviewsTable";

async function getReviews() {
  return await prisma.review.findMany({
    orderBy: { id: "desc" },
  });
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return <ReviewsTable reviews={reviews} />;
}
