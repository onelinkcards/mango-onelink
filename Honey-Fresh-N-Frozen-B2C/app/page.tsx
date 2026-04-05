'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
// Shop-specific components
import Hero from './shops/honeys-fresh-n-frozen/components/Hero'
import About from './shops/honeys-fresh-n-frozen/components/About'
import MenuPreview from './shops/honeys-fresh-n-frozen/components/MenuPreview'
import Services from './shops/honeys-fresh-n-frozen/components/Services'
import SocialConnect from './shops/honeys-fresh-n-frozen/components/SocialConnect'
import ContactCard from './shops/honeys-fresh-n-frozen/components/ContactCard'
// Shop-specific components (Gallery and Reviews)
import Gallery from './shops/honeys-fresh-n-frozen/components/Gallery'
import GoogleReviews from './shops/honeys-fresh-n-frozen/components/GoogleReviews'
// Shared components
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import LoadingScreen from './components/LoadingScreen'

export default function Home() {
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Check if coming from gallery, menu, or reviews page - skip loading screen
    if (typeof window !== 'undefined') {
      const fromGallery = sessionStorage.getItem('fromGallery')
      const fromMenu = sessionStorage.getItem('fromMenu')
      const fromReviews = sessionStorage.getItem('fromReviews')
      
      if (fromGallery === 'true') {
        // Skip loading screen when coming from gallery
        setShowLoading(false)
        sessionStorage.removeItem('fromGallery')
        
        // Scroll to gallery section
        setTimeout(() => {
          const gallerySection = document.getElementById('gallery')
          if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
        return
      }
      
      if (fromMenu === 'true') {
        // Skip loading screen when coming from menu
        setShowLoading(false)
        sessionStorage.removeItem('fromMenu')
        
        // Scroll to menu section
        setTimeout(() => {
          const menuSection = document.getElementById('menu')
          if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
        return
      }
      
      if (fromReviews === 'true') {
        // Skip loading screen when coming from reviews
        setShowLoading(false)
        sessionStorage.removeItem('fromReviews')
        
        // Scroll to reviews section
        setTimeout(() => {
          const reviewsSection = document.getElementById('reviews')
          if (reviewsSection) {
            reviewsSection.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
        return
      }
    }

    // Show loading screen on every page load/refresh for 3.5 seconds
    const timer = setTimeout(() => {
      setShowLoading(false)
    }, 3500)

    // Fallback: ensure loading screen always disappears after 5 seconds max
    const fallbackTimer = setTimeout(() => {
      setShowLoading(false)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // Handle hash navigation after loading
  useEffect(() => {
    if (!showLoading && typeof window !== 'undefined') {
      // If there's a #gallery hash on refresh, remove it and scroll to top
      if (window.location.hash === '#gallery') {
        window.history.replaceState(null, '', window.location.pathname)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }, [showLoading])

  return (
    <>
      <AnimatePresence>
        {showLoading && (
          <LoadingScreen key="loading" />
        )}
      </AnimatePresence>
      {!showLoading && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="min-h-screen pb-12 relative z-10 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <Hero />
          <About />
          <MenuPreview />
          <Services />
          <Gallery />
          <GoogleReviews />
          <SocialConnect />
          <ContactCard />
          <Footer />
          <BackToTop />
        </motion.main>
      )}
    </>
  )
}
