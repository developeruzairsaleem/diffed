import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    console.error("GET /subpackages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subpackages" },
      { status: 500 }
    );
  }
}
// ---------------------------------------
// post request for creating a new service
// ---------------------------------------
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

    if (!name || !description || !serviceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { game: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const stripeProduct = await stripe.products.create({
      name: `${service.game.name} - ${service.name} - ${name}`,
      description,
      metadata: {
        gameId: service.game.id,
        serviceName: service.name,
        subpackageName: name,
      },
    });

    let stripePriceId: string | null = null;
    if (!dynamicPricing) {
      const stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(price * 100),
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
          include: { game: true },
        },
      },
    });

    return NextResponse.json(subpackage);
  } catch (error) {
    console.error("POST /subpackages error:", error);
    return NextResponse.json(
      { error: "Failed to create subpackage" },
      { status: 500 }
    );
  }
}
