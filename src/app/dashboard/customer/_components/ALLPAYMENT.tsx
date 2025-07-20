"use client";

import { useState } from "react";
// import { WalletDashboard } from "@/components/wallet-dashboard";
import { AddFunds } from "@/components/add-funds";
// import { WithdrawFunds } from "@/components/withdraw-funds";
// import { Checkout } from "@/components/checkout"
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

type View = "dashboard" | "add-funds" | "withdraw" | "checkout";

export default function AddFundss() {
  const [currentView, setCurrentView] = useState<View>("add-funds");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setCurrentView("dashboard");
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "add-funds":
        return (
          <AddFunds
            onSuccess={() => handleSuccess("Funds added successfully!")}
            onCancel={() => setCurrentView("dashboard")}
          />
        );
      case "withdraw":
        return (
          // <WithdrawFunds
          //   onSuccess={() =>
          //     handleSuccess("Withdrawal processed successfully!")
          //   }
          //   onCancel={() => setCurrentView("dashboard")}
          // />
          <div>Withdraw</div>
        );
      case "checkout":
        return (
          // <Checkout
          //   onSuccess={() => handleSuccess("Purchase completed successfully!")}
          //   onCancel={() => setCurrentView("dashboard")}
          // />
          <div>hello checkout</div>
        );
      default:
        return (
          // <WalletDashboard
          //   onAddFunds={() => setCurrentView("add-funds")}
          //   onWithdraw={() => setCurrentView("withdraw")}
          //   onCheckout={() => setCurrentView("checkout")}
          // />
          <div>dashboard</div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet System</h1>
          <p className="text-gray-600 mt-2">
            Manage your funds, add money, withdraw, and make purchases
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {renderCurrentView()}
      </div>
    </div>
  );
}
