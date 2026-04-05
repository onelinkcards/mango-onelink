'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

// Gallery images from public/gallery folder (Mango)
const galleryImages = [
  '/gallery/unnamed.webp',
  '/gallery/unnamed (1).webp',
  '/gallery/unnamed (2).webp',
  '/gallery/unnamed (3).webp',
  '/gallery/unnamed (4).webp',
  '/gallery/unnamed (5).webp',
]

const visibleImages = galleryImages.slice(0, 4)

export default function Gallery() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      visibleImages.forEach((src) => {
        const img = document.createElement('img')
        img.src = src
      })
    }
  }, [])

  const handleImageClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fromGallery', 'true')
    }
    router.push('/gallery')
  }

  return (
    <section id="gallery" className="w-full max-w-md mx-auto pt-8 pb-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left mb-1.5">
          Gallery
        </h2>
        <p className="text-sm sm:text-base text-slate-300/90 font-normal text-left">
          Moments at Mango
        </p>
      </motion.div>

      {/* 4 image grid – click any image → open gallery page */}
      <div className="grid grid-cols-2 gap-3">
        {visibleImages.map((imageSrc, index) => (
          <motion.div
            key={`gallery-${index}-${imageSrc}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
            onClick={handleImageClick}
          >
            <Image
              src={imageSrc}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 448px) 50vw, 224px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* View Gallery button – same style as View Full Menu */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-4"
      >
        <Link
          href="/gallery"
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('fromGallery', 'true')
            }
          }}
          className="block w-full bg-mango-green hover:bg-mango-greenSoft text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          View Gallery
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  )
}
