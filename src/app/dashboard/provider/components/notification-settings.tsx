"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Bell, User, Loader2 } from "lucide-react";
import { message } from "antd";
import { SettingsSkeleton } from "@/components/ui/SettingsSkeleton"; // Adjust path

export function SettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  // Fetch initial data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/profile-settings");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setFormData({
          username: data.username,
          email: data.email,
          bio: data.bio || "",
        });
      } catch (error) {
      message.error((error as any)?.message || "Failed to load your settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log('Input changed:', formData)
  };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Only send username, email, bio as expected by the API
      const { username, email, bio } = formData;
      const response = await fetch("/api/profile-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, bio }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      // Optionally update local state with returned user data
      if (data.user) {
        setFormData((prev) => ({ ...prev, ...data.user }));
      }
      message.success("Profile updated successfully!");
    } catch (error) {
      message.error((error as any)?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Profile Information Card */}
      <Card
        style={{ backgroundColor: "#3A0F2A" }}
        className="bg-opacity-30 backdrop-blur-sm border-white/10 shadow-2xl"
      >
        <form onSubmit={handleFormSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <User className="w-5 h-5 mr-3" />
              Profile Information
            </CardTitle>
            <CardDescription className="text-white/70">
              Update your account details here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-12">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/80">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-black/30 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white/80">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="bg-black/30 border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-black/30 border-white/20 text-white"
              />
            </div>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[linear-gradient(90deg,_#EE2C81_0%,_#FE0FD0_60%)] hover:opacity-90 text-white font-semibold"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
