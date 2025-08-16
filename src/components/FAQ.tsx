'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What time is check-in and check-out?',
    answer: 'Check-in starts at 3:00 PM and check-out is until 11:00 AM. We have 24/7 reception, so late arrivals are no problem! Just let us know in advance. Early check-in and late check-out may be available upon request, subject to availability.',
  },
  {
    question: 'Is breakfast included?',
    answer: 'Yes! We offer a complimentary continental breakfast every morning from 7:00 AM to 10:00 AM. It includes fresh bread, pastries, cereals, fruits, coffee, tea, and juice. Perfect to start your day of Montreal exploration!',
  },
  {
    question: 'Do you have luggage storage?',
    answer: 'Absolutely! We offer free luggage storage for our guests. You can store your bags before check-in or after check-out at no extra charge. This way, you can explore the city without carrying your luggage around.',
  },
  {
    question: 'Is there a minimum age requirement?',
    answer: 'Guests must be at least 18 years old to stay in dormitory rooms. Guests under 18 are welcome when accompanied by a parent or guardian and must book private rooms. We also accept school groups with proper supervision.',
  },
  {
    question: 'What\'s your cancellation policy?',
    answer: 'Free cancellation up to 48 hours before your arrival date. Cancellations made within 48 hours will be charged for the first night. For group bookings (6+ beds), special cancellation policies apply - please contact us for details.',
  },
  {
    question: 'Do you provide towels and linens?',
    answer: 'Yes, bed linens are included and provided for free. Towels are available for rent at $2 per stay, or you\'re welcome to bring your own. We also sell travel towels at reception if you\'d like to purchase one.',
  },
  {
    question: 'Is the hostel accessible for people with disabilities?',
    answer: 'We have wheelchair-accessible common areas and specially equipped rooms on the ground floor. Please contact us in advance so we can ensure we accommodate your specific needs properly.',
  },
  {
    question: 'Can I book a female-only dorm?',
    answer: 'Yes! We offer female-only dormitory rooms for women travelers who prefer this option. These rooms feature the same amenities as our mixed dorms, with added privacy features like individual curtains and dedicated bathroom facilities.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div
                  id={`faq-answer-${index}`}
                  className={`transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-primary-50 rounded-xl p-8">
            <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our friendly staff is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15141234567"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-sm"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Message
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}