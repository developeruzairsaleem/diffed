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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Edit, Trash2, Plus } from "lucide-react";
// import { useToast } from "@/hooks/use-toast"

interface Game {
  id: string;
  name: string;
  icon: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  gameId: string;
  game: Game;
  subpackages: any[];
}

export function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    gameId: "",
  });
  // const { toast } = useToast()

  useEffect(() => {
    fetchServices();
    fetchGames();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      const data = await response.json();
      if (data?.services) {
        return setServices([]);
      }
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services");
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
      console.error("Failed to fetch games");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log(
          `Service ${editingService ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to save service");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      gameId: service.gameId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Service deleted successfully");
        fetchServices();
      }
    } catch (error) {
      console.error("Failed to delete service");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      gameId: "",
    });
    setEditingService(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div>
                <Label htmlFor="name">Service Name</Label>
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
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingService ? "Update" : "Create"} Service
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
              <TableHead>Description</TableHead>
              <TableHead>Subpackages</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <Collapsible key={service.id} asChild>
                <>
                  <TableRow>
                    <TableCell className="font-medium">
                      {service.name}
                    </TableCell>
                    <TableCell>
                      {service.game.icon} {service.game.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {service.description}
                    </TableCell>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {service.subpackages.length} subpackages
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-4 bg-gray-50 rounded">
                          <h4 className="font-semibold mb-2">Subpackages:</h4>
                          {service.subpackages.length > 0 ? (
                            <ul className="space-y-1">
                              {service.subpackages.map((subpackage: any) => (
                                <li key={subpackage.id} className="text-sm">
                                  • {subpackage.name} - ${subpackage.price}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No subpackages yet
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </>
              </Collapsible>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
