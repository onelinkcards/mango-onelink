'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { siteConfig } from '../data/site'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#000000',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw'
      }}
    >
      <div className="flex flex-col items-center" style={{ transform: 'translateY(-10%)' }}>
        {/* Square Border with Logo and Scanning Animation - Center */}
        <div className="relative mb-6">
          {/* Square Frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="w-40 h-40 bg-white rounded-xl shadow-2xl flex items-center justify-center overflow-hidden border-2 border-slate-200 relative"
          >
            {/* Logo in Center - zoomed in */}
            <div className="w-36 h-36 rounded-xl flex items-center justify-center shadow-xl overflow-hidden bg-mango-green p-1">
              <div className="w-full h-full flex items-center justify-center" style={{ transform: 'scale(1.35)' }}>
                <Image
                  src={shopConfig.assets.logo}
                  alt={`${shopConfig.name} Logo`}
                  width={144}
                  height={144}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>

            {/* Scanning Line */}
            <motion.div
              className="absolute inset-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent pointer-events-none"
              initial={{ top: 0 }}
              animate={{ top: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 0.3
              }}
              style={{
                boxShadow: '0 0 20px rgba(234, 179, 8, 0.8), 0 0 40px rgba(234, 179, 8, 0.5)'
              }}
            />

            {/* Corner Indicators */}
            <motion.div
              className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-yellow-400 rounded-tl-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-yellow-400 rounded-tr-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-400 rounded-bl-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-yellow-400 rounded-br-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          </motion.div>
        </div>

        {/* Welcome to Company Name - Below Square, Small Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-slate-400 mb-1">
            Welcome to
          </p>
          <p className="text-base font-bold text-white">
            {siteConfig.name}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
