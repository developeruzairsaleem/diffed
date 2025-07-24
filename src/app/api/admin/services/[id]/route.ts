import { type NextRequest, NextResponse } from "next/server";
import { GameService } from "@/lib/game.service";
import type {
  ApiResponse,
  ServiceDetailDto,
  ServiceUpdateRequest,
} from "@/types/game.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await GameService.getServiceById(params.id);

    if (!service) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Service not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ServiceDetailDto> = {
      success: true,
      data: service,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching service:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch service",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: ServiceUpdateRequest = await request.json();

    const updatedService = await GameService.updateService(params.id, body);

    if (!updatedService) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Service not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ServiceDetailDto> = {
      success: true,
      data: updatedService,
      message: "Service updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating service:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update service",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await GameService.deleteService(params.id);

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to delete service",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Service deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting service:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete service",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
