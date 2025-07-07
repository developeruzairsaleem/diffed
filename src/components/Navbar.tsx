"use client";
import { useState } from "react";
import NavButtons from "./NavButtons";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="w-full">
      <div className="flex justify-between max-w-8xl py-8 w-full px-6 mx-auto">
        <img src="/logo/logo.png" alt="Logo image" className="h-10 w-auto" />

        {/* Desktop Nav */}
        <div className="main_buttons hidden lg:flex">
          <ul className="main_nav uppercase mt-3 text-md lg:text-lg flex gap-4 lg:gap-6 mr-5 lg:mr-10">
            <li>Home</li>
            <li>Games</li>
            <li>Features</li>
            <li>Customer Reviews</li>
            <li>About</li>
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
            <li onClick={() => setMobileOpen(false)}>Games</li>
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
