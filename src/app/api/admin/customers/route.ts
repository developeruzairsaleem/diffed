import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CustomersDTO } from "@/DTO/admin/customers.dto";
import { CustomerArraySchema } from "@/validations/admin/customers.validator";
import { ZodError } from "zod";
export async function GET() {
  try {
    // ------------------------------------------------------------------
    // raw customers from db with orderUsers count in the orderUsers table
    // ------------------------------------------------------------------
    const customers = await prisma.user.findMany({
      where: { role: "customer" },
      include: {
        wallet: true,
        _count: {
          select: {
            orderUsers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    // ---------------------------------------------------------
    // tranform customers so they can be parsed for validations
    // ----------------------------------------------------------
    const transformedCustomers = customers.map((c: any) => new CustomersDTO(c));
    // ---------------------------------
    // validated customer after parsing
    // ----------------------------------
    const parsedCustomers = CustomerArraySchema.parse(transformedCustomers);
    return NextResponse.json(parsedCustomers);
  } catch (error) {
    // -------------------------------------------------
    // check if the error occured is the validation error
    // ------------------------------------------------
    if (error instanceof ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        {
          error: "validation Error",
        },
        {
          status: 400,
        }
      );
    } else {
      console.error("General error:", error);
      return NextResponse.json(
        { error: "Failed to fetch customers" },
        { status: 500 }
      );
    }
  }
}
