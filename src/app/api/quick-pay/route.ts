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
    const body = await request.json();
  const { subpackageId, selectedRank, numberOfGames, numberOfTeammates } = body || {};

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
      select: {
        id: true,
        name: true,
        price: true,
        dynamicPricing: true,
        basePricePerELO: true,

        minELO: true,
        maxELO: true,
        requiredProviders: true,
        ranks: true,
        type: true,
      },
    });

    if (!subpackage) {
      return NextResponse.json(
        { error: "Subpackage not found", success: false },
        {
          status: 404,
        }
      );
    }

    // New price calculation logic
    let basePrice = Number(subpackage.price);
    let additionalCost = 0;
    if (selectedRank && typeof selectedRank.additionalCost === "number") {
      additionalCost = Number(selectedRank.additionalCost);
    }
    let priceWithRank = basePrice + additionalCost;
    let games = typeof numberOfGames === "number" ? numberOfGames : 1;
    let teammates = subpackage.type==="perteammate"? numberOfTeammates : subpackage.requiredProviders;
    let finalPriceNumber = priceWithRank * games * teammates;

    // Ensure wallet has enough balance
    if (userWallet.balance.toNumber() < finalPriceNumber) {
      return NextResponse.json(
        { error: "Insufficient funds", success: false },
        {
          status: 400,
        }
      );
    }

    // Create order with final price
    const newOrder = await prisma.order.create({
      data: {
        customerId: session.userId as string,
        subpackageId: subpackageId,
        price: finalPriceNumber,
        discordTag: "#1234",
        discordUsername: "ase_1234",
        isInQueue: true,
        rank: selectedRank ? selectedRank : null,
        gamesCount: typeof numberOfGames === "number" ? numberOfGames : 1,
        requiredCount: subpackage.type==="perteammate"? Number(numberOfTeammates) : subpackage.requiredProviders,
        packageType: subpackage.type,
      },
    });

    // Deduct from wallet
    await prisma.wallet.update({
      where: { id: userWallet.id },
      data: {
        balance: {
          decrement: finalPriceNumber,
        },
      },
    });

    // Create transaction
    await prisma.transaction.create({
      data: {
        walletId: userWallet.id,
        type: "payment",
        amount: finalPriceNumber,
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
