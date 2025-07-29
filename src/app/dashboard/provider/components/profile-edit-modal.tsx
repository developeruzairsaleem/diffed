"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, XCircle } from "lucide-react"

interface ProfileData {
  gamertag: string
  realName: string
  email: string
  discord: string
  timezone: string
  experience: string
  bio: string
  specializations: string[]
  ranks: { game: string; rank: string }[]
}

interface ProfileEditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  profileData: ProfileData
  onSave: (newData: ProfileData) => Promise<void>
}

export function ProfileEditModal({ isOpen, onOpenChange, profileData, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState<ProfileData>(profileData)
  const [newSpecialization, setNewSpecialization] = useState("")
  const [newRankGame, setNewRankGame] = useState("")
  const [newRankValue, setNewRankValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Update form data when profileData prop changes (e.g., when modal opens with new data)
  useEffect(() => {
    setFormData(profileData)
  }, [profileData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }))
      setNewSpecialization("")
    }
  }

  const handleRemoveSpecialization = (specToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((spec) => spec !== specToRemove),
    }))
  }

  const handleAddRank = () => {
    if (newRankGame.trim() && newRankValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        ranks: [...prev.ranks, { game: newRankGame.trim(), rank: newRankValue.trim() }],
      }))
      setNewRankGame("")
      setNewRankValue("")
    }
  }

  const handleRemoveRank = (rankToRemove: { game: string; rank: string }) => {
    setFormData((prev) => ({
      ...prev,
      ranks: prev.ranks.filter((rank) => !(rank.game === rankToRemove.game && rank.rank === rankToRemove.rank)),
    }))
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    await onSave(formData)
    setIsSaving(false)
    onOpenChange(false) // Close modal after saving
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-black/30 backdrop-blur-sm border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-white/70">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 pr-4 overflow-y-auto max-h-[70vh] ">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gamertag" className="text-right text-white/80">
              Gamertag
            </Label>
            <Input
              id="gamertag"
              value={formData.gamertag}
              onChange={handleChange}
              className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="realName" className="text-right text-white/80">
              Real Name
            </Label>
            <Input
              id="realName"
              value={formData.realName}
              onChange={handleChange}
              className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-white/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discord" className="text-right text-white/80">
              Discord
            </Label>
            <Input
              id="discord"
              value={formData.discord}
              onChange={handleChange}
              className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timezone" className="text-right text-white/80">
              Timezone
            </Label>
            <Input
              id="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="experience" className="text-right text-white/80">
              Experience
            </Label>
            <Input
              id="experience"
              value={formData.experience}
              onChange={handleChange}
              className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="bio" className="text-right text-white/80 pt-2">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              className="col-span-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
            />
          </div>

          {/* Specializations */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-white/80 pt-2">Specializations</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.specializations.map((spec) => (
                  <Badge key={spec} variant="outline" className="border-white/20 text-white/80 bg-white/5">
                    {spec}
                    <XCircle
                      className="ml-1 h-3 w-3 cursor-pointer text-white/60 hover:text-white"
                      onClick={() => handleRemoveSpecialization(spec)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new specialization"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleAddSpecialization}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Ranks */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right text-white/80 pt-2">Ranks</Label>
            <div className="col-span-3 space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.ranks.map((rank, index) => (
                  <Badge
                    key={`${rank.game}-${rank.rank}-${index}`}
                    variant="outline"
                    className="border-white/20 text-white/80 bg-white/5"
                  >
                    {rank.game}: {rank.rank}
                    <XCircle
                      className="ml-1 h-3 w-3 cursor-pointer text-white/60 hover:text-white"
                      onClick={() => handleRemoveRank(rank)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Game"
                  value={newRankGame}
                  onChange={(e) => setNewRankGame(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Input
                  placeholder="Rank"
                  value={newRankValue}
                  onChange={(e) => setNewRankValue(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={handleAddRank}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
