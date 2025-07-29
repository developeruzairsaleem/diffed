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
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"

interface Game {
  id: string;
  name: string;
  icon: string;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  gameId: string;
}

interface Subpackage {
  id: string;
  name: string;
  requiredProviders: number;

  description: string;
  price: number;
  duration?: string;
  dynamicPricing: boolean;
  basePricePerELO?: number;
  minELO?: number;
  maxELO?: number;
  stripeProductId?: string;
  stripePriceId?: string;
  serviceId: string;
  service: {
    id: string;
    name: string;
    game: {
      id: string;
      name: string;
      icon: string;
    };
  };
}

export function SubpackagesTab() {
  const [subpackages, setSubpackages] = useState<Subpackage[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubpackage, setEditingSubpackage] = useState<Subpackage | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    dynamicPricing: false,
    basePricePerELO: "",
    minELO: "",
    requiredProviders: 1,
    maxELO: "",
    gameId: "",
    serviceId: "",
  });
  // const { toast } = useToast()

  useEffect(() => {
    fetchSubpackages();
    fetchGames();
  }, []);

  useEffect(() => {
    if (formData.gameId) {
      const selectedGame = games.find((g) => g.id === formData.gameId);
      setFilteredServices(selectedGame?.services || []);
    } else {
      setFilteredServices([]);
    }
  }, [formData.gameId, games]);

  const fetchSubpackages = async () => {
    try {
      const response = await fetch("/api/admin/subpackages");
      const data = await response.json();
      if (data?.error) {
        return setSubpackages([]);
      }
      setSubpackages(data);
    } catch (error) {
      console.error("Failed to fetch subpackages", error);
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
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        basePricePerELO: formData.basePricePerELO
          ? Number.parseFloat(formData.basePricePerELO)
          : null,
        minELO: formData.minELO ? Number.parseInt(formData.minELO) : null,
        maxELO: formData.maxELO ? Number.parseInt(formData.maxELO) : null,
        duration: formData.duration || null,
      };

      const url = editingSubpackage
        ? `/api/admin/subpackages/${editingSubpackage.id}`
        : "/api/admin/subpackages";
      const method = editingSubpackage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(
          `Subpackage ${editingSubpackage ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchSubpackages();
      }
    } catch (error) {
      console.error("Failed to save subpackage", error);
    }
  };

  const handleEdit = (subpackage: Subpackage) => {
    setEditingSubpackage(subpackage);
    setFormData({
      name: subpackage.name,
      description: subpackage.description,
      requiredProviders: subpackage.requiredProviders,
      price: subpackage.price.toString(),
      duration: subpackage.duration || "",
      dynamicPricing: subpackage.dynamicPricing,
      basePricePerELO: subpackage.basePricePerELO?.toString() || "",
      minELO: subpackage.minELO?.toString() || "",
      maxELO: subpackage.maxELO?.toString() || "",
      gameId: subpackage.service.game.id,
      serviceId: subpackage.serviceId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subpackage?")) return;

    try {
      const response = await fetch(`/api/admin/subpackages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Subpackage deleted successfully");
        fetchSubpackages();
      }
    } catch (error) {
      console.error("Failed to delete subpackage", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      dynamicPricing: false,
      basePricePerELO: "",
      minELO: "",
      maxELO: "",
      gameId: "",
      requiredProviders: 1,
      serviceId: "",
    });
    setEditingSubpackage(null);
    setFilteredServices([]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Subpackages Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subpackage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSubpackage ? "Edit Subpackage" : "Add New Subpackage"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gameId">Game</Label>
                  <Select
                    value={formData.gameId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gameId: value, serviceId: "" })
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
                <div>
                  <Label htmlFor="serviceId">Service</Label>
                  <Select
                    value={formData.serviceId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Subpackage Name</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
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
                  <Label htmlFor="duration">Duration (optional)</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="e.g., 3h, 45m"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="dynamicPricing"
                  checked={formData.dynamicPricing}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, dynamicPricing: checked })
                  }
                />
                <Label htmlFor="dynamicPricing">
                  Dynamic Pricing (ELO-based)
                </Label>
              </div>

              {formData.dynamicPricing && (
                <div className="grid grid-cols-3 gap-4 p-4 border rounded">
                  <div>
                    <Label htmlFor="basePricePerELO">Base Price per ELO</Label>
                    <Input
                      id="basePricePerELO"
                      type="number"
                      step="0.01"
                      value={formData.basePricePerELO}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basePricePerELO: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="minELO">Min ELO</Label>
                    <Input
                      id="minELO"
                      type="number"
                      value={formData.minELO}
                      onChange={(e) =>
                        setFormData({ ...formData, minELO: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxELO">Max ELO</Label>
                    <Input
                      id="maxELO"
                      type="number"
                      value={formData.maxELO}
                      onChange={(e) =>
                        setFormData({ ...formData, maxELO: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSubpackage ? "Update" : "Create"} Subpackage
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
              <TableHead>Name</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Stripe</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subpackages.map((subpackage) => (
              <TableRow key={subpackage.id}>
                <TableCell className="font-medium">{subpackage.name}</TableCell>
                <TableCell>
                  {subpackage.service.game.icon} {subpackage.service.game.name}
                </TableCell>
                <TableCell>{subpackage.service.name}</TableCell>
                <TableCell>
                  {subpackage.dynamicPricing ? (
                    <Badge variant="secondary">Dynamic</Badge>
                  ) : (
                    `$${subpackage.price}`
                  )}
                </TableCell>
                <TableCell>{subpackage.duration || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    variant={subpackage.dynamicPricing ? "default" : "outline"}
                  >
                    {subpackage.dynamicPricing ? "ELO-based" : "Fixed"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      subpackage.stripeProductId ? "default" : "destructive"
                    }
                  >
                    {subpackage.stripeProductId ? "Created" : "Missing"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(subpackage)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(subpackage.id)}
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
