"use client"

import type React from "react"
import { motion } from "framer-motion"

interface WordGridProps {
  currentGuess: string
  guesses: any[]
  turn: number
}

export const WordGrid: React.FC<WordGridProps> = ({ currentGuess, guesses, turn }) => {
  return (
    <div className="grid grid-rows-6 gap-1 mb-8">
      {guesses.map((guess, i) => {
        if (turn === i) {
          return <CurrentRow key={i} currentGuess={currentGuess} />
        }
        return guess ? <PastRow key={i} guess={guess} /> : <EmptyRow key={i} />
      })}
    </div>
  )
}

const CurrentRow: React.FC<{ currentGuess: string }> = ({ currentGuess }) => {
  const letters = currentGuess.split("")
  return (
    <div className="grid grid-cols-5 gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-14 h-14 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold rounded"
          initial={{ scale: 1 }}
          animate={{ scale: letters[i] ? 1.1 : 1 }}
          transition={{ duration: 0.1 }}
        >
          {letters[i]}
        </motion.div>
      ))}
    </div>
  )
}

const PastRow: React.FC<{ guess: any }> = ({ guess }) => {
  return (
    <div className="grid grid-cols-5 gap-1">
      {guess.map((letter: any, i: number) => (
        <motion.div
          key={i}
          className={`w-14 h-14 flex items-center justify-center text-2xl font-bold rounded ${
            letter.color === "green" ? "bg-green-500" : letter.color === "yellow" ? "bg-yellow-500" : "bg-gray-500"
          } text-white`}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: 360 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          {letter.key}
        </motion.div>
      ))}
    </div>
  )
}

const EmptyRow: React.FC = () => {
  return (
    <div className="grid grid-cols-5 gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-14 h-14 border-2 border-gray-300 flex items-center justify-center text-2xl font-bold rounded"
        />
      ))}
    </div>
  )
}

