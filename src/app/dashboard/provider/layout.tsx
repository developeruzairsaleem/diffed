"use client";

import { useStore } from "@/store/useStore";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, setUser, setWallet, setTransactions } = useStore();

  // Effect for getting the provider dashboard info
  useEffect(() => {
    const getProviderDashboard = async () => {
      try {
        const userRes = await fetch("/api/user/me");
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          isLoggedIn: true,
          role: userData.role,
          avatar: userData.profileImage,
        });

        const walletRes = await fetch("/api/wallet");
        if (!walletRes.ok) throw new Error("Failed to fetch wallet");
        const walletData = await walletRes.json();
        setWallet({
          id: walletData.id,
          balance: walletData.balance,
          currency: walletData.currency,
        });

        const txRes = await fetch("/api/transaction/me");
        if (!txRes.ok) throw new Error("Failed to fetch transactions");
        const txData = await txRes.json();
        setTransactions(
          txData.map((idTx: any) => ({
            id: idTx.id,
            type: idTx.type,
            amount: idTx.amount,
            walletId: idTx.walletId,
            createdAt: idTx.createdAt,
            description: idTx.description,
            status: idTx.status,
          }))
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    getProviderDashboard();
  }, [setUser, setWallet, setTransactions]);
  return <div>{children}</div>;
}
