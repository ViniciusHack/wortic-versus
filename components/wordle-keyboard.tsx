"use client"

import { Button } from "@/components/ui/button"
import { SkipBackIcon as Backspace } from "lucide-react"

interface WordleKeyboardProps {
  onKeyPress: (key: string) => void
  guesses: string[]
  targetWord: string
}

export default function WordleKeyboard({ onKeyPress, guesses, targetWord }: WordleKeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ]

  // Track which letters have been used and their states
  const letterStates: Record<string, string> = {}

  if (targetWord) {
    guesses.forEach((guess) => {
      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i]
        if (!letter) continue

        if (letter === targetWord[i]) {
          letterStates[letter] = "correct"
        } else if (targetWord.includes(letter) && letterStates[letter] !== "correct") {
          letterStates[letter] = "present"
        } else if (!targetWord.includes(letter)) {
          letterStates[letter] = "absent"
        }
      }
    })
  }

  const getKeyStyle = (key: string) => {
    if (key === "ENTER" || key === "BACKSPACE") return ""

    switch (letterStates[key]) {
      case "correct":
        return "bg-green-500 text-white border-green-500 hover:bg-green-600"
      case "present":
        return "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
      case "absent":
        return "bg-gray-500 text-white border-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-200 hover:bg-gray-300"
    }
  }

  return (
    <div className="mt-6 p-2 bg-gray-100 rounded-lg">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 mb-1">
          {row.map((key) => (
            <Button
              key={key}
              variant="outline"
              className={`
                ${key === "ENTER" ? "text-xs px-1 w-16" : key === "BACKSPACE" ? "px-2 w-12" : "w-10"}
                h-12 font-bold ${getKeyStyle(key)}
              `}
              onClick={() => onKeyPress(key)}
            >
              {key === "BACKSPACE" ? <Backspace className="h-5 w-5" /> : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}

