"use client"

import { useState, useMemo } from "react" // Import useMemo
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Gamepad2, DollarSign, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" // Import Tabs components

interface Order {
  id: string
  clientName: string
  clientAvatar: string
  service: string
  game: string // e.g., "Valorant", "League of Legends", "Fortnite", "CS2", "Overwatch 2"
  price: number
  status: "Pending" | "Accepted" | "Rejected"
  requestedAt: string
}

const initialOrders: Order[] = [
  {
    id: "ORD001",
    clientName: "GamerPro2024",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "1-on-1 Coaching",
    game: "Valorant",
    price: 35,
    status: "Pending",
    requestedAt: "2025-07-18 10:00 AM",
  },
  {
    id: "ORD002",
    clientName: "LeaguePlayer99",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "Rank Boosting",
    game: "League of Legends",
    price: 150,
    status: "Pending",
    requestedAt: "2025-07-18 09:30 AM",
  },
  {
    id: "ORD003",
    clientName: "CS_Master",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "VOD Review",
    game: "CS2",
    price: 20,
    status: "Pending",
    requestedAt: "2025-07-17 05:00 PM",
  },
  {
    id: "ORD004",
    clientName: "OverwatchFan",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "Team Coaching",
    game: "Overwatch 2",
    price: 120,
    status: "Pending",
    requestedAt: "2025-07-17 02:15 PM",
  },
  {
    id: "ORD005",
    clientName: "FortnitePro",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "1-on-1 Coaching",
    game: "Fortnite",
    price: 40,
    status: "Pending",
    requestedAt: "2025-07-17 01:00 PM",
  },
  {
    id: "ORD007",
    clientName: "ApexLegend",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "Rank Boosting",
    game: "Apex Legends",
    price: 180,
    status: "Pending",
    requestedAt: "2025-07-16 04:00 PM",
  },
  {
    id: "ORD005",
    clientName: "NewbieGamer",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "1-on-1 Coaching",
    game: "Valorant",
    price: 35,
    status: "Accepted",
    requestedAt: "2025-07-16 11:00 AM",
  },
  {
    id: "ORD006",
    clientName: "RageQuitKid",
    clientAvatar: "/placeholder.svg?height=40&width=40",
    service: "Rank Boosting",
    game: "League of Legends",
    price: 100,
    status: "Rejected",
    requestedAt: "2025-07-16 09:00 AM",
  },
]

export function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [activeFilter, setActiveFilter] = useState("All") // New state for filter

  // Dynamically get unique games from orders, plus "All"
  const gameFilters = useMemo(() => {
    const uniqueGames = new Set(initialOrders.map((order) => order.game))
    return ["All", ...Array.from(uniqueGames).sort()]
  }, [])

  // Filtered orders based on activeFilter
  const filteredOrders = useMemo(() => {
    if (activeFilter === "All") {
      return orders
    }
    return orders.filter((order) => order.game === activeFilter)
  }, [orders, activeFilter])

  const handleAccept = (id: string) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, status: "Accepted" } : order)))
    console.log(`Order ${id} accepted!`)
  }

  const handleReject = (id: string) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? { ...order, status: "Rejected" } : order)))
    console.log(`Order ${id} rejected!`)
  }

  const getStatusBadgeClass = (status: Order["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500 text-white"
      case "Rejected":
        return "bg-red-500 text-white"
      case "Pending":
      default:
        return "bg-yellow-500 text-white"
    }
  }

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Orders Queue
        </CardTitle>
        <CardDescription className="text-white/70">Manage incoming coaching and boosting requests.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Options */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 bg-white/5 border border-white/10 shadow-md">
            {gameFilters.map((game) => (
              <TabsTrigger
                key={game}
                value={game}
                className="text-white/70 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600"
              >
                {game}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <p className="text-white/70 text-center py-8">No orders found for {activeFilter}.</p>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-0">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={order.clientAvatar || "/placeholder.svg"} alt={order.clientName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                        {order.clientName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-white">{order.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gamepad2 className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/80">
                      {order.service} ({order.game})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/80">${order.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/60">{order.requestedAt}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-end md:items-center">
                  <Badge className={getStatusBadgeClass(order.status)}>{order.status}</Badge>
                  {order.status === "Pending" && (
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAccept(order.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-600 hover:bg-red-700 text-white border-red-700"
                        onClick={() => handleReject(order.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
