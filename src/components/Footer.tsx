'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Send, Sparkles, Heart } from 'lucide-react'

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
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/leopvthostel', color: 'hover:bg-blue-600' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/leopvthostel', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/leopvthostel', color: 'hover:bg-sky-500' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/leopvthostel', color: 'hover:bg-red-600' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      <div className="absolute inset-0 bg-mesh-gradient opacity-10"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 particles-bg opacity-30"></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main Footer Content */}
          <div className="py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Premium Brand Column */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="relative"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="bg-gradient-primary text-white font-bold text-2xl w-14 h-14 rounded-2xl flex items-center justify-center shadow-glow">
                      L
                    </div>
                    <div className="absolute inset-0 bg-gradient-secondary rounded-2xl opacity-30 blur-xl"></div>
                  </motion.div>
                  <div>
                    <span className="font-heading font-black text-3xl gradient-text">Leo PVT</span>
                    <span className="block text-sm text-gray-400 font-medium tracking-wider">
                      LUXURY HOSTEL MONTREAL
                    </span>
                  </div>
                </div>
                
                <p className="text-base text-gray-300 mb-8 max-w-md leading-relaxed">
                  Experience Montreal like never before. Our premium hostel offers luxurious accommodation, 
                  world-class amenities, and an unbeatable location in the vibrant heart of downtown.
                </p>
                
                {/* Premium Contact Info */}
                <div className="space-y-4 mb-8">
                  <motion.a 
                    href="tel:+15141234567" 
                    className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="glass-subtle p-2 rounded-xl mr-4 group-hover:bg-primary-500/20 transition-colors duration-300">
                      <Phone className="h-5 w-5 text-accent-400" />
                    </div>
                    <span className="font-medium">+1 (514) 123-4567</span>
                  </motion.a>
                  
                  <motion.a 
                    href="mailto:info@leo.pvthostel.com" 
                    className="flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="glass-subtle p-2 rounded-xl mr-4 group-hover:bg-primary-500/20 transition-colors duration-300">
                      <Mail className="h-5 w-5 text-accent-400" />
                    </div>
                    <span className="font-medium">info@leo.pvthostel.com</span>
                  </motion.a>
                  
                  <motion.div 
                    className="flex items-start text-gray-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="glass-subtle p-2 rounded-xl mr-4 group-hover:bg-primary-500/20 transition-colors duration-300">
                      <MapPin className="h-5 w-5 text-accent-400 mt-0.5" />
                    </div>
                    <span className="font-medium leading-relaxed">
                      123 Rue Example<br />
                      Montreal, QC H2X 1Y7<br />
                      Canada
                    </span>
                  </motion.div>
                </div>

                {/* Premium Social Links */}
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`glass-effect p-3 rounded-2xl text-gray-400 hover:text-white transition-all duration-300 ${social.color} group`}
                        aria-label={social.name}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <Icon className="h-5 w-5 group-hover:animate-pulse" />
                      </motion.a>
                    )
                  })}
                </div>
              </motion.div>

              {/* Premium Links Columns */}
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div key={category} variants={itemVariants}>
                  <h3 className="font-heading font-bold text-xl text-white mb-6 gradient-text-accent capitalize">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, linkIndex) => (
                      <motion.li 
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * 0.1) + (linkIndex * 0.05) + 0.7 }}
                      >
                        <Link 
                          href={link.href} 
                          className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 block py-1 group"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Premium Newsletter Section */}
          <motion.div 
            variants={itemVariants}
            className="border-t border-white/10 py-12"
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-accent-400 mr-2" />
                <h3 className="font-heading font-bold text-2xl gradient-text">
                  Stay Connected
                </h3>
                <Sparkles className="h-6 w-6 text-accent-400 ml-2" />
              </div>
              
              <p className="text-lg text-gray-300 mb-8">
                Subscribe to our newsletter for exclusive deals, travel tips, and Montreal insights.
              </p>
              
              <motion.form 
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                whileInView={{ scale: [0.95, 1] }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 glass-effect rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  className="btn-primary group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center">
                    Subscribe
                    <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </motion.button>
              </motion.form>
            </div>
          </motion.div>

          {/* Premium Bottom Bar */}
          <motion.div 
            variants={itemVariants}
            className="border-t border-white/10 py-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="flex items-center text-gray-400">
                <span>© {new Date().getFullYear()} Leo PVT Hostel Montreal. Made with</span>
                <Heart className="h-4 w-4 mx-2 text-red-500 animate-pulse" />
                <span>in Montreal</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Sitemap
                </Link>
                <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Accessibility
                </Link>
                <motion.select
                  className="glass-subtle px-4 py-2 rounded-xl text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                  defaultValue="en"
                  whileHover={{ scale: 1.05 }}
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </motion.select>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}