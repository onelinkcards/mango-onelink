'use client'

import { motion } from 'framer-motion'
import { Star, ExternalLink } from 'lucide-react'
import { shopConfig } from '../config'

export default function ReviewForm() {
  const handleReviewClick = () => {
    // Construct Google Maps review URL using Place ID
    let reviewsUrl = '#'
    
    if (shopConfig.google?.placeId) {
      // Use Google's write review URL with Place ID
      reviewsUrl = `https://search.google.com/local/writereview?placeid=${shopConfig.google.placeId}`
    }
    
    // Fallback to configured reviewsUrl or mapsUrl
    if (!reviewsUrl || reviewsUrl === '#') {
      reviewsUrl = shopConfig.google?.reviewsUrl || shopConfig.google?.mapsUrl || '#'
    }
    
    // Open Google Reviews page in new tab
    if (reviewsUrl && reviewsUrl !== '#') {
      window.open(reviewsUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 p-6 text-center shadow-lg"
      style={{ 
        background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
        borderColor: 'rgba(37, 99, 235, 0.3)'
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Star className="w-5 h-5" style={{ color: '#1e40af', fill: '#1e40af' }} />
        <h3 className="text-slate-800 font-bold text-lg">Review Us on Google</h3>
        <Star className="w-5 h-5" style={{ color: '#1e40af', fill: '#1e40af' }} />
      </div>
      
      <p className="text-slate-600 text-sm mb-5">
        Share your experience and help others discover our quality service
      </p>

      <motion.button
        onClick={handleReviewClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)',
          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)'
        }}
      >
        {/* Shine effect */}
        <div 
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            transform: 'translateX(-100%)',
            animation: 'shine-sweep 2s infinite'
          }}
        />
        <Star className="w-5 h-5 fill-white relative z-10" />
        <span className="relative z-10">Write a Review</span>
        <ExternalLink className="w-5 h-5 relative z-10" />
      </motion.button>

      <p className="text-slate-500 text-xs mt-3">
        Opens Google Maps to submit your review
      </p>
    </motion.div>
  )
}
