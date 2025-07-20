import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const subpackages = await prisma.subpackage.findMany({
      include: {
        service: {
          include: {
            game: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(subpackages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subpackages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      duration,
      dynamicPricing,
      basePricePerELO,
      minELO,
      maxELO,
      serviceId,
    } = body;

    // Get service and game info for Stripe product
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { game: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name: `${service.game.name} - ${service.name} - ${name}`,
      description: description,
      metadata: {
        gameId: service.game.id,
        serviceName: service.name,
        subpackageName: name,
      },
    });

    // Create Stripe price (only if not dynamic pricing)
    let stripePriceId = null;
    if (!dynamicPricing) {
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(price * 100), // Convert to cents
        currency: "usd",
      });
      stripePriceId = stripePrice.id;
    }

    const subpackage = await prisma.subpackage.create({
      data: {
        name,
        description,
        price,
        duration,
        dynamicPricing,
        basePricePerELO,
        minELO,
        maxELO,
        serviceId,
        stripeProductId: stripeProduct.id,
        stripePriceId,
      },
      include: {
        service: {
          include: {
            game: true,
          },
        },
      },
    });

    return NextResponse.json(subpackage);
  } catch (error) {
    console.error("Error creating subpackage:", error);
    return NextResponse.json(
      { error: "Failed to create subpackage" },
      { status: 500 }
    );
  }
}
