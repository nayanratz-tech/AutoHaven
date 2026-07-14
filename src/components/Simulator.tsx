import React, { useState, useEffect } from "react";
import { Sliders, Zap, Sun, ShieldCheck, Thermometer, Gauge, Wind, Battery, BatteryCharging, Info } from "lucide-react";
import { Vehicle } from "../types";

interface SimulatorProps {
  electricVehicles: Vehicle[];
}

export default function Simulator({ electricVehicles }: SimulatorProps) {
  const [selectedEv, setSelectedEv] = useState<Vehicle>(electricVehicles[0]);
  const [speed, setSpeed] = useState<number>(65); // mph
  const [temperature, setTemperature] = useState<number>(75); // °F
  const [climate, setClimate] = useState<"ac" | "heat" | "off">("ac");
  const [drivingStyle, setDrivingStyle] = useState<"eco" | "balanced" | "sport">("balanced");
  const [wheelSize, setWheelSize] = useState<number>(18);

  // Sync state if selectedEv changes or is invalid
  useEffect(() => {
    if (electricVehicles.length > 0 && !electricVehicles.find(v => v.id === selectedEv.id)) {
      setSelectedEv(electricVehicles[0]);
    }
  }, [electricVehicles]);

  // Base parameters
  const nominalRange = parseInt(selectedEv.specs.range) || 300;
  
  // Calculate dynamic range based on conditions
  const calculateDynamicRange = () => {
    let multiplier = 1.0;

    // 1. Speed factor: optimal speed is ~45-50mph. Range decreases heavily above 65mph
    if (speed < 50) {
      // low speed boost
      multiplier += (50 - speed) * 0.003;
    } else {
      // high speed drag penalty
      multiplier -= (speed - 50) * 0.007;
    }

    // 2. Temperature factor: batteries perform poorly in freezing weather (< 35°F) and extreme heat (> 95°F)
    if (temperature < 35) {
      multiplier -= 0.18; // cold penalty
    } else if (temperature < 55) {
      multiplier -= 0.06;
    } else if (temperature > 95) {
      multiplier -= 0.08; // extreme heat
    }

    // 3. Climate Control penalty
    if (climate === "ac") {
      multiplier -= 0.05;
    } else if (climate === "heat") {
      multiplier -= 0.09; // heating cabin takes more energy
    }

    // 4. Driving Style penalty
    if (drivingStyle === "sport") {
      multiplier -= 0.12;
    } else if (drivingStyle === "eco") {
      multiplier += 0.06;
    }

    // 5. Wheel Size penalty (larger wheels increase drag and weight)
    if (wheelSize > 19) {
      multiplier -= 0.04;
    }

    // Prevent extreme degradation
    const finalMultiplier = Math.max(0.45, Math.min(1.25, multiplier));
    return Math.round(nominalRange * finalMultiplier);
  };

  const currentRange = calculateDynamicRange();
  const efficiencyScore = Math.round((currentRange / nominalRange) * 100);

  // Charging Speed Simulation
  const batteryCap = selectedEv.id === "ioniq-6" ? 77.4 : selectedEv.id === "ev-6" ? 77.4 : selectedEv.id === "harrier-ev" ? 80.0 : 87.7;
  
  // Estimated charge times from 10% to 80% (70% replenishment)
  const homeLevel2TimeHours = ((batteryCap * 0.7) / 11.5).toFixed(1); // 11.5 kW Level 2 wallbox
  const DCFast350kWMinutes = selectedEv.id === "ioniq-6" || selectedEv.id === "ev-6" ? 18 : 28;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm max-w-5xl mx-auto overflow-hidden">
      {/* Top Section */}
      <div className="p-8 border-b border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-stone-50/50">
        <div>
          <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase block">
            INTELLIGENT ELECTRIC
          </span>
          <h2 className="text-2xl font-display font-semibold tracking-tight text-stone-900 mt-1">
            Range & Charger Simulator
          </h2>
          <p className="text-xs text-stone-500 font-sans mt-0.5">
            Visualize how real-world climates, highway speeds, and options dictate your driving perimeter.
          </p>
        </div>

        {/* EV Picker */}
        <div className="flex gap-2 bg-stone-100 p-1 rounded-xl w-full md:w-auto">
          {electricVehicles.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEv(ev)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedEv.id === ev.id
                  ? "bg-white text-stone-950 shadow-sm font-bold"
                  : "text-stone-500 hover:text-stone-700"
              }`}
              id={`btn-sim-ev-${ev.id}`}
            >
              {ev.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
        {/* Controls Column */}
        <div className="lg:col-span-3 p-8 space-y-8">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">
            Environment & Driving Controls
          </h3>

          {/* Cruise Speed Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-medium text-stone-500">
              <span className="flex items-center gap-1">
                <Gauge className="w-4 h-4 text-brand-emerald" /> Cruise Speed
              </span>
              <span className="text-stone-900 font-bold text-sm font-mono">{speed} MPH</span>
            </div>
            <input
              type="range"
              min="40"
              max="85"
              step="5"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-emerald focus:outline-none"
              id="slider-sim-speed"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>40 MPH</span>
              <span>65 MPH (Highway)</span>
              <span>85 MPH</span>
            </div>
          </div>

          {/* Outside Temperature Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-medium text-stone-500">
              <span className="flex items-center gap-1">
                <Thermometer className="w-4 h-4 text-brand-emerald" /> Outside Temperature
              </span>
              <span className="text-stone-900 font-bold text-sm font-mono">{temperature}°F</span>
            </div>
            <input
              type="range"
              min="-10"
              max="110"
              step="5"
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-emerald focus:outline-none"
              id="slider-sim-temp"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span className="text-blue-500 font-semibold">-10°F (Freeze)</span>
              <span>75°F (Ideal)</span>
              <span className="text-red-500 font-semibold">110°F (Desert)</span>
            </div>
          </div>

          {/* Selection Toggles (Climate & Driving Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Climate Toggle */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Climate Control
              </label>
              <div className="flex bg-stone-50 border border-stone-200 p-1 rounded-lg text-xs font-semibold">
                {(["ac", "heat", "off"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setClimate(mode)}
                    className={`flex-1 py-2 text-center rounded-md cursor-pointer transition-all ${
                      climate === mode
                        ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                    id={`btn-sim-climate-${mode}`}
                  >
                    {mode === "ac" ? "A/C Cool" : mode === "heat" ? "Heat" : "Off"}
                  </button>
                ))}
              </div>
            </div>

            {/* Driving Style Toggle */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Driving Style
              </label>
              <div className="flex bg-stone-50 border border-stone-200 p-1 rounded-lg text-xs font-semibold">
                {(["eco", "balanced", "sport"] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setDrivingStyle(style)}
                    className={`flex-1 py-2 text-center rounded-md cursor-pointer transition-all ${
                      drivingStyle === style
                        ? "bg-white text-stone-900 shadow-sm border border-stone-200/50"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                    id={`btn-sim-style-${style}`}
                  >
                    {style === "eco" ? "Eco" : style === "balanced" ? "Balanced" : "Sport"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wheels Toggle */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Wheel Aerodynamics
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setWheelSize(18)}
                className={`flex-1 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  wheelSize === 18
                    ? "bg-emerald-50/15 border-brand-emerald text-stone-900"
                    : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
                }`}
                id="btn-sim-wheels-18"
              >
                <div className="font-semibold text-xs text-stone-800">18" Aero Spoke Alloys</div>
                <div className="text-[10px] text-stone-400 mt-1">Maximum efficiency, lower drag coefficient.</div>
              </button>

              <button
                type="button"
                onClick={() => setWheelSize(21)}
                className={`flex-1 p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  wheelSize === 21
                    ? "bg-emerald-50/15 border-brand-emerald text-stone-900"
                    : "bg-white border-stone-200 text-stone-500 hover:border-stone-300"
                }`}
                id="btn-sim-wheels-21"
              >
                <div className="font-semibold text-xs text-stone-800">21" Performance Multi-Spoke</div>
                <div className="text-[10px] text-stone-400 mt-1">Stunning track presence, 4% drag premium.</div>
              </button>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 p-8 bg-stone-50/60 flex flex-col justify-between">
          <div className="space-y-8">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2">
              Range Projection
            </h3>

            {/* Simulated Range Meter */}
            <div className="text-center p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm">
              <div className="flex justify-center mb-3">
                <Battery className="w-10 h-10 text-brand-emerald stroke-[1.5]" />
              </div>
              <span className="text-xs text-stone-400 uppercase tracking-wider block">Simulated Driving Range</span>
              <span className="text-6xl font-display font-bold text-stone-900 mt-1 block">
                {currentRange}
                <span className="text-2xl font-sans text-stone-400 font-normal ml-1">MI</span>
              </span>
              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400">Battery Efficiency</span>
                <span className={`font-mono font-bold ${efficiencyScore >= 95 ? "text-emerald-600" : efficiencyScore >= 75 ? "text-stone-700" : "text-amber-600"}`}>
                  {efficiencyScore}% of Nominal ({nominalRange} mi)
                </span>
              </div>
            </div>

            {/* Recharge Estimation Details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Recharging Period (10% to 80%)
              </h4>

              {/* DC Fast Charger */}
              <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-center gap-4">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <Zap className="w-5 h-5 fill-amber-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">350kW DC Fast Charge</span>
                  <span className="text-sm font-semibold text-stone-900 mt-0.5 block">{DCFast350kWMinutes} Minutes</span>
                  <p className="text-[10px] text-stone-400">Ideal highway refreshment period.</p>
                </div>
              </div>

              {/* AC Home Charger */}
              <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <BatteryCharging className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">11.5kW AC Home Wallbox</span>
                  <span className="text-sm font-semibold text-stone-900 mt-0.5 block">{homeLevel2TimeHours} Hours</span>
                  <p className="text-[10px] text-stone-400">Convenient overnight replenishment.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-white/70 border border-stone-200 rounded-lg text-[10px] text-stone-500 font-sans mt-8">
            <Info className="w-4 h-4 text-stone-400 shrink-0" />
            <span>Range calculations are simulated based on aerodynamic friction calculations and thermodynamic battery physics coefficients.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
