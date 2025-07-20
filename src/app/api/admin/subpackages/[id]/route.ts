import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get existing subpackage
    const existingSubpackage = await prisma.subpackage.findUnique({
      where: { id: params.id },
      include: {
        service: {
          include: { game: true },
        },
      },
    });

    if (!existingSubpackage) {
      return NextResponse.json(
        { error: "Subpackage not found" },
        { status: 404 }
      );
    }

    // Update Stripe product
    if (existingSubpackage.stripeProductId) {
      await stripe.products.update(existingSubpackage.stripeProductId, {
        name: `${existingSubpackage.service.game.name} - ${existingSubpackage.service.name} - ${name}`,
        description: description,
      });

      // Update price if not dynamic pricing and price changed
      if (!dynamicPricing && price !== existingSubpackage.price) {
        // Archive old price
        if (existingSubpackage.stripePriceId) {
          await stripe.prices.update(existingSubpackage.stripePriceId, {
            active: false,
          });
        }

        // Create new price
        const stripePrice = await stripe.prices.create({
          product: existingSubpackage.stripeProductId,
          unit_amount: Math.round(price * 100),
          currency: "usd",
        });

        // Update subpackage with new price ID
        const subpackage = await prisma.subpackage.update({
          where: { id: params.id },
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
            stripePriceId: stripePrice.id,
          },
          include: {
            service: {
              include: { game: true },
            },
          },
        });

        return NextResponse.json(subpackage);
      }
    }

    const subpackage = await prisma.subpackage.update({
      where: { id: params.id },
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
      },
      include: {
        service: {
          include: { game: true },
        },
      },
    });

    return NextResponse.json(subpackage);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update subpackage" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const subpackage = await prisma.subpackage.findUnique({
      where: { id: params.id },
    });

    if (subpackage?.stripeProductId) {
      // Archive Stripe product
      await stripe.products.update(subpackage.stripeProductId, {
        active: false,
      });
    }

    await prisma.subpackage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete subpackage" },
      { status: 500 }
    );
  }
}
