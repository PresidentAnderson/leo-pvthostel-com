'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, Globe, Sparkles } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Rooms', href: '/rooms' },
  { name: 'Amenities', href: '/amenities' },
  { name: 'Location', href: '/location' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-glass shadow-luxury' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-gradient-primary text-white font-bold text-2xl w-12 h-12 rounded-2xl flex items-center justify-center shadow-glow">
                  L
                </div>
                <div className="absolute inset-0 bg-gradient-secondary rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </motion.div>
              <div>
                <span className="font-heading font-black text-2xl text-white group-hover:gradient-text transition-all duration-300">
                  Leo PVT
                </span>
                <span className="block text-xs text-gray-300 font-medium tracking-wider">
                  LUXURY HOSTEL MONTREAL
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Premium Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl group ${
                    pathname === item.href 
                      ? 'text-white bg-white/10 backdrop-blur-sm' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-primary rounded-xl opacity-20"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-secondary rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Premium Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-subtle px-4 py-2 rounded-xl flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <Globe className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-sm font-medium">EN/FR</span>
            </motion.button>
            
            <motion.a
              href="tel:+15141234567"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-subtle px-4 py-2 rounded-xl flex items-center text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <Phone className="h-4 w-4 mr-2 group-hover:animate-pulse" />
              <span className="text-sm font-medium">+1 514-123-4567</span>
            </motion.a>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/book"
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Book Now
                  <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </motion.div>
          </div>

          {/* Premium Mobile Menu Button */}
          <div className="flex lg:hidden">
            <motion.button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="glass-effect p-3 rounded-xl text-white hover:text-accent-400 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Premium Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <motion.div 
                className="glass-effect rounded-3xl m-4 p-6 border border-white/10"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="space-y-2">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 rounded-2xl text-base font-semibold transition-all duration-300 ${
                          pathname === item.href
                            ? 'bg-gradient-primary text-white shadow-glow'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="border-t border-white/10 pt-6 mt-6 space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <a
                    href="tel:+15141234567"
                    className="flex items-center px-4 py-3 text-gray-300 hover:text-white transition-colors duration-300 rounded-2xl hover:bg-white/5"
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    +1 514-123-4567
                  </a>
                  
                  <Link
                    href="/book"
                    className="block btn-primary text-center w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book Your Stay
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}