import React, { useState } from "react";
import { X, Calendar, MapPin, Clock, ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake } from "lucide-react";
import { Vehicle } from "../types";
import { TEST_LOCATIONS } from "../data";

interface BookingModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onSuccess: (booking: {
    vehicleId: string;
    vehicleName: string;
    vehicleImage: string;
    date: string;
    time: string;
    location: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    isBespokeConcierge: boolean;
  }) => void;
  allVehicles: Vehicle[];
}

export default function BookingModal({ vehicle, onClose, onSuccess, allVehicles }: BookingModalProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicle);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState(TEST_LOCATIONS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isBespoke, setIsBespoke] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Tomorrow as minimum date
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle || !date || !time || !name || !email || !phone) return;

    onSuccess({
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      vehicleImage: selectedVehicle.imageUrl,
      date,
      time,
      location: isBespoke ? "Concierge Home Delivery" : location,
      userName: name,
      userEmail: email,
      userPhone: phone,
      isBespokeConcierge: isBespoke,
    });

    setFormSubmitted(true);
  };

  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "01:30 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
  ];

  if (formSubmitted && selectedVehicle) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white max-w-lg w-full rounded-2xl p-8 text-center border border-stone-200 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-emerald to-stone-900" />
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-emerald-50 text-brand-emerald rounded-full">
              <CheckCircle2 className="w-16 h-16 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-stone-900 mb-3">
            Reservation Confirmed
          </h2>
          <p className="text-stone-500 mb-6 font-sans text-sm max-w-sm mx-auto">
            Your private cinematic showcase for the <span className="font-semibold text-stone-900">{selectedVehicle.name}</span> has been locked.
          </p>

          <div className="bg-stone-50 rounded-xl p-5 mb-8 text-left border border-stone-200/60 space-y-3 text-sm">
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-400">Driver</span>
              <span className="font-medium text-stone-800">{name}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-400">Schedule</span>
              <span className="font-medium text-stone-800">{date} at {time}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/60 pb-2">
              <span className="text-stone-400">Location</span>
              <span className="font-medium text-stone-800">{isBespoke ? "Home Concierge Service" : location}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-stone-400">Assigned Lounge</span>
              <span className="font-medium text-brand-emerald">AutoHaven Private Fleet</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-left p-3 bg-emerald-50/50 rounded-lg text-xs text-stone-600 border border-brand-emerald/15">
              <ShieldCheck className="w-5 h-5 text-brand-emerald shrink-0" />
              <span>A representative will contact you at <strong>{phone}</strong> to verify credentials. Please carry a valid Driver's License.</span>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 bg-stone-950 hover:bg-stone-900 text-white font-semibold text-sm rounded-lg tracking-wider uppercase transition-colors cursor-pointer"
              id="btn-close-success"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#f9f9f9] max-w-2xl w-full rounded-2xl border border-stone-200 shadow-2xl relative my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase">
              EXPERIENCE LUXURY
            </span>
            <h2 className="text-2xl font-display font-bold text-stone-900 mt-0.5">
              Schedule Private Drive
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            id="btn-close-booking-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Select Vehicle */}
          <div>
            <label className="block text-xs font-bold tracking-wider text-stone-500 uppercase mb-2">
              Select Vehicle
            </label>
            <select
              value={selectedVehicle?.id || ""}
              onChange={(e) => {
                const found = allVehicles.find((v) => v.id === e.target.value);
                setSelectedVehicle(found || null);
              }}
              className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
              required
              id="select-vehicle-booking"
            >
              <option value="" disabled>Choose an AutoHaven model...</option>
              {allVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.name} ({v.category === "Electric Vehicles" ? "EV" : "Turbo"})
                </option>
              ))}
            </select>
          </div>

          {selectedVehicle && (
            <div className="bg-white border border-stone-200/80 rounded-xl p-4 flex gap-4 items-center">
              <img
                src={selectedVehicle.imageUrl}
                alt={selectedVehicle.name}
                className="w-24 h-16 object-cover rounded-md"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-display font-semibold text-stone-900 text-sm">{selectedVehicle.brand} {selectedVehicle.name}</h4>
                <p className="text-xs text-stone-500 mt-0.5 italic">{selectedVehicle.tagline}</p>
                <p className="text-xs font-bold text-brand-emerald mt-1">Starting at ${selectedVehicle.price.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Toggle Bespoke Concierge Option */}
          <div
            onClick={() => setIsBespoke(!isBespoke)}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              isBespoke
                ? "bg-emerald-50/40 border-brand-emerald/40"
                : "bg-white border-stone-200 hover:border-stone-300"
            }`}
            id="toggle-bespoke-delivery"
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isBespoke}
                onChange={() => {}}
                className="mt-1 h-4 w-4 rounded border-stone-300 text-brand-emerald focus:ring-brand-emerald cursor-pointer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-stone-900 text-xs tracking-wider uppercase flex items-center gap-1">
                    <HeartHandshake className="w-4 h-4 text-brand-emerald" /> Bespoke Concierge Service
                  </span>
                  <span className="bg-brand-emerald text-white text-[9px] font-bold px-1.5 py-0.5 rounded">PREMIUM</span>
                </div>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Avoid visiting the gallery. We will deliver your configured test vehicle directly to your residence, complete with a private concierge advisor to answer questions.
                </p>
              </div>
            </div>
          </div>

          {/* Location & Schedule Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Showroom location selection if not Bespoke */}
            {!isBespoke && (
              <div className="md:col-span-2">
                <label className="block text-xs font-bold tracking-wider text-stone-500 uppercase mb-2">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-brand-emerald" /> Select Showroom Location
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TEST_LOCATIONS.map((loc) => (
                    <div
                      key={loc}
                      onClick={() => setLocation(loc)}
                      className={`border p-3.5 rounded-lg text-xs cursor-pointer transition-all ${
                        location === loc
                          ? "border-stone-900 bg-white font-semibold text-stone-900"
                          : "border-stone-200 bg-white text-stone-500 hover:border-stone-300"
                      }`}
                      id={`loc-option-${loc.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-wider text-stone-500 uppercase mb-2">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-brand-emerald" /> Pick Date
              </label>
              <input
                type="date"
                min={tomorrowStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 text-sm focus:outline-none focus:border-brand-emerald"
                required
                id="input-booking-date"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider text-stone-500 uppercase mb-2">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-brand-emerald" /> Select Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 text-sm focus:outline-none focus:border-brand-emerald"
                required
                id="select-booking-time"
              >
                <option value="" disabled>Select Time...</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white border border-stone-200 p-5 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-widest border-b border-stone-100 pb-2">
              Driver Identification
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nayan Ratz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:bg-white focus:border-brand-emerald"
                  required
                  id="input-driver-name"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +1 555-0199"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:bg-white focus:border-brand-emerald"
                  required
                  id="input-driver-phone"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. nayanratz@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-800 text-sm focus:outline-none focus:bg-white focus:border-brand-emerald"
                  required
                  id="input-driver-email"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="p-6 border-t border-stone-200 bg-white flex items-center justify-between">
          <span className="text-xs text-stone-400 font-sans">
            Secure 256-bit credentials protection.
          </span>
          <button
            onClick={handleSubmit}
            disabled={!selectedVehicle || !date || !time || !name || !email || !phone}
            className={`px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors ${
              (!selectedVehicle || !date || !time || !name || !email || !phone)
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : "bg-brand-emerald hover:bg-[#004d45] text-white"
            }`}
            id="btn-confirm-booking"
          >
            Confirm Reservation <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
