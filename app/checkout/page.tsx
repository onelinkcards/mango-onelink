'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Minus, Plus } from 'lucide-react'
import { type CartItem, generateWhatsAppCartMessage } from '../shops/honeys-fresh-n-frozen/menu'
import { shopConfig } from '../shops/honeys-fresh-n-frozen/config'
import { getWhatsAppLink } from '../lib/phone'

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [locationStatus, setLocationStatus] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.sessionStorage.getItem('mango_checkout_cart')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as CartItem[]
      setCart(parsed)
    } catch {
      setCart([])
    }
  }, [])

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const numeric = parseFloat(item.price.replace('₹', '').replace(',', '').split('/')[0].trim())
      return sum + (isNaN(numeric) ? 0 : numeric * item.cartQuantity)
    }, 0)
  }, [cart])
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.cartQuantity, 0), [cart])

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, cartQuantity: qty } : i))
  }

  const orderNow = () => {
    if (!name.trim() || !mobile.trim() || !address.trim() || cart.length === 0) return
    const phone = shopConfig.contact.phones[0]?.replace(/\D/g, '') || '9419532222'
    const e164 = phone.length === 10 ? `91${phone}` : phone
    const base = generateWhatsAppCartMessage(cart, total)
    const customer = `\n\nCustomer Details:\nName: ${name}\nMobile: ${mobile}\nAddress: ${address}\n\nPlease confirm this order.`
    window.open(getWhatsAppLink(e164, `${base}${customer}`), '_blank')
  }

  const useCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('Location is not supported on this device.')
      return
    }

    setIsLocating(true)
    setLocationStatus('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const response = await fetch(`/api/current-location?lat=${latitude}&lng=${longitude}`)
          if (!response.ok) {
            throw new Error('Could not fetch address')
          }
          const data = await response.json()
          if (data?.address) {
            setAddress(data.address)
            setLocationStatus('Current location added.')
          } else {
            setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
            setLocationStatus('Coordinates added. Address not found.')
          }
        } catch {
          setLocationStatus('Could not auto-fetch address. Try again.')
        } finally {
          setIsLocating(false)
        }
      },
      () => {
        setIsLocating(false)
        setLocationStatus('Permission denied. Please allow location access.')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff8f9] via-[#f8f9fb] to-[#f3f4f7] pb-28">
      <div className="w-full max-w-md mx-auto px-3 pt-3">
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-[0_14px_32px_rgba(15,23,42,0.08)] p-4">
          <Link href="/menu?mode=order" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <p className="text-lg font-extrabold text-slate-900 mt-1.5 tracking-tight">Checkout</p>
          <p className="text-xs text-slate-500 mt-0.5">{totalItems} items in cart</p>
        </div>

        <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-3.5 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Your items</h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{totalItems} items</span>
          </div>
          <div className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-slate-500 rounded-2xl border border-dashed border-slate-300 p-3">Your cart is empty.</p>
            ) : (
              cart.map((item) => {
                const unitPrice = parseFloat(item.price.replace('₹', '').replace(',', '').split('/')[0].trim())
                const lineTotal = (isNaN(unitPrice) ? 0 : unitPrice) * item.cartQuantity
                return (
                  <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5">
                    <div className="min-w-0">
                      <p className="text-[15px] leading-tight font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.price}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="inline-flex items-center h-9 rounded-xl border border-[#f3b5c0] bg-[#fff3f6] px-2">
                        <button onClick={() => updateQty(item.id, item.cartQuantity - 1)} className="w-5 h-5 rounded-full text-[#E23744] flex items-center justify-center">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-[#E23744]">{item.cartQuantity}</span>
                        <button onClick={() => updateQty(item.id, item.cartQuantity + 1)} className="w-5 h-5 rounded-full text-[#E23744] flex items-center justify-center">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 mt-1">₹{lineTotal.toFixed(0)}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <Link href="/menu?mode=order" className="mt-3 inline-flex items-center rounded-full border border-[#f3b5c0] bg-[#fff3f6] px-3 py-1.5 text-[14px] font-semibold text-[#E23744]">
            + Add more items
          </Link>
        </section>

        <section className="mt-3 rounded-3xl border border-slate-200 bg-white p-3.5 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Delivery details</h2>
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={isLocating}
              className="h-9 px-3.5 rounded-full border border-slate-300 text-[#1a73e8] text-xs font-semibold bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              {isLocating ? 'Getting location...' : 'Use current location'}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]" />
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]" />
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" rows={3} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#f6c7cf]" />
          </div>
          {locationStatus && <p className="mt-2 text-xs text-slate-500">{locationStatus}</p>}
        </section>
      </div>

      <div className="fixed left-4 right-4 bottom-4 z-[9999] max-w-[430px] mx-auto">
        <button
          onClick={orderNow}
          disabled={!name.trim() || !mobile.trim() || !address.trim() || cart.length === 0}
          className="w-full h-[62px] rounded-full bg-[#E23744] text-white flex items-center justify-between px-5 shadow-[0_14px_30px_rgba(226,55,68,0.35)] border border-white/20 disabled:opacity-50"
        >
          <span className="text-left">
            <span className="block text-[11px] uppercase tracking-wide text-white/90">Total</span>
            <span className="block text-lg font-bold leading-none">₹{total.toFixed(2)}</span>
          </span>
          <span className="text-right">
            <span className="block text-[15px] font-semibold">Place Order</span>
            <span className="block text-[10px] text-white/90">UPI only</span>
          </span>
        </button>
      </div>
    </main>
  )
}
