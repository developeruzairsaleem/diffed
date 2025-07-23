import { type NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/customer.service";
import type {
  ApiResponse,
  CustomerDetailDto,
  CustomerUpdateRequest,
} from "@/types/customer.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await CustomerService.getCustomerById(params.id);

    if (!customer) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Customer not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<CustomerDetailDto> = {
      success: true,
      data: customer,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching customer:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch customer",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: CustomerUpdateRequest = await request.json();

    const updatedCustomer = await CustomerService.updateCustomer(
      params.id,
      body
    );

    if (!updatedCustomer) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Customer not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<CustomerDetailDto> = {
      success: true,
      data: updatedCustomer,
      message: "Customer updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating customer:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update customer",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await CustomerService.deleteCustomer(params.id);

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to delete customer",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Customer deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting customer:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete customer",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
