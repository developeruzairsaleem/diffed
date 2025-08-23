"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Wifi,
  WifiOff,
  MessageCircle,
  Gamepad2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useOrderChat } from "@/hooks/useSocket";
import type { ChatMessage } from "@/lib/socket";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  orderId: string;
  orderNumber: string;
  currentUser: {
    id: string;
    username: string;
    avatar?: string;
    role: "customer" | "provider" | "admin";
  };
  className?: string;
}

export default function ChatInterface({
  orderId,
  orderNumber,
  currentUser,
  className,
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null); //updated might cause issue

  const { messages, typingUsers, isConnected, sendMessage, sendTyping } =
    useOrderChat(orderId, currentUser);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const message = messageInput.trim();
    setMessageInput(""); // Clear input immediately for better UX
    setIsTyping(false);
    sendTyping(false);

    await sendMessage(message); // Send the saved message
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      sendTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    // after a sligh delay of typing state change it back to normal
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      sendTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "provider":
        return "bg-teal-500";
      case "customer":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    // Store preference in localStorage
    localStorage.setItem("chatSoundEnabled", (!soundEnabled).toString());

    // Test sound when enabling
    if (!soundEnabled) {
      setTimeout(() => {
        const audio = new Audio("/sounds/notification.wav");
        audio.volume = 0.3;
        audio.play().catch(console.error);
      }, 100);
    }
  };

  // Load sound preference from localStorage
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("chatSoundEnabled");
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === "true");
    }
  }, []);

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <style jsx global>{`
        .chat-container {
          background: linear-gradient(135deg, 0%, #764ba2 100%);

          overflow: hidden;
        }
        .chat-header {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        .chat-messages {
          background: rgba(0, 0, 0, 0.2);
          min-height: 500px;
        }
        .message-bubble {
          animation: slideIn 0.3s ease-out;
        }
        .message-bubble.own {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .message-bubble.other {
          background: rgba(255, 255, 255, 0.95);
        }
        .chat-input-area {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .game-title {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: bold;
        }
      `}</style>

      <Card className="chat-container border-0">
        <CardHeader className="chat-header">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Gamepad2 className="h-6 w-6 text-white" />
              <div>
                <CardTitle className="text-white ">
                  Order #{orderNumber.slice(-8)}
                </CardTitle>
                <p className="text-sm text-white/80 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Live Order Chat
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Sound Toggle Button */}
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={toggleSound}
                className="text-white hover:bg-white/20"
                title={soundEnabled ? "Disable sound" : "Enable sound"}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button> */}

              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {/* {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-400" />
                    <Badge
                      variant="outline"
                      className="text-green-400 border-green-400"
                    >
                      Connected
                    </Badge>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-400" />
                    <Badge
                      variant="outline"
                      className="text-red-400 border-red-400"
                    >
                      Connecting...
                    </Badge>
                  </>
                )} */}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="chat-messages p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-white/60">
                <MessageCircle className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message: ChatMessage) => {
                  const isOwn = message.senderId === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 message-bubble",
                        isOwn ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <Avatar className="h-10 w-10 border-2 border-white/30">
                        <AvatarImage
                          src={message.senderAvatar || "/placeholder.svg"}
                        />
                        <AvatarFallback
                          className={getRoleColor(message.senderRole)}
                        >
                          {message.senderName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl p-4",
                          isOwn
                            ? "message-bubble own text-white"
                            : "message-bubble other"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={cn(
                              "font-semibold text-sm",
                              isOwn ? "text-white" : "text-gray-700"
                            )}
                          >
                            {message.senderName}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getRoleColor(message.senderRole),
                              "text-white"
                            )}
                          >
                            {message.senderRole}
                          </Badge>
                          <span
                            className={cn(
                              "text-xs",
                              isOwn ? "text-white/70" : "text-gray-500"
                            )}
                          >
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-sm leading-relaxed",
                            isOwn ? "text-white" : "text-gray-800"
                          )}
                        >
                          {message.message}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {typingUsers.length > 0 && (
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white/50 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span>
                      {typingUsers.join(", ")}{" "}
                      {typingUsers.length === 1 ? "is" : "are"} typing...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <Separator className="bg-white/20" />

          <div className="chat-input-area p-6">
            <div className="flex gap-3">
              <Input
                value={messageInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Press Enter to send)"
                className="flex-1 bg-white/90 border-0 text-gray-800 placeholder:text-gray-500"
                disabled={!isConnected}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim() || !isConnected}
                className="bg-gradient-to-r from-pink-600 via-purple-400 to-cyan-400 hover:from-pink-700 hover:via-purple-700 hover:to-cyan-700 text-white border-0"
                size="lg"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
