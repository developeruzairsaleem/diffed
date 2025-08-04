import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    //-------------------------------------------
    // getting the user wallet
    //-------------------------------------------

    // Decrypt the session from the cookie
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { error: "Invalid session", success: false },
        {
          status: 401,
        }
      );
    }

    // the body which contains the packageId which user wants to buy
    const { subpackageId } = await request.json();

    if (!subpackageId) {
      return NextResponse.json(
        { error: "Subpackage ID is required", success: false },
        {
          status: 400,
        }
      );
    }

    const userWallet = await prisma.wallet.findFirst({
      where: { userId: session?.userId },
    });

    if (!userWallet) {
      return NextResponse.json(
        { error: "User wallet not found", success: false },
        {
          status: 404,
        }
      );
    }

    const subpackage = await prisma.subpackage.findUnique({
      where: { id: subpackageId },
    });

    if (!subpackage) {
      return NextResponse.json(
        { error: "Subpackage not found", success: false },
        {
          status: 404,
        }
      );
    }

    if (userWallet.balance.toNumber() < subpackage.price) {
      return NextResponse.json(
        { error: "Insufficient funds", success: false },
        {
          status: 400,
        }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        customerId: session.userId as string,
        subpackageId: subpackageId,
        price: subpackage.price,
        discordTag: "#1234",
        discordUsername: "ase_1234",
        isInQueue: true,
        requiredCount: subpackage.requiredProviders,
      },
    });

    const updatedWallet = await prisma.wallet.update({
      where: { id: userWallet.id },
      data: {
        balance: {
          decrement: subpackage.price,
        },
      },
    });

    const newTransaction = await prisma.transaction.create({
      data: {
        walletId: userWallet.id,
        type: "payment",
        amount: subpackage.price,
        description: `Payment for subpackage: ${subpackage.name}`,
        status: "completed",
      },
    });

    return NextResponse.json(
      { data: newOrder, success: true },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("error occured while paying through wallet", err);
    return NextResponse.json(
      { error: "Can't pay from wallet", success: false },
      {
        status: 500,
      }
    );
  }
};
