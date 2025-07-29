"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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

interface Game {
  id: string;
  name: string;
  icon: string;
  image: string;
  isEloBased: boolean;
  ranks: any;
  services: any[];
}

export function GamesTab() {
  const [games, setGames] = useState<Game[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    image: "",
    isEloBased: false,
    ranks: "",
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/admin/games");
      const data = await response.json();
      console.log("hello reached");
      console.log(data, "data");
      if (data?.error) {
        return setGames([]);
      }
      setGames(data);
    } catch (error) {
      console.log("Error: Failed to fetch games");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        ranks: formData.ranks ? JSON.parse(formData.ranks) : null,
      };

      const url = editingGame
        ? `/api/admin/games/${editingGame.id}`
        : "/api/admin/games";
      const method = editingGame ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(
          `Success: Game ${editingGame ? "updated" : "created"} successfully`
        );
        setIsDialogOpen(false);
        resetForm();
        fetchGames();
      }
    } catch (error) {
      console.log("Error: Failed to save game");
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      icon: game.icon,
      image: game.image,
      isEloBased: game.isEloBased,
      ranks: game.ranks ? JSON.stringify(game.ranks, null, 2) : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;

    try {
      const response = await fetch(`/api/admin/games/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Success: Game deleted successfully");
        fetchGames();
      }
    } catch (error) {
      console.log("Error: Failed to delete game");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      icon: "",
      image: "",
      isEloBased: false,
      ranks: "",
    });
    setEditingGame(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Games Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Game
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingGame ? "Edit Game" : "Add New Game"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Game Name</Label>
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
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="🎮"
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="/images/game.svg"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isEloBased"
                  checked={formData.isEloBased}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isEloBased: checked })
                  }
                />
                <Label htmlFor="isEloBased">ELO Based Game</Label>
              </div>
              <div>
                <Label htmlFor="ranks">Ranks (JSON format)</Label>
                <Textarea
                  id="ranks"
                  value={formData.ranks}
                  onChange={(e) =>
                    setFormData({ ...formData, ranks: e.target.value })
                  }
                  placeholder='[{"id": "bronze", "name": "Bronze", "price": 20}]'
                  rows={6}
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
                  {editingGame ? "Update" : "Create"} Game
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
              <TableHead>Icon</TableHead>
              <TableHead>ELO Based</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <Collapsible key={game.id} asChild>
                <>
                  <TableRow>
                    <TableCell className="font-medium">{game.name}</TableCell>
                    <TableCell>{game.icon}</TableCell>
                    <TableCell>{game.isEloBased ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {game.services.length} services
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(game)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(game.id)}
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
                          <h4 className="font-semibold mb-2">Services:</h4>
                          {game.services.length > 0 ? (
                            <ul className="space-y-1">
                              {game.services.map((service: any) => (
                                <li key={service.id} className="text-sm">
                                  • {service.name} ({service.subpackages.length}{" "}
                                  subpackages)
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No services yet
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
