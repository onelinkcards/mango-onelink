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
      <div className="section-shell section-shell-green">
        <div className="section-shell-inner p-7 sm:p-8">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[#FBEC89]/18 blur-3xl" />
          <div className="absolute left-[-2rem] bottom-[-2rem] h-28 w-28 rounded-full bg-white/[0.08] blur-3xl" />

          <div className="relative">
            <div className="section-title-accent mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
                {shopConfig.about.title}
              </h2>
            </div>
            <p className="text-white/90 leading-[1.75] text-[15px]">
              {shopConfig.about.shortDescription}
            </p>
            <div className="mt-6 h-px w-full bg-gradient-to-r from-white/40 via-[#FBEC89]/65 to-transparent" />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
