'use client'

import { useState, useEffect, Suspense, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Moon, Sun, ChevronsLeftRight, ShoppingCart, Plus, Minus, Check, List, X, ChevronDown, ChevronUp } from 'lucide-react'
import { menuCategories, type CartItem, type MenuItem } from '../shops/honeys-fresh-n-frozen/menu'
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
  const router = useRouter()
  const catParam = searchParams.get('cat') as MenuCategoryKey | null
  const mode = searchParams.get('mode')
  const isOrderMode = mode === 'order'
  const useWhiteOrderTheme = isOrderMode
  const initialCat = (catParam && categoryKeys.includes(catParam)) ? catParam : 'burgerPizza'
  const [activeCategory, setActiveCategory] = useState<MenuCategoryKey>(initialCat)
  const [isLightMode, setIsLightMode] = useState(true)
  const [showSlideHint, setShowSlideHint] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [lastAddedItemId, setLastAddedItemId] = useState<string | null>(null)
  const [cartBarPulse, setCartBarPulse] = useState(false)
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  const [expandedOrderCategory, setExpandedOrderCategory] = useState<MenuCategoryKey | null>(initialCat)
  const [activeFilter, setActiveFilter] = useState<'all' | 'bestsellers' | 'under150' | 'under300' | 'quickBites' | 'meals' | 'drinks' | 'desserts' | 'combos'>('all')
  const categoryRefs = useRef<Partial<Record<MenuCategoryKey, HTMLButtonElement | null>>>({})
  const orderSectionRefs = useRef<Partial<Record<MenuCategoryKey, HTMLElement | null>>>({})
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (catParam && categoryKeys.includes(catParam)) {
      setActiveCategory(catParam)
      setExpandedOrderCategory(catParam)
    }
  }, [catParam])

  useEffect(() => {
    const el = categoryRefs.current[activeCategory]
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [activeCategory])

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
  const currentItemCount = currentCategory.items.length

  const openWhatsApp = () => {
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9419532222'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    window.open(getWhatsAppLink(e164, defaultOrderMessage), '_blank')
  }

  const addToCart = (menuItem: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id)
      if (existing) return prev.map((item) => item.id === menuItem.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item)
      return [...prev, { ...menuItem, cartQuantity: 1 }]
    })
    setLastAddedItemId(menuItem.id)
    setCartBarPulse(true)
    window.setTimeout(() => setLastAddedItemId(null), 550)
    window.setTimeout(() => setCartBarPulse(false), 320)
  }

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId))
      return
    }
    setCart((prev) => prev.map((item) => item.id === itemId ? { ...item, cartQuantity: qty } : item))
    setCartBarPulse(true)
    window.setTimeout(() => setCartBarPulse(false), 320)
  }

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.cartQuantity, 0)
  const getItemNumericPrice = (price: string) => {
    const numeric = parseFloat(price.replace('₹', '').replace(',', '').split('/')[0].trim())
    return isNaN(numeric) ? 0 : numeric
  }
  const getTotalPrice = () =>
    cart.reduce((sum, item) => {
      const numeric = getItemNumericPrice(item.price)
      return sum + numeric * item.cartQuantity
    }, 0)

  const filteredOrderCategories = useMemo(() => {
    return categoryKeys
      .map((key) => {
        const cat = menuCategories[key]
        const items = cat.items.filter((item) => {
          const price = getItemNumericPrice(item.price)
          if (activeFilter === 'all') return true
          if (activeFilter === 'bestsellers') return Boolean((item as MenuItem & { bestseller?: boolean }).bestseller)
          if (activeFilter === 'under150') return price > 0 && price <= 150
          if (activeFilter === 'under300') return price > 0 && price <= 300
          if (activeFilter === 'quickBites') return ['burgerPizza', 'sandwichSalad', 'momos', 'pastaMaggiFries', 'wraps', 'starters'].includes(key)
          if (activeFilter === 'meals') return ['mainCourse', 'riceNoodlesSoups', 'thali'].includes(key)
          if (activeFilter === 'drinks') return ['healthyDrinks', 'mojitosSmoothies', 'shakesIceCream', 'hotBeverages'].includes(key)
          if (activeFilter === 'desserts') return ['shakesIceCream'].includes(key)
          if (activeFilter === 'combos') return ['combos'].includes(key)
          return true
        })
        return { key, cat, items }
      })
      .filter((entry) => entry.items.length > 0)
  }, [activeFilter])

  useEffect(() => {
    if (!isOrderMode) return
    const first = filteredOrderCategories[0]
    if (!first) {
      setExpandedOrderCategory(null)
      return
    }
    setExpandedOrderCategory(first.key)
    setActiveCategory(first.key)
  }, [activeFilter, isOrderMode, filteredOrderCategories])
  const goToCheckout = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('mango_checkout_cart', JSON.stringify(cart))
    }
    router.push('/checkout')
  }

  const moveCategory = (direction: 'next' | 'prev') => {
    const idx = categoryKeys.indexOf(activeCategory)
    if (idx < 0) return
    const nextIdx = direction === 'next'
      ? Math.min(categoryKeys.length - 1, idx + 1)
      : Math.max(0, idx - 1)
    setActiveCategory(categoryKeys[nextIdx])
    setExpandedOrderCategory(categoryKeys[nextIdx])
  }

  const scrollToCategorySection = (key: MenuCategoryKey) => {
    const section = orderSectionRefs.current[key]
    const container = scrollContainerRef.current
    if (section && container) {
      container.scrollTo({
        top: Math.max(0, section.offsetTop - 12),
        behavior: 'smooth',
      })
      return
    }
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="relative max-w-[430px] mx-auto min-h-screen overflow-hidden">
      <div ref={scrollContainerRef} className="h-screen overflow-y-auto">
      <main
        className={`relative min-h-screen ${isOrderMode ? (cart.length > 0 ? 'pb-[160px]' : 'pb-[90px]') : 'pb-24'} transition-colors duration-300 w-full max-w-full pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] ${
          useWhiteOrderTheme
            ? 'bg-gradient-to-b from-white via-[#fcfcfd] to-[#f7f8fa] text-slate-900'
            : isLightMode
            ? 'bg-gradient-to-b from-[#fff8e8] via-slate-50 to-[#fef2d7] text-slate-900'
            : 'bg-gradient-to-b from-slate-950 via-[#08110f] to-slate-950 text-white'
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className={`absolute -top-14 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl ${isLightMode ? 'bg-[#FBEC89]/20' : 'bg-[#FBEC89]/10'}`} />
          <div className={`absolute top-[22rem] -left-20 h-64 w-64 rounded-full blur-3xl ${isLightMode ? 'bg-mango-green/12' : 'bg-mango-green/16'}`} />
          <div className={`absolute bottom-[18rem] right-[-5rem] h-72 w-72 rounded-full blur-3xl ${isLightMode ? 'bg-[#FBEC89]/15' : 'bg-white/[0.05]'}`} />
        </div>

        <div
          className={`${isOrderMode ? 'relative' : 'sticky top-0'} z-20 backdrop-blur-xl transition-colors duration-300 ${
            useWhiteOrderTheme ? 'bg-white/90' : isLightMode ? 'bg-[#fff8e8]/85' : 'bg-slate-950/72'
          }`}
          style={{
            paddingTop: 'max(0.4rem, env(safe-area-inset-top))',
          }}
        >
          <div className={`w-full max-w-md mx-auto px-3 sm:px-4 ${isOrderMode ? 'pb-2' : 'pb-3'}`}>
            <div
              className={`${isOrderMode ? 'rounded-[20px] px-3 sm:px-4 py-2' : 'rounded-[28px] px-3 sm:px-4 py-3'} border transition-colors duration-300 ${
                useWhiteOrderTheme
                  ? 'border-slate-200 bg-white shadow-[0_14px_28px_rgba(15,23,42,0.08)]'
                  : isLightMode
                  ? 'border-amber-200/80 bg-white/[0.88] shadow-[0_18px_40px_rgba(148,163,184,0.16)]'
                  : 'border-white/[0.08] bg-white/[0.05] shadow-[0_20px_44px_rgba(0,0,0,0.42)]'
              }`}
              style={isOrderMode
                ? {
                    background: 'linear-gradient(135deg, rgba(209,250,229,0.72), rgba(167,243,208,0.45))',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderColor: 'rgba(110,231,183,0.65)',
                    boxShadow: '0 14px 28px rgba(16,185,129,0.10), inset 0 1px 0 rgba(255,255,255,0.7)',
                  }
                : undefined}
            >
              <div className="flex items-center justify-between relative">
                <Link
                  href="/"
                  className={`p-2 rounded-full transition-colors active:scale-95 z-10 ${
                    isOrderMode
                      ? 'bg-white/90 text-slate-900 shadow-[0_8px_18px_rgba(15,23,42,0.2)] hover:bg-white'
                      : isLightMode ? 'hover:bg-slate-100' : 'hover:bg-white/5'
                  }`}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('fromMenu', 'true')
                    }
                  }}
                >
                  <ArrowLeft
                    className={`w-5 h-5 ${
                      isOrderMode ? 'text-slate-900' : isLightMode ? 'text-slate-900' : 'text-white'
                    }`}
                  />
                </Link>
                <h1
                  className={`absolute left-0 right-0 text-center ${isOrderMode ? 'text-[22px] sm:text-2xl' : 'text-xl sm:text-2xl'} font-bold tracking-tight pointer-events-none ${
                    isOrderMode ? 'text-slate-900' : isLightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {isOrderMode ? 'Order Online' : 'Our Menu'}
                </h1>
                {!isOrderMode && (
                  <button
                    type="button"
                    onClick={() => setIsLightMode((v) => !v)}
                    className="flex items-center text-xs sm:text-sm font-semibold z-10 touch-manipulation"
                  >
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
                )}
              </div>

              {!isOrderMode && <div className="mt-4">
                <a
                  href={MENU_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl font-medium text-sm transition-colors border ${
                    isLightMode
                      ? 'bg-slate-900 text-white border-slate-900/10 hover:bg-slate-800 shadow-[0_16px_30px_rgba(15,23,42,0.14)]'
                      : 'bg-white/[0.08] text-white border-white/[0.1] hover:bg-white/[0.12] shadow-[0_18px_34px_rgba(0,0,0,0.28)]'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 shrink-0" />
                  View PDF Menu
                </a>
              </div>}

              <div className="mt-4">
                <AnimatePresence>
                  {!isOrderMode && showSlideHint && (
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
                {!isOrderMode && <div className="mb-2 flex items-center justify-between px-1">
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${isLightMode ? 'text-slate-500' : 'text-white/65'}`}>
                    Browse Categories
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => moveCategory('prev')}
                      className={`h-7 px-2 rounded-full text-[11px] font-semibold border transition-colors ${isLightMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/[0.08] border-white/15 text-white/90'}`}
                    >
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => moveCategory('next')}
                      className={`h-7 px-2 rounded-full text-[11px] font-semibold border transition-colors ${isLightMode ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-white/[0.08] border-white/15 text-white/90'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>}
                <div className={`${isOrderMode ? 'hidden' : 'flex'} gap-2 overflow-x-auto scrollbar-hide pb-0.5 -mx-1 px-1`}>
                  {categoryKeys.map((key) => {
                    const cat = menuCategories[key]
                    const isActive = activeCategory === key
                    return (
                      <motion.button
                        key={key}
                        ref={(el) => { categoryRefs.current[key] = el }}
                        onClick={() => setActiveCategory(key)}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl font-semibold whitespace-nowrap flex-shrink-0 text-sm transition-all ${
                          isActive
                            ? 'bg-mango-green text-white shadow-[0_14px_28px_rgba(30,77,61,0.25)]'
                            : isLightMode
                              ? 'bg-white text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-[0_10px_18px_rgba(148,163,184,0.12)]'
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
          </div>
        </div>

        <div className="relative z-10">
          {!isOrderMode && <div className="w-full max-w-md mx-auto px-3 sm:px-4 pt-4 pb-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`relative h-40 rounded-[24px] overflow-hidden border transition-colors duration-300 ${
                  useWhiteOrderTheme
                    ? 'border-slate-200 bg-gradient-to-br from-white via-[#fdfdfd] to-[#f7f7f8] shadow-[0_16px_34px_rgba(15,23,42,0.08)]'
                    : isLightMode
                    ? 'border-rose-200 bg-gradient-to-br from-[#fff1f4] via-[#ffe6ec] to-[#ffd8e1] shadow-[0_22px_52px_rgba(242,82,105,0.2)]'
                    : 'border-rose-300/20 bg-gradient-to-br from-[#2b0d13] via-[#3b111a] to-[#22090f] shadow-[0_22px_60px_rgba(0,0,0,0.75)]'
                }`}
              >
                <div className={`absolute inset-x-8 top-4 h-12 rounded-full blur-3xl ${useWhiteOrderTheme ? 'bg-slate-300/30' : isLightMode ? 'bg-rose-500/20' : 'bg-rose-400/20'}`} />
                <div className={`absolute inset-[1px] rounded-[23px] border ${isLightMode ? 'border-white/70' : 'border-white/10'}`} />
                <div className={`absolute inset-0 ${useWhiteOrderTheme ? 'bg-gradient-to-r from-slate-900/5 via-slate-700/5 to-transparent' : isLightMode ? 'bg-gradient-to-r from-rose-900/30 via-rose-800/10 to-transparent' : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'}`} />
                <div className={`absolute top-4 right-4 premium-meta-pill ${useWhiteOrderTheme ? 'border border-slate-200 bg-white text-slate-700 shadow-[0_8px_16px_rgba(15,23,42,0.08)]' : isLightMode ? 'border border-rose-200 bg-white/88 text-rose-900 shadow-[0_10px_20px_rgba(242,82,105,0.18)]' : 'border border-rose-300/20 bg-black/30 text-rose-100'}`}>
                  <span className="text-sm">{currentCategory.icon}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className={`max-w-[17rem] rounded-2xl px-3 py-2.5 ${useWhiteOrderTheme ? 'bg-white border border-slate-200 shadow-[0_10px_20px_rgba(15,23,42,0.08)]' : isLightMode ? 'bg-white border border-rose-200 shadow-[0_14px_28px_rgba(242,82,105,0.18)]' : 'bg-black/30 border border-rose-300/20'}`}>
                    <h2 className={`text-lg font-bold ${useWhiteOrderTheme ? 'text-slate-900' : isLightMode ? 'text-rose-900' : 'text-white drop-shadow-lg'}`}>{currentCategory.name}</h2>
                    <p className={`text-xs mt-1 line-clamp-2 ${useWhiteOrderTheme ? 'text-slate-600' : isLightMode ? 'text-rose-700/80' : 'text-white/82'} `}>{currentCategory.shortDescription}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`premium-meta-pill ${useWhiteOrderTheme ? 'border border-slate-200 bg-white text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.08)]' : isLightMode ? 'border border-rose-200 bg-white/90 text-rose-900 shadow-[0_8px_18px_rgba(242,82,105,0.12)]' : 'border border-rose-300/20 bg-white/10 text-white/95'}`}>{currentItemCount} items</span>
                    <span className={`premium-meta-pill ${useWhiteOrderTheme ? 'border border-slate-200 bg-white text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.08)]' : isLightMode ? 'border border-rose-200 bg-white/90 text-rose-900 shadow-[0_8px_18px_rgba(242,82,105,0.12)]' : 'border border-rose-300/20 bg-white/10 text-white/95'}`}>Pure Veg</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>}

          <div className="w-full max-w-md mx-auto px-3 sm:px-4 pt-3 pb-8">
            {isOrderMode ? (
              <div className="space-y-2.5">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'bestsellers', label: 'Bestsellers' },
                    { id: 'under150', label: 'Under ₹150' },
                    { id: 'under300', label: 'Under ₹300' },
                    { id: 'quickBites', label: 'Quick Bites' },
                    { id: 'meals', label: 'Meals' },
                    { id: 'drinks', label: 'Drinks' },
                    { id: 'desserts', label: 'Desserts' },
                    { id: 'combos', label: 'Combos' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                      className={`h-9 px-3.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors ${
                        activeFilter === filter.id
                          ? 'bg-[#1E4D3D] text-white border-[#1E4D3D]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                {filteredOrderCategories.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm font-medium text-slate-500">
                    No items found in this filter.
                  </div>
                ) : filteredOrderCategories.map(({ key, cat, items: filteredItems }) => {
                  const isOpen = expandedOrderCategory === key
                  return (
                    <section ref={(el) => { orderSectionRefs.current[key] = el }} key={`order-section-${key}`} className="w-full rounded-2xl border border-slate-200 bg-white overflow-hidden">
                      <button
                        type="button"
                        onClick={() => {
                          if (isOpen) {
                            setExpandedOrderCategory(null)
                            return
                          }
                          setExpandedOrderCategory(key)
                          setActiveCategory(key)
                          scrollToCategorySection(key)
                        }}
                        className="w-full px-4 py-3.5 flex items-center justify-between text-left"
                      >
                        <span className="text-[17px] font-semibold leading-tight text-slate-900">{cat.name}</span>
                        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="overflow-hidden border-t border-slate-100"
                          >
                            <div className="p-3 space-y-3">
                              {filteredItems.map((item, index) => {
                                const inCartQty = cart.find((c) => c.id === item.id)?.cartQuantity || 0
                                return (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.02, 0.15) }}
                                    className="group rounded-2xl overflow-hidden border transition-all duration-300 relative min-h-[160px]"
                                    style={{
                                      background: 'linear-gradient(145deg, #ffffff 0%, #ffffff 56%, #fafafa 100%)',
                                      border: '1px solid rgba(226, 232, 240, 0.95)',
                                      boxShadow: '0 10px 20px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.96)',
                                    }}
                                  >
                                    <div className="p-3.5 relative z-10">
                                      <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">Veg</span>
                                      <h3 className="text-[15px] font-bold leading-tight mt-2 text-slate-900">{item.name}</h3>
                                      <p className="text-sm font-semibold mt-1 text-slate-700">{item.price}</p>
                                      {item.quantity && item.quantity !== '1 portion' && (
                                        <p className="text-xs mt-1 text-slate-500">{item.quantity}</p>
                                      )}
                                      <div className="mt-3 flex justify-end">
                                        {inCartQty > 0 ? (
                                          <div className={`h-10 min-w-[120px] rounded-xl flex items-center justify-between px-3 transition-transform ${lastAddedItemId === item.id ? 'scale-[1.03]' : ''}`} style={{ background: '#F25269', color: '#FFFFFF' }}>
                                            <button type="button" onClick={() => updateCartQuantity(item.id, inCartQty - 1)} className="w-6 h-6 rounded-full flex items-center justify-center text-white">
                                              <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-bold tabular-nums">{inCartQty}</span>
                                            <button type="button" onClick={() => addToCart(item)} className="w-6 h-6 rounded-full flex items-center justify-center text-white">
                                              <Plus className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <motion.button
                                            type="button"
                                            onClick={() => addToCart(item)}
                                            whileTap={{ scale: 0.97 }}
                                            animate={lastAddedItemId === item.id ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                            transition={{ duration: 0.28, ease: 'easeOut' }}
                                            className="relative overflow-hidden h-10 min-w-[120px] rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 border-2"
                                            style={{ borderColor: '#F25269', color: '#F25269', background: '#FFFFFF' }}
                                          >
                                            {lastAddedItemId === item.id && (
                                              <span className="absolute inset-0 rounded-xl bg-[#F25269]/10 animate-ping" />
                                            )}
                                            <span className="relative z-10 inline-flex items-center gap-1.5">
                                              ADD
                                              <Plus className="w-4 h-4" />
                                            </span>
                                          </motion.button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </section>
                  )
                })}
              </div>
            ) : (
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
                      className="group rounded-[24px] overflow-hidden border transition-all duration-300 relative flex flex-col min-h-[148px]"
                      style={isLightMode
                        ? {
                            background: 'linear-gradient(145deg, #ffffff 0%, #ffffff 52%, #fcfcfb 100%)',
                            border: '1px solid rgba(226, 232, 240, 0.95)',
                            boxShadow: '0 14px 28px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.92)',
                          }
                        : {
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.04))',
                            border: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '0 18px 48px rgba(0,0,0,0.55)',
                          }}
                    >
                      <div className="p-4 flex flex-col flex-1 min-h-0 gap-0 relative z-10">
                        <div className="flex items-center justify-between gap-2 shrink-0 flex-wrap">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold border tracking-wide shrink-0 ${isLightMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-emerald-500/15 text-emerald-200 border-emerald-300/50'}`}>Veg</span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold tabular-nums border shadow-sm shrink-0 ${isLightMode ? 'bg-white text-amber-900 border-amber-200 shadow-[0_6px_14px_rgba(15,23,42,0.06)]' : 'bg-black/40 text-amber-100 border-amber-400/50'}`}>{item.price}</span>
                        </div>
                        <h3 className={`text-[14px] sm:text-[15px] font-bold leading-snug line-clamp-3 flex-1 min-h-0 mt-3 overflow-hidden break-words ${isLightMode ? 'text-slate-900' : 'text-white/95'}`}>{item.name}</h3>
                        {item.quantity && item.quantity !== '1 portion' && (
                          <p className={`text-[11px] mt-1.5 truncate shrink-0 font-medium ${isLightMode ? 'text-slate-600' : 'text-white/55'}`}>{item.quantity}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
      </div>

      <AnimatePresence>
        {isOrderMode && showCategoryMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100001] bg-black/35 backdrop-blur-[1px] p-3"
            onClick={() => setShowCategoryMenu(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="mx-auto mt-4 w-full max-w-md rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_44px_rgba(15,23,42,0.22)] max-h-[72vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <p className="text-base font-bold text-slate-900">Browse Menu</p>
                <button
                  type="button"
                  onClick={() => setShowCategoryMenu(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 inline-flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto py-1.5">
                {categoryKeys.map((key) => {
                  const cat = menuCategories[key]
                  const isActive = activeCategory === key
                  return (
                    <button
                      key={`menu-sheet-${key}`}
                      type="button"
                      onClick={() => {
                        setActiveCategory(key)
                        setExpandedOrderCategory(key)
                        scrollToCategorySection(key)
                        setShowCategoryMenu(false)
                      }}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between border-b border-slate-100/90 last:border-b-0"
                    >
                      <span className={`text-[16px] font-semibold ${isActive ? 'text-[#E23744]' : 'text-slate-800'}`}>
                        {cat.name}
                      </span>
                      <span className={`text-[15px] font-semibold ${isActive ? 'text-[#E23744]' : 'text-slate-500'}`}>
                        {cat.items.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOrderMode && (
        <>
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute left-4 right-4 bottom-4 z-[9999] pointer-events-none"
              >
                <motion.button
                  onClick={goToCheckout}
                  animate={cartBarPulse ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="pointer-events-auto w-full h-[60px] rounded-full text-white shadow-[0_14px_28px_rgba(226,55,68,0.32)] flex items-center justify-between px-4 border border-white/20"
                  style={{ background: '#F25269' }}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex items-center -space-x-2">
                      <span className="w-7 h-7 rounded-full border border-white/80 overflow-hidden bg-white">
                        <Image src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=120&q=60" alt="Food 1" width={28} height={28} className="w-full h-full object-cover" unoptimized />
                      </span>
                      <span className="w-7 h-7 rounded-full border border-white/80 overflow-hidden bg-white">
                        <Image src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=120&q=60" alt="Food 2" width={28} height={28} className="w-full h-full object-cover" unoptimized />
                      </span>
                    </span>
                    <span className="text-[16px] font-semibold">{getTotalItems()} items added</span>
                  </span>
                  <span className="text-[16px] font-semibold">Checkout &gt;</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!showCategoryMenu && (
              <motion.button
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => setShowCategoryMenu(true)}
                whileTap={{ scale: 0.97 }}
                className={`absolute right-4 z-[10000] h-11 rounded-full shadow-[0_14px_30px_rgba(15,23,42,0.38)] text-white px-4 inline-flex items-center gap-2.5 border border-white/20 ${
                  cart.length > 0 ? 'bottom-[96px]' : 'bottom-4'
                }`}
                style={{ background: 'linear-gradient(135deg, #334155, #0f172a)' }}
              >
                <span className="w-6 h-6 rounded-full bg-white/20 inline-flex items-center justify-center">
                  <List className="w-4 h-4" />
                </span>
                <span className="text-sm font-semibold tracking-wide">Menu</span>
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
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
