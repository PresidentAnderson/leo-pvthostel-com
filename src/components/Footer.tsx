import Link from 'next/link'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  explore: [
    { name: 'Rooms & Rates', href: '/rooms' },
    { name: 'Amenities', href: '/amenities' },
    { name: 'Location', href: '/location' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Events', href: '/events' },
  ],
  info: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
  services: [
    { name: 'Group Bookings', href: '/group-bookings' },
    { name: 'Long-term Stays', href: '/long-term' },
    { name: 'Work & Travel', href: '/work-travel' },
    { name: 'Student Discounts', href: '/students' },
    { name: 'Partnerships', href: '/partners' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/leopvthostel' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/leopvthostel' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/leopvthostel' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/leopvthostel' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-600 text-white font-bold text-xl w-10 h-10 rounded-lg flex items-center justify-center">
                  L
                </div>
                <div>
                  <span className="font-heading font-bold text-xl text-white">Leo PVT</span>
                  <span className="block text-xs text-gray-400">HOSTEL MONTREAL</span>
                </div>
              </div>
              <p className="text-sm mb-6 max-w-sm">
                Experience Montreal like a local. Our hostel offers comfortable accommodation, 
                great amenities, and an unbeatable location in the heart of downtown.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <a href="tel:+15141234567" className="flex items-center text-sm hover:text-white transition-colors">
                  <Phone className="h-4 w-4 mr-3 text-primary-400" />
                  +1 (514) 123-4567
                </a>
                <a href="mailto:info@leo.pvthostel.com" className="flex items-center text-sm hover:text-white transition-colors">
                  <Mail className="h-4 w-4 mr-3 text-primary-400" />
                  info@leo.pvthostel.com
                </a>
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-3 mt-0.5 text-primary-400 flex-shrink-0" />
                  <span>
                    123 Rue Example<br />
                    Montreal, QC H2X 1Y7<br />
                    Canada
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-full p-2 transition-all duration-200"
                      aria-label={social.name}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h3 className="font-heading font-semibold text-white mb-4">Explore</h3>
              <ul className="space-y-2">
                {footerLinks.explore.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-white mb-4">Information</h3>
              <ul className="space-y-2">
                {footerLinks.info.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-heading font-semibold text-white text-lg mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to our newsletter for exclusive deals and Montreal travel tips.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Leo PVT Hostel Montreal. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
              <select
                className="bg-transparent border border-gray-700 rounded px-3 py-1 text-gray-400 hover:text-white focus:outline-none focus:border-primary-500"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}