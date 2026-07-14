import React from "react";
import { ArrowLeft, Calendar, Sliders, Shield, Zap, Sparkles, AlertCircle, Fuel, Milestone, Gauge } from "lucide-react";
import { Vehicle } from "../types";

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
  onBookTestDrive: (vehicle: Vehicle) => void;
  onConfigure: (vehicle: Vehicle) => void;
}

export default function VehicleDetail({ vehicle, onBack, onBookTestDrive, onConfigure }: VehicleDetailProps) {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8 animate-fade-in pb-24">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors font-semibold text-xs uppercase tracking-wider mb-8 cursor-pointer focus:outline-none"
        id="btn-back-to-inventory"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Gallery
      </button>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Interactive Media Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-stone-200/60 bg-white group shadow-sm">
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            {/* Soft Ambient Shadow Base */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Quick Specs Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white border border-stone-200/50 p-4 rounded-xl text-center shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">0-60 MPH</span>
              <span className="text-xl font-display font-bold text-stone-900 mt-1 block font-mono">
                {vehicle.specs.acceleration}
              </span>
            </div>

            <div className="bg-white border border-stone-200/50 p-4 rounded-xl text-center shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Top Speed</span>
              <span className="text-xl font-display font-bold text-stone-900 mt-1 block font-mono">
                {vehicle.specs.topSpeed}
              </span>
            </div>

            <div className="bg-white border border-stone-200/50 p-4 rounded-xl text-center shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Power output</span>
              <span className="text-xl font-display font-bold text-stone-900 mt-1 block font-mono">
                {vehicle.specs.power}
              </span>
            </div>

            <div className="bg-white border border-stone-200/50 p-4 rounded-xl text-center shadow-sm">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Driving Range</span>
              <span className="text-xl font-display font-bold text-stone-900 mt-1 block font-mono">
                {vehicle.specs.range}
              </span>
            </div>

            <div className="bg-white border border-stone-200/50 p-4 rounded-xl text-center shadow-sm col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Drivetrain</span>
              <span className="text-xs font-display font-bold text-stone-900 mt-1.5 block leading-tight">
                {vehicle.specs.drivetrain}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Editorial & Pricing Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-emerald tracking-widest uppercase">
                  {vehicle.category}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                <span className="text-xs text-stone-400 font-medium">AutoHaven Collection</span>
              </div>
              <h1 className="text-4xl font-display font-bold text-stone-900 tracking-tight mt-1.5">
                {vehicle.name}
              </h1>
              <p className="text-stone-500 text-sm font-sans italic mt-1">{vehicle.tagline}</p>
            </div>

            {/* Price section */}
            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200/60 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Guaranteed MSRP</span>
                <span className="text-3xl font-display font-bold text-stone-900 mt-0.5 block">
                  ₹{(vehicle.price / 100000).toFixed(2)} Lakh
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-brand-emerald bg-emerald-50 px-2.5 py-1 rounded uppercase tracking-wider block font-semibold">
                  {vehicle.isLaunched ? "Immediate Order" : "Pre-Order Open"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                The Silhouette Narrative
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed font-sans">
                {vehicle.description}
              </p>
            </div>

            {/* Core Architectural Details */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5">
                Detailed Spec Manifest
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                {vehicle.additionalSpecs.map((spec) => (
                  <div key={spec.label} className="flex justify-between items-center border-b border-stone-100/80 pb-2">
                    <span className="text-stone-400">{spec.label}</span>
                    <span className="font-semibold text-stone-800 font-mono">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3.5 pt-6 border-t border-stone-200/60">
            <div className="flex gap-4">
              {/* Configure CTA */}
              <button
                onClick={() => onConfigure(vehicle)}
                className="flex-1 py-4 bg-stone-950 hover:bg-stone-900 text-white font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                id={`btn-detail-configure-${vehicle.id}`}
              >
                <Sliders className="w-4 h-4" /> Configure Bespoke
              </button>

              {/* Book Test Drive CTA */}
              <button
                onClick={() => onBookTestDrive(vehicle)}
                className="flex-1 py-4 bg-brand-emerald hover:bg-[#004d45] text-white font-semibold text-xs tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                id={`btn-detail-book-${vehicle.id}`}
              >
                <Calendar className="w-4 h-4" /> Book Showcase
              </button>
            </div>

            {/* Safety Assurance Badge */}
            <div className="flex items-center gap-2.5 p-3 bg-stone-50 rounded-lg text-[11px] text-stone-500 border border-stone-200/50">
              <Shield className="w-4 h-4 text-brand-emerald shrink-0" />
              <span>Includes 200-Point Concierge Inspection and 3-Year Complimentary Charging or Fueling Concierge.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
