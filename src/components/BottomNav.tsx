import React from "react";
import { Home, Car, Sparkles, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "inventory" | "experience" | "account";
  onTabChange: (tab: "home" | "inventory" | "experience" | "account") => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "inventory" as const, label: "Inventory", icon: Car },
    { id: "experience" as const, label: "Experience", icon: Sparkles },
    { id: "account" as const, label: "Account", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg px-4 py-2 pb-safe">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? "text-brand-emerald scale-105"
                  : "text-stone-400 hover:text-stone-600"
              }`}
              id={`bottom-nav-${tab.id}`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${isActive ? "text-stone-900 font-bold" : "text-stone-500"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
