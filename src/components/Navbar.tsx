"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NavButtons from "./NavButtons";
import { X } from "lucide-react";
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
  const [mobileGamesOpen, setMobileGamesOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);
  return (
    <nav className="w-full sticky top-0 z-50 bg-[#581742]/90 backdrop-blur">
      <div className=" flex justify-between max-w-8xl py-8 w-full px-6 mx-auto">
        <Link href="/">
          <img src="/logo/logo.png" alt="Logo image" className="h-14 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="main_buttons hidden lg:flex">
          <ul className="main_nav uppercase mt-3 items-center text-md lg:text-lg flex gap-4 lg:gap-6 mr-5 lg:mr-10">
            <Link
              href={"/"}
              className="cursor-pointer hover:text-gray-200 transition-all"
            >
              Home
            </Link>
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
              <Link href="#why-us">Features</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-200 transition-all">
              <Link href="#customer-reviews">Customer Reviews</Link>
            </li>
            <li className="cursor-pointer hover:text-gray-200 transition-all">
              <Link href="/about">About</Link>
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

      {/* Mobile Drawer via Portal to ensure proper fixed positioning */}
      {isMounted && mobileOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed top-0 right-0 bottom-0 lg:hidden z-[70] w-full max-w-[400px] bg-[#581742]/95 backdrop-blur-md pl-10 pr-6  pb-10 flex flex-col overflow-y-auto h-screen">
              <div className="ml-auto mt-12" onClick={() => setMobileOpen(false)}>
               <X />
              </div>
              <ul className="pt-28 uppercase text-xl sm:text-2xl flex flex-col gap-6 ">
                <li>
                  <Link
                    href="/"
                    className="block w-full py-2 text-white hover:text-gray-200 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    className="w-full flex items-center gap-6 py-2 text-white hover:text-gray-200 transition-colors"
                    onClick={() => setMobileGamesOpen((v) => !v)}
                    aria-expanded={mobileGamesOpen}
                    aria-controls="mobile-games-list"
                  >
                    <span>GAMES</span>
                    <svg
                      className={`ml-2 w-5 h-5 transition-transform ${
                        mobileGamesOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileGamesOpen && (
                    <ul id="mobile-games-list" className="mt-2 pl-4 flex flex-col gap-3">
                      {games.map((game) => (
                        <li key={game.name}>
                          <Link
                            href={game.href}
                            className="block w-full py-2 text-white/90 hover:text-white transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {game.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li>
                  <Link
                    href="#why-us"
                    className="block w-full py-2 text-white hover:text-gray-200 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#customer-reviews"
                    className="block w-full py-2 text-white hover:text-gray-200 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Customer Reviews
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="block w-full py-2 text-white hover:text-gray-200 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    About
                  </Link>
                </li>
              </ul>
              <div className="mt-8">
                <NavButtons />
              </div>
            </div>
          </>,
          document.body
        )}
    </nav>
  );
}
