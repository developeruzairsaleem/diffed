"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Plus, Star } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"

interface Game {
  id: string;
  name: string;
  icon: string;
}

interface Provider {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  rating: number;
  totalOrders: number;
  isActive: boolean;
  gameIds: string[];
  orders: any[];
}

export function ProvidersTab() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    gameIds: [] as string[],
    isActive: true,
  });
  // const { toast } = useToast()

  useEffect(() => {
    fetchProviders();
    fetchGames();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/admin/providers");
      const data = await response.json();
      if (data?.error) {
        return setProviders([]);
      }
      setProviders(data);
    } catch (error) {
      console.error("Failed to fetch providers", error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/admin/games");
      const data = await response.json();
      if (data?.error) {
        return setGames([]);
      }
      setGames(data);
    } catch (error) {
      console.error("Failed to fetch games", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProvider
        ? `/api/admin/providers/${editingProvider.id}`
        : "/api/admin/providers";
      const method = editingProvider ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(
          `Provider ${editingProvider ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchProviders();
      }
    } catch (error) {
      console.error("Failed to save provider", error);
    }
  };

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      email: provider.email,
      avatar: provider.avatar || "",
      bio: provider.bio || "",
      gameIds: provider.gameIds,
      isActive: provider.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this provider?")) return;

    try {
      const response = await fetch(`/api/admin/providers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Provider deleted successfully");
        fetchProviders();
      }
    } catch (error) {
      console.error("Failed to delete provider", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      avatar: "",
      bio: "",
      gameIds: [],
      isActive: true,
    });
    setEditingProvider(null);
  };

  const handleGameToggle = (gameId: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, gameIds: [...formData.gameIds, gameId] });
    } else {
      setFormData({
        ...formData,
        gameIds: formData.gameIds.filter((id) => id !== gameId),
      });
    }
  };

  const getGameNames = (gameIds: string[]) => {
    return gameIds
      .map((id) => {
        const game = games.find((g) => g.id === id);
        return game ? `${game.icon} ${game.name}` : id;
      })
      .join(", ");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Service Providers Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProvider ? "Edit Provider" : "Add New Provider"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Brief description of the provider's expertise..."
                />
              </div>

              <div>
                <Label>Games</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {games.map((game) => (
                    <div key={game.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={game.id}
                        checked={formData.gameIds.includes(game.id)}
                        onCheckedChange={(checked) =>
                          handleGameToggle(game.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={game.id} className="text-sm">
                        {game.icon} {game.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active Provider</Label>
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
                  {editingProvider ? "Update" : "Create"} Provider
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Games</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={provider.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      {provider.bio && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {provider.bio}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{provider.email}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {getGameNames(provider.gameIds)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{provider.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{provider.totalOrders}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={provider.isActive ? "default" : "secondary"}>
                    {provider.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(provider)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(provider.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
