'use client'

import { motion } from 'framer-motion'
import { shopConfig } from '../config'

export default function About() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-6"
    >
      <div className="bg-gradient-to-br from-mango-green to-mango-greenSoft backdrop-blur-md rounded-3xl p-7 shadow-lg border border-mango-green/30 overflow-hidden">
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight text-left">
            {shopConfig.about.title}
          </h2>
          <p className="text-white/90 leading-[1.7] text-[15px]">
            {shopConfig.about.shortDescription}
          </p>
        </div>
      </div>
    </motion.section>
  )
}
