import type { Server as NetServer } from "http";
import type { NextApiResponse } from "next";
import type { Server as ServerIO } from "socket.io";

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole: "customer" | "provider" | "admin";
  message: string;
  timestamp: number;
  type: "message" | "system";
}

export interface TypingData {
  userId: string;
  userName: string;
  orderId: string;
  isTyping: boolean;
}
