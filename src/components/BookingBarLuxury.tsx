"use client";

import { useState } from "react";
import { Calendar, Users, BedDouble, ArrowRight } from "lucide-react";

export default function BookingBarLuxury() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [roomType, setRoomType] = useState("all");

  return (
    <section id="booking" className="relative -mt-20 z-30 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Dark Mode Floating Booking Bar */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              Check Availability
            </h2>
            <p className="text-gray-400">Find your perfect room at the best price</p>
          </div>

          {/* Form Grid */}
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Check-in */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Check-in
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pvt-gold transition-colors" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pvt-gold/50 focus:border-pvt-gold/50 transition-all"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Check-out
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pvt-gold transition-colors" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pvt-gold/50 focus:border-pvt-gold/50 transition-all"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Guests
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pvt-gold transition-colors" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pvt-gold/50 focus:border-pvt-gold/50 transition-all appearance-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room Type */}
            <div className="group relative">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Room Type
              </label>
              <div className="relative">
                <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pvt-gold transition-colors" />
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pvt-gold/50 focus:border-pvt-gold/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Rooms</option>
                  <option value="mixed">Mixed Dorm</option>
                  <option value="female">Female Dorm</option>
                  <option value="male">Male Dorm</option>
                  <option value="private">Private Room</option>
                  <option value="family">Family Suite</option>
                </select>
              </div>
            </div>
          </form>

          {/* Search Button */}
          <div className="mt-6 flex justify-center">
            <button className="group relative px-12 py-5 bg-pvt-gold text-pvt-black font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(211,168,103,0.6)] flex items-center gap-3">
              <span>Search Rooms</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-pvt-gold to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Live Availability Indicator */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-300 font-mono">
                12 rooms available tonight
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
