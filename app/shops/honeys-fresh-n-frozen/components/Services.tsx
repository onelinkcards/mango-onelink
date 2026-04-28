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
        <div className="section-title-accent mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-left">
            Why Mango?
          </h2>
        </div>
        <p className="text-sm sm:text-base text-slate-300/90 font-normal text-left">
          Clean • Pure Veg • Fresh • Made with Care
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {services.map((service, index) => {
          const IconComponent = service.icon
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              className="group relative rounded-[25px] p-5 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FBEC89 0%, #FDF8E0 35%, #ffffff 72%, #FEFDF8 100%)',
                border: '1px solid rgba(251, 236, 137, 0.44)',
                boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08), 0 2px 10px rgba(251, 236, 137, 0.12)',
              }}
            >
              <div className="absolute inset-x-0 top-0 h-20 opacity-65 pointer-events-none bg-gradient-to-b from-white/85 to-transparent" />
              <div className="absolute right-4 top-4 text-[10px] font-bold tracking-[0.22em] text-slate-400">
                  {String(index + 1).padStart(2, '0')}
              </div>

              <div className="relative z-10 flex items-start gap-4 transition-all duration-300 group-hover:-translate-y-0.5">
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[#FBEC89]/60"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, #FBEC89 100%)',
                    boxShadow: '0 8px 18px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.92)',
                  }}
                >
                  <IconComponent className="w-7 h-7 relative z-10" style={{ color: '#1E4D3D' }} strokeWidth={2} />
                </div>

                <div className="flex-1 relative z-10 pr-7">
                  <h3
                    className="font-bold text-base mb-1.5 leading-tight"
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
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
