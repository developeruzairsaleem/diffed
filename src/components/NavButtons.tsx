"use client";

import { useState } from "react";
import { orbitron } from "@/fonts/fonts";
export default function Component() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className={`flex gap-8 items-center ${orbitron.className} font-thin`}>
      {/* LOGIN Button */}
      <button
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredButton("login")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <div
          className={`
             
              bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500
              transform -skew-x-12
               
              transition-all duration-300 ease-out
              ${hoveredButton === "login" ? "scale-105 brightness-110" : ""}
              p-0.5
            `}
        >
          <div
            className={`
                w-full h-full 
                bg-[#591741]
                 px-10 py-3
                transition-all duration-300 ease-out
                ${hoveredButton === "login" ? "bg-opacity-80" : ""}
              `}
          >
            <div className="flex items-center justify-center h-full transform skew-x-12">
              <span className="text-white text-lg font-bold tracking-wider">
                LOGIN
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* REGISTER Button */}
      <button
        className="relative group cursor-pointer"
        onMouseEnter={() => setHoveredButton("register")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <div
          className={`
            
              bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
              transform -skew-x-12
              px-5 py-3
              transition-all duration-300 ease-out
              ${hoveredButton === "register" ? "scale-105 brightness-110" : ""}
            `}
        >
          <div className="flex items-center justify-center h-full p-0.5 transform skew-x-12">
            <span className="text-white text-lg font-bold tracking-wider">
              REGISTER
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
