"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  Trash2,
  Plus,
  UserCheck,
  Clock,
  CheckCircle,
} from "lucide-react";
// import { useToast } from "@/hooks/use-toast"

interface Game {
  id: string;
  name: string;
  icon: string;
}

interface Provider {
  id: string;
  name: string;
  avatar?: string;
  gameIds: string[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer: Customer;
  gameId: string;
  serviceName: string;
  subpackageName: string;
  price: number;
  scheduledTime?: string;
  completionTime?: string;
  status: string;
  notes?: string;
  providerId?: string;
  provider?: Provider;
  createdAt: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ASSIGNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusIcons = {
  PENDING: Clock,
  ASSIGNED: UserCheck,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle,
  CANCELLED: Trash2,
};

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    customerEmail: "",
    gameId: "",
    serviceName: "",
    subpackageName: "",
    price: "",
    scheduledTime: "",
    notes: "",
  });
  // const { toast } = useToast()

  useEffect(() => {
    fetchOrders();
    fetchGames();
    fetchProviders();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders");
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/admin/games");
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch games");
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/admin/providers");
      const data = await response.json();
      setProviders(data.filter((p: Provider) => p.isActive));
    } catch (error) {
      console.error("Failed to fetch providers");
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        scheduledTime: formData.scheduledTime || null,
      };

      const url = editingOrder
        ? `/api/admin/orders/${editingOrder.id}`
        : "/api/admin/orders";
      const method = editingOrder ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(
          `Order ${editingOrder ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to save order");
    }
  };

  const handleAssignProvider = async () => {
    if (!assigningOrder || !selectedProviderId) return;

    try {
      const response = await fetch(
        `/api/admin/orders/${assigningOrder.id}/assign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ providerId: selectedProviderId }),
        }
      );

      if (response.ok) {
        console.log("Provider assigned successfully");
        setIsAssignDialogOpen(false);
        setAssigningOrder(null);
        setSelectedProviderId("");
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to assign provider");
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const updateData: any = { status: newStatus };

      if (newStatus === "COMPLETED") {
        updateData.completionTime = new Date().toISOString();
      }

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        console.log("Order status updated successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update order status");
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      customerId: order.customerId,
      customerName: order.customer.name,
      customerEmail: order.customer.email,
      gameId: order.gameId,
      serviceName: order.serviceName,
      subpackageName: order.subpackageName,
      price: order.price.toString(),
      scheduledTime: order.scheduledTime
        ? new Date(order.scheduledTime).toISOString().slice(0, 16)
        : "",
      notes: order.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Order deleted successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to delete order");
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: "",
      customerName: "",
      customerEmail: "",
      gameId: "",
      serviceName: "",
      subpackageName: "",
      price: "",
      scheduledTime: "",
      notes: "",
    });
    setEditingOrder(null);
  };

  const getGameName = (gameId: string) => {
    const game = games.find((g) => g.id === gameId);
    return game ? `${game.icon} ${game.name}` : gameId;
  };

  const getAvailableProviders = (gameId: string) => {
    return providers.filter((p) => p.gameIds.includes(gameId));
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Orders Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? "Edit Order" : "Add New Order"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerId">Customer</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) => {
                    const customer = customers.find((c) => c.id === value);
                    setFormData({
                      ...formData,
                      customerId: value,
                      customerName: customer?.name || "",
                      customerEmail: customer?.email || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select existing customer or create new" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={customer.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {customer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{customer.name}</div>
                            <div className="text-xs text-gray-500">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Show manual entry fields if no customer selected */}
              {!formData.customerId && (
                <div className="grid grid-cols-2 gap-4 p-4 border rounded bg-gray-50">
                  <div>
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      required={!formData.customerId}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Customer Email</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerEmail: e.target.value,
                        })
                      }
                      required={!formData.customerId}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="gameId">Game</Label>
                <Select
                  value={formData.gameId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gameId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.icon} {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input
                    id="serviceName"
                    value={formData.serviceName}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subpackageName">Subpackage Name</Label>
                  <Input
                    id="subpackageName"
                    value={formData.subpackageName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subpackageName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledTime">Scheduled Time</Label>
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduledTime: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Additional notes or requirements..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOrder ? "Update" : "Create"} Order
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Assign Provider Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Provider</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>
                  Available Providers for{" "}
                  {assigningOrder && getGameName(assigningOrder.gameId)}
                </Label>
                <Select
                  value={selectedProviderId}
                  onValueChange={setSelectedProviderId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {assigningOrder &&
                      getAvailableProviders(assigningOrder.gameId).map(
                        (provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={provider.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {provider.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{provider.name}</span>
                            </div>
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAssignProvider}
                  disabled={!selectedProviderId}
                >
                  Assign Provider
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Game & Service</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const StatusIcon =
                  statusIcons[order.status as keyof typeof statusIcons];
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.orderNumber.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={order.customer.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {order.customer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {getGameName(order.gameId)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.serviceName} - {order.subpackageName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${order.price}
                    </TableCell>
                    <TableCell>
                      {order.provider ? (
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={order.provider.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {order.provider.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{order.provider.name}</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAssigningOrder(order);
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          Assign
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-4 h-4" />
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ASSIGNED">Assigned</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              In Progress
                            </SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{formatDateTime(order.scheduledTime)}</div>
                      {order.completionTime && (
                        <div className="text-green-600">
                          Completed: {formatDateTime(order.completionTime)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(order)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
