import { prisma } from "@/lib/prisma";
import type {
  ProvidersListRequest,
  ProvidersListResponse,
  ProviderListDto,
  ProviderDetailDto,
  ProviderUpdateRequest,
  ProviderStatsDto,
} from "@/types/provider.dto";
import { Status, Role } from "@/generated/prisma";

export class ProviderService {
  static async getProviders(
    params: ProvidersListRequest
  ): Promise<ProvidersListResponse> {
    const {
      page = 1,
      limit = 10,
      status,
      role = Role.provider,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      hasAssignments,
      minEarnings,
      maxEarnings,
      minRating,
      gameId,
    } = params;

    const skip = (page - 1) * limit;

    const where = {
      role,
      ...(status && { status }),
      ...(search && {
        OR: [
          { username: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),

      // query for handling assignment and game filtering
      ...(hasAssignments !== undefined
        ? {
            assignments: hasAssignments
              ? {
                  some: {
                    ...(gameId && {
                      order: {
                        subpackage: {
                          service: {
                            gameId,
                          },
                        },
                      },
                    }),
                  },
                }
              : { none: {} },
          }
        : {
            ...(gameId
              ? {
                  assignments: {
                    some: {
                      order: {
                        subpackage: {
                          service: {
                            gameId,
                          },
                        },
                      },
                    },
                  },
                }
              : { assignments: { some: {} } }),
          }),

      // end of the query for filtering the assignments
    };

    // Get providers with their wallet and assignment information
    const [providers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          wallet: {
            select: {
              balance: true,
              currency: true,
            },
          },
          assignments: {
            include: {
              order: {
                select: {
                  price: true,
                  status: true,
                  createdAt: true,
                },
              },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Calculate provider statistics
    const providerDtos: ProviderListDto[] = providers
      .map((provider) => {
        // ------------------------------------------
        // approved assignments as completed by admin
        // ------------------------------------------
        const completedAssignments = provider.assignments.filter(
          (a) => a.status === "APPROVED"
        ).length;
        // -------------------------------
        // Total Earnings by that provider
        // --------------------------------W
        const totalEarnings = provider.assignments
          .filter((a) => a.status === "APPROVED")
          .reduce((sum, assignment) => sum + assignment.order.price, 0);
        // Ratings of that order
        const ratings = provider.assignments
          .filter((a) => a.reviewRating)
          .map((a) => a.reviewRating!);
        // average rating for completed orders for that provider
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0;

        // Last assignment from the provider
        const lastAssignment = provider.assignments.sort(
          (a, b) => b.claimedAt.getTime() - a.claimedAt.getTime()
        )[0];

        // active assignemnts provider is currently working on
        const activeAssignments = provider.assignments.filter((a) =>
          ["PENDING", "APPROVED"].includes(a.status)
        ).length;

        return {
          id: provider.id,
          username: provider.username,
          email: provider.email,
          role: provider.role,
          status: provider.status,
          profileImage: provider.profileImage || undefined,
          createdAt: provider.createdAt,
          updatedAt: provider.updatedAt,
          wallet: provider.wallet
            ? {
                balance: Number(provider.wallet.balance),
                currency: provider.wallet.currency,
              }
            : undefined,
          assignmentsCount: provider.assignments.length,
          completedAssignments,
          totalEarnings,
          averageRating,
          lastAssignmentDate: lastAssignment?.claimedAt,
          activeAssignments,
        };
      })
      .filter((provider) => {
        if (minEarnings !== undefined && provider.totalEarnings < minEarnings)
          return false;
        if (maxEarnings !== undefined && provider.totalEarnings > maxEarnings)
          return false;
        if (minRating !== undefined && provider.averageRating < minRating)
          return false;
        return true;
      });

    // Get overall statistics
    const [
      totalProviders,
      activeProviders,
      inactiveProviders,
      suspendedProviders,
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.provider } }),
      prisma.user.count({
        where: { role: Role.provider, status: Status.active },
      }),
      prisma.user.count({
        where: { role: Role.provider, status: Status.inactive },
      }),
      prisma.user.count({
        where: { role: Role.provider, status: Status.suspended },
      }),
    ]);

    const totalEarningsResult = await prisma.order.aggregate({
      _sum: { price: true },
      where: {
        status: "COMPLETED",
      },
    });

    const avgRatingResult = await prisma.orderAssignment.aggregate({
      _avg: { reviewRating: true },
      where: {
        reviewRating: { not: null },
        provider: { role: Role.provider },
      },
    });

    const stats = {
      totalProviders,
      activeProviders,
      inactiveProviders,
      suspendedProviders,
      totalEarningsPaid: Number(totalEarningsResult._sum.price || 0), // Will need to calculate from completed assignments
      averageProviderEarnings: totalProviders > 0 ? 0 / totalProviders : 0,
      averageProviderRating: avgRatingResult._avg.reviewRating || 0,
    };

    return {
      providers: providerDtos,
      total: providerDtos.length,
      page,
      limit,
      totalPages: Math.ceil(providerDtos.length / limit),
      stats,
    };
  }

  static async getProviderById(id: string): Promise<ProviderDetailDto | null> {
    const provider = await prisma.user.findUnique({
      where: { id, role: Role.provider },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: { createdAt: "desc" },
              take: 50,
            },
          },
        },
        assignments: {
          include: {
            order: {
              include: {
                customer: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  },
                },
                subpackage: {
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
                  },
                },
              },
            },
          },
          orderBy: { claimedAt: "desc" },
        },
      },
    });

    if (!provider) return null;

    // Calculate provider statistics
    const totalAssignments = provider.assignments.length;
    const completedAssignments = provider.assignments.filter(
      (a) => a.status === "COMPLETED" || a.status === "VERIFIED"
    ).length;
    const approvedAssignments = provider.assignments.filter(
      (a) =>
        a.status === "APPROVED" ||
        a.status === "COMPLETED" ||
        a.status === "VERIFIED"
    ).length;
    const cancelledAssignments = provider.assignments.filter(
      (a) => a.status === "REPLACED"
    ).length;

    const totalEarnings = provider.assignments
      .filter((a) => a.status === "VERIFIED")
      .reduce((sum, assignment) => sum + assignment.order.price, 0);

    const ratings = provider.assignments
      .filter((a) => a.reviewRating)
      .map((a) => a.reviewRating!);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

    const completionRate =
      totalAssignments > 0
        ? (completedAssignments / totalAssignments) * 100
        : 0;
    const approvalRate =
      totalAssignments > 0
        ? (approvedAssignments + completedAssignments / totalAssignments) * 100
        : 0;

    // Calculate average completion time
    const completedWithTimes = provider.assignments.filter(
      (a) => a.status === "COMPLETED" || a.status === "VERIFIED"
    );
    const averageCompletionTime =
      completedWithTimes.length > 0
        ? completedWithTimes.reduce((sum, assignment) => {
            const completionTime =
              new Date().getTime() - assignment.claimedAt.getTime();
            return sum + completionTime;
          }, 0) /
          completedWithTimes.length /
          (1000 * 60 * 60 * 24) // Convert to days
        : 0;

    const lastAssignment = provider.assignments[0];

    // Calculate top games
    const gameStats = provider.assignments.reduce((acc, assignment) => {
      const gameName = assignment.order.subpackage.service.game.name;
      if (!acc[gameName]) {
        acc[gameName] = { assignmentsCount: 0, earnings: 0 };
      }
      acc[gameName].assignmentsCount++;
      if (assignment.status === "VERIFIED") {
        acc[gameName].earnings += assignment.order.price;
      }
      return acc;
    }, {} as Record<string, { assignmentsCount: number; earnings: number }>);

    const topGames = Object.entries(gameStats)
      .map(([gameName, stats]) => ({
        gameName,
        assignmentsCount: stats.assignmentsCount,
        earnings: stats.earnings,
      }))
      .sort((a, b) => b.assignmentsCount - a.assignmentsCount)
      .slice(0, 5);

    return {
      id: provider.id,
      username: provider.username,
      email: provider.email,
      role: provider.role,
      status: provider.status,
      profileImage: provider.profileImage || undefined,
      stripeCustId: provider.stripeCustId || undefined,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
      wallet: provider.wallet
        ? {
            id: provider.wallet.id,
            balance: Number(provider.wallet.balance),
            currency: provider.wallet.currency,
            userId: provider.wallet.userId,
          }
        : undefined,
      assignments: provider.assignments.map((assignment) => ({
        id: assignment.id,
        orderId: assignment.orderId,
        claimedAt: assignment.claimedAt,
        status: assignment.status,
        approved:
          assignment.status === "APPROVED" ||
          assignment.status === "COMPLETED" ||
          assignment.status === "VERIFIED",
        completed:
          assignment.status === "COMPLETED" || assignment.status === "VERIFIED",
        leftEarly: assignment.leftEarly,
        progress: assignment.progress,
        proofUrl: assignment.proofUrl || undefined,
        reviewRating: assignment.reviewRating || undefined,
        reviewText: assignment.reviewText || undefined,
        order: {
          id: assignment.order.id,
          orderNumber: assignment.order.orderNumber,
          price: assignment.order.price,
          status: assignment.order.status,
          customer: {
            id: assignment.order.customer.id,
            username: assignment.order.customer.username,
            email: assignment.order.customer.email,
          },
          subpackage: {
            id: assignment.order.subpackage.id,
            name: assignment.order.subpackage.name,
            service: {
              name: assignment.order.subpackage.service.name,
              game: {
                name: assignment.order.subpackage.service.game.name,
                image: assignment.order.subpackage.service.game.image,
              },
            },
          },
        },
      })),
      transactions:
        provider.wallet?.transactions.map((transaction) => ({
          id: transaction.id,
          walletId: transaction.walletId,
          type: transaction.type,
          amount: Number(transaction.amount),
          description: transaction.description || undefined,
          status: transaction.status,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        })) || [],
      stats: {
        totalAssignments,
        completedAssignments,
        approvedAssignments,
        cancelledAssignments,
        totalEarnings,
        averageRating,
        completionRate,
        approvalRate,
        averageCompletionTime,
        lastAssignmentDate: lastAssignment?.claimedAt,
        topGames,
      },
    };
  }

  static async updateProvider(
    id: string,
    data: ProviderUpdateRequest
  ): Promise<ProviderDetailDto | null> {
    const updatedProvider = await prisma.user.update({
      where: { id, role: Role.provider },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return this.getProviderById(updatedProvider.id);
  }

  static async deleteProvider(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id, role: Role.provider },
      });
      return true;
    } catch (error) {
      console.error("Error deleting provider:", error);
      return false;
    }
  }

  static async getProviderStats(): Promise<ProviderStatsDto> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalProviders, newProvidersThisMonth, activeProviders] =
      await Promise.all([
        prisma.user.count({ where: { role: Role.provider } }),
        prisma.user.count({
          where: {
            role: Role.provider,
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.user.count({
          where: {
            role: Role.provider,
            status: Status.active,
          },
        }),
      ]);

    // Get top performers
    const topPerformersData = await prisma.user.findMany({
      where: { role: Role.provider },
      include: {
        assignments: {
          include: {
            order: {
              select: {
                price: true,
              },
            },
          },
        },
      },
      take: 20,
    });

    const topPerformers = topPerformersData
      .map((provider) => {
        const completedAssignments = provider.assignments.filter(
          (a) => a.status === "COMPLETED" || a.status === "VERIFIED"
        );
        const totalEarnings = completedAssignments.reduce(
          (sum, assignment) => sum + assignment.order.price,
          0
        );
        const ratings = provider.assignments
          .filter((a) => a.reviewRating)
          .map((a) => a.reviewRating!);
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0;
        const completionRate =
          provider.assignments.length > 0
            ? (completedAssignments.length / provider.assignments.length) * 100
            : 0;

        return {
          id: provider.id,
          username: provider.username,
          email: provider.email,
          totalEarnings,
          assignmentsCount: provider.assignments.length,
          averageRating,
          completionRate,
        };
      })
      .sort((a, b) => b.totalEarnings - a.totalEarnings)
      .slice(0, 5);

    // Get earnings by month (last 6 months)
    const earningsByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const [assignmentsData, providersCount] = await Promise.all([
        prisma.orderAssignment.findMany({
          where: {
            OR: [
              {
                status: "COMPLETED",
              },
              {
                status: "VERIFIED",
              },
            ],
            claimedAt: {
              gte: monthStart,
              lte: monthEnd,
            },
            provider: { role: Role.provider },
          },
          include: {
            order: {
              select: {
                price: true,
              },
            },
          },
        }),
        prisma.user.count({
          where: {
            role: Role.provider,
            assignments: {
              some: {
                claimedAt: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
            },
          },
        }),
      ]);

      const earnings = assignmentsData.reduce(
        (sum, assignment) => sum + assignment.order.price,
        0
      );

      earningsByMonth.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        earnings,
        providers: providersCount,
        assignments: assignmentsData.length,
      });
    }

    // Get game popularity
    const gamePopularityData = await prisma.orderAssignment.findMany({
      where: {
        provider: { role: Role.provider },
      },
      include: {
        order: {
          include: {
            subpackage: {
              include: {
                service: {
                  include: {
                    game: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        provider: {
          select: {
            id: true,
          },
        },
      },
    });

    const gameStats = gamePopularityData.reduce((acc, assignment) => {
      const gameName = assignment.order.subpackage.service.game.name;
      if (!acc[gameName]) {
        acc[gameName] = {
          providersSet: new Set(),
          assignmentsCount: 0,
          totalEarnings: 0,
        };
      }
      acc[gameName].providersSet.add(assignment.provider.id);
      acc[gameName].assignmentsCount++;
      if (assignment.completed) {
        acc[gameName].totalEarnings += assignment.order.price;
      }
      return acc;
    }, {} as Record<string, { providersSet: Set<string>; assignmentsCount: number; totalEarnings: number }>);

    const gamePopularity = Object.entries(gameStats)
      .map(([gameName, stats]) => ({
        gameName,
        providersCount: stats.providersSet.size,
        assignmentsCount: stats.assignmentsCount,
        totalEarnings: stats.totalEarnings,
      }))
      .sort((a, b) => b.assignmentsCount - a.assignmentsCount);

    return {
      totalProviders,
      newProvidersThisMonth,
      activeProviders,
      topPerformers,
      earningsByMonth,
      gamePopularity,
    };
  }
}
