// src/components/ui/SkeletonLoader.tsx
import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen p-6 pt-0 animate-pulse">
      <div className="max-w-7xl h-full mx-auto">
        {/* Games Grid Skeleton */}
        <div className="mb-2">
          <div className="h-8 bg-gray-700 rounded-md w-1/3 mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-800 aspect-[5/4]"
              ></div>
            ))}
          </div>
        </div>

        {/* Selected Game Packages Skeleton */}
        <div className="my-16">
          <div className="flex items-center mb-8">
            <div className="relative w-20 h-20 mr-6 rounded-lg bg-gray-800"></div>
            <div>
              <div className="h-10 bg-gray-700 rounded-md w-72 mb-3"></div>
              <div className="h-6 bg-gray-700 rounded-md w-96"></div>
            </div>
          </div>

          <div>
            {/* Package Category Navigation Skeleton */}
            <div className="h-16 bg-gray-800 rounded-lg my-6 p-2">
              <div className="flex flex-wrap gap-4">
                <div className="h-10 bg-gray-700 rounded-md w-32"></div>
                <div className="h-10 bg-gray-700 rounded-md w-28"></div>
                <div className="h-10 bg-gray-700 rounded-md w-40"></div>
              </div>
            </div>

            {/* Active Package Category Skeleton */}
            <div className="bg-gray-800 rounded-[14px] p-8">
              <div className="h-8 bg-gray-700 rounded-md w-1/4 mb-6"></div>
              <div className="h-5 bg-gray-700 rounded-md w-full mb-2"></div>
              <div className="h-5 bg-gray-700 rounded-md w-2/3 mb-8"></div>

              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <th key={i} className="py-3 px-4">
                          <div className="h-6 bg-gray-700 rounded-md"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 4 }).map((_, itemIndex) => (
                      <tr key={itemIndex}>
                        <td className="py-5 px-4">
                          <div className="h-6 bg-gray-700 rounded-md"></div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="h-8 w-24 bg-gray-700 rounded-full"></div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="h-8 w-24 bg-gray-700 rounded-full"></div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="h-5 bg-gray-700 rounded-md"></div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="h-10 w-28 bg-gray-700 rounded-lg mx-auto"></div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="h-10 w-28 bg-gray-700 rounded-lg mx-auto"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
