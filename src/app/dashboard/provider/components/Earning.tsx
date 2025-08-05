"use client";

import { useState, useEffect, useCallback } from "react";
import { orbitron, poppins } from "@/fonts/fonts";
import { EarningsSkeleton } from "@/components/ui/EarningsSkeleton"; // Adjust path
import { message, Modal, InputNumber, Spin } from "antd";
import { format } from "date-fns";

// Helper function to get status colors for the table
const getStatusClass = (status: any) => {
  switch (status) {
    case "completed":
      return "text-green-400";
    case "pending":
      return "text-yellow-400";
    case "failed":
      return "text-red-400";
    case "cancelled":
      return "text-gray-400";
    default:
      return "text-white";
  }
};

export default function EarningPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEarningsData = useCallback(async () => {
    try {
      const response = await fetch("/api/provider-earnings");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to fetch data");
      setData(result);
    } catch (error) {
      console.error(error);
      message.error(error?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  const showPayoutModal = () => {
    setPayoutAmount(null); // Reset amount on modal open
    setIsModalVisible(true);
  };

  const handlePayoutRequest = async () => {
    if (!payoutAmount || payoutAmount <= 0) {
      return message.error("Please enter a valid amount to withdraw.");
    }
    if (payoutAmount > parseFloat(data?.availableBalance)) {
      return message.error(
        "Withdrawal amount cannot exceed available balance."
      );
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/payout-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: payoutAmount }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Payout request failed.");

      message.success("Payout request submitted successfully!");
      setIsModalVisible(false);
      setLoading(true); // Show loader while we refresh data
      await fetchEarningsData(); // Refresh data to show the new pending transaction
    } catch (error) {
      console.error(error);
      message.error(error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <EarningsSkeleton />;
  }
  if (!data) {
    return (
      <div className="text-center text-white/70">
        Could not load earnings data.
      </div>
    );
  }

  const { totalEarnings, availableBalance, transactionHistory } = data;

  return (
    <div className="main mx-auto pb-60">
      <div className="flex md:flex-row flex-col gap-10">
        {/* Total Earnings Card */}
        <div
          className={`bg-[linear-gradient(90deg,_#EE2C81_0%,_#FE0FD0_60%,_#58B9E3_100%)] h-fit rounded-lg p-8 w-full md:w-1/2 shadow-2xl flex flex-col justify-center`}
        >
          <h3 className={`${orbitron.className} font-bold text-2xl`}>
            TOTAL EARNING
          </h3>
          <h3 className={`${orbitron.className} font-bold text-5xl mt-2`}>
            ${parseFloat(totalEarnings).toFixed(2)}
          </h3>
        </div>

        {/* Available Balance & Payout Card */}
        <div
          className={`bg-black/20 h-fit rounded-lg p-8 font-bold w-full md:w-1/2 shadow-2xl flex flex-col justify-center`}
        >
          <h3 className={`${orbitron.className} text-2xl`}>
            AVAILABLE BALANCE
          </h3>
          <div className="flex items-end justify-between mt-2">
            <h3 className={`${orbitron.className} text-5xl`}>
              ${parseFloat(availableBalance).toFixed(2)}
            </h3>
            <button
              onClick={showPayoutModal}
              className={`bg-[linear-gradient(90deg,_#EE2C81_0%,_#FE0FD0_60%,_#58B9E3_100%)] py-3 px-6 text-lg font-semibold rounded-lg ${poppins.className} transition-transform hover:scale-105`}
            >
              Request Payout
            </button>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-8 mt-12">
        {/* Earning History Table */}
        <div className="col-span-2 mb-14 lg:mb-0 shadow-2xl bg-black/20 rounded-[14px] p-8">
          <h2
            className={`text-white text-2xl font-bold mb-6 ${orbitron.className}`}
          >
            EARNING HISTORY
          </h2>
          <div className="overflow-x-auto w-full">
            <table
              className="w-full min-w-[600px] text-left"
              style={{ borderCollapse: "separate", borderSpacing: 0 }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "3px solid",
                    borderImage:
                      "linear-gradient(90deg, #00C3FF 0%, #FFFF1C 100%) 1",
                  }}
                >
                  <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                    Date
                  </th>
                  <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg">
                    Description
                  </th>
                  <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg text-right">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-[#E1E1E1] font-semibold text-lg text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionHistory.length > 0 ? (
                  transactionHistory.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-white/10 last:border-b-0"
                    >
                      <td className="py-4 px-4 text-[#E1E1E1]">
                        {format(new Date(tx.createdAt), "PP")}
                      </td>
                      <td className="py-4 px-4 text-[#E1E1E1]">
                        {tx.description}
                      </td>
                      <td
                        className={`py-4 px-4 text-right font-semibold ${
                          tx.type === "withdrawal"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}$
                        {parseFloat(tx.amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`capitalize font-bold ${getStatusClass(
                            tx.status
                          )}`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-white/70">
                      No transaction history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placeholder for future Payout Method integrations */}
        <div className="col-span-1 h-full shadow-2xl bg-black/20 rounded-[14px] p-8 flex flex-col items-center">
          <h2
            className={`text-white text-2xl font-bold mb-8 ${orbitron.className}`}
          >
            PAYOUT METHOD
          </h2>
          <p className="text-center text-white/60">
            Payouts are currently processed by an admin. More automated methods
            coming soon!
          </p>
        </div>
      </div>

      <Modal
        className={"payout-modal"}
        title={
          <span className={` ${orbitron.className} block pb-2 text-white`}>
            Request Payout
          </span>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={!isSubmitting}
        maskClosable={!isSubmitting}
      >
        <Spin spinning={isSubmitting} tip="Submitting...">
          <div className="space-y-4 p-4">
            <p className="text-white/80">
              Enter the amount you wish to withdraw from your available balance
              of{" "}
              <strong className="text-green-400">
                ${parseFloat(availableBalance).toFixed(2)}
              </strong>
              .
            </p>
            <InputNumber
              value={payoutAmount}
              onChange={setPayoutAmount}
              placeholder="e.g., 150.00"
              min={0.01}
              max={parseFloat(availableBalance)}
              precision={2}
              className="w-full !bg-gray-800 !text-white !border-gray-600 !h-12 !text-lg"
            />
            <button
              onClick={handlePayoutRequest}
              disabled={isSubmitting}
              className="w-full mt-4 py-3 rounded-lg text-white text-xl font-semibold transition-all"
              style={{
                background:
                  "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 50%, #58B9E3 100%)",
              }}
            >
              Confirm & Request Payout
            </button>
          </div>
        </Spin>
      </Modal>
    </div>
  );
}
