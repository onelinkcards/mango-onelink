'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ChevronLeft, ChevronRight, X, Image as ImageIcon, Video } from 'lucide-react'

// Gallery images from public/gallery folder
const galleryImages = [
  '/gallery/unnamed.webp',
  '/gallery/unnamed (1).webp',
  '/gallery/unnamed (2).webp',
  '/gallery/unnamed (3).webp',
  '/gallery/unnamed (4).webp',
  '/gallery/unnamed (5).webp',
]

// No videos – show banner when on Videos tab
const galleryVideos: { src: string; thumbnail: string; title: string }[] = []

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      galleryImages.slice(0, 6).forEach((src) => {
        const img = document.createElement('img')
        img.src = src
        img.loading = 'eager'
      })
    }
  }, [])

  useEffect(() => {
    if (lightboxOpen && typeof window !== 'undefined') {
      setImageLoading(true)
      const preloadIndexes = [
        photoIndex === 0 ? galleryImages.length - 1 : photoIndex - 1,
        photoIndex,
        photoIndex === galleryImages.length - 1 ? 0 : photoIndex + 1,
      ]
      preloadIndexes.forEach((idx) => {
        const img = document.createElement('img')
        img.src = galleryImages[idx]
        img.onload = () => {
          if (idx === photoIndex) {
            setImageLoading(false)
          }
        }
      })
    }
  }, [lightboxOpen, photoIndex])

  const openLightbox = (index: number) => {
    setPhotoIndex(index)
    setLightboxOpen(true)
    setImageLoading(true)
  }

  const goPrev = () => {
    setImageLoading(true)
    setPhotoIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  }

  const goNext = () => {
    setImageLoading(true)
    setPhotoIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <main className="min-h-screen pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="border-b border-gray-700 sticky top-0 z-20 bg-[rgba(26,26,26,0.95)] backdrop-blur-md">
          <div className="max-w-md mx-auto py-3 sm:py-4 flex items-center gap-2 sm:gap-3">
            <Link
              href="/#gallery"
              className="p-2.5 sm:p-3 hover:bg-slate-800 rounded-full transition-colors"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('fromGallery', 'true')
                }
              }}
            >
              <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 text-slate-200" />
            </Link>
            <h1 className="text-lg sm:text-xl font-bold text-white">Gallery</h1>
          </div>
        </div>

        <div className="max-w-md mx-auto py-4 sm:py-6">
          <div className="flex gap-3 mb-4 sm:mb-6">
            <motion.button
              onClick={() => setActiveTab('photos')}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all ${
                activeTab === 'photos'
                  ? 'bg-mango-green text-white shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/90 border border-slate-700/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2.5">
                <ImageIcon className={`w-5 h-5 ${activeTab === 'photos' ? 'text-white' : 'text-slate-400'}`} strokeWidth={2.5} />
                Photos
              </span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('videos')}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 px-5 py-3.5 rounded-2xl font-semibold text-sm sm:text-base transition-all ${
                activeTab === 'videos'
                  ? 'bg-mango-green text-white shadow-lg'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/90 border border-slate-700/50'
              }`}
            >
              <span className="flex items-center justify-center gap-2.5">
                <Video className={`w-5 h-5 ${activeTab === 'videos' ? 'text-white' : 'text-slate-400'}`} strokeWidth={2.5} />
                Videos
              </span>
            </motion.button>
          </div>

          {activeTab === 'photos' && galleryImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {galleryImages.map((imageSrc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="rounded-xl sm:rounded-2xl shadow-md aspect-square overflow-hidden cursor-pointer group hover:shadow-xl hover:-translate-y-1 transition-all relative"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={imageSrc}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                    priority={index < 4}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    quality={85}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* No videos – banner */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-600/50 bg-slate-800/60 p-8 sm:p-10 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/80 flex items-center justify-center">
                <Video className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No videos yet</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Video content will appear here when available. Check back later.
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.div
              key={photoIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={galleryImages[photoIndex]}
                alt={`Gallery image ${photoIndex + 1}`}
                width={1600}
                height={1600}
                className={`w-full h-auto max-h-[90vh] object-contain rounded-xl transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                priority
                quality={90}
                unoptimized
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <span className="text-white text-sm font-medium">
                  {photoIndex + 1} / {galleryImages.length}
                </span>
              </div>
            </motion.div>
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goPrev()
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goNext()
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
