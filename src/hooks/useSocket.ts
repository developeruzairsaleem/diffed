"use client";

import { useEffect, useState } from "react";
import io, { type Socket } from "socket.io-client";
import type { ChatMessage, TypingData } from "../lib/socket";

// ------------------------------------------
// connect the socket connection for realtime
// -----------------------------------------
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(
      process.env.NODE_ENV === "production" ? "" : "http://localhost:3000",
      {
        path: "/api/socket",
        addTrailingSlash: false,
      }
    );

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
}
// --------------------------------
// get all the chats for the order
// --------------------------------
export function useOrderChat(
  orderId: string,
  currentUser: { id: string; username: string; avatar?: string; role: string }
) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!socket || !orderId) return;

    socket.emit("join-order", orderId);
    loadMessages();

    socket.on("new-message", (message: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === message.id);
        if (exists) return prev;
        return [...prev, message].sort((a, b) => a.timestamp - b.timestamp);
      });
    });

    socket.on("user-typing", (data: TypingData) => {
      if (data.userId !== currentUser.id) {
        setTypingUsers((prev) => {
          if (data.isTyping) {
            return prev.includes(data.userName)
              ? prev
              : [...prev, data.userName];
          } else {
            return prev.filter((name) => name !== data.userName);
          }
        });
      }
    });

    return () => {
      socket.emit("leave-order", orderId);
      socket.off("new-message");
      socket.off("user-typing");
    };
  }, [socket, orderId, currentUser.id]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/messages`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!socket || !message.trim()) return;

    const messageData: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role as any,
      message: message.trim(),
      timestamp: Date.now(),
      type: "message",
    };

    socket.emit("send-message", messageData);

    try {
      await fetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          senderId: currentUser.id,
        }),
      });
    } catch (error) {
      console.error("Failed to save message:", error);
    }
  };

  const sendTyping = (isTyping: boolean) => {
    if (!socket) return;

    socket.emit("typing", {
      userId: currentUser.id,
      userName: currentUser.username,
      orderId,
      isTyping,
    });
  };

  return {
    messages,
    typingUsers,
    isConnected,
    sendMessage,
    sendTyping,
    loadMessages,
  };
}
