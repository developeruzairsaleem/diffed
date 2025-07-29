import { type NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/game.service";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, SubpackageCreateRequest } from "@/types/game.dto";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 10,
      serviceId: searchParams.get("serviceId") || undefined,
      gameId: searchParams.get("gameId") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
      dynamicPricing: searchParams.get("dynamicPricing")
        ? searchParams.get("dynamicPricing") === "true"
        : undefined,
      minPrice: searchParams.get("minPrice")
        ? Number.parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number.parseFloat(searchParams.get("maxPrice")!)
        : undefined,
    };

    const skip = (params.page - 1) * params.limit;

    const where: any = {
      ...(params.serviceId && { serviceId: params.serviceId }),
      ...(params.gameId && { service: { gameId: params.gameId } }),
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: "insensitive" as const } },
          {
            description: {
              contains: params.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
      ...(params.dynamicPricing !== undefined && {
        dynamicPricing: params.dynamicPricing,
      }),
      ...(params.minPrice !== undefined && { price: { gte: params.minPrice } }),
      ...(params.maxPrice !== undefined && { price: { lte: params.maxPrice } }),
    };

    const [subpackages, total, allGames] = await Promise.all([
      prisma.subpackage.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { [params.sortBy]: params.sortOrder },
        include: {
          service: {
            include: {
              game: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          orders: {
            select: {
              id: true,
              price: true,
              status: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.subpackage.count({ where }),
      prisma.game.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          services: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      }),
    ]);

    const subpackageDtos = subpackages.map((subpackage) => {
      const ordersCount = subpackage.orders.length;
      const totalRevenue = subpackage.orders.reduce(
        (sum, order) => sum + order.price,
        0
      );
      const completedOrders = subpackage.orders.filter(
        (order) => order.status === "COMPLETED"
      ).length;
      const completionRate =
        ordersCount > 0 ? (completedOrders / ordersCount) * 100 : 0;

      return {
        id: subpackage.id,
        name: subpackage.name,
        description: subpackage.description,
        price: subpackage.price,
        requiredProviders: subpackage.requiredProviders || 1,
        duration: subpackage.duration,
        dynamicPricing: subpackage.dynamicPricing,
        basePricePerELO: subpackage.basePricePerELO,
        minELO: subpackage.minELO,
        maxELO: subpackage.maxELO,
        serviceId: subpackage.serviceId,
        service: {
          id: subpackage.service.id,
          name: subpackage.service.name,
          description: subpackage.service.description,
          game: subpackage.service.game,
        },
        ordersCount,
        totalRevenue,
        completionRate,
        createdAt: subpackage.createdAt,
        updatedAt: subpackage.updatedAt,
      };
    });

    const response: ApiResponse<any> = {
      success: true,
      data: {
        subpackages: subpackageDtos,
        total,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(total / params.limit),
        allGames,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching subpackages:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch subpackages",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: SubpackageCreateRequest = await request.json();

    const subpackage = await GameService.createSubpackage(body);

    const response: ApiResponse<typeof subpackage> = {
      success: true,
      data: subpackage,
      message: "Subpackage created successfully",
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating subpackage:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create subpackage",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
