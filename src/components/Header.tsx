import React from "react";
import { Search, User, Compass, HelpCircle } from "lucide-react";
import { IMAGES } from "../data";

interface HeaderProps {
  onNavigate: (tab: "home" | "inventory" | "experience" | "account") => void;
  activeTab: string;
}

export default function Header({ onNavigate, activeTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50 px-6 py-3 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          id="btn-logo-nav"
        >
          <img
            src={IMAGES.logo}
            alt="AutoHaven Logo"
            className="h-24 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Desktop Primary Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <button
            onClick={() => onNavigate("home")}
            className={`cursor-pointer transition-all ${
              activeTab === "home"
                ? "text-brand-emerald border-b-2 border-brand-emerald pb-1"
                : "text-stone-600 hover:text-stone-900 pb-1"
            }`}
            id="nav-home"
          >
            HOME
          </button>
          <button
            onClick={() => onNavigate("inventory")}
            className={`cursor-pointer transition-all ${
              activeTab === "inventory"
                ? "text-brand-emerald border-b-2 border-brand-emerald pb-1"
                : "text-stone-600 hover:text-stone-900 pb-1"
            }`}
            id="nav-inventory"
          >
            INVENTORY
          </button>
          <button
            onClick={() => onNavigate("experience")}
            className={`cursor-pointer transition-all ${
              activeTab === "experience"
                ? "text-brand-emerald border-b-2 border-brand-emerald pb-1"
                : "text-stone-600 hover:text-stone-900 pb-1"
            }`}
            id="nav-experience"
          >
            BESPOKE LAB
          </button>
          <button
            onClick={() => onNavigate("account")}
            className={`cursor-pointer transition-all ${
              activeTab === "account"
                ? "text-brand-emerald border-b-2 border-brand-emerald pb-1"
                : "text-stone-600 hover:text-stone-900 pb-1"
            }`}
            id="nav-account"
          >
            RESERVATIONS
          </button>
        </nav>

        {/* Desktop Right Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("inventory")}
            className="p-2 text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            id="btn-search-header"
            aria-label="Search Collection"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate("account")}
            className={`p-2 rounded-full transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "account"
                ? "bg-brand-emerald/10 text-brand-emerald"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
            id="btn-user-header"
            aria-label="Account Details"
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase">Member</span>
          </button>
        </div>
      </div>
    </header>
  );
}
