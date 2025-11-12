"use client";

import { useState, useEffect } from "react";
import { Calendar, Users, BedDouble, Clock } from "lucide-react";

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

  return (
    <section className="w-full flex flex-col items-center gap-12 py-20 px-6 bg-[#f9f9f9]">

      {/* FLASH SALE CARD */}
      <div className="w-full max-w-3xl bg-[#0E0E0E] text-white rounded-2xl p-10 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] bg-[url('/montreal-skyline.png')] bg-cover bg-center"></div>

        <div className="relative z-10 flex flex-col gap-4 text-center">
          <div className="text-sm tracking-[0.25em] text-[#D3A867] uppercase">
            Limited-Time Winter Special
          </div>

          <h2 className="text-3xl font-semibold">
            Save 25% on 3+ night stays — only 3 beds left
          </h2>

          <div className="flex items-center justify-center gap-2 text-lg font-mono mt-2" aria-live="polite">
            <Clock className="w-5 h-5 text-[#D3A867]" aria-hidden="true" />
            <span>
              {hours}h : {minutes}m : {seconds}s
            </span>
          </div>

          <button className="mt-6 bg-[#D3A867] hover:bg-[#c39855] text-black font-semibold px-8 py-4 rounded-full transition-all focus:ring-2 focus:ring-[#D3A867] focus:ring-offset-2 focus:ring-offset-[#0E0E0E]">
            Book & Save 25%
          </button>
        </div>
      </div>

      {/* BOOKING CARD */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold mb-2 text-[#111111]">Check Availability</h2>
        <p className="text-[#555555] mb-8">Find your perfect room at the best price</p>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Check-in */}
          <div className="flex flex-col gap-2">
            <label htmlFor="checkin" className="font-medium text-[#111111]">Check-in</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#D3A867] focus-within:border-[#1A1A1A] transition-all">
              <Calendar className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <input
                id="checkin"
                type="date"
                className="w-full outline-none"
                aria-label="Check-in date"
              />
            </div>
          </div>

          {/* Check-out */}
          <div className="flex flex-col gap-2">
            <label htmlFor="checkout" className="font-medium text-[#111111]">Check-out</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#D3A867] focus-within:border-[#1A1A1A] transition-all">
              <Calendar className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <input
                id="checkout"
                type="date"
                className="w-full outline-none"
                aria-label="Check-out date"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-2">
            <label htmlFor="guests" className="font-medium text-[#111111]">Guests</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#D3A867] focus-within:border-[#1A1A1A] transition-all">
              <Users className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <select id="guests" className="w-full outline-none bg-transparent" aria-label="Number of guests">
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1} Guest{i > 0 ? "s" : ""}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Room Type */}
          <div className="flex flex-col gap-2">
            <label htmlFor="roomtype" className="font-medium text-[#111111]">Room Type</label>
            <div className="flex items-center gap-2 border border-gray-300 rounded-xl p-3 focus-within:ring-2 focus-within:ring-[#D3A867] focus-within:border-[#1A1A1A] transition-all">
              <BedDouble className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <select id="roomtype" className="w-full outline-none bg-transparent" aria-label="Room type">
                <option value="all">All Rooms</option>
                <option value="mixed">Mixed Dormitory</option>
                <option value="female">Female Dormitory</option>
                <option value="male">Male Dormitory</option>
                <option value="private">Private Room</option>
                <option value="family">Family Room</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-black text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition-all duration-150 ease-out focus:ring-2 focus:ring-[#D3A867] focus:ring-offset-2 w-full md:w-auto"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
