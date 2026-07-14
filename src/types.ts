export interface VehicleSpec {
  label: string;
  value: string;
  iconName: string;
}

export interface ColorOption {
  name: string;
  hex: string;
  price: number;
}

export interface TrimOption {
  name: string;
  description: string;
  price: number;
}

export interface WheelOption {
  name: string;
  imageUrl: string;
  price: number;
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: "Electric Vehicles" | "Performance Lab" | "Luxury SUVs" | "Futuristic Concepts";
  price: number;
  imageUrl: string;
  tagline: string;
  description: string;
  specs: {
    acceleration: string; // e.g. "4.6s"
    topSpeed: string; // e.g. "155 mph"
    range: string; // e.g. "310 mi" or "N/A"
    power: string; // e.g. "320 HP"
    drivetrain: string; // e.g. "Dual Motor AWD"
  };
  additionalSpecs: VehicleSpec[];
  colors: ColorOption[];
  trims: TrimOption[];
  wheels: WheelOption[];
  isLaunced: boolean;
  launchDate?: string;
}

export interface TestDriveBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  date: string;
  time: string;
  location: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface SavedVehicle {
  id: string;
  vehicleId: string;
  configuredColor?: ColorOption;
  configuredTrim?: TrimOption;
  configuredWheel?: WheelOption;
  totalPrice: number;
  savedAt: string;
}
