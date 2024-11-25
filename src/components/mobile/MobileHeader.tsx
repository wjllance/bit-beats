"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";

const SLOGANS = [
  "Watch Bitcoin Rise to the Top",
  "Ride the Digital Gold Wave",
  "The Future of Finance is Here",
  "Decentralized. Secure. Revolutionary.",
  "Beyond Traditional Boundaries",
  "Financial Freedom Awaits",
  "Join the Crypto Revolution",
  "Where Innovation Meets Value",
  "Empowering Digital Wealth",
  "The Beat of Digital Currency",
];

export default function MobileHeader() {
  const [currentSlogan, setCurrentSlogan] = useState(
    Math.floor(Math.random() * SLOGANS.length)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlogan((prev) => (prev + 1) % SLOGANS.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center ">
        <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-transparent bg-clip-text tracking-tight leading-none">
          Bit Beats
        </h1>
        <p
          className={clsx(
            "text-[10px] text-gray-400 transition-opacity duration-500",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
        >
          {SLOGANS[currentSlogan]}
        </p>
      </div>
    </div>
  );
}
