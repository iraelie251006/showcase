"use client"

import { Coffee, Heart } from "lucide-react"
import Link from "next/link"

interface BuyMeCoffeeBadgeProps {
  href?: string
  username?: string
  variant?: "default" | "outline" | "ghost" | "compact"
  showHeart?: boolean
  className?: string
}

export default function BuyMeCoffeeBadge({
  href = "https://buymeacoffee.com/username",
  variant = "default",
  showHeart = true,
  className = "",
}: BuyMeCoffeeBadgeProps) {
  const baseClasses = "inline-flex items-center gap-2 font-medium transition-all duration-200 no-underline"

  const variants = {
    default:
      "bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105",
    outline: "border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-full",
    ghost: "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 px-3 py-2 rounded-lg",
    compact: "bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm",
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <Coffee className="w-4 h-4" />
      <span>Buy me a coffee</span>
      {showHeart && <Heart className="w-4 h-4 fill-red-600" />}
    </Link>
  )
}

// Example usage component
export function BuyMeCoffee() {
  return (
        <div className="space-y-4 fixed bottom-4 right-4 z-50 p-4">
          <div className="flex flex-wrap gap-4">
            <BuyMeCoffeeBadge
              className="bg-gradient-to-r from-[#2a2a9b] via-[#576cc7] to-[#e353ed] text-white px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:brightness-110"
              href="https://ko-fi.com/iraelie"
            />
          </div>
        </div>
  )
}
