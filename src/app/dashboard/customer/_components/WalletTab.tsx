"use client";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import {
  Plus,
  Wallet,
  ArrowUpDown,
  Download,
  Activity,
  Minus,
  Gift,
} from "lucide-react";
import formatDate from "../_lib/format-date";
import AddFundsCard from "./AddFundCard";
const WalletTab = () => {
  const store = useStore();
  const walletTransactions = store.transactions;
  console.log("transactions", walletTransactions);
  const [showAddFunds, setShowAddFunds] = useState(false);
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Wallet</h2>
        <button
          onClick={() => setShowAddFunds(true)}
          className="flex items-center space-x-2 font-semibold rounded-2xl px-4 py-2 cursor-pointer bg-gradient-to-r from-pink-500 gap-3 via-purple-500 to-cyan-400"
        >
          <Plus className="w-4 h-4" />
          <span>Add Funds</span>
        </button>
      </div>

      {showAddFunds && <AddFundsCard handleAddShow={setShowAddFunds} />}
      {/* Balance Card */}
      <div
        style={{ padding: "2px" }}
        className=" bg-gradient-to-r rounded-xl from-pink-500 gap-3 via-purple-500 to-cyan-400"
      >
        <div className="bg-[#6C3457] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 font-bold text-sm">
                Current Balance
              </p>
              <p className="text-3xl font-bold">
                ${store?.wallet?.balance || "0"}
              </p>
            </div>
            <div className="p-3 bg-gradient-to-r from-pink-500 gap-3 via-purple-500 to-cyan-400 bg-opacity-50 rounded-full">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-purple-200">Available for orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {/* Balance Card */}
      <div
        style={{ padding: "2px" }}
        className=" bg-gradient-to-r rounded-xl from-pink-500 via-purple-500 to-cyan-400"
      >
        <div className="bg-[#591742] rounded-xl">
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
            className=" rounded-xl shadow-sm "
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Transactions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {walletTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                    className="flex items-center justify-between p-4 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        style={{ backgroundColor: "rgba(255,255,255,0.40)" }}
                        className={`p-2 font-bold text-2xl rounded-full`}
                      >
                        {transaction.type === "deposit" ? (
                          <Plus
                            className={`w-5 h-5 ${
                              transaction.type === "deposit"
                                ? "text-green-300"
                                : transaction.type === "payment"
                                ? "text-red-300"
                                : "text-blue-300"
                            }`}
                          />
                        ) : transaction.type === "payment" ? (
                          <Minus className="w-4 h-4 text-red-300" />
                        ) : (
                          <Gift className="w-4 h-4 text-blue-300" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-100">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          transaction.amount > 0
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
                        {Math.abs(transaction.amount)}
                      </div>
                      <div className="text-sm text-gray-100 capitalize">
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletTab;
