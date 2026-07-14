import React, { useState, useEffect } from "react";
import { Check, Heart, HelpCircle, Sparkles, Sliders, Calendar, ArrowRight, Share2, Info } from "lucide-react";
import { Vehicle, ColorOption, TrimOption, WheelOption } from "../types";

interface BespokeConfiguratorProps {
  vehicle: Vehicle;
  onSaveConfig: (config: {
    vehicleId: string;
    configuredColor: ColorOption;
    configuredTrim: TrimOption;
    configuredWheel: WheelOption;
    totalPrice: number;
  }) => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
  isSaved: boolean;
}

export default function BespokeConfigurator({
  vehicle,
  onSaveConfig,
  onBookTestDrive,
  isSaved,
}: BespokeConfiguratorProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>(vehicle.colors[0]);
  const [selectedTrim, setSelectedTrim] = useState<TrimOption>(vehicle.trims[0]);
  const [selectedWheel, setSelectedWheel] = useState<WheelOption>(vehicle.wheels[0]);
  const [activeTab, setActiveTab] = useState<"color" | "trim" | "wheels">("color");

  // Sync state if vehicle changes
  useEffect(() => {
    setSelectedColor(vehicle.colors[0]);
    setSelectedTrim(vehicle.trims[0]);
    setSelectedWheel(vehicle.wheels[0]);
  }, [vehicle]);

  const basePrice = vehicle.price;
  const totalPrice = basePrice + selectedColor.price + selectedTrim.price + selectedWheel.price;

  const handleSave = () => {
    onSaveConfig({
      vehicleId: vehicle.id,
      configuredColor: selectedColor,
      configuredTrim: selectedTrim,
      configuredWheel: selectedWheel,
      totalPrice,
    });
  };

  return (
    <div className="bg-[#f9f9f9] rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm max-w-6xl mx-auto">
      {/* Decorative Top header */}
      <div className="bg-stone-900 text-stone-100 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-emerald fill-brand-emerald" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-emerald">
              AUTOHAVEN BESPOKE STUDIO
            </span>
          </div>
          <h2 className="text-2xl font-display font-semibold tracking-tight mt-1">
            Sculpt Your {vehicle.name}
          </h2>
          <p className="text-stone-400 text-xs font-sans mt-0.5">
            Tailoring elite automotive engineering to your unique aesthetic persona.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-stone-400 block uppercase tracking-wider">Estimated Configured Price</span>
          <span className="text-3xl font-display font-bold text-white">
            ${totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Left Side: Cinematic Showcase */}
        <div className="lg:col-span-3 p-8 bg-white flex flex-col justify-between border-r border-stone-200/50">
          <div className="relative aspect-video flex items-center justify-center overflow-hidden rounded-xl bg-stone-50 border border-stone-100/80">
            {/* Color Overlay Tint Effect (Subtle background radial glow matching active color) */}
            <div
              className="absolute inset-0 opacity-10 transition-colors duration-1000 blur-3xl pointer-events-none"
              style={{ backgroundColor: selectedColor.hex }}
            />
            
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full h-full object-cover relative z-10 transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Launch Status Badge */}
            {!vehicle.isLaunced && (
              <span className="absolute top-4 left-4 z-20 bg-brand-emerald text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-widest uppercase">
                PRE-ORDER (LAUNCHING {vehicle.launchDate})
              </span>
            )}
          </div>

          {/* Active selections breakdown */}
          <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block uppercase font-medium tracking-wider mb-1">Exterior Hue</span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-stone-300"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="font-semibold text-stone-800">{selectedColor.name}</span>
              </div>
              {selectedColor.price > 0 && <span className="text-stone-400 text-[10px] block font-mono mt-0.5">+${selectedColor.price}</span>}
            </div>

            <div>
              <span className="text-stone-400 block uppercase font-medium tracking-wider mb-1">Interior Trim</span>
              <span className="font-semibold text-stone-800 line-clamp-1">{selectedTrim.name}</span>
              {selectedTrim.price > 0 && <span className="text-stone-400 text-[10px] block font-mono mt-0.5">+${selectedTrim.price}</span>}
            </div>

            <div>
              <span className="text-stone-400 block uppercase font-medium tracking-wider mb-1">Wheel Spec</span>
              <span className="font-semibold text-stone-800 line-clamp-1">{selectedWheel.name}</span>
              {selectedWheel.price > 0 && <span className="text-stone-400 text-[10px] block font-mono mt-0.5">+${selectedWheel.price}</span>}
            </div>
          </div>
        </div>

        {/* Right Side: Options Customizer */}
        <div className="lg:col-span-2 p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Nav Selection Tabs */}
            <div className="flex border-b border-stone-200 pb-2 gap-2">
              <button
                onClick={() => setActiveTab("color")}
                className={`flex-1 pb-2 text-xs font-bold tracking-widest uppercase text-center cursor-pointer transition-colors ${
                  activeTab === "color"
                    ? "text-stone-900 border-b-2 border-stone-950"
                    : "text-stone-400 hover:text-stone-600"
                }`}
                id="tab-config-color"
              >
                1. Exterior
              </button>
              <button
                onClick={() => setActiveTab("trim")}
                className={`flex-1 pb-2 text-xs font-bold tracking-widest uppercase text-center cursor-pointer transition-colors ${
                  activeTab === "trim"
                    ? "text-stone-900 border-b-2 border-stone-950"
                    : "text-stone-400 hover:text-stone-600"
                }`}
                id="tab-config-trim"
              >
                2. Cabin Trim
              </button>
              <button
                onClick={() => setActiveTab("wheels")}
                className={`flex-1 pb-2 text-xs font-bold tracking-widest uppercase text-center cursor-pointer transition-colors ${
                  activeTab === "wheels"
                    ? "text-stone-900 border-b-2 border-stone-950"
                    : "text-stone-400 hover:text-stone-600"
                }`}
                id="tab-config-wheels"
              >
                3. Wheels
              </button>
            </div>

            {/* TAB CONTENT: COLORS */}
            {activeTab === "color" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-stone-800 font-display">Paint Finishes</h4>
                  <p className="text-xs text-stone-400 mt-1 font-sans">
                    Earthy minimalism meets futuristic gloss. Formulated for longevity.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {vehicle.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedColor.name === color.name
                          ? "bg-white border-stone-900 shadow-sm"
                          : "bg-white/50 border-stone-200 hover:border-stone-300"
                      }`}
                      id={`btn-color-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-5 h-5 rounded-full border border-stone-300 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-semibold text-stone-800 line-clamp-1">{color.name}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-stone-400">
                        <span>{color.price === 0 ? "No Charge" : `+$${color.price}`}</span>
                        {selectedColor.name === color.name && <Check className="w-3.5 h-3.5 text-stone-950" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: TRIMS */}
            {activeTab === "trim" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-stone-800 font-display">Cabin Themes & Tech</h4>
                  <p className="text-xs text-stone-400 mt-1 font-sans">
                    Hand-crafted materials built around ergonomics and serene aesthetics.
                  </p>
                </div>

                <div className="space-y-3">
                  {vehicle.trims.map((trim) => (
                    <button
                      key={trim.name}
                      onClick={() => setSelectedTrim(trim)}
                      className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTrim.name === trim.name
                          ? "bg-white border-stone-900 shadow-sm"
                          : "bg-white/50 border-stone-200 hover:border-stone-300"
                      }`}
                      id={`btn-trim-${trim.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-bold text-stone-900">{trim.name}</span>
                          <p className="text-[11px] text-stone-500 mt-1 leading-relaxed pr-2">
                            {trim.description}
                          </p>
                        </div>
                        {selectedTrim.name === trim.name && <Check className="w-4 h-4 text-stone-950 shrink-0" />}
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-stone-100 text-[11px] font-mono font-semibold text-stone-600">
                        {trim.price === 0 ? "Standard Package" : `+$${trim.price.toLocaleString()}`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: WHEELS */}
            {activeTab === "wheels" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-stone-800 font-display">Alloy Configurations</h4>
                  <p className="text-xs text-stone-400 mt-1 font-sans">
                    Lightweight performance optimized for aerodynamic coefficient reduction.
                  </p>
                </div>

                <div className="space-y-3">
                  {vehicle.wheels.map((wheel) => (
                    <button
                      key={wheel.name}
                      onClick={() => setSelectedWheel(wheel)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                        selectedWheel.name === wheel.name
                          ? "bg-white border-stone-900 shadow-sm"
                          : "bg-white/50 border-stone-200 hover:border-stone-300"
                      }`}
                      id={`btn-wheel-${wheel.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div>
                        <span className="text-xs font-bold text-stone-900 block">{wheel.name}</span>
                        <span className="text-[11px] font-mono text-stone-400 mt-0.5 block">
                          {wheel.price === 0 ? "Standard Issue" : `+$${wheel.price.toLocaleString()}`}
                        </span>
                      </div>
                      {selectedWheel.name === wheel.name && <Check className="w-4 h-4 text-stone-950" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Configuration Actions Panel */}
          <div className="mt-8 pt-6 border-t border-stone-200 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`flex-1 py-3.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSaved
                    ? "bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed"
                    : "bg-white border-stone-300 text-stone-800 hover:bg-stone-50"
                }`}
                disabled={isSaved}
                id="btn-config-save"
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-brand-emerald text-brand-emerald" : ""}`} />
                {isSaved ? "Configuration Saved" : "Save Configuration"}
              </button>

              <button
                onClick={() => onBookTestDrive(vehicle)}
                className="flex-1 py-3.5 px-4 bg-brand-emerald hover:bg-[#004d45] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                id="btn-config-test-drive"
              >
                <Calendar className="w-4 h-4" />
                Book Showcase
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-stone-400 justify-center font-sans mt-2">
              <Info className="w-3.5 h-3.5 text-stone-400" />
              <span>Prices exclude local taxes, title, licensing, and dealer fees.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
