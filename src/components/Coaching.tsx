"use client";
import { useState } from "react";
import { orbitron } from "@/fonts/fonts";
export default function Coaching() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  return (
    <div className=" flex justify-center relative -my-12">
      <button
        className={` ${orbitron.className} relative cursor-pointer group`}
        onMouseEnter={() => setHoveredButton("coaching")}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <div
          className={`
          
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
            transform -skew-x-12
            border border-white
            
            px-7 py-4
            transition-all duration-300 ease-out
            ${hoveredButton === "coaching" ? "scale-105" : ""}
          `}
          style={{
            boxShadow:
              "0 0 20px 12px rgba(220, 38, 38, 0.9), 0 0 40px 24px rgba(220, 38, 38, 0.5)",
          }}
        >
          <div className="flex items-center justify-center h-full p-0.5 transform skew-x-12">
            <span className="text-white text-lg font-bold tracking-wider">
              JOIN COACHING - PLAY
              <div>WITH TEAMMATES</div>
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
