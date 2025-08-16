'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    country: 'United States',
    avatar: '/images/avatars/sarah.jpg',
    rating: 5,
    date: 'November 2024',
    text: 'Amazing hostel! The location is perfect, right in downtown Montreal. The staff was incredibly friendly and helpful. The rooms were clean and the beds comfortable. Would definitely stay here again!',
    highlight: 'Perfect Location',
  },
  {
    id: 2,
    name: 'Pierre Dubois',
    country: 'France',
    avatar: '/images/avatars/pierre.jpg',
    rating: 5,
    date: 'October 2024',
    text: 'Excellent rapport qualité-prix! The hostel has everything you need - great kitchen, comfortable common areas, and the free breakfast is a nice touch. Met so many cool people here!',
    highlight: 'Great Value',
  },
  {
    id: 3,
    name: 'Maria Garcia',
    country: 'Spain',
    avatar: '/images/avatars/maria.jpg',
    rating: 4,
    date: 'September 2024',
    text: 'Very clean and modern hostel. The female-only dorm was spacious and felt very safe. The only thing I would improve is adding more power outlets near the beds.',
    highlight: 'Clean & Safe',
  },
  {
    id: 4,
    name: 'Tom Anderson',
    country: 'Australia',
    avatar: '/images/avatars/tom.jpg',
    rating: 5,
    date: 'August 2024',
    text: 'Best hostel I\'ve stayed at in North America! The social atmosphere is fantastic, and the weekly events really help you meet other travelers. The rooftop terrace is a great bonus!',
    highlight: 'Social Atmosphere',
  },
  {
    id: 5,
    name: 'Yuki Tanaka',
    country: 'Japan',
    avatar: '/images/avatars/yuki.jpg',
    rating: 5,
    date: 'July 2024',
    text: 'Super convenient location near the metro. The lockers are big enough for large backpacks. Staff speaks multiple languages which was very helpful. Highly recommend!',
    highlight: 'Helpful Staff',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from travelers who've experienced Leo PVT Hostel
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 relative">
            <Quote className="absolute top-8 left-8 h-8 w-8 text-primary-200" />
            
            <div className="relative">
              {/* Testimonial Content */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[currentIndex].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {testimonials[currentIndex].date}
                  </span>
                </div>
                
                <p className="text-lg text-gray-700 mb-6 italic">
                  "{testimonials[currentIndex].text}"
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-4" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonials[currentIndex].name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonials[currentIndex].country}
                      </p>
                    </div>
                  </div>
                  
                  <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                    {testimonials[currentIndex].highlight}
                  </span>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={prevTestimonial}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                
                <div className="flex items-center space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex ? 'w-8 bg-primary-600' : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextTestimonial}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">4.8</p>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">2,500+</p>
            <p className="text-sm text-gray-600 mt-1">Happy Guests</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">95%</p>
            <p className="text-sm text-gray-600 mt-1">Would Recommend</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">50+</p>
            <p className="text-sm text-gray-600 mt-1">Countries</p>
          </div>
        </div>
      </div>
    </section>
  )
}