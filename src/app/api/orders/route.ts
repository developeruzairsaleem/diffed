import { type NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service";
import type {
  OrdersListRequest,
  ApiResponse,
  CustomerOrderListResponse,
} from "@/types/order.dto";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: OrdersListRequest = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 10,
      status: (searchParams.get("status") as any) || undefined,
      customerId: searchParams.get("customerId") || undefined,
      gameId: searchParams.get("gameId") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
    };
    if (!params?.customerId) {
      console.error("Error fetching orders no customerId:");

      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to fetch orders without providing valid customerId",
      };

      return NextResponse.json(response, { status: 400 });
    }
    const result = await OrderService.getRecentOrdersCustomer(params);

    const response: ApiResponse<CustomerOrderListResponse> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching orders:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch orders",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// create new order
export async function POST(request: NextRequest) {
  try {
    const {
      subpackageId,
      paymentIntentId,
      discordUsername,
      discordTag,
      notes,
    } = await request.json();

    if (
      !subpackageId ||
      !paymentIntentId ||
      !discordUsername ||
      !discordTag ||
      (notes && typeof notes !== "string")
    ) {
      return NextResponse.json(
        {
          error: "Invalid request body.Cant' create the order",
          success: false,
        },
        {
          status: 400,
        }
      );
    }

    // verify the customer current session
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        {
          status: 401,
        }
      );
    }

    // get the packageItem from DB
    const subpackage = await prisma.subpackage.findFirst({
      where: {
        id: subpackageId,
      },
    });
    // if no package found return
    if (!subpackage) {
      return NextResponse.json(
        { error: "can't find the package", success: false },
        { status: 400 }
      );
    }

    // Validate payment intent with Stripe
    // const stri = stripe;
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid payment intent", success: false },
        { status: 400 }
      );
    }
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not successful", success: false },
        { status: 400 }
      );
    }

    // create order entry in the db
    const order = await prisma.order.create({
      data: {
        customerId: session?.userId as string,
        subpackageId: subpackageId,
        price: subpackage.price,
        requiredCount: subpackage.requiredProviders,
        discordTag: discordTag,
        discordUsername: discordUsername,
        notes: notes || null,
      },
    });

    // create transaction entry
    const userWallet = await prisma.wallet.findUnique({
      where: { userId: session?.userId as string },
    });
    if (userWallet) {
      await prisma.transaction.create({
        data: {
          walletId: userWallet.id,
          type: "payment",
          amount: subpackage.price,
          description: `Order payment for subpackage ${subpackage.name}`,
          stripePaymentIntentId: paymentIntentId,
          status: "completed",
          metadata: {
            orderId: order.id,
            subpackageId: subpackage.id,
          },
        },
      });
    }

    const response: ApiResponse<any> = {
      success: true,
      data: order.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching orders:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create orders",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
