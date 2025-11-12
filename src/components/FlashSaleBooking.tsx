"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, BedDouble, Clock } from "lucide-react";
import * as PVT from "./PVT";

export default function FlashSaleBooking() {
  // Simple countdown timer (6 hours)
  const [timeLeft, setTimeLeft] = useState(6 * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const roomOptions = [
    { value: "all", label: "All Rooms" },
    { value: "mixed", label: "Mixed Dormitory" },
    { value: "female", label: "Female Dormitory" },
    { value: "male", label: "Male Dormitory" },
    { value: "private", label: "Private Room" },
    { value: "family", label: "Family Room" },
  ];

  const guestOptions = Array.from({ length: 8 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1} Guest${i > 0 ? "s" : ""}`,
  }));

  return (
    <section className="w-full flex flex-col items-center gap-12 py-20 px-6 bg-background-primary">

      {/* FLASH SALE CARD */}
      <PVT.Card
        background="dark"
        shadow="hard"
        padding="xl"
        className="w-full max-w-3xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.12] bg-[url('/montreal-skyline.png')] bg-cover bg-center"></div>

        <div className="relative z-10 flex flex-col gap-4 text-center">
          <PVT.Text
            as="div"
            size="sm"
            weight="medium"
            color="inverse"
            className="tracking-widest text-pvt-gold uppercase"
          >
            Limited-Time Winter Special
          </PVT.Text>

          <PVT.Heading level="2" font="display" className="text-text-inverse">
            Save 25% on 3+ night stays — only 3 beds left
          </PVT.Heading>

          <div className="flex items-center justify-center gap-2 mt-2" aria-live="polite">
            <Clock className="w-5 h-5 text-pvt-gold" aria-hidden="true" />
            <span className="font-mono text-lg text-text-inverse">
              {hours}h : {minutes}m : {seconds}s
            </span>
          </div>

          <div className="mt-6">
            <PVT.Button variant="gold" size="lg">
              Book & Save 25%
            </PVT.Button>
          </div>
        </div>
      </PVT.Card>

      {/* BOOKING CARD */}
      <PVT.Card
        background="white"
        shadow="medium"
        padding="xl"
        className="w-full max-w-4xl"
      >
        <PVT.Heading level="2" className="mb-2">
          Check Availability
        </PVT.Heading>

        <PVT.Text color="secondary" className="mb-8">
          Find your perfect room at the best price
        </PVT.Text>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Check-in */}
          <PVT.DatePicker
            label="Check-in"
            icon={<Calendar className="w-5 h-5" />}
            aria-label="Check-in date"
          />

          {/* Check-out */}
          <PVT.DatePicker
            label="Check-out"
            icon={<Calendar className="w-5 h-5" />}
            aria-label="Check-out date"
          />

          {/* Guests */}
          <PVT.Select
            label="Guests"
            icon={<Users className="w-5 h-5" />}
            options={guestOptions}
            aria-label="Number of guests"
          />

          {/* Room Type */}
          <PVT.Select
            label="Room Type"
            icon={<BedDouble className="w-5 h-5" />}
            options={roomOptions}
            aria-label="Room type"
          />

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center">
            <PVT.Button
              variant="black"
              size="lg"
              type="submit"
              className="md:min-w-[200px] w-full md:w-auto"
            >
              Search
            </PVT.Button>
          </div>
        </form>
      </PVT.Card>
    </section>
  );
}
