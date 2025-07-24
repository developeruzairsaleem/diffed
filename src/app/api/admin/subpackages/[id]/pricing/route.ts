import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/game.dto";

interface PricingRequest {
  currentELO: number;
  targetELO: number;
}

interface PricingResponse {
  basePrice: number;
  eloDifference: number;
  additionalCost: number;
  finalPrice: number;
  breakdown: {
    basePricePerELO: number;
    eloRange: string;
    calculation: string;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: PricingRequest = await request.json();
    const { currentELO, targetELO } = body;

    const subpackage = await prisma.subpackage.findUnique({
      where: { id: params.id },
      include: {
        service: {
          include: {
            game: {
              select: {
                isEloBased: true,
                ranks: true,
              },
            },
          },
        },
      },
    });

    if (!subpackage) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Subpackage not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    if (!subpackage.dynamicPricing || !subpackage.service.game.isEloBased) {
      const response: ApiResponse<PricingResponse> = {
        success: true,
        data: {
          basePrice: subpackage.price,
          eloDifference: 0,
          additionalCost: 0,
          finalPrice: subpackage.price,
          breakdown: {
            basePricePerELO: 0,
            eloRange: "Fixed pricing",
            calculation: `Fixed price: $${subpackage.price}`,
          },
        },
      };
      return NextResponse.json(response);
    }

    // Validate ELO ranges
    if (subpackage.minELO && currentELO < subpackage.minELO) {
      const response: ApiResponse<never> = {
        success: false,
        error: `Current ELO (${currentELO}) is below minimum allowed (${subpackage.minELO})`,
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (subpackage.maxELO && targetELO > subpackage.maxELO) {
      const response: ApiResponse<never> = {
        success: false,
        error: `Target ELO (${targetELO}) is above maximum allowed (${subpackage.maxELO})`,
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (targetELO <= currentELO) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Target ELO must be higher than current ELO",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Calculate dynamic pricing
    const eloDifference = targetELO - currentELO;
    const basePricePerELO = subpackage.basePricePerELO || 1.0;
    const additionalCost = eloDifference * basePricePerELO;
    const finalPrice = subpackage.price + additionalCost;

    const eloRange = `${subpackage.minELO || 0} - ${subpackage.maxELO || "∞"}`;
    const calculation = `Base: $${
      subpackage.price
    } + (${eloDifference} ELO × $${basePricePerELO}) = $${finalPrice.toFixed(
      2
    )}`;

    const pricingResponse: PricingResponse = {
      basePrice: subpackage.price,
      eloDifference,
      additionalCost,
      finalPrice: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      breakdown: {
        basePricePerELO,
        eloRange,
        calculation,
      },
    };

    const response: ApiResponse<PricingResponse> = {
      success: true,
      data: pricingResponse,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error calculating pricing:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to calculate pricing",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
