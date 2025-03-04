import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random color for players
export function getRandomColor() {
  const colors = ["red", "blue", "green", "purple", "orange", "pink", "teal", "indigo", "amber", "emerald"]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Map color names to Tailwind classes
export function getColorClass(color: string) {
  const colorMap: Record<string, string> = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
    indigo: "bg-indigo-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
  }
  return colorMap[color] || "bg-gray-500"
}

