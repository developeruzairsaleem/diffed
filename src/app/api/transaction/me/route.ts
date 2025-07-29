import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    //-------------------------------------------
    // getting the user wallet
    //-------------------------------------------

    // Decrypt the session from the cookie
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Invalid session" },
        {
          status: 401,
        }
      );
    }
    const userWallet = await prisma.wallet.findFirst({
      where: { userId: session?.userId },
    });
    const userTransactions = await prisma.transaction.findMany({
      where: { walletId: userWallet?.id },
    });

    // format the data for the frontend
    console.log("user profile", userTransactions);

    return NextResponse.json(userTransactions);
  } catch (error) {
    console.log("something went wrong");
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong getting transactions" },
      {
        status: 400,
      }
    );
  }
}
