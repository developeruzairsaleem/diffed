"use client";
import { Star, User, Gamepad2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ReviewSkeleton } from "@/components/ui/ReviewSkeleton";

interface Review {
  id: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  provider: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  service: {
    name: string;
    subpackageName: string;
    game: {
      name: string;
      image: string;
    };
  };
  order: {
    id: string;
    orderNumber: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

interface ReviewsData {
  reviews: Review[];
  stats: ReviewStats;
}

const ReviewsTab = () => {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/reviews/my-reviews");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch reviews");
        }

        if (result.success) {
          console.log("succeeded", result);
          setReviewsData(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch reviews");
        }
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.ceil(diffDays / 7)} week${
        Math.ceil(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    return `${Math.ceil(diffDays / 30)} month${
      Math.ceil(diffDays / 30) > 1 ? "s" : ""
    } ago`;
  };

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-lg font-semibold">
          Error loading reviews
        </div>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!reviewsData || reviewsData.reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">My Reviews</h2>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-12 text-center">
          <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-300">
            You haven't left any reviews for providers yet. Complete some orders
            and share your experience!
          </p>
        </div>
      </div>
    );
  }

  const { reviews, stats } = reviewsData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Reviews</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-lg font-semibold text-white">
              {stats.averageRating}
            </span>
            <span className="text-sm text-gray-300">Average Rating</span>
          </div>
          <div className="text-sm text-gray-300">
            {stats.totalReviews} Reviews
          </div>
        </div>
      </div>

      {/* Rating Overview */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Rating Breakdown
        </h3>
        <div className="space-y-3">
          {stats.ratingBreakdown.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center space-x-4">
              <div className="w-4 text-sm text-gray-300">{rating}</div>
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-300 w-12">{percentage}%</div>
              <div className="text-sm text-gray-400 w-8">({count})</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="p-6 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white">Your Reviews</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-white/10 pb-6 last:border-b-0"
              >
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    {review.provider.profileImage ? (
                      <img
                        src={review.provider.profileImage || "/placeholder.svg"}
                        alt={review.provider.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                      <Gamepad2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="font-medium text-white">
                        {review.provider.username}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-400">
                        {review.service.game.name} -{" "}
                        {review.service.subpackageName}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      "{review.reviewText}"
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{formatDate(review.createdAt)}</span>
                      <span>•</span>
                      <span>Order #{review.order.orderNumber}</span>
                      <span>•</span>
                      <span className="text-blue-400">
                        {review.service.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;
