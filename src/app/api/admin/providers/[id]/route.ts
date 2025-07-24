import { type NextRequest, NextResponse } from "next/server";
import { ProviderService } from "@/lib/provider.service";
import type {
  ApiResponse,
  ProviderDetailDto,
  ProviderUpdateRequest,
} from "@/types/provider.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const provider = await ProviderService.getProviderById(params.id);

    if (!provider) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Provider not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ProviderDetailDto> = {
      success: true,
      data: provider,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching provider:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch provider",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: ProviderUpdateRequest = await request.json();

    const updatedProvider = await ProviderService.updateProvider(
      params.id,
      body
    );

    if (!updatedProvider) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Provider not found",
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ProviderDetailDto> = {
      success: true,
      data: updatedProvider,
      message: "Provider updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating provider:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to update provider",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await ProviderService.deleteProvider(params.id);

    if (!success) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Failed to delete provider",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const response: ApiResponse<never> = {
      success: true,
      message: "Provider deleted successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting provider:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to delete provider",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
