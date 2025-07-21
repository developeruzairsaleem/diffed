import { NextRequest, NextResponse } from "next/server";
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

    const existing = await prisma.subpackage.findUnique({
      where: { id: params.id },
      include: {
        service: {
          include: { game: true },
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Subpackage not found" },
        { status: 404 }
      );
    }

    // Update Stripe product name/description
    if (existing.stripeProductId) {
      await stripe.products.update(existing.stripeProductId, {
        name: `${existing.service.game.name} - ${existing.service.name} - ${name}`,
        description,
      });

      // Update Stripe price if not dynamic pricing
      if (!dynamicPricing && price !== existing.price) {
        if (existing.stripePriceId) {
          await stripe.prices.update(existing.stripePriceId, { active: false });
        }

        const newPrice = await stripe.prices.create({
          product: existing.stripeProductId,
          unit_amount: Math.round(price * 100),
          currency: "usd",
        });

        const updated = await prisma.subpackage.update({
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
            stripePriceId: newPrice.id,
          },
          include: {
            service: {
              include: { game: true },
            },
          },
        });

        return NextResponse.json(updated);
      }
    }

    // If price unchanged or dynamicPricing true
    const updated = await prisma.subpackage.update({
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /subpackages error:", error);
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

    if (!subpackage) {
      return NextResponse.json(
        { error: "Subpackage not found" },
        { status: 404 }
      );
    }

    if (subpackage.stripeProductId) {
      await stripe.products.update(subpackage.stripeProductId, {
        active: false,
      });
    }

    await prisma.subpackage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /subpackages error:", error);
    return NextResponse.json(
      { error: "Failed to delete subpackage" },
      { status: 500 }
    );
  }
}
