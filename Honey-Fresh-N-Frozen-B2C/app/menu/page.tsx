'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, FileText, Moon, Sun, ChevronsLeftRight } from 'lucide-react'
import { menuCategories } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'

type MenuCategoryKey = keyof typeof menuCategories

const categoryKeys: MenuCategoryKey[] = [
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

// PDF menu in public – opens in phone preview / browser
const MENU_PDF_URL = '/mango%20menu%2017-01-2025.pdf'

const defaultOrderMessage = "Hi Mango, I'd like to order from the menu. Please share today's availability and rates."

function MenuPageInner() {
  const searchParams = useSearchParams()
  const catParam = searchParams.get('cat') as MenuCategoryKey | null
  const initialCat = (catParam && categoryKeys.includes(catParam)) ? catParam : 'burgerPizza'
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>(initialCat)
  const [isLightMode, setIsLightMode] = useState(true)
  const [showSlideHint, setShowSlideHint] = useState(false)

  useEffect(() => {
    if (catParam && categoryKeys.includes(catParam)) {
      setActiveCategory(catParam)
    }
  }, [catParam])

  // Hint: show when user lands on menu page → auto-remove after 1 sec (or on scroll); next visit = show again
  useEffect(() => {
    if (typeof window === 'undefined') return
    setShowSlideHint(true)
    const hideAfter = setTimeout(() => setShowSlideHint(false), 1500)
    const onScroll = () => setShowSlideHint(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(hideAfter)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const currentCategory = menuCategories[activeCategory]

  const openWhatsApp = () => {
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9419532222'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    window.open(getWhatsAppLink(e164, defaultOrderMessage), '_blank')
  }

  return (
    <>
      <main
        className={`min-h-screen pb-24 transition-colors duration-300 w-full max-w-full overflow-x-hidden pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] ${
          isLightMode
            ? 'bg-gradient-to-b from-amber-50 via-slate-50 to-amber-50 text-slate-900'
            : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white'
        }`}
      >
        {/* Header – full bleed, no side padding (edge to edge on mobile) */}
        <div
          className={`border-b sticky top-0 z-20 backdrop-blur-md transition-colors duration-300 ${
            isLightMode ? 'border-slate-200 bg-white/95' : 'border-white/[0.06] bg-slate-900/95'
          }`}
          style={{
            paddingTop: 'max(0.25rem, env(safe-area-inset-top))',
            marginLeft: 'calc(-1 * max(0.5rem, env(safe-area-inset-left)))',
            marginRight: 'calc(-1 * max(0.5rem, env(safe-area-inset-right)))',
            paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
            paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
          }}
        >
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 pt-2 pb-2 flex items-center justify-between relative">
            <Link
              href="/#menu"
              className={`p-2 rounded-full transition-colors active:scale-95 z-10 ${
                isLightMode ? 'hover:bg-slate-100' : 'hover:bg-white/5'
              }`}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('fromMenu', 'true')
                }
              }}
            >
              <ArrowLeft
                className={`w-5 h-5 ${
                  isLightMode ? 'text-slate-900' : 'text-white'
                }`}
              />
            </Link>
            <h1
              className={`absolute left-0 right-0 text-center text-xl sm:text-2xl font-bold tracking-tight pointer-events-none ${
                isLightMode ? 'text-slate-900' : 'text-white'
              }`}
            >
              Our Menu
            </h1>
            <button
              type="button"
              onClick={() => setIsLightMode((v) => !v)}
              className="flex items-center gap-2 text-xs sm:text-sm font-semibold z-10 touch-manipulation"
            >
              <span
                className={`hidden sm:inline text-[12px] font-medium ${
                  isLightMode ? 'text-slate-700' : 'text-slate-200/80'
                }`}
              >
                {isLightMode ? 'Light mode' : 'Dark mode'}
              </span>
              <span
                className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full border transition-colors ${
                  isLightMode
                    ? 'bg-slate-100 border-slate-300 shadow-[0_4px_10px_rgba(148,163,184,0.55)]'
                    : 'bg-slate-800 border-slate-600 shadow-[0_6px_16px_rgba(15,23,42,0.8)]'
                }`}
              >
                <span
                  className={`absolute inset-y-0 left-0 flex w-1/2 items-center justify-center text-[11px] sm:text-xs ${
                    isLightMode ? 'text-amber-500' : 'text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </span>
                <span
                  className={`absolute inset-y-0 right-0 flex w-1/2 items-center justify-center text-[11px] sm:text-xs ${
                    !isLightMode ? 'text-slate-100' : 'text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </span>
                <span
                  className={`inline-block h-6 w-6 sm:h-7 sm:w-7 transform rounded-full bg-white shadow-lg transition-transform ${
                    isLightMode ? 'translate-x-[26px] sm:translate-x-[30px]' : 'translate-x-1'
                  }`}
                />
              </span>
            </button>
          </div>

          {/* View PDF Menu */}
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 pb-3">
            <a
              href={MENU_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-medium text-sm transition-colors border ${
                isLightMode
                  ? 'bg-slate-900 text-white border-slate-900/10 hover:bg-slate-800'
                  : 'bg-white/[0.08] text-white border-white/[0.1] hover:bg-white/[0.12]'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              View PDF Menu
            </a>
          </div>

          {/* Category tabs */}
          <div className="w-full max-w-md mx-auto px-3 sm:px-4 pb-3">
            <AnimatePresence>
              {showSlideHint && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-center gap-2 mb-3 py-2 px-3 rounded-xl text-sm font-medium"
                  style={{
                    background: isLightMode ? 'rgba(30, 77, 61, 0.08)' : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${isLightMode ? 'rgba(30, 77, 61, 0.2)' : 'rgba(255,255,255,0.15)'}`,
                    color: isLightMode ? '#1E4D3D' : 'rgba(255,255,255,0.95)',
                  }}
                >
                  <ChevronsLeftRight className="w-4 h-4 shrink-0" aria-hidden />
                  <span>Slide to view categories</span>
                  <ChevronsLeftRight className="w-4 h-4 shrink-0" aria-hidden />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5 -mx-1 px-1">
              {categoryKeys.map((key) => {
                const cat = menuCategories[key]
                const isActive = activeCategory === key
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    whileTap={{ scale: 0.97 }}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold whitespace-nowrap flex-shrink-0 text-sm ${
                      isActive
                        ? 'bg-mango-green text-white'
                        : isLightMode
                          ? 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200'
                          : 'bg-white/[0.06] text-white/90 hover:bg-white/[0.1] border border-white/[0.08]'
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Category hero – animates once when first in view, then stays */}
        <div className="w-full max-w-md mx-auto px-3 sm:px-4 pt-4 pb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={`relative h-32 rounded-[18px] overflow-hidden border transition-colors duration-300 ${
                isLightMode
                  ? 'border-amber-200/80 bg-amber-50/60 shadow-[0_18px_45px_rgba(15,23,42,0.18)]'
                  : 'border-white/[0.06] bg-white/5 shadow-[0_22px_60px_rgba(0,0,0,0.75)]'
              }`}
            >
              <Image
                src={currentCategory.image}
                alt={currentCategory.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 448px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h2 className="text-base font-bold text-white drop-shadow-lg">
                  {currentCategory.name}
                </h2>
                <p className="text-white/80 text-[11px] mt-0.5 line-clamp-1">
                  {currentCategory.shortDescription}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Items grid – animates once when first in view on scroll */}
        <div className="w-full max-w-md mx-auto px-3 sm:px-4 pt-3 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {currentCategory.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.02, 0.15) }}
                  className="group rounded-2xl overflow-hidden flex flex-col min-h-[136px] border transition-all duration-300 relative"
                  style={isLightMode
                    ? {
                        background: 'linear-gradient(135deg, #FEFCF0 0%, #FDF9EB 25%, #ffffff 55%, #ffffff 100%)',
                        border: '1px solid rgba(251, 236, 137, 0.28)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(251, 236, 137, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 18px 55px rgba(0,0,0,0.85)',
                      }
                  }
                >
                  {isLightMode && (
                    <div className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl pointer-events-none opacity-40" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 100%)' }} />
                  )}
                  <div className="p-3.5 flex flex-col flex-1 min-h-0 gap-0 relative z-10">
                    <div className="flex items-center justify-between gap-2 shrink-0 flex-wrap">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border tracking-wide shrink-0 ${
                          isLightMode
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300/80'
                            : 'bg-emerald-500/15 text-emerald-200 border-emerald-300/50'
                        }`}
                      >
                        Veg
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold tabular-nums border shadow-sm shrink-0 ${
                          isLightMode
                            ? 'bg-amber-50 text-amber-900 border-amber-300/80 shadow-[0_2px_8px_rgba(251,191,36,0.3)]'
                            : 'bg-black/40 text-amber-100 border-amber-400/50'
                        }`}
                      >
                        {item.price}
                      </span>
                    </div>
                    <h3
                      className={`text-[13px] sm:text-[14px] font-semibold leading-snug line-clamp-3 flex-1 min-h-0 mt-2 overflow-hidden break-words ${
                        isLightMode ? 'text-slate-900' : 'text-white/95'
                      }`}
                    >
                      {item.name}
                    </h3>
                    {item.quantity && item.quantity !== '1 portion' && (
                      <p
                        className={`text-[11px] mt-1.5 truncate shrink-0 ${
                          isLightMode ? 'text-slate-500' : 'text-white/45'
                        }`}
                      >
                        {item.quantity}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <p
            className={`mt-8 text-center text-[11px] ${
              isLightMode ? 'text-slate-500' : 'text-white/40'
            }`}
          >
            All items are vegetarian. Prices may vary. Confirm at the counter.
          </p>

          <div className="mt-10">
            <button
              onClick={openWhatsApp}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen pb-24 flex items-center justify-center"
          style={{ backgroundColor: '#1a1a1a' }}
        >
          <p className="text-white/70 text-sm">Loading menu…</p>
        </main>
      }
    >
      <MenuPageInner />
    </Suspense>
  )
}
