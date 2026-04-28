'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Clock, Store, Hand } from 'lucide-react'
import { shopConfig, ContactPerson } from '../config'
import ActionsRow, { ActionsRowRef } from './ActionsRow'
import Card3D, { Face } from '../../../components/Card3D'
import PaymentFace from './PaymentFace'
import { useLanguage } from '../../../contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const [currentFace, setCurrentFace] = useState<Face>('front')
  const [isFlipping, setIsFlipping] = useState(false)
  const [headerImageIndex, setHeaderImageIndex] = useState(0)
  const actionsRowRef = useRef<ActionsRowRef>(null)

  const headerImages = [
    '/gallery/unnamed.webp',
    '/gallery/unnamed%20(1).webp',
    '/gallery/unnamed%20(5).webp',
  ]

  const handleFlip = (e?: React.MouseEvent, forceFlip = false) => {
    // Prevent flip if clicking on buttons or during animation (unless forced by flip button)
    if (isFlipping) return
    if (!forceFlip && e && (e.target as HTMLElement).closest('button, a, [role="button"]')) {
      return
    }
    
    setIsFlipping(true)
    if (currentFace === 'front') {
      setCurrentFace('info')
    } else if (currentFace === 'info') {
      setCurrentFace('front')
    } else {
      setCurrentFace('info')
    }
    
    setTimeout(() => {
      setIsFlipping(false)
    }, 850) // Slightly longer than animation duration (0.8s)
  }

  const handleOpenPayments = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCurrentFace('payment')
    setTimeout(() => {
      setIsFlipping(false)
    }, 850)
  }

  const handleBackFromPayment = () => {
    if (isFlipping) return
    setIsFlipping(true)
    setCurrentFace('front')
    setTimeout(() => {
      setIsFlipping(false)
    }, 850)
  }

  // Open payment face when returning from menu page (Proceed to Payment)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('openPayment')) {
      sessionStorage.removeItem('openPayment')
      const t = setTimeout(handleOpenPayments, 150)
      return () => clearTimeout(t)
    }
  }, [])

  // Header image carousel: cycle through 3 images very smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setHeaderImageIndex((i) => (i + 1) % headerImages.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [headerImages.length])

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      className="w-full max-w-md mx-auto pt-4 pb-6 min-w-0"
      style={{ width: '100%', maxWidth: 'min(100%, 28rem)' }}
    >
      <Card3D
        currentFace={currentFace}
        isFlipping={isFlipping}
        faceFront={
          <div 
          className="rounded-[24px] shadow-2xl relative cursor-pointer overflow-hidden"
          style={{
            background: 'linear-gradient(165deg, #FBEC89 0%, #FDF8E0 18%, #ffffff 45%, #FEFDF5 70%, #ffffff 100%)',
            border: '1px solid rgba(251, 236, 137, 0.45)',
            boxShadow: '0 12px 40px rgba(251, 236, 137, 0.2), 0 4px 20px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
            minHeight: '580px',
            boxSizing: 'border-box'
          }}
            onClick={(e) => {
              // Flip on click anywhere except buttons/links
              const target = e.target as HTMLElement
              const isButton = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button, a')
              const isInActionsRow = target.closest('[data-actions-row]')
              const isInSocialIcons = target.closest('[data-social-icons]')
              const isSVG = target.tagName === 'svg' || target.closest('svg')
              const isInSVG = isSVG && target.closest('[data-social-icons]')
              if (!isButton && !isInActionsRow && !isInSocialIcons && !isInSVG) {
                handleFlip(e)
              }
            }}
          >
            {/* Shiny top highlight */}
            <div className="absolute inset-x-0 top-0 h-24 rounded-t-[24px] pointer-events-none z-0 opacity-70" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)' }} />

            {/* Tap to flip – corner hint (front face only) */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); handleFlip(e); }}
              className="absolute top-4 right-4 z-10 text-xs font-semibold text-slate-700 bg-white/90 hover:bg-white px-3 py-2 rounded-full shadow-lg cursor-pointer transition-all flex items-center gap-1.5 touch-manipulation border border-amber-200/60"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label={t('tapToFlip')}
            >
              <Hand className="w-3.5 h-3.5 text-slate-600" />
              <span style={{ fontSize: '12px' }}>{t('tapToFlip')}</span>
            </motion.button>

            {/* Header – 3 images, smooth crossfade */}
            <div className="relative h-40 bg-slate-900 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={headerImageIndex}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Image
                    src={headerImages[headerImageIndex]}
                    alt="Mango Restaurant"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 448px) 100vw, 448px"
                    unoptimized
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Social Media Icons - At header border line (same line as logo, right side) */}
            <motion.div 
              data-social-icons
              className="absolute right-2 z-20 flex items-center gap-3 social-icons-top"
              style={{ top: '8.5rem' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
              onTouchStart={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              {/* Instagram - Opens selector */}
              {shopConfig.social?.instagram && (
                <motion.button
                  data-instagram-button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    window.open(shopConfig.social.instagram, '_blank', 'noopener,noreferrer')
                  }}
                  className="h-11 w-11 p-0.5 rounded-full shadow-2xl flex items-center justify-center overflow-hidden transition-all cursor-pointer touch-manipulation"
                  style={{
                    background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)',
                    WebkitTapHighlightColor: 'transparent',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)'
                  }}
                  title="Follow @mangojammu"
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <Image
                      src="/social.png"
                      alt="Instagram"
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.button>
              )}
              
              {/* WhatsApp - Opens Selector in Card */}
              <motion.button
                data-whatsapp-button
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  // Trigger WhatsApp selector in ActionsRow
                  actionsRowRef.current?.openWhatsAppSelector()
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                onTouchStart={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-11 w-11 p-0 rounded-full shadow-2xl border-2 border-[#25D366] flex items-center justify-center overflow-hidden transition-all cursor-pointer bg-white touch-manipulation"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </motion.button>
            </motion.div>

            {/* Content – same layout desktop/phone; responsive padding so action row stays in view */}
            <div className="relative px-4 sm:px-5 pb-6 pt-3 max-w-full" style={{ backgroundColor: 'rgba(253, 255, 255, 0.5)' }}>
              {/* Logo Circle - subtle float animation, no glow */}
              <motion.div
                className="absolute -top-14 left-6"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  y: [0, -5, 0],
                }}
                transition={{
                  scale: { duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] },
                  opacity: { duration: 0.4, delay: 0.1 },
                  y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'reverse' },
                }}
              >
                <div className="w-32 h-32 rounded-full flex items-center justify-center overflow-hidden bg-white p-1.5 border-2 border-slate-200/70 shadow-lg">
                  <Image
                    src={shopConfig.assets.logo}
                    alt={`${shopConfig.name} Logo`}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                    style={{ transform: 'scale(1.25)' }}
                  />
                </div>
              </motion.div>

              {/* Brand info - MANGO + subtitle + keyword badges */}
              <motion.div
                className="pt-20 mb-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.45, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <h1 className="text-2xl font-black text-slate-900 mb-1 leading-tight tracking-tight">
                  {shopConfig.name}
                </h1>
                <p className="text-mango-green font-semibold text-[15px] mb-3">
                  {shopConfig.tagline}
                </p>
                {'keywordBadges' in shopConfig && Array.isArray(shopConfig.keywordBadges) && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {shopConfig.keywordBadges.map((badge: string) => (
                      <span
                        key={badge}
                        className="inline-flex px-2.5 py-1 rounded-full bg-mango-lightGreen border border-mango-green/20 text-mango-green text-xs font-medium"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Actions - smooth appear after card */}
              <motion.div
                data-actions-row
                className="w-full min-w-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <ActionsRow 
                  ref={actionsRowRef}
                  onOpenPayments={handleOpenPayments}
                />
              </motion.div>

            </div>
          </div>
        }
        faceInfo={
          <div
            className="bg-gradient-to-br from-mango-green to-mango-greenSoft backdrop-blur-md rounded-[24px] shadow-2xl border-2 border-mango-green/50 cursor-pointer relative h-full overflow-hidden flex flex-col touch-manipulation"
            style={{ minHeight: '580px', boxSizing: 'border-box', WebkitTapHighlightColor: 'transparent' }}
            onClick={(e) => {
              const t = e.target as HTMLElement
              if (t.closest('[data-no-info-flip]')) return
              handleFlip(e, true)
            }}
          >
            {/* Tap to Return – must use forceFlip; plain handleFlip ignores all buttons */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={currentFace === 'info' ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleFlip(e, true)
              }}
              className="absolute top-4 right-4 z-20 text-xs text-white font-semibold bg-white/20 hover:bg-white/30 px-3 py-2 rounded-full backdrop-blur-md shadow-lg cursor-pointer transition-all flex items-center gap-1.5 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label={t('tapToReturn')}
            >
              <Hand className="w-3.5 h-3.5 text-white" />
              <span style={{ fontSize: '12px' }}>{t('tapToReturn')}</span>
            </motion.button>

            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%)',
              }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Content – same width as main card, no scroll; fits within card like reference */}
            <div className="relative flex-1 flex flex-col items-center min-h-0 px-4 pt-16 pb-5 text-white overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={currentFace === 'info' ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="w-full flex flex-col items-center max-w-[calc(100%-2rem)] flex-shrink-0 min-h-[555px] mt-[3px] mb-[3px]"
              >
                {/* Title – centered below Tap to Return, slightly smaller, pushed down */}
                <h2 className="text-[23px] sm:text-2xl font-black mb-[11px] pt-[7px] pb-[7px] h-[42px] tracking-wide text-white text-center w-full [text-shadow:0_1px_3px_rgba(0,0,0,0.25)]">
                  Business Snapshot
                </h2>

                {/* Block 1: Location – same card depth & frosted style as reference */}
                <div className="flex items-start gap-3 w-full mb-2 rounded-2xl p-3 bg-white/15 backdrop-blur-md border border-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 drop-shadow-md text-white" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-bold leading-snug text-white/95">Location</p>
                    <p className="text-sm leading-relaxed text-white/90">Shop No 32, B2 South Block, Bahu Plaza, Gandhi Nagar, Jammu, Jammu & Kashmir – 180004</p>
                  </div>
                </div>

                {/* Block 2: Services – same card depth & frosted style */}
                <div className="flex items-start gap-3 w-full mb-2 rounded-2xl p-3 bg-white/15 backdrop-blur-md border border-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
                  <Store className="w-5 h-5 flex-shrink-0 mt-0.5 drop-shadow-md text-white" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-bold leading-snug text-white/95">Services</p>
                    <p className="text-sm leading-relaxed text-white/90">Dine-In • Takeaway • Pure Vegetarian</p>
                  </div>
                </div>

                {/* Block 3: Timings – same card depth & frosted style */}
                <div className="flex items-start gap-3 w-full mb-3 rounded-2xl p-3 bg-white/15 backdrop-blur-md border border-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5 drop-shadow-md text-white" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-bold leading-snug text-white/95">Timings</p>
                    <p className="text-sm leading-relaxed text-white/90">Monday – Saturday: 10:30 AM – 9:30 PM</p>
                    <p className="text-sm leading-relaxed text-white/90">Sunday: 11:00 AM – 9:30 PM</p>
                  </div>
                </div>

                {/* Google Map – same card depth, frosted border & shadow as info cards */}
                <div className="w-full h-32 rounded-2xl overflow-hidden mb-3 pointer-events-none flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(shopConfig.contact.mapQuery)}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, pointerEvents: 'none' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Open in Maps – centered pill button at bottom */}
                <motion.a
                  data-no-info-flip
                  href={`https://www.google.com/maps?q=${encodeURIComponent(shopConfig.contact.mapQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-white/25 hover:bg-white/35 text-white font-semibold px-6 py-3 rounded-full border border-white/30 backdrop-blur-sm touch-manipulation pointer-events-auto shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    window.open(
                      `https://www.google.com/maps?q=${encodeURIComponent(shopConfig.contact.mapQuery)}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }}
                  style={{ fontSize: '14px', WebkitTapHighlightColor: 'transparent' }}
                >
                  <MapPin className="w-5 h-5" />
                  Open in Maps
                </motion.a>
              </motion.div>
            </div>
          </div>
        }
        facePayment={
          <PaymentFace
            upiId={shopConfig.payment.upiId}
            upiName={shopConfig.payment.upiName}
            upiQrImageUrl={shopConfig.payment.upiQrImageUrl}
            scannerImage={shopConfig.payment.scannerImage}
            bank={shopConfig.payment.bank}
            onBack={handleBackFromPayment}
          />
        }
      />

    </motion.section>
  )
}
