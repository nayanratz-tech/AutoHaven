"use client";

import DisplayCards from "@/src/components/ui/display-cards";

interface DisplayCardsDemoProps {
  onSelectVehicle: (id: string) => void;
}

export function DisplayCardsDemo({ onSelectVehicle }: DisplayCardsDemoProps) {
  const cards = [
    {
      icon: <img src="/Creta.webp" className="w-5 h-5 rounded-full object-cover" />,
      title: "Creta EV",
      description: "Hyundai Creta EV",
      date: "₹17.99 Lakh | Range: 510 km",
      iconClassName: "text-brand-emerald",
      titleClassName: "text-white font-display",
      className:
        "[grid-area:stack] translate-x-0 translate-y-0 hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-stone-700 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-stone-900/50 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 border-stone-850 bg-stone-900/90 text-white",
      onClick: () => onSelectVehicle("creta-ev"),
    },
    {
      icon: <img src="/Tata-Sierra-EV-13-scaled.jpg" className="w-5 h-5 rounded-full object-cover" />,
      title: "Sierra EV",
      description: "Tata Sierra EV",
      date: "₹18.79 Lakh | Range: 600 km",
      iconClassName: "text-brand-emerald",
      titleClassName: "text-white font-display",
      className:
        "[grid-area:stack] translate-x-8 translate-y-6 hover:-translate-y-4 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-stone-700 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-stone-900/50 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 border-stone-850 bg-stone-900/90 text-white",
      onClick: () => onSelectVehicle("sierra-ev"),
    },
    {
      icon: <img src="/Safari Dark Edition.avif" className="w-5 h-5 rounded-full object-cover" />,
      title: "Safari Dark",
      description: "Safari Dark Edition",
      date: "₹20.69 Lakh | Power: 170 HP",
      iconClassName: "text-brand-emerald",
      titleClassName: "text-white font-display",
      className:
        "[grid-area:stack] translate-x-16 translate-y-12 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-stone-700 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-stone-900/50 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 border-stone-850 bg-stone-900/90 text-white",
      onClick: () => onSelectVehicle("safari-dark"),
    },
    {
      icon: <img src="/Mahindra BE 6.webp" className="w-5 h-5 rounded-full object-cover" />,
      title: "BE 6",
      description: "Mahindra BE 6",
      date: "₹24.00 Lakh | Range: 682 km",
      iconClassName: "text-brand-emerald",
      titleClassName: "text-white font-display",
      className:
        "[grid-area:stack] translate-x-24 translate-y-18 hover:translate-y-8 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-stone-700 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-stone-900/50 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 border-stone-850 bg-stone-900/90 text-white",
      onClick: () => onSelectVehicle("be-6"),
    },
    {
      icon: <img src="/7xO images.avif" className="w-5 h-5 rounded-full object-cover" />,
      title: "XUV 7XO",
      description: "Mahindra XUV 7XO",
      date: "₹25.49 Lakh | Power: 200 HP",
      iconClassName: "text-brand-emerald",
      titleClassName: "text-white font-display",
      className:
        "[grid-area:stack] translate-x-32 translate-y-24 hover:translate-y-14 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-stone-700 before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-stone-900/50 grayscale-[80%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 border-stone-850 bg-stone-900/90 text-white",
      onClick: () => onSelectVehicle("xuv700"),
    },
    {
      icon: <img src="/Tata Harrier QWD.webp" className="w-5 h-5 rounded-full object-cover" />,
      title: "Harrier EV QWD",
      description: "Tata Harrier QWD",
      date: "₹26.49 Lakh | Range: 500 km",
      iconClassName: "text-brand-emerald",
      titleClassName: "text-white font-display",
      className:
        "[grid-area:stack] translate-x-40 translate-y-30 hover:translate-y-20 border-stone-850 bg-stone-900/90 text-white",
      onClick: () => onSelectVehicle("harrier-ev"),
    },
  ];

  return (
    <div className="flex min-h-[360px] w-full items-center justify-center py-6">
      <div className="w-full max-w-xl">
        <DisplayCards cards={cards} />
      </div>
    </div>
  );
}
