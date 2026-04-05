'use client'

import { motion } from 'framer-motion'
import { Sparkles, Leaf, ChefHat, Heart } from 'lucide-react'

const services = [
  {
    id: 'service-1',
    icon: Sparkles,
    title: 'Clean & Hygienic Kitchen',
    description: 'Freshly prepared food in a well-maintained environment.',
  },
  {
    id: 'service-2',
    icon: Leaf,
    title: 'Pure Vegetarian',
    description: '100% vegetarian menu crafted with quality ingredients.',
  },
  {
    id: 'service-3',
    icon: ChefHat,
    title: 'Freshly Prepared Daily',
    description: 'Every dish is prepared fresh in our kitchen.',
  },
  {
    id: 'service-4',
    icon: Heart,
    title: 'Healthy & Balanced Meals',
    description: 'Tasteful food made with care and proper preparation standards.',
  },
]

export default function Services() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto py-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left mb-1.5">
          Why Mango?
        </h2>
        <p className="text-sm sm:text-base text-slate-300/90 font-normal text-left">
          Clean • Pure Veg • Fresh • Made with Care
        </p>
      </div>

      {/* Services Grid - Premium FBEC89 + White gradient, shiny */}
      <div className="grid grid-cols-1 gap-3">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              className="relative rounded-2xl p-5 flex items-center gap-4 overflow-hidden group hover:shadow-2xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #FBEC89 0%, #FDF8E0 35%, #ffffff 70%, #FEFDF5 100%)',
                border: '1px solid rgba(251, 236, 137, 0.5)',
                boxShadow: '0 8px 32px rgba(251, 236, 137, 0.25), 0 2px 12px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
              }}
            >
              {/* Shiny top-edge highlight */}
              <div 
                className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl opacity-60 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)'
                }}
              />
              {/* Subtle golden glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FBEC89]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              {/* Icon Container - premium with golden tint */}
              <div 
                className="relative w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border border-[#FBEC89]/60"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, #FBEC89 100%)',
                  boxShadow: '0 4px 14px rgba(251, 236, 137, 0.4), inset 0 1px 0 rgba(255,255,255,0.9)'
                }}
              >
                <IconComponent 
                  className="w-7 h-7 relative z-10" 
                  style={{ color: '#1E4D3D' }}
                  strokeWidth={2}
                />
              </div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <h3 
                  className="font-bold text-base mb-1 leading-tight"
                  style={{ color: '#1e293b' }}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#475569' }}
                >
                  {service.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

    </motion.section>
  )
}
