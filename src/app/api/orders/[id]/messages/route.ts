import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@/types/order.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messages = await prisma.chat.findMany({
      where: { orderId: params.id },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            profileImage: true,
          },
        },
      },
      orderBy: { sentAt: "asc" },
    });

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      orderId: msg.orderId,
      senderId: msg.senderId,
      senderName: msg.sender.username,
      senderAvatar: msg.sender.profileImage,
      senderRole: msg.sender.role,
      message: msg.message,
      timestamp: msg.sentAt.getTime(),
      type: "message" as const,
    }));

    const response: ApiResponse<typeof formattedMessages> = {
      success: true,
      data: formattedMessages,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching messages:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to fetch messages",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { message, senderId } = await request.json();

    if (!message?.trim() || !senderId) {
      const response: ApiResponse<never> = {
        success: false,
        error: "Message and senderId are required",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const newMessage = await prisma.chat.create({
      data: {
        orderId: params.id,
        senderId,
        message: message.trim(),
        sentAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            profileImage: true,
          },
        },
      },
    });

    const formattedMessage = {
      id: newMessage.id,
      orderId: newMessage.orderId,
      senderId: newMessage.senderId,
      senderName: newMessage.sender.username,
      senderAvatar: newMessage.sender.profileImage,
      senderRole: newMessage.sender.role,
      message: newMessage.message,
      timestamp: newMessage.sentAt.getTime(),
      type: "message" as const,
    };

    const response: ApiResponse<typeof formattedMessage> = {
      success: true,
      data: formattedMessage,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating message:", error);

    const response: ApiResponse<never> = {
      success: false,
      error: "Failed to create message",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
