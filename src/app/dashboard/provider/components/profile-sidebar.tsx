// "use client"

// import { useState } from "react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Mail, Gamepad2, MapPin, Calendar, Camera, Crown, Edit } from "lucide-react" // Import Edit icon
// import { ProfileEditModal } from "./profile-edit-modal" // Import the new modal component

// interface ProfileData {
//   gamertag: string
//   realName: string
//   email: string
//   discord: string
//   timezone: string
//   experience: string
//   bio: string
//   specializations: string[]
//   ranks: { game: string; rank: string }[]
// }

// export function ProfileSidebar() {
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [profileData, setProfileData] = useState<ProfileData>({
//     gamertag: "ProGamer_Coach",
//     realName: "Alex Johnson",
//     email: "coach@progamer.gg",
//     discord: "ProGamer#1337",
//     timezone: "EST (UTC-5)",
//     experience: "5+ years",
//     bio: "Elite gaming coach specializing in FPS and MOBA games. Helped 200+ players reach their dream ranks with proven strategies and personalized training.",
//     specializations: ["Valorant", "League of Legends", "CS2", "Overwatch 2"],
//     ranks: [
//       { game: "Valorant", rank: "Radiant" },
//       { game: "League of Legends", rank: "Challenger" },
//       { game: "CS2", rank: "Global Elite" },
//     ],
//   })

//   const handleSaveProfile = async (newData: ProfileData) => {
//     // Simulate API call
//     console.log("Saving profile data:", newData)
//     await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
//     setProfileData(newData) // Update local state after successful "API" call
//     console.log("Profile updated successfully!")
//   }

//   // w-full h-full bg-black/20 backdrop-blur-sm border-none shadow-2xl

//   return (
//     <div className="flex h-full w-full flex-col bg-black/30 backdrop-blur-sm text-white p-6 border-r border-white/10">
//       <div className="text-center">
//         <div className="relative inline-block">
//           <Avatar className="w-24 h-24 mx-auto">
//             <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
//             <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">PG</AvatarFallback>
//           </Avatar>
//           <Button
//             size="sm"
//             className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-pink-500 to-purple-600"
//           >
//             <Camera className="w-4 h-4" />
//           </Button>
//         </div>
//         <h3 className="mt-4 text-xl font-semibold text-white">{profileData.gamertag}</h3>
//         <p className="text-white/70">Elite Gaming Coach</p>
//         <div className="flex items-center justify-center mt-2">
//           <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-pink-600 border-0">
//             <Crown className="w-3 h-3 mr-1" />
//             Grandmaster
//           </Badge>
//         </div>
//       </div>

//       <Button
//         variant="outline"
//         className="mt-6 w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
//         onClick={() => setIsModalOpen(true)}
//       >
//         <Edit className="w-4 h-4 mr-2" />
//         Edit Profile
//       </Button>

//       <Separator className="my-6 bg-white/10" />

//       <div className="space-y-4">
//         <div className="flex items-center space-x-3">
//           <Mail className="w-4 h-4 text-white/60" />
//           <span className="text-sm text-white/80">{profileData.email}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Gamepad2 className="w-4 h-4 text-white/60" />
//           <span className="text-sm text-white/80">Discord: {profileData.discord}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <MapPin className="w-4 h-4 text-white/60" />
//           <span className="text-sm text-white/80">{profileData.timezone}</span>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Calendar className="w-4 h-4 text-white/60" />
//           <span className="text-sm text-white/80">Coaching since {profileData.experience.split(" ")[0]}</span>
//         </div>
//       </div>

//       <Separator className="my-6 bg-white/10" />

//       <div className="space-y-3">
//         <h4 className="font-medium text-white">Specializations</h4>
//         <div className="flex flex-wrap gap-2">
//           {profileData.specializations.map((spec) => (
//             <Badge key={spec} variant="outline" className="border-white/20 text-white/80 bg-white/5">
//               {spec}
//             </Badge>
//           ))}
//         </div>
//       </div>

//       <ProfileEditModal
//         isOpen={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         profileData={profileData}
//         onSave={handleSaveProfile}
//       />
//     </div>
//   )
// }

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Gamepad2,
  MapPin,
  Calendar,
  Camera,
  Crown,
  Edit,
} from "lucide-react";
import { ProfileEditModal } from "./profile-edit-modal";

// dummy json data - To be replaced by api
import coachData from "../../../../../coach_booster.json";
import { useState } from "react";
const coach = coachData[0];

interface ProfileData {
  gamertag: string;
  realName: string;
  email: string;
  discord: string;
  timezone: string;
  experience: string;
  bio: string;
  specializations: string[];
  ranks: { game: string; rank: string }[];
}

export function ProfileSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    gamertag: "ProGamer_Coach",
    realName: "Alex Johnson",
    email: "coach@progamer.gg",
    discord: "ProGamer#1337",
    timezone: "EST (UTC-5)",
    experience: "5+ years",
    bio: "Elite gaming coach specializing in FPS and MOBA games. Helped 200+ players reach their dream ranks with proven strategies and personalized training.",
    specializations: ["Valorant", "League of Legends", "CS2", "Overwatch 2"],
    ranks: [
      { game: "Valorant", rank: "Radiant" },
      { game: "League of Legends", rank: "Challenger" },
      { game: "CS2", rank: "Global Elite" },
    ],
  });

  const handleSaveProfile = async (newData: ProfileData) => {
    // Simulate API call
    console.log("Saving profile data:", newData);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    setProfileData(newData); // Update local state after successful "API" call
    console.log("Profile updated successfully!");
  };

  return (
    <Card className="w-full h-full bg-black/20 backdrop-blur-sm border-none shadow-2xl">
      <CardContent className="p-6 border-none">
        <div className="text-center">
          <div className="relative inline-block">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={coach.image} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                PG
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gradient-to-r from-pink-500 to-purple-600"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <h3 className="mt-4 text-xl font-semibold text-white">Alex Dev</h3>
          <p className="text-white/70">Elite Gaming Coach</p>
          <div className="flex items-center justify-center mt-2">
            <Badge
              variant="default"
              className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 h-8 w-36"
            >
              <Crown className="w-3 h-3 mr-1" />
              Grandmaster
            </Badge>
          </div>
        </div>

        <Separator className="my-3 bg-white/10" />

        <Button
          variant="outline"
          className="mb-6 w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
          onClick={() => setIsModalOpen(true)}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">{coach.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Gamepad2 className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">
              Discord: ProGamer#1337
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">NA East Server</span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/80">Coaching since 2021</span>
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div className="space-y-3">
          <h4 className="font-medium text-white">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {coach.specialties.map((speciality, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-white/20 text-white/80 bg-white/5"
              >
                {speciality}
              </Badge>
            ))}
          </div>
        </div>

        <ProfileEditModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          profileData={profileData}
          onSave={handleSaveProfile}
        />
      </CardContent>
    </Card>
  );
}
