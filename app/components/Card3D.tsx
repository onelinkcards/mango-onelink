'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

type Face = 'front' | 'info' | 'payment'

interface Card3DProps {
  currentFace: Face
  isFlipping?: boolean
  onFaceChange?: (face: Face) => void
  faceFront: ReactNode
  faceInfo: ReactNode
  facePayment: ReactNode
}

export default function Card3D({
  currentFace,
  isFlipping = false,
  onFaceChange,
  faceFront,
  faceInfo,
  facePayment,
}: Card3DProps) {

  // Calculate rotateY based on current face
  // For double flip: front (0) -> info (180) -> payment (360/0)
  const getRotateY = () => {
    switch (currentFace) {
      case 'front':
        return 0
      case 'info':
        return 180
      case 'payment':
        return 360 // Completes full rotation, payment face is at 360deg position
      default:
        return 0
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ perspective: '1000px', width: '100%' }}>
      {/* Blocking overlay during flip animation */}
      {isFlipping && (
        <div
          className="absolute inset-0"
          style={{
            pointerEvents: 'auto',
            touchAction: 'none',
            zIndex: 100,
            backgroundColor: 'transparent'
          }}
        />
      )}
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: getRotateY() }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0.0, 0.2, 1], // smooth ease-in-out cubic bezier
          type: "tween"
        }}
      >
        {/* FRONT FACE - rotateY 0 */}
        <div
          className="relative w-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
            willChange: 'transform',
            opacity: currentFace === 'payment' ? 0 : 1,
            pointerEvents: currentFace === 'payment' || isFlipping ? 'none' : 'auto',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            zIndex: currentFace === 'front' ? 20 : currentFace === 'info' ? 10 : 1
          }}
        >
          {faceFront}
        </div>

        {/* INFO FACE - rotateY 180 */}
        <div
          className="absolute inset-0 w-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            willChange: 'transform',
            pointerEvents: currentFace === 'info' && !isFlipping ? 'auto' : 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            visibility: currentFace === 'info' ? 'visible' : 'hidden',
            zIndex: currentFace === 'info' ? 15 : 5
          }}
        >
          {faceInfo}
        </div>

        {/* PAYMENT FACE - rotateY 360deg (positioned to show when container rotates to 360) */}
        <div
          className="absolute inset-0 w-full"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(360deg)',
            willChange: 'transform',
            opacity: currentFace === 'payment' ? 1 : 0,
            pointerEvents: currentFace === 'payment' && !isFlipping ? 'auto' : 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            visibility: currentFace === 'payment' ? 'visible' : 'hidden',
            zIndex: currentFace === 'payment' ? 10 : -1
          }}
        >
          {facePayment}
        </div>
      </motion.div>
    </div>
  )
}

// Export setFace function via context or ref
export type { Face }
export type { Card3DProps }

