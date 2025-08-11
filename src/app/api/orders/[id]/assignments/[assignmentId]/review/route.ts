import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/lib/order.service"; // adjust the import if needed
import type { ApiResponse, AssignmentUpdateRequest, AssignmentUpdateRequestShabir } from "@/types/order.dto"; // your ApiResponse generic type
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/sessions";
import { prisma } from "@/lib/prisma";
import { getWalletBalance } from "@/lib/wallet";
import { Decimal } from "@prisma/client/runtime/library";
import { toast } from "sonner";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string } }
) {

  try {
    const assignment = await OrderService.getAssignment(params.assignmentId);

    if (!assignment) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Assignment not found",
      };
      console.log(
        "GET ERROR response from /api/orders/[orderId]/assignments/[assignmentId]",
        response
      );
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof assignment> = {
      success: true,
      data: assignment,
    };
    console.log(
      "GET SUCCESS response from /api/orders/[orderId]/assignments/[assignmentId]",
      response
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error retrieving assignment:", error);
    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to retrieve assignment",
    };
    return NextResponse.json(response, { status: 500 });
  }
}



// Update the assignment status from customer point of view. only able to change to "replaced", "Approved" & "Verified"


// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string; assignmentId: string } }
// ) {
//   try {
//     const body: AssignmentUpdateRequest = await request.json();
//     const cookie = (await cookies()).get("session")?.value;

//     const session = await decrypt(cookie);
//     console.log('SESSION LOGGED SHABIR: ', session)
//     const userId = session?.userId as string;
//     if (!session?.userId) {
//       return NextResponse.json({ error: "Missing session cookie", success: false }, { status: 401 });
//     }
//     const tipAmount = body?.tipAmount;

//     if (!userId) {
//       return NextResponse.json({ error: "Invalid session", success: false }, { status: 401 });
//     }

//     const { gamePlay, communication, attitude, reviewText } = body;

//     if (
//       typeof gamePlay !== "number" ||
//       typeof communication !== "number" ||
//       typeof attitude !== "number"
//     ) {
//       return NextResponse.json(
//         { error: "Missing or invalid rating fields" },
//         { status: 400 }
//       );
//     }
    
//     const reviewRating = (gamePlay + communication + attitude) / 3;
    
//     const update = await prisma.orderAssignment.update({
//       where: { id: params.assignmentId },
//       data: {
//         reviewRating,
//         reviewText,
//         gamePlay,
//         communication,
//         attitude,
//       },
//     });

//     if (!update) {
//       toast('Review Update could be successful');
//       return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
//     }

//     // Handle tip balance deduction
//     if (tipAmount) {
//       const currentBalance = await getWalletBalance(userId);

//       if (currentBalance.lessThan(tipAmount)) {
//         return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
//       }

//       const updatedWallet = await prisma.wallet.update({
//         where: { userId },
//         data: {
//           balance: {
//             decrement: tipAmount,
//           },
//         },
//       });

//       if(updatedWallet) {
//         const updatedAssignmentTip = await prisma.orderAssignment.update({
//           where: {id: params.assignmentId},
//           data: {
//             tipAmount: tipAmount,
//           }
//         });

//         if(!updatedAssignmentTip) {
//           toast('Your tip could not be sent');
//           return NextResponse.json('Your tip could not be sent', {status: 500});
//         } 

//         toast('Tip sent sucessfully!');
//       }

//       return NextResponse.json({ success: true, updatedWallet }, { status: 200 });
//     }

//     // If no tip, just return the updated assignment
//     toast('Review updated successfully');
//     return NextResponse.json({ success: true, update }, { status: 200 });

//   } catch (error) {
//     console.error("Error updating assignment:", error);
//     const response: ApiResponse<never> = {
//       success: false,
//       error: "Failed to update assignment",
//     };

//     toast('Error updating assignment')
//     return NextResponse.json(response, { status: 500 });
//   }
// }


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; assignmentId: string } }
) {
  try {
    const body: AssignmentUpdateRequestShabir = await request.json();
    const cookie = (await cookies()).get("session")?.value;

    if (!cookie) {
      return NextResponse.json({ success: false, error: "Unauthorized: Missing session cookie" }, { status: 401 });
    }

    const session = await decrypt(cookie);
    const userId = session?.userId as string;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid session" }, { status: 401 });
    }

    const { gamePlay, communication, attitude, reviewText, tipAmount, providerId } = body;

    if (
      typeof gamePlay !== "number" ||
      typeof communication !== "number" ||
      typeof attitude !== "number" ||
      typeof providerId !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid rating fields" },
        { status: 400 }
      );
    }

    // if (reviewText === '') {
    //   return NextResponse.json('Review description is must', {status: 404});
    // }
    
    const reviewRating = (gamePlay + communication + attitude) / 3;
    
    const updatedReview = await prisma.orderAssignment.update({
      where: { id: params.assignmentId },
      data: {
        reviewRating,
        reviewText,
        gamePlay,
        communication,
        attitude,
      },
    });

    if (!updatedReview) {
      return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
    }

    // Handle tip balance deduction only if a tip is provided
    if (tipAmount && tipAmount > 0) {
      const currentBalance = await getWalletBalance(userId);

      if (currentBalance.lessThan(tipAmount)) {
        return NextResponse.json({ success: false, error: "Insufficient balance to send tip." }, { status: 400 });
      }

      // Using a transaction to ensure both wallet deduction and tip update are successful
      try {
        await prisma.$transaction(async (tx) => {
          await tx.wallet.update({
            where: { userId },
            data: {
              balance: {
                decrement: tipAmount,
              },
            },
          });

          await tx.wallet.update({
            where: {userId: providerId},
            data: {
              balance: {
                increment: tipAmount
              }
            }
          })

          await tx.orderAssignment.update({
            where: { id: params.assignmentId },
            data: {
              tipAmount,
            },
          });

        });
        
        return NextResponse.json({ success: true, message: "Review saved and tip sent successfully!" }, { status: 200 });

      } catch (transactionError) {
        console.error("Tip transaction failed:", transactionError);
        return NextResponse.json({ success: false, error: "Your tip could not be sent due to a server error." }, { status: 500 });
      }
    }

    // If no tip was provided, just confirm the review update
    return NextResponse.json({ success: true, message: "Review updated successfully", data: updatedReview }, { status: 200 });

  } catch (error) {
    console.error("Error updating assignment:", error);
    // toast(error.message || 'Error updating assignment')
    return NextResponse.json({
      success: false,
      error: "Failed to update assignment due to a server error.",
    }, { status: 500 });
  }
}