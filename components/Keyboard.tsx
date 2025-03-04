"use client"

import { motion } from "framer-motion"
import type React from "react"

const keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
]

interface KeyboardProps {
  usedKeys: { [key: string]: string }
  handleKeyup: (e: KeyboardEvent | { key: string }) => void
}

export const Keyboard: React.FC<KeyboardProps> = ({ usedKeys, handleKeyup }) => {
  const getKeyColor = (key: string) => {
    const color = usedKeys[key.toUpperCase()]
    switch (color) {
      case "green":
        return "bg-green-500 text-white"
      case "yellow":
        return "bg-yellow-500 text-white"
      case "grey":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  return (
    <div className="mt-8">
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center mb-2">
          {row.map((key) => (
            <motion.button
              key={key}
              onClick={() => handleKeyup({ key })}
              className={`mx-0.5 text-sm font-bold rounded px-2 py-3 ${getKeyColor(key)} ${
                key.length > 1 ? "px-4" : "px-2"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {key === "Backspace" ? "⌫" : key}
            </motion.button>
          ))}
        </div>
      ))}
    </div>
  )
}

