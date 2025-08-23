import { NextRequest, NextResponse } from "next/server";
import { paypalClient } from "../../../lib/paypal";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { prisma } from "@/lib/prisma";
import paypal from "@paypal/paypal-server-sdk";

export async function POST(req: NextRequest) {
  try {
    const { subpackageId, customerEmail, currentELO, targetELO } =
      await req.json();

    if (!subpackageId || !customerEmail) {
      return NextResponse.json(
        { error: "Missing required data", success: false },
        { status: 400 }
      );
    }

    // Verify the customer current session
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      );
    }

    // Get the package item from DB
    const subpackage = await prisma.subpackage.findFirst({
      where: { id: subpackageId },
      include: {
        service: {
          include: { game: true },
        },
      },
    });

    if (!subpackage) {
      return NextResponse.json(
        { error: "Package not found", success: false },
        { status: 400 }
      );
    }

    // Calculate total price
    let totalPrice;
    if (!currentELO && !targetELO) {
      totalPrice = subpackage.price;
    } else {
      totalPrice =
        subpackage.price +
        subpackage.basePricePerELO! * (targetELO - currentELO);
    }

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalPrice.toFixed(2),
          },
          description: `Order for ${subpackage.name} - ${subpackage.service.game.name}`,
          custom_id: subpackageId,
          invoice_id: `INV-${Date.now()}`,
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer/checkout/${subpackageId}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/customer/checkout/${subpackageId}?canceled=true`,
        brand_name: "Diffed.gg",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
      },
    });

    const order = await paypalClient.execute(request);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.result.id,
        approvalUrl: order.result.links.find(
          (link: any) => link.rel === "approve"
        )?.href,
        subpackage,
        currentELO,
        targetELO,
        finalPrice: totalPrice,
      },
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return NextResponse.json(
      {
        error: "Failed to create PayPal order",
        success: false,
      },
      { status: 500 }
    );
  }
}

