"use client"

import { useWordle } from "@/hooks/useWordle"
import type React from "react"
import { useEffect } from "react"
import { Keyboard } from "./Keyboard"
import { WordGrid } from "./WordGrid"

interface WordleGameProps {
  solution: string
  onGuessSubmit?: (guess: string) => void
}

export const Board: React.FC<WordleGameProps> = ({ solution, onGuessSubmit }) => {
  const { currentGuess, guesses, turn, usedKeys, handleKeyup } = useWordle(solution, onGuessSubmit)

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup)
    return () => window.removeEventListener("keyup", handleKeyup)
  }, [handleKeyup])

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      <WordGrid currentGuess={currentGuess} guesses={guesses} turn={turn} />
      <Keyboard usedKeys={usedKeys} handleKeyup={handleKeyup} />
    </div>
  )
}

