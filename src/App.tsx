import React, { useState, useEffect } from "react";
import {
  Compass,
  ArrowRight,
  Shield,
  Briefcase,
  Users,
  Award,
  Search,
  Filter,
  Sliders,
  Calendar,
  Sparkles,
  ChevronDown,
  Trash2,
  Heart,
  ExternalLink,
  Zap,
  CheckCircle,
  HelpCircle,
  Smartphone
} from "lucide-react";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import BookingModal from "./components/BookingModal";
import BespokeConfigurator from "./components/BespokeConfigurator";
import Simulator from "./components/Simulator";
import VehicleDetail from "./components/VehicleDetail";

import { VEHICLES, IMAGES, TEST_LOCATIONS } from "./data";
import { Vehicle, TestDriveBooking, SavedVehicle, ColorOption, TrimOption, WheelOption } from "./types";

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<"home" | "inventory" | "experience" | "account">("home");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  
  // Custom Studio View (Inside Experience Tab)
  const [studioView, setStudioView] = useState<"configurator" | "simulator">("configurator");
  const [configuratorVehicleId, setConfiguratorVehicleId] = useState<string>("ioniq-6");

  // Filter States for Inventory
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<number>(80000);

  // Persistence States (Persisted in LocalStorage)
  const [bookings, setBookings] = useState<TestDriveBooking[]>([]);
  const [savedConfigs, setSavedConfigs] = useState<SavedVehicle[]>([]);
  const [username, setUsername] = useState<string>("Nayan Ratz");
  const [userEmail, setUserEmail] = useState<string>("nayanratz@gmail.com");

  // Booking Modal
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const cachedBookings = localStorage.getItem("autohaven_bookings");
    if (cachedBookings) {
      try { setBookings(JSON.parse(cachedBookings)); } catch (e) { console.error(e); }
    }

    const cachedConfigs = localStorage.getItem("autohaven_saved_configs");
    if (cachedConfigs) {
      try { setSavedConfigs(JSON.parse(cachedConfigs)); } catch (e) { console.error(e); }
    }

    const cachedUser = localStorage.getItem("autohaven_username");
    if (cachedUser) setUsername(cachedUser);

    const cachedEmail = localStorage.getItem("autohaven_email");
    if (cachedEmail) setUserEmail(cachedEmail);
  }, []);

  // Sync back to LocalStorage
  const saveBookingsToStorage = (newBookings: TestDriveBooking[]) => {
    setBookings(newBookings);
    localStorage.setItem("autohaven_bookings", JSON.stringify(newBookings));
  };

  const saveConfigsToStorage = (newConfigs: SavedVehicle[]) => {
    setSavedConfigs(newConfigs);
    localStorage.setItem("autohaven_saved_configs", JSON.stringify(newConfigs));
  };

  const updateProfileInStorage = (name: string, email: string) => {
    setUsername(name);
    setUserEmail(email);
    localStorage.setItem("autohaven_username", name);
    localStorage.setItem("autohaven_email", email);
  };

  // Handlers
  const handleAddBooking = (bookingData: {
    vehicleId: string;
    vehicleName: string;
    vehicleImage: string;
    date: string;
    time: string;
    location: string;
    userName: string;
    userEmail: string;
    userPhone: string;
  }) => {
    const newBooking: TestDriveBooking = {
      id: "book-" + Math.random().toString(36).substr(2, 9),
      vehicleId: bookingData.vehicleId,
      vehicleName: bookingData.vehicleName,
      vehicleImage: bookingData.vehicleImage,
      date: bookingData.date,
      time: bookingData.time,
      location: bookingData.location,
      status: "Confirmed",
      userName: bookingData.userName,
      userEmail: bookingData.userEmail,
      userPhone: bookingData.userPhone,
    };
    saveBookingsToStorage([newBooking, ...bookings]);
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    saveBookingsToStorage(updated);
  };

  const handleSaveConfig = (config: {
    vehicleId: string;
    configuredColor: ColorOption;
    configuredTrim: TrimOption;
    configuredWheel: WheelOption;
    totalPrice: number;
  }) => {
    const newConfig: SavedVehicle = {
      id: "config-" + Math.random().toString(36).substr(2, 9),
      vehicleId: config.vehicleId,
      configuredColor: config.configuredColor,
      configuredTrim: config.configuredTrim,
      configuredWheel: config.configuredWheel,
      totalPrice: config.totalPrice,
      savedAt: new Date().toLocaleDateString(),
    };
    saveConfigsToStorage([newConfig, ...savedConfigs]);
  };

  const handleRemoveSavedConfig = (id: string) => {
    const updated = savedConfigs.filter((c) => c.id !== id);
    saveConfigsToStorage(updated);
  };

  const triggerBookingModal = (v: Vehicle) => {
    setBookingVehicle(v);
    setIsBookingOpen(true);
  };

  const handleCategorySelectFromHome = (cat: string) => {
    setCategoryFilter(cat);
    setActiveTab("inventory");
    setSelectedVehicleId(null);
  };

  const handleConfigureFromInventory = (v: Vehicle) => {
    setConfiguratorVehicleId(v.id);
    setStudioView("configurator");
    setActiveTab("experience");
  };

  // Filtering Logic
  const filteredVehicles = VEHICLES.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      categoryFilter === "All" || vehicle.category === categoryFilter;

    const matchesPrice = vehicle.price <= priceRange;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const activeVehicle = VEHICLES.find((v) => v.id === selectedVehicleId);
  const selectedConfiguratorVehicle = VEHICLES.find((v) => v.id === configuratorVehicleId) || VEHICLES[0];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-stone-900 font-sans flex flex-col selection:bg-brand-emerald/15 selection:text-stone-950">
      
      {/* Dynamic Header */}
      <Header
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          // Auto reset detail page on layout shift
          if (tab !== "inventory") setSelectedVehicleId(null);
        }}
      />

      {/* Main Container */}
      <main className="flex-grow pb-16 md:pb-6">
        
        {/* VIEW 1: HOME */}
        {activeTab === "home" && (
          <div className="space-y-[100px] animate-fade-in">
            {/* Elegant Hero Banner */}
            <div className="relative h-[92vh] w-full flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src={IMAGES.heroBg}
                  alt="AutoHaven Luxury Showroom"
                  className="w-full h-full object-cover scale-105 filter brightness-[0.7] blur-[1px]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 max-w-[1440px] mx-auto px-8 w-full">
                <div className="max-w-2xl text-white space-y-6">
                  <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase bg-brand-emerald/10 border border-brand-emerald/20 px-3 py-1.5 rounded-full inline-block">
                    ESTABLISHED 2024
                  </span>
                  <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.05]">
                    Your Next Drive <br />Starts Here
                  </h1>
                  <p className="text-stone-300 text-base md:text-lg leading-relaxed max-w-lg">
                    Experience the future of automotive luxury. Curated for the next generation of drivers who value uncompromised performance, quiet elegance, and advanced technology.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      onClick={() => handleCategorySelectFromHome("All")}
                      className="px-8 py-4 bg-white text-stone-950 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-stone-100 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      id="btn-hero-explore"
                    >
                      Explore Collection <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => triggerBookingModal(VEHICLES[0])}
                      className="px-8 py-4 bg-brand-emerald hover:bg-[#004d45] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      id="btn-hero-book"
                    >
                      Book Private Showcase
                    </button>
                  </div>
                </div>
              </div>

              {/* Scroll tag */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] tracking-widest uppercase flex flex-col items-center gap-1.5 font-semibold">
                <span>SCROLL</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </div>
            </div>

            {/* COLLECTION OVERVIEW Section */}
            <section className="max-w-[1440px] mx-auto px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-200 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase block">
                    COLLECTION OVERVIEW
                  </span>
                  <h2 className="text-3xl font-display font-semibold tracking-tight text-stone-900 mt-1">
                    Curated Categories
                  </h2>
                </div>
                <button
                  onClick={() => handleCategorySelectFromHome("All")}
                  className="text-stone-500 hover:text-stone-950 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 mt-4 md:mt-0 cursor-pointer"
                  id="btn-home-view-all"
                >
                  View All Models <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Category Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    name: "Electric Vehicles",
                    desc: "Zero-emission performance with elite aerodynamic contours.",
                    image: IMAGES.ioniq6,
                    count: "3 Models"
                  },
                  {
                    name: "Performance Lab",
                    desc: "Rigorous mechanical dynamics built for aggressive agility.",
                    image: IMAGES.safariDark,
                    count: "2 Models"
                  },
                  {
                    name: "Luxury SUVs",
                    desc: "Elevated stance married to immaculate physical hospitality.",
                    image: IMAGES.safari,
                    count: "2 Models"
                  },
                  {
                    name: "Futuristic Concepts",
                    desc: "Born electric designs looking towards next-decade roadways.",
                    image: IMAGES.be05,
                    count: "2 Models"
                  }
                ].map((cat) => (
                  <div
                    key={cat.name}
                    onClick={() => handleCategorySelectFromHome(cat.name)}
                    className="group bg-white rounded-2xl overflow-hidden border border-stone-200/50 hover:border-stone-400 transition-all duration-300 cursor-pointer shadow-sm flex flex-col"
                    id={`card-cat-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="relative aspect-video overflow-hidden bg-stone-100">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-stone-800 px-2 py-1 rounded">
                        {cat.count}
                      </span>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-display font-semibold text-lg text-stone-900 group-hover:text-brand-emerald transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-stone-500 text-xs mt-2 font-sans leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-stone-400 uppercase group-hover:text-stone-900 transition-colors">
                        Browse Gallery <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* THE AUTOHAVEN PROMISE */}
            <section className="bg-stone-900 text-white py-24">
              <div className="max-w-[1440px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                
                {/* Left Side: Column Details */}
                <div className="lg:col-span-5 space-y-10">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase block">
                      THE AUTOHAVEN PROMISE
                    </span>
                    <h2 className="text-4xl font-display font-bold tracking-tight">
                      Beyond the <br />Transaction.
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed font-sans pt-2">
                      At AutoHaven, we believe buying a luxury automobile should be as refined as piloting one. Our digital-first showroom completely eliminates standard dealer friction, providing a quiet, pristine atmosphere where every detail is tailored around you.
                    </p>
                  </div>

                  {/* Certified & Bespoke */}
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start border-t border-stone-800 pt-6">
                      <div className="p-3 bg-stone-800 text-brand-emerald rounded-lg shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">Certified Diagnostics</h4>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          Every single vehicle in our vault undergoes a rigorous 200-point physical and diagnostic validation check before showcase.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-stone-800 pt-6">
                      <div className="p-3 bg-stone-800 text-brand-emerald rounded-lg shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-white text-sm">Bespoke Concierge</h4>
                        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                          Enjoy fully integrated digital credit applications, bespoke financing terms, and signature home-delivery courier services.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Editorial Lifestyle Image */}
                <div className="lg:col-span-7">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-stone-800/80">
                    <img
                      src={IMAGES.heroBg}
                      alt="Refined Dealings"
                      className="w-full h-full object-cover scale-110 object-bottom brightness-[0.8] contrast-[1.05]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            </section>

            {/* TRUST INDICATORS FOOTER ACCENTS */}
            <section className="max-w-[1440px] mx-auto px-8 pb-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-stone-200/50 shadow-sm flex flex-col justify-between h-[180px]">
                <span className="text-xs font-bold text-brand-emerald tracking-widest uppercase">
                  INSPECTION
                </span>
                <p className="text-stone-600 text-xs font-sans leading-relaxed">
                  "Every vehicle undergoes a meticulous 200-point diagnostic physical validation."
                </p>
                <span className="text-[10px] font-mono text-stone-400">STATUS: 100% VERIFIED</span>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-stone-200/50 shadow-sm flex flex-col justify-between h-[180px]">
                <span className="text-xs font-bold text-brand-emerald tracking-widest uppercase">
                  SHIPPING
                </span>
                <p className="text-stone-600 text-xs font-sans leading-relaxed">
                  "Tailored concierge home vehicle delivery is available across all primary showrooms."
                </p>
                <span className="text-[10px] font-mono text-stone-400">STATUS: ACTIVE INGRESS</span>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-stone-200/50 shadow-sm flex flex-col justify-between h-[180px]">
                <span className="text-xs font-bold text-brand-emerald tracking-widest uppercase">
                  SECURITY
                </span>
                <p className="text-stone-600 text-xs font-sans leading-relaxed">
                  "Fully secure local storage and transactions safeguarded by advanced protocols."
                </p>
                <span className="text-[10px] font-mono text-stone-400">STATUS: SECURE HANDSHAKE</span>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: INVENTORY */}
        {activeTab === "inventory" && (
          <div className="max-w-[1440px] mx-auto px-6 py-8 animate-fade-in">
            
            {/* If vehicle is selected, display Detail view instead of listing */}
            {selectedVehicleId && activeVehicle ? (
              <VehicleDetail
                vehicle={activeVehicle}
                onBack={() => setSelectedVehicleId(null)}
                onBookTestDrive={(v) => triggerBookingModal(v)}
                onConfigure={(v) => handleConfigureFromInventory(v)}
              />
            ) : (
              // Listing View
              <div>
                {/* Section Header */}
                <div className="mb-10 border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase block">
                      AUTOHAVEN VAULT
                    </span>
                    <h2 className="text-3xl font-display font-semibold tracking-tight text-stone-900 mt-1">
                      Explore Active Collection
                    </h2>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-2">
                    {["All", "Electric Vehicles", "Performance Lab", "Luxury SUVs", "Futuristic Concepts"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                          categoryFilter === cat
                            ? "bg-stone-900 text-white shadow-sm"
                            : "bg-white text-stone-500 border border-stone-200/80 hover:border-stone-400"
                        }`}
                        id={`btn-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Search & Slider Bar */}
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Search Input */}
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Search models
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search brand, model, features..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200/80 rounded-lg pl-10 pr-4 py-2.5 text-stone-800 text-xs focus:outline-none focus:bg-white focus:border-brand-emerald"
                        id="input-inventory-search"
                      />
                    </div>
                  </div>

                  {/* Maximum MSRP Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      <span>Maximum MSRP Limit</span>
                      <span className="text-stone-900 font-mono font-bold">${priceRange.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="20000"
                      max="85000"
                      step="2500"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-brand-emerald focus:outline-none mt-2"
                      id="slider-price-limit"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                      <span>$20k</span>
                      <span>$50k</span>
                      <span>$85k+</span>
                    </div>
                  </div>

                  {/* Quick summary status */}
                  <div className="flex items-center justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-stone-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Showing</span>
                      <span className="text-xl font-display font-bold text-brand-emerald mt-0.5 block">
                        {filteredVehicles.length} of {VEHICLES.length} Models
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid of Listings */}
                {filteredVehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="group bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-sm hover:shadow-md hover:border-stone-400 transition-all duration-300 flex flex-col justify-between"
                        id={`card-vehicle-${vehicle.id}`}
                      >
                        {/* Image banner with dynamic badge */}
                        <div
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                          className="relative aspect-video overflow-hidden bg-stone-50 border-b border-stone-100 cursor-pointer"
                        >
                          <img
                            src={vehicle.imageUrl}
                            alt={vehicle.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Top Tag */}
                          {!vehicle.isLaunced ? (
                            <span className="absolute top-4 left-4 bg-brand-emerald text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">
                              PRE-ORDER OPEN
                            </span>
                          ) : (
                            <span className="absolute top-4 left-4 bg-stone-900/90 text-stone-100 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">
                              {vehicle.category}
                            </span>
                          )}

                          {/* Float price */}
                          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-stone-900 px-3 py-1.5 rounded-lg border border-stone-100 shadow-sm text-sm font-display font-bold">
                            ${vehicle.price.toLocaleString()}
                          </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                              <span>{vehicle.brand}</span>
                              <span>•</span>
                              <span>{vehicle.specs.drivetrain}</span>
                            </div>
                            <h3
                              onClick={() => setSelectedVehicleId(vehicle.id)}
                              className="text-xl font-display font-bold text-stone-900 group-hover:text-brand-emerald transition-colors cursor-pointer"
                            >
                              {vehicle.name}
                            </h3>
                            <p className="text-stone-500 text-xs font-sans line-clamp-2 leading-relaxed">
                              {vehicle.description}
                            </p>
                          </div>

                          {/* Mini Spec Banner */}
                          <div className="my-5 py-3 border-y border-stone-100 grid grid-cols-3 gap-2 text-center text-[10px]">
                            <div>
                              <span className="text-stone-400 uppercase block font-medium">0-60 MPH</span>
                              <span className="font-semibold text-stone-800 font-mono mt-0.5 block">{vehicle.specs.acceleration}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 uppercase block font-medium">Power output</span>
                              <span className="font-semibold text-stone-800 font-mono mt-0.5 block">{vehicle.specs.power}</span>
                            </div>
                            <div>
                              <span className="text-stone-400 uppercase block font-medium">EST. RANGE</span>
                              <span className="font-semibold text-stone-800 font-mono mt-0.5 block">{vehicle.specs.range}</span>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="grid grid-cols-2 gap-3 mt-4 pt-1">
                            <button
                              onClick={() => setSelectedVehicleId(vehicle.id)}
                              className="py-2.5 border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                              id={`btn-list-view-${vehicle.id}`}
                            >
                              Specs Details
                            </button>
                            <button
                              onClick={() => handleConfigureFromInventory(vehicle)}
                              className="py-2.5 bg-stone-950 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-900 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                              id={`btn-list-config-${vehicle.id}`}
                            >
                              <Sliders className="w-3.5 h-3.5 text-stone-300" /> Customize
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // No Search Results
                  <div className="text-center py-20 bg-white border border-stone-200/50 rounded-2xl">
                    <HelpCircle className="w-16 h-16 text-stone-300 mx-auto stroke-[1.2] mb-4" />
                    <h3 className="text-xl font-display font-bold text-stone-800">No Vehicles Match Criteria</h3>
                    <p className="text-stone-400 text-sm font-sans mt-2 max-w-md mx-auto leading-relaxed">
                      Please adjust your maximum MSRP limit or refine your search input keywords.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("All");
                        setPriceRange(80000);
                      }}
                      className="mt-6 px-5 py-2.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                      id="btn-reset-filters"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: EXPERIENCE (BESPOKE STUDIO + SIMULATOR) */}
        {activeTab === "experience" && (
          <div className="max-w-[1440px] mx-auto px-6 py-8 animate-fade-in space-y-12 pb-24">
            
            {/* Studio Navigation & Mode Selector */}
            <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase block">
                  AUTOHAVEN DESIGN & SIMULATION
                </span>
                <h2 className="text-3xl font-display font-semibold tracking-tight text-stone-900 mt-1">
                  Bespoke Interactive Lab
                </h2>
              </div>

              {/* Toggle views between Bespoke Configurator & Range Simulator */}
              <div className="flex bg-white border border-stone-200 p-1.5 rounded-xl text-xs font-bold shadow-sm w-full md:w-auto">
                <button
                  onClick={() => setStudioView("configurator")}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-lg text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-2 ${
                    studioView === "configurator"
                      ? "bg-stone-900 text-white shadow-sm font-bold"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                  id="btn-toggle-configurator"
                >
                  <Sliders className="w-4 h-4" /> Bespoke Configurator
                </button>
                <button
                  onClick={() => setStudioView("simulator")}
                  className={`flex-1 md:flex-none px-6 py-3 rounded-lg text-center cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-2 ${
                    studioView === "simulator"
                      ? "bg-stone-900 text-white shadow-sm font-bold"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                  id="btn-toggle-simulator"
                >
                  <Zap className="w-4 h-4" /> Range Simulator
                </button>
              </div>
            </div>

            {/* Display active laboratory sub-component */}
            {studioView === "configurator" ? (
              <div className="space-y-8">
                {/* Extra picker in studio view */}
                <div className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-stone-900 text-sm">Select Baseline Model</h3>
                    <p className="text-xs text-stone-400 font-sans">Swap base configurations on the fly.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {VEHICLES.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setConfiguratorVehicleId(v.id)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          configuratorVehicleId === v.id
                            ? "bg-brand-emerald text-white font-bold"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                        id={`btn-config-baseline-${v.id}`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>

                <BespokeConfigurator
                  vehicle={selectedConfiguratorVehicle}
                  onSaveConfig={handleSaveConfig}
                  onBookTestDrive={(v) => triggerBookingModal(v)}
                  isSaved={savedConfigs.some((sc) => sc.vehicleId === selectedConfiguratorVehicle.id)}
                />
              </div>
            ) : (
              <Simulator
                electricVehicles={VEHICLES.filter((v) => v.category === "Electric Vehicles" || v.id === "harrier-ev" || v.id === "be-05")}
              />
            )}
          </div>
        )}

        {/* VIEW 4: ACCOUNT / MEMBER PROFILE */}
        {activeTab === "account" && (
          <div className="max-w-[1440px] mx-auto px-6 py-8 animate-fade-in space-y-12 pb-24">
            
            {/* Header */}
            <div className="border-b border-stone-200 pb-6">
              <span className="text-[10px] font-bold text-brand-emerald tracking-widest uppercase block">
                AUTOHAVEN PASSPORT
              </span>
              <h2 className="text-3xl font-display font-semibold tracking-tight text-stone-900 mt-1">
                Your Luxury Lounge
              </h2>
            </div>

            {/* Profile Detail Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-sm">
              {/* Profile Pic Indicator */}
              <div className="md:col-span-3 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-emerald to-stone-900 flex items-center justify-center text-white text-3xl font-display font-bold shadow-md">
                  {username.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>

              {/* Profile Form Details */}
              <div className="md:col-span-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Member Name
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => updateProfileInStorage(e.target.value, userEmail)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-brand-emerald"
                      id="input-account-username"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Member Email
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => updateProfileInStorage(username, e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-brand-emerald"
                      id="input-account-email"
                    />
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-stone-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Verified AutoHaven Elite Passport member since July 2026</span>
                </div>
              </div>

              {/* Membership Tier Spec */}
              <div className="md:col-span-3 bg-stone-50 p-5 rounded-xl border border-stone-200 text-center space-y-1">
                <span className="text-[9px] font-bold text-brand-emerald uppercase tracking-widest block">
                  Passport Status
                </span>
                <span className="text-lg font-display font-bold text-stone-900 block uppercase">
                  Bespoke Elite
                </span>
                <span className="text-[10px] text-stone-400 block pt-1 border-t border-stone-200/60 font-mono">
                  Concierge delivery available
                </span>
              </div>
            </div>

            {/* Split layout: Saved Configurations & Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* Left Column: Booked Showcases */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-3">
                  Scheduled Private Showcases ({bookings.length})
                </h3>

                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4"
                        id={`card-booked-showcase-${booking.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={booking.vehicleImage}
                            alt={booking.vehicleName}
                            className="w-20 h-14 object-cover rounded-md border border-stone-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[9px] font-bold text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                              {booking.status}
                            </span>
                            <h4 className="font-display font-semibold text-stone-900 mt-1 text-sm">{booking.vehicleName}</h4>
                            <p className="text-[11px] text-stone-400 font-sans mt-0.5 leading-none">
                              Scheduled on {booking.date} at {booking.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs text-stone-500 font-sans">
                          <div>
                            <span className="block text-[9px] uppercase font-semibold text-stone-400">Location</span>
                            <span className="font-medium text-stone-700">{booking.location}</span>
                          </div>
                          
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-500 hover:text-red-700 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1 cursor-pointer focus:outline-none py-1 px-2.5 hover:bg-red-50 rounded"
                            id={`btn-cancel-booking-${booking.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Cancel Drive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border border-stone-200/50 rounded-2xl">
                    <Calendar className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2] mb-3" />
                    <h4 className="text-sm font-semibold text-stone-800">No Showcases Scheduled</h4>
                    <p className="text-stone-400 text-xs font-sans mt-1.5 max-w-xs mx-auto">
                      Review the inventory to book a private cinematic drive session or direct-home concierge drop.
                    </p>
                    <button
                      onClick={() => setActiveTab("inventory")}
                      className="mt-4 px-4 py-2 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
                      id="btn-acc-explore-inv"
                    >
                      Book Showcase Now
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Saved Bespoke Configurations */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-3">
                  My Saved Bespoke Layouts ({savedConfigs.length})
                </h3>

                {savedConfigs.length > 0 ? (
                  <div className="space-y-4">
                    {savedConfigs.map((config) => {
                      const vehRef = VEHICLES.find((v) => v.id === config.vehicleId);
                      if (!vehRef) return null;
                      return (
                        <div
                          key={config.id}
                          className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4"
                          id={`card-saved-config-${config.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={vehRef.imageUrl}
                              alt={vehRef.name}
                              className="w-20 h-14 object-cover rounded-md border border-stone-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-stone-400 font-mono">Saved {config.savedAt}</span>
                                <span className="font-display font-bold text-stone-950 text-sm">
                                  ${config.totalPrice.toLocaleString()}
                                </span>
                              </div>
                              <h4 className="font-display font-semibold text-stone-900 mt-1 text-sm">{vehRef.brand} {vehRef.name}</h4>
                              
                              {/* Selection Circles */}
                              <div className="flex gap-4 text-[10px] text-stone-500 font-sans mt-2.5">
                                <div className="flex items-center gap-1">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                    style={{ backgroundColor: config.configuredColor?.hex }}
                                  />
                                  <span>{config.configuredColor?.name}</span>
                                </div>
                                <span>•</span>
                                <span>{config.configuredWheel?.name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                            <button
                              onClick={() => triggerBookingModal(vehRef)}
                              className="text-brand-emerald hover:text-[#004d45] font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1.5 cursor-pointer"
                              id={`btn-book-saved-${config.id}`}
                            >
                              <Calendar className="w-3.5 h-3.5" /> Book Configured Model
                            </button>

                            <button
                              onClick={() => handleRemoveSavedConfig(config.id)}
                              className="text-stone-400 hover:text-stone-600 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1 cursor-pointer focus:outline-none"
                              id={`btn-remove-saved-${config.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white border border-stone-200/50 rounded-2xl">
                    <Heart className="w-12 h-12 text-stone-300 mx-auto stroke-[1.2] mb-3" />
                    <h4 className="text-sm font-semibold text-stone-800">No Saved Layouts</h4>
                    <p className="text-stone-400 text-xs font-sans mt-1.5 max-w-xs mx-auto">
                      Go to the Bespoke Studio inside our Experience tab to customize colors, interiors, and wheels.
                    </p>
                    <button
                      onClick={() => {
                        setStudioView("configurator");
                        setActiveTab("experience");
                      }}
                      className="mt-4 px-4 py-2 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-stone-900 transition-colors cursor-pointer"
                      id="btn-acc-custom-studio"
                    >
                      Bespoke Studio
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Nav for Mobile Viewports */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab !== "inventory") setSelectedVehicleId(null);
      }} />

      {/* Booking Modal Showcase (Active Globally when triggered) */}
      {isBookingOpen && (
        <BookingModal
          vehicle={bookingVehicle}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={(bData) => {
            handleAddBooking(bData);
          }}
          allVehicles={VEHICLES}
        />
      )}

      {/* Global Modern Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-12 px-6 border-t border-stone-800 mt-auto">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Logo Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src={IMAGES.logo}
                alt="AutoHaven Logo"
                className="h-8 w-auto brightness-200 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-stone-500 leading-relaxed font-sans pr-4">
              Defining the next chapter of luxury automotive retail. Minimalist by design, powerful by nature. Bringing high-tech curation to tomorrow's luxury drivers.
            </p>
          </div>

          {/* Column 2 */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Explore</h4>
            <ul className="space-y-2 text-stone-500 font-sans">
              <li>
                <button onClick={() => { setActiveTab("inventory"); setSelectedVehicleId(null); }} className="hover:text-stone-300 cursor-pointer">
                  Inventory Vault
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategorySelectFromHome("Electric Vehicles"); }} className="hover:text-stone-300 cursor-pointer">
                  Electric Vehicles
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategorySelectFromHome("Performance Lab"); }} className="hover:text-stone-300 cursor-pointer">
                  Performance Lab
                </button>
              </li>
              <li>
                <button onClick={() => { handleCategorySelectFromHome("Futuristic Concepts"); }} className="hover:text-stone-300 cursor-pointer">
                  Futuristic Concepts
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Connect</h4>
            <ul className="space-y-2 text-stone-500 font-sans">
              <li><span className="hover:text-stone-300 cursor-pointer">About Us</span></li>
              <li><span className="hover:text-stone-300 cursor-pointer">Contact Lounge</span></li>
              <li><span className="hover:text-stone-300 cursor-pointer">Support Studio</span></li>
              <li><span className="hover:text-stone-300 cursor-pointer">Locations Map</span></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">HQ Showroom</h4>
            <p className="text-stone-500 leading-relaxed font-sans">
              AutoHaven Beverly Hills<br />
              9450 Wilshire Blvd<br />
              Beverly Hills, CA 90212
            </p>
          </div>
        </div>

        {/* Footer legal */}
        <div className="max-w-[1440px] mx-auto pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-stone-500 font-mono">
          <span>© 2026 AUTOHAVEN. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-6">
            <span className="hover:text-stone-300 cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-stone-300 cursor-pointer">TERMS OF SERVICE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
