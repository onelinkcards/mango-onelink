'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ArrowRight, ChevronRight } from 'lucide-react'
import { shopConfig } from '../config'

interface Review {
  author_name: string
  author_url?: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

interface ReviewsData {
  rating: number
  totalReviews: number
  reviews: Review[]
  googleUrl?: string
}

export default function GoogleReviews() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!shopConfig.google?.placeId) {
      setLoading(false)
      setError('Google Place ID not configured')
      return
    }

    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/google-reviews?placeId=${encodeURIComponent(shopConfig.google.placeId)}`
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || errorData.error || 'Failed to fetch reviews')
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.message || data.error)
        }
        
        setReviewsData(data)
      } catch (err: any) {
        setError(err.message || 'Failed to load reviews. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Don't render if no place ID
  if (!shopConfig.google?.placeId) {
    return null
  }

  // Show skeleton loader
  if (loading) {
    return (
      <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Google Reviews
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 p-4 animate-pulse"
              style={{ height: '120px' }}
            />
          ))}
        </div>
      </section>
    )
  }

  // Show error state with message
  if (error || (!reviewsData && !loading)) {
    return (
      <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Google Reviews
          </h2>
          <Link
            href="/reviews"
            className="text-sm font-semibold text-white hover:text-white/90 transition-colors flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center">
          <p className="text-slate-300 mb-4">
            {error || 'Unable to load reviews at the moment.'}
          </p>
          <Link
            href="/reviews"
            className="inline-block bg-mango-green hover:bg-mango-greenSoft text-white font-semibold py-2 px-4 rounded-xl transition-all"
          >
            View Reviews Page
          </Link>
        </div>
      </section>
    )
  }

  if (!reviewsData) return null

  const displayReviews = reviewsData.reviews.slice(0, 2)

  return (
    <section id="reviews" className="w-full max-w-md mx-auto pt-8 pb-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
          Google Reviews
        </h2>
        <Link
          href="/reviews"
          className="text-sm font-semibold text-white hover:text-white/90 transition-colors flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(reviewsData.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            ))}
          </div>
          <span className="text-white font-bold text-lg">
            {reviewsData.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-slate-300 text-sm">
          Based on {reviewsData.totalReviews.toLocaleString()} reviews on Google
        </p>
      </motion.div>

      {/* Review Cards */}
      <div className="space-y-3">
        {displayReviews.map((review, index) => (
          <motion.div
            key={review.time}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
            className="rounded-2xl p-4 hover:shadow-lg transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-start gap-3 mb-2">
              {review.profile_photo_url ? (
                <Image
                  src={review.profile_photo_url}
                  alt={review.author_name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #2F6B55 0%, #1E4D3D 100%)'
                  }}
                >
                  <span className="text-white font-semibold text-sm">
                    {review.author_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-sm text-white drop-shadow-md">
                    {review.author_name}
                  </h3>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/80 drop-shadow-sm">
                  {review.relative_time_description}
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed line-clamp-3 text-white/90 drop-shadow-sm">
              {review.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-5 space-y-3"
      >
        <Link
          href="/reviews"
          className="block w-full font-semibold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          View All Reviews
          <ArrowRight className="w-4 h-4 text-white" />
        </Link>
        <Link
          href="/reviews#write-review"
          className="block w-full font-semibold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #1E4D3D 0%, #2F6B55 100%)',
            color: 'white'
          }}
        >
          Write a Review
          <Star className="w-4 h-4 fill-white text-white" />
        </Link>
      </motion.div>
    </section>
  )
}
