import { Star } from "lucide-react";

const ReviewsTab = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400 fill-current" />
          <span className="text-lg font-semibold text-gray-900">4.8</span>
          <span className="text-sm text-gray-500">Average Rating</span>
        </div>
      </div>
    </div>

    {/* Rating Overview */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rating Breakdown
      </h3>
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center space-x-4">
            <div className="w-4 text-sm text-gray-600">{rating}</div>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full"
                style={{
                  width: `${
                    rating === 5
                      ? 70
                      : rating === 4
                      ? 20
                      : rating === 3
                      ? 8
                      : rating === 2
                      ? 2
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 w-8">
              {rating === 5
                ? 70
                : rating === 4
                ? 20
                : rating === 3
                ? 8
                : rating === 2
                ? 2
                : 0}
              %
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Reviews */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">👨‍💻</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="font-medium text-gray-900">ProGamer_Alex</div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    Valorant Solo Boost
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  "Amazing service! Alex helped me climb from Silver to Gold in
                  just 2 days. Very professional and kept me updated throughout
                  the process. Highly recommended!"
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>2 days ago</span>
                  <span>•</span>
                  <span>Order #ord_001</span>
                  <span>•</span>
                  <span className="text-green-600">Tip: €5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🧑‍💻</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="font-medium text-gray-900">RankUp_Mike</div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    Fortnite Duo Boost
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  "Great duo partner! Mike taught me so much during our
                  sessions. Not only did we reach Diamond, but I learned
                  strategies I still use today."
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>1 week ago</span>
                  <span>•</span>
                  <span>Order #ord_002</span>
                  <span>•</span>
                  <span className="text-green-600">Tip: €10</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ReviewsTab;
