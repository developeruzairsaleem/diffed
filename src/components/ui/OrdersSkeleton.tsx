import { Clock } from "lucide-react";

export const OrdersSkeleton = () => {
  return (
    <div className="space-y-6 mb-20 flex flex-col animate-pulse">
      <div
        className="rounded-lg flex-1 mt-auto"
        style={{
          padding: "1px",
          background:
            "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
        }}
      >
        <div
          style={{
            padding: "1px",
            background:
              "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
          }}
          className="h-full rounded-lg"
        >
          <div className="rounded-lg h-full bg-[#52103A]">
            <div
              style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              className="rounded-lg h-full shadow-sm w-full"
            >
              {/* Header */}
              <div className="p-6 border-gray-200">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-white/50" />
                  <div className="h-6 bg-[#3A0F2A] rounded w-20"></div>
                </div>
              </div>

              {/* Table Content */}
              <div className="p-6">
                <div className="overflow-x-auto w-full">
                  <table
                    className="w-full min-w-[600px] text-left"
                    style={{ borderCollapse: "separate", borderSpacing: 0 }}
                  >
                    {/* Table Header */}
                    <thead>
                      <tr
                        style={{
                          borderBottom: "3px solid",
                          borderImage:
                            "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%) 1",
                        }}
                      >
                        <th className="py-3 px-4">
                          <div className="h-5 bg-[#3A0F2A] rounded w-16"></div>
                        </th>
                        <th className="py-3 px-4">
                          <div className="h-5 bg-[#3A0F2A] rounded w-20"></div>
                        </th>
                        <th className="py-3 px-4">
                          <div className="h-5 bg-[#3A0F2A] rounded w-20"></div>
                        </th>
                        <th className="py-3 px-4">
                          <div className="h-5 bg-[#3A0F2A] rounded w-32"></div>
                        </th>
                        <th className="py-3 px-4">
                          <div className="h-5 bg-[#3A0F2A] rounded w-16"></div>
                        </th>
                        <th className="py-3 px-4">
                          <div className="h-5 bg-[#3A0F2A] rounded w-16"></div>
                        </th>
                        <th className="py-3 px-4">
                          <div className="h-5 bg-[#3A0F2A] rounded w-12"></div>
                        </th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i} className="">
                          {/* Game Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-[#3A0F2A] rounded"></div>
                              <div className="h-4 bg-[#3A0F2A] rounded w-24"></div>
                            </div>
                          </td>
                          {/* Service Column */}
                          <td className="py-3 px-4">
                            <div className="h-4 bg-[#3A0F2A] rounded w-28"></div>
                          </td>
                          {/* Package Column */}
                          <td className="py-3 px-4">
                            <div className="h-4 bg-[#3A0F2A] rounded w-32"></div>
                          </td>
                          {/* Providers Column */}
                          <td className="py-3 px-4">
                            <div className="h-4 bg-[#3A0F2A] rounded w-24"></div>
                          </td>
                          {/* Price Column */}
                          <td className="py-3 px-4">
                            <div className="h-4 bg-[#3A0F2A] rounded w-16"></div>
                          </td>
                          {/* Status Column */}
                          <td className="py-3 px-4">
                            <div className="h-6 bg-[#3A0F2A] rounded-xl w-24"></div>
                          </td>
                          {/* View Column */}
                          <td className="py-3 px-4">
                            <div className="h-8 bg-[#3A0F2A] rounded w-24"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Skeleton */}
                  <div className="flex justify-center items-center gap-4 mt-6">
                    <div className="h-10 bg-[#3A0F2A] rounded w-20"></div>
                    <div className="h-6 bg-[#3A0F2A] rounded w-16"></div>
                    <div className="h-10 bg-[#3A0F2A] rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
