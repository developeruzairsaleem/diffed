import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import ReviewsTable from "./ReviewsTable";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getReviews() {
  return await prisma.platformReview.findMany({
    orderBy: { id: "desc" },
  });
}

export default async function ReviewsPage() {
  const reviews = await getReviews();
  return <ReviewsTable reviews={reviews} />;
}
