import type { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import type { NextApiResponseServerIO } from "../../lib/socket";

export default async function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new ServerIO(res.socket.server as any, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join-order", (orderId: string) => {
        socket.join(`order-${orderId}`);
        console.log(`User ${socket.id} joined order-${orderId}`);
      });

      socket.on("leave-order", (orderId: string) => {
        socket.leave(`order-${orderId}`);
        console.log(`User ${socket.id} left order-${orderId}`);
      });

      socket.on("send-message", (data: any) => {
        io.to(`order-${data.orderId}`).emit("new-message", data);
      });

      socket.on("typing", (data: any) => {
        socket.to(`order-${data.orderId}`).emit("user-typing", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }
  res.end();
}
