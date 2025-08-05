"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { message } from "antd";
import { ReviewsSkeleton } from "@/components/ui/ReviewsSkeleton"; // Adjust path if needed
import { formatDistanceToNow } from "date-fns";
import SafeImage from "@/components/ui/SafeImage"; // Assuming you have a safe image component

// It's good practice to define the type for your review data
type ProviderReview = {
  id: string;
  reviewRating: number;
  reviewText: string;
  claimedAt: string;
  order: {
    customer: {
      username: string;
      profileImage: string | null;
    };
    subpackage: {
      name: string;
    };
  };
};

export function ProviderReviews() {
  const [reviews, setReviews] = useState<ProviderReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // This endpoint is now secure and context-aware
        const response = await fetch("/api/provider-reviews");
        const data = await response.json();

        if (!response.ok) {
          message.error(data.error || "Failed to fetch your reviews.");
        } else {
          setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        message.error(
          "An unexpected error occurred while fetching your reviews."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <ReviewsSkeleton />;
  }

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white">My Client Reviews</CardTitle>
        <CardDescription className="text-white/70">
          Recent feedback from players I've coached
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-white/10 pb-4 last:border-b-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                      <SafeImage
                        src={
                          review.order.customer.profileImage ||
                          "/images/default-avatar.png"
                        }
                        alt={review.order.customer.username}
                        className="w-full h-full object-cover"
                        placeholder="/images/placeholder.png"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-white">
                        {review.order.customer.username}
                      </span>
                      <div className="flex mt-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 transition-colors ${
                              index < review.reviewRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-white/60 flex-shrink-0 ml-4">
                    {formatDistanceToNow(new Date(review.claimedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-white/80 mt-2 pl-13">
                  "{review.reviewText}"
                </p>
                <p className="text-xs text-white/50 mt-2 pl-13">
                  Service: {review.order.subpackage.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-white/70">
              You haven't received any reviews yet.
            </p>
            <p className="text-sm text-white/50 mt-1">
              Complete more orders to get feedback from clients.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
