import { prisma } from "@/lib/prisma";
import type {
  CustomersListRequest,
  CustomersListResponse,
  CustomerListDto,
  CustomerDetailDto,
  CustomerUpdateRequest,
  CustomerStatsDto,
} from "@/types/customer.dto";
import { Status, Role } from "@/generated/prisma";

export class CustomerService {
  static async getCustomers(
    params: CustomersListRequest
  ): Promise<CustomersListResponse> {
    const {
      page = 1,
      limit = 10,
      status,
      role = Role.customer,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      hasOrders,
      minSpent,
      maxSpent,
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
      ...(hasOrders !== undefined && {
        orders: hasOrders ? { some: {} } : { none: {} },
      }),
    };

    // Get customers with their wallet and order information
    const [customers, total] = await Promise.all([
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
      prisma.user.count({ where }),
    ]);

    // Calculate customer statistics
    const customerDtos: CustomerListDto[] = customers
      .map((customer) => {
        const totalSpent = customer.orders.reduce(
          (sum, order) => sum + order.price,
          0
        );
        const lastOrder = customer.orders.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )[0];

        return {
          id: customer.id,
          username: customer.username,
          email: customer.email,
          role: customer.role,
          status: customer.status,
          profileImage: customer.profileImage || undefined,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
          wallet: customer.wallet
            ? {
                balance: Number(customer.wallet.balance),
                currency: customer.wallet.currency,
              }
            : undefined,
          ordersCount: customer.orders.length,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt,
        };
      })
      .filter((customer) => {
        if (minSpent !== undefined && customer.totalSpent < minSpent)
          return false;
        if (maxSpent !== undefined && customer.totalSpent > maxSpent)
          return false;
        return true;
      });

    // Get overall statistics
    const [
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      suspendedCustomers,
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.customer } }),
      prisma.user.count({
        where: { role: Role.customer, status: Status.active },
      }),
      prisma.user.count({
        where: { role: Role.customer, status: Status.inactive },
      }),
      prisma.user.count({
        where: { role: Role.customer, status: Status.suspended },
      }),
    ]);

    const totalRevenue = await prisma.order.aggregate({
      _sum: { price: true },
      where: { customer: { role: Role.customer } },
    });

    const stats = {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      suspendedCustomers,
      totalRevenue: totalRevenue._sum.price || 0,
      averageCustomerValue:
        totalCustomers > 0
          ? (totalRevenue._sum.price || 0) / totalCustomers
          : 0,
    };

    return {
      customers: customerDtos,
      total: customerDtos.length,
      page,
      limit,
      totalPages: Math.ceil(customerDtos.length / limit),
      stats,
    };
  }

  static async getCustomerById(id: string): Promise<CustomerDetailDto | null> {
    const customer = await prisma.user.findUnique({
      where: { id, role: Role.customer },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: { createdAt: "desc" },
              take: 20,
            },
          },
        },
        orders: {
          include: {
            customer: {
              select: {
                id: true,
                username: true,
                email: true,
                role: true,
                profileImage: true,
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
            assignments: {
              select: {
                id: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!customer) return null;

    // Calculate customer statistics
    const totalOrders = customer.orders.length;
    const completedOrders = customer.orders.filter(
      (order) => order.status === "COMPLETED"
    ).length;
    const cancelledOrders = customer.orders.filter(
      (order) => order.status === "CANCELLED"
    ).length;
    const totalSpent = customer.orders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrder = customer.orders[0];

    return {
      id: customer.id,
      username: customer.username,
      email: customer.email,
      role: customer.role,
      status: customer.status,
      profileImage: customer.profileImage || undefined,
      stripeCustId: customer.stripeCustId || undefined,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
      wallet: customer.wallet
        ? {
            id: customer.wallet.id,
            balance: Number(customer.wallet.balance),
            currency: customer.wallet.currency,
            userId: customer.wallet.userId,
          }
        : undefined,
      orders: customer.orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerId: order.customerId,
        customer: {
          id: order.customer.id,
          username: order.customer.username,
          email: order.customer.email,
          role: order.customer.role,
          profileImage: order.customer.profileImage || undefined,
        },
        subpackage: {
          id: order.subpackage.id,
          name: order.subpackage.name,
          description: order.subpackage.description,
          price: order.subpackage.price,
          duration: order.subpackage.duration || undefined,
          service: {
            id: order.subpackage.service.id,
            name: order.subpackage.service.name,
            game: {
              id: order.subpackage.service.game.id,
              name: order.subpackage.service.game.name,
              image: order.subpackage.service.game.image,
            },
          },
        },
        price: order.price,
        status: order.status,
        rerollsLeft: order.rerollsLeft,
        approvedCount: order.approvedCount,
        requiredCount: order.requiredCount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        assignmentsCount: order.assignments.length,
      })),
      transactions:
        customer.wallet?.transactions.map((transaction) => ({
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
        totalOrders,
        completedOrders,
        cancelledOrders,
        totalSpent,
        averageOrderValue,
        lastOrderDate: lastOrder?.createdAt,
      },
    };
  }

  static async updateCustomer(
    id: string,
    data: CustomerUpdateRequest
  ): Promise<CustomerDetailDto | null> {
    const updatedCustomer = await prisma.user.update({
      where: { id, role: Role.customer },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return this.getCustomerById(updatedCustomer.id);
  }

  static async deleteCustomer(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id, role: Role.customer },
      });
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
    }
  }

  static async getCustomerStats(): Promise<CustomerStatsDto> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalCustomers, newCustomersThisMonth, activeCustomers] =
      await Promise.all([
        prisma.user.count({ where: { role: Role.customer } }),
        prisma.user.count({
          where: {
            role: Role.customer,
            createdAt: { gte: startOfMonth },
          },
        }),
        prisma.user.count({
          where: {
            role: Role.customer,
            status: Status.active,
          },
        }),
      ]);

    // Get top spenders
    const topSpendersData = await prisma.user.findMany({
      where: { role: Role.customer },
      include: {
        orders: {
          select: {
            price: true,
          },
        },
      },
      take: 10,
    });

    const topSpenders = topSpendersData
      .map((customer) => ({
        id: customer.id,
        username: customer.username,
        email: customer.email,
        totalSpent: customer.orders.reduce(
          (sum, order) => sum + order.price,
          0
        ),
        ordersCount: customer.orders.length,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Get revenue by month (last 6 months)
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const [revenue, customers] = await Promise.all([
        prisma.order.aggregate({
          _sum: { price: true },
          where: {
            createdAt: {
              gte: monthStart,
              lte: monthEnd,
            },
            customer: { role: Role.customer },
          },
        }),
        prisma.user.count({
          where: {
            role: Role.customer,
            orders: {
              some: {
                createdAt: {
                  gte: monthStart,
                  lte: monthEnd,
                },
              },
            },
          },
        }),
      ]);

      revenueByMonth.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        revenue: revenue._sum.price || 0,
        customers,
      });
    }

    return {
      totalCustomers,
      newCustomersThisMonth,
      activeCustomers,
      topSpenders,
      revenueByMonth,
    };
  }
}
