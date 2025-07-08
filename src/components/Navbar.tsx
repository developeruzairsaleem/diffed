"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import NavButtons from "./NavButtons";
const games = [
  { name: "Valorant", href: "/valorant" },
  { name: "CS2", href: "/cs2" },
  { name: "Fortnite", href: "/fortnite" },
  { name: "League of Legends", href: "/league-of-legends" },
  { name: "Marvel Rivals", href: "/marvel-rivals" },
  { name: "Gamer Girl", href: "/gamer-girl" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  return (
    <nav className="w-full">
      <div className="flex justify-between max-w-8xl py-8 w-full px-6 mx-auto">
        <img src="/logo/logo.png" alt="Logo image" className="h-10 w-auto" />

        {/* Desktop Nav */}
        <div className="main_buttons hidden lg:flex">
          <ul className="main_nav uppercase mt-3 items-center text-md lg:text-lg flex gap-4 lg:gap-6 mr-5 lg:mr-10">
            <li className="cursor-pointer hover:text-gray-200 transition-all">
              Home
            </li>
            <DropdownMenu open={gamesOpen} onOpenChange={setGamesOpen}>
              <DropdownMenuTrigger asChild>
                <li className="relative flex items-center cursor-pointer hover:text-gray-200 transition-all select-none">
                  Games
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                      gamesOpen ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </li>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#5D1A45] shadow-lg rounded-md border border-gray-700 rounded-md mt-2 min-w-[180px] py-2 z-50">
                {games.map((game) => (
                  <DropdownMenuItem key={game.name} asChild>
                    <Link
                      href={game.href}
                      className="block px-10 py-4 overflow-hidden hover:outline-none text-white hover:bg-[#4E0D37] transition-colors w-full text-left"
                    >
                      {game.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <li className="cursor-pointer hover:text-gray-200 transition-all">
              Features
            </li>
            <li className="cursor-pointer hover:text-gray-200 transition-all">
              Customer Reviews
            </li>
            <li className="cursor-pointer hover:text-gray-200 transition-all">
              About
            </li>
          </ul>
          <NavButtons />
        </div>

        {/* Hamburger for mobile */}
        <button
          className="lg:hidden flex flex-col justify-center items-center z-50"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-7 h-1 bg-white rounded transition-all duration-300 mb-1 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-1 bg-white rounded transition-all duration-300 mb-1 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-7 h-1 bg-white rounded transition-all duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-40 flex flex-col items-center pt-32">
          <ul className="main_nav uppercase text-2xl flex flex-col gap-8 mb-8">
            <li onClick={() => setMobileOpen(false)}>Home</li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <li className="relative flex items-center cursor-pointer select-none">
                  Games
                  <svg
                    className="ml-1 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </li>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black border border-gray-700 rounded-md mt-2 min-w-[180px] py-2 z-50">
                {games.map((game) => (
                  <DropdownMenuItem key={game.name} asChild>
                    <Link
                      href={game.href}
                      className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors w-full text-left"
                      onClick={() => setMobileOpen(false)}
                    >
                      {game.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <li onClick={() => setMobileOpen(false)}>Features</li>
            <li onClick={() => setMobileOpen(false)}>Customer Reviews</li>
            <li onClick={() => setMobileOpen(false)}>About</li>
          </ul>
          <NavButtons />
        </div>
      )}
    </nav>
  );
}
