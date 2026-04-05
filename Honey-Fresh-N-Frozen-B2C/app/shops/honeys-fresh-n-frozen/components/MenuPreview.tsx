'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { menuCategories } from '../menu'

const categoryOrder: (keyof typeof menuCategories)[] = [
  'burgerPizza',
  'sandwichSalad',
  'momos',
  'pastaMaggiFries',
  'healthyDrinks',
  'wraps',
  'mojitosSmoothies',
  'shakesIceCream',
  'starters',
  'hotBeverages',
  'riceNoodlesSoups',
  'combos',
  'mainCourse',
  'thali',
]

// Show only 4 categories on home section (Burger & Pizza, Sandwich, Momos, Wraps)
const previewCategories: (keyof typeof menuCategories)[] = [
  'burgerPizza',
  'sandwichSalad',
  'momos',
  'wraps',
]

export default function MenuPreview() {
  return (
    <section id="menu" className="w-full max-w-md mx-auto py-8">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left mb-2">
          Our Menu
        </h2>
        <div className="h-0.5 w-12 rounded-full bg-mango-green/80 mb-3" aria-hidden />
        <p className="text-sm sm:text-base text-slate-200 font-medium text-left tracking-wide">
          Fresh • Pure Veg • Made with Care
        </p>
      </motion.div>

      {/* 4 card grid – same layout & sizing as Gallery on all viewports (incl. phone) */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {previewCategories.map((key, index) => {
          const category = menuCategories[key]
          return (
            <Link key={key} href={`/menu?cat=${key}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-lg transition-all duration-300 border border-white/10"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 448px) 50vw, 224px"
                />
                <div
                  className="absolute inset-0 z-[1]"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.88) 25%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.05) 100%)',
                  }}
                />
                {/* Icon: top-right corner */}
                <div
                  className="absolute top-3 right-3 w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center z-10 bg-white/20 border border-white/40 shadow-lg"
                >
                  <span className="text-xl sm:text-2xl">{category.icon}</span>
                </div>
                {/* Text: title bold white, subtitle lighter grey – gallery card style */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 z-10">
                  <h3 className="text-white font-bold text-base sm:text-lg mb-0.5 leading-tight line-clamp-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.85)' }}>
                    {category.name}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium leading-snug mb-2 line-clamp-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>
                    {category.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-slate-200 font-semibold text-xs sm:text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors border border-white/30">
                    View Items
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Link
          href="/menu"
          className="block w-full bg-mango-green hover:bg-mango-greenSoft text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          View Full Menu
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  )
}
