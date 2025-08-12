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
  type Transaction = {
    id: string;
    createdAt: string | Date;
    description?: string | null;
    type: "withdrawal" | "payment" | "deposit" | "refund";
    amount: string | number;
    status: "pending" | "completed" | "failed" | "cancelled";
  };
  type EarningsResponse = {
    totalEarnings: string | number;
    availableBalance: string | number;
    transactionHistory: Transaction[];
  };

  const [data, setData] = useState<EarningsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [connectStatus, setConnectStatus] = useState<
    | { connected: false }
    | {
        connected: true;
        accountId: string;
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
        detailsSubmitted: boolean;
      }
    | null
  >(null);
  type PayoutMethodDetails = {
    connected: boolean;
    payoutsEnabled?: boolean;
    detailsSubmitted?: boolean;
    bankAccounts?: Array<{
      id: string;
      bankName: string | null;
      last4: string | null;
      currency: string | null;
      country: string | null;
      accountHolderName: string | null;
      defaultForCurrency: boolean;
    }>;
  };
  const [isPayoutDetailsOpen, setIsPayoutDetailsOpen] = useState(false);
  const [payoutDetails, setPayoutDetails] = useState<PayoutMethodDetails | null>(null);

  const toNum = (value: string | number): number =>
    typeof value === "string" ? parseFloat(value) : value;

  const fetchEarningsData = useCallback(async () => {
    try {
      const response = await fetch("/api/provider-earnings");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to fetch data");
      setData(result);
    } catch (error) {
      console.error(error);
      message.error((error as any)?.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarningsData();
  }, [fetchEarningsData]);

  const showPayoutModal = async () => {
    // Block if there is a pending withdrawal transaction
    const hasPendingWithdrawal = (data?.transactionHistory || []).some(
      (t) => t.type === "withdrawal" && t.status === "pending"
    );
    if (hasPendingWithdrawal) {
      message.warning(
        "You already have a payout request pending. Please wait until it is processed."
      );
      return;
    }
    setPayoutAmount(null); // Reset amount on modal open
    setIsModalVisible(true);
    try {
      const res = await fetch("/api/stripe/connect", { method: "GET" });
      const status = await res.json();
      setConnectStatus(status);
    } catch (e) {
      setConnectStatus({ connected: false });
    }
  };

  const handlePayoutRequest = async () => {
    if (!payoutAmount || payoutAmount <= 0) {
      return message.error("Please enter a valid amount to withdraw.");
    }
    if (payoutAmount > parseFloat(String(data?.availableBalance ?? 0))) {
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
      message.error((error as any)?.message);
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
  const exceedsBalance = (payoutAmount ?? 0) > parseFloat(String(availableBalance));
  const invalidAmount = !payoutAmount || payoutAmount <= 0 || exceedsBalance;

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
            ${toNum(totalEarnings).toFixed(2)}
          </h3>
        </div>

        {/* Available Balance & Payout Card */}
        <div
          className={`bg-black/20 h-fit rounded-lg p-8 font-bold w-full md:w-1/2 shadow-2xl flex flex-col justify-center`}
        >
          <h3 className={`${orbitron.className} text-2xl`}>
            AVAILABLE BALANCE
          </h3>
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-end justify-between mt-2">
            <h3 className={`${orbitron.className} text-5xl`}>
              ${toNum(availableBalance).toFixed(2)}
            </h3>
            <button
              onClick={showPayoutModal}
              className={`bg-[linear-gradient(90deg,_#EE2C81_0%,_#FE0FD0_60%,_#58B9E3_100%)] py-3 px-6 text-lg font-semibold rounded-lg ${poppins.className} transition-transform hover:scale-105`}
            >
              Request Payout
            </button>
          </div>
          {(data?.transactionHistory || []).some(
            (t) => t.type === "withdrawal" && t.status === "pending"
          ) && (
            <p className="mt-2 text-yellow-300/90 text-sm">
              A payout request is currently pending. You can request a new payout once it is processed.
            </p>
          )}
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
                        {toNum(tx.amount).toFixed(2)}
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
                    <td colSpan={4} className="text-center py-10 text-white/70">
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
          <div className="w-full space-y-4">
            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/stripe/connect/payout-method");
                  const js = (await res.json()) as PayoutMethodDetails & { error?: string };
                  if (!res.ok) throw new Error(js?.error || "Failed to fetch payout method");
                  setPayoutDetails(js);
                  setIsPayoutDetailsOpen(true);
                } catch (e: any) {
                  message.error(e?.message || "Failed to load payout method");
                }
              }}
              className="w-full py-2 rounded-md bg-slate-800 text-white hover:bg-slate-700"
            >
              View Payout Method
            </button>

            <button
              onClick={async () => {
                try {
                  const res = await fetch("/api/stripe/connect", { method: "PUT" });
                  const js = await res.json();
                  if (js?.url) {
                    window.location.href = js.url as string;
                  } else {
                    message.error(js?.error || "Failed to open update link");
                  }
                } catch (e) {
                  message.error("Failed to open update link");
                }
              }}
              className="w-full py-2 rounded-md bg-pink-600 text-white hover:bg-pink-500"
            >
              Update Payout Details
            </button>
          </div>
        </div>
        {/* Payout Method Details Modal */}
        <Modal
          className={"payout-modal"}
          title={<span className={`${orbitron.className} text-white`}>Payout Method Details</span>}
          open={isPayoutDetailsOpen}
          onCancel={() => setIsPayoutDetailsOpen(false)}
          footer={null}
        >
          <div className="space-y-3 text-white">
            {!payoutDetails?.connected && (
              <p className="text-white/80">Stripe account not connected.</p>
            )}
            {payoutDetails?.connected && (
              <div>
                <p className="text-white/80">
                  Payouts Enabled: {payoutDetails.payoutsEnabled ? "Yes" : "No"}
                </p>
                {Array.isArray(payoutDetails.bankAccounts) && payoutDetails.bankAccounts.length > 0 ? (
                  <div className="mt-2 space-y-2">
                    {payoutDetails.bankAccounts.map((ba) => (
                      <div key={ba.id} className="rounded-md bg-white/5 p-2">
                        <p className="text-white">
                          {ba.bankName || "Bank"} •••• {ba.last4}
                        </p>
                        <p className="text-white/70 text-sm">
                          {ba.country?.toUpperCase()} • {ba.currency?.toUpperCase()} {ba.defaultForCurrency ? "(default)" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/70">No bank account found.</p>
                )}
              </div>
            )}
          </div>
        </Modal>
      </div>

      <Modal
        className={"payout-modal"}
        title={
          <span className={` ${orbitron.className} block pb-2 text-white`}>
            Request Payout
          </span>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={!isSubmitting}
        maskClosable={!isSubmitting}
      >
        <Spin spinning={isSubmitting} tip="Submitting...">
          <div className="space-y-4 p-4">
            {connectStatus && !connectStatus.connected && (
              <div className="rounded-md bg-yellow-500/10 border border-yellow-500/30 p-3 text-yellow-200">
                <p className="mb-2">You need to complete Stripe onboarding to receive payouts.</p>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/stripe/connect", { method: "POST" });
                      const js = await res.json();
                      if (js?.url) {
                        window.location.href = js.url as string;
                      } else {
                        message.error(js?.error || "Failed to start onboarding");
                      }
                    } catch (e) {
                      message.error("Failed to start onboarding");
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-500 text-white"
                >
                  Start Stripe Onboarding
                </button>
              </div>
            )}
            <p className="text-white/80">
              Enter the amount you wish to withdraw from your available balance
              of{" "}
              <strong className="text-green-400">
                ${parseFloat(String(availableBalance)).toFixed(2)}
              </strong>
              .
            </p>
            <InputNumber
              value={payoutAmount}
              onChange={(v) => setPayoutAmount(v)}
              placeholder="Enter your payout amount"
              min={0.01}
              precision={2}
              className="payout-input w-full !h-12 !text-lg"
              style={{ backgroundColor: 'transparent', width: '100%' }}
            />
            {exceedsBalance && (
              <p className="text-red-400 text-sm mt-1">Amount exceeds available balance.</p>
            )}
            <button
              onClick={handlePayoutRequest}
              disabled={isSubmitting || invalidAmount}
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
