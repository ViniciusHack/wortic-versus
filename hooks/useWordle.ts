"use client"

import { useCallback, useState } from "react"

export const useWordle = (solution: string, onGuessSubmit?: (guess: string) => void) => {
  const [turn, setTurn] = useState(0)
  const [currentGuess, setCurrentGuess] = useState("")
  const [guesses, setGuesses] = useState<any[]>([...Array(6)])
  const [history, setHistory] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [usedKeys, setUsedKeys] = useState<{ [key: string]: string }>({})

  const formatGuess = useCallback(() => {
    const solutionArray = [...solution] as (string | null)[]
    const formattedGuess = [...currentGuess].map((l) => {
      return { key: l, color: "grey" }
    })

    formattedGuess.forEach((l, i) => {
      if (solutionArray[i] === l.key) {
        formattedGuess[i].color = "green"
        solutionArray[i] = null
      }
    })

    formattedGuess.forEach((l, i) => {
      if (solutionArray.includes(l.key) && l.color !== "green") {
        formattedGuess[i].color = "yellow"
        solutionArray[solutionArray.indexOf(l.key)] = null
      }
    })

    return formattedGuess
  }, [currentGuess, solution])

  const addNewGuess = useCallback(() => {
    if (currentGuess.length !== 5) return
    
    const formatted = formatGuess()
    
    if (currentGuess === solution) {
      setIsCorrect(true)
    }
    
    setGuesses((prevGuesses) => {
      const newGuesses = [...prevGuesses]
      newGuesses[turn] = formatted
      return newGuesses
    })
    
    setHistory((prevHistory) => [...prevHistory, currentGuess])
    setTurn((prevTurn) => prevTurn + 1)
    
    setUsedKeys((prevUsedKeys) => {
      const newKeys = { ...prevUsedKeys }
      formatted.forEach((l: any) => {
        const currentColor = newKeys[l.key]
        if (l.color === "green") {
          newKeys[l.key] = "green"
          return
        }
        if (l.color === "yellow" && currentColor !== "green") {
          newKeys[l.key] = "yellow"
          return
        }
        if (l.color === "grey" && currentColor !== "green" && currentColor !== "yellow") {
          newKeys[l.key] = "grey"
        }
      })
      return newKeys
    })
    
    setCurrentGuess("")
  }, [currentGuess, turn, solution, formatGuess])

  const handleKeyup = useCallback(
    (e: KeyboardEvent | { key: string }) => {
      // Don't process keys if game is complete
      if (isCorrect || turn >= 6) return
      
      const key = e.key
      
      if (key === "Enter") {
        if (turn > 5) {
          console.log("you used all your guesses!")
          return
        }
        if (history.includes(currentGuess)) {
          console.log("you already tried that word.")
          return
        }
        if (currentGuess.length !== 5) {
          console.log("word must be 5 chars.")
          return
        }
        
        // Call addNewGuess and notify parent component
        addNewGuess()
        onGuessSubmit?.(currentGuess)
      }
      if (key === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1))
        return
      }
      if (/^[A-Za-z]$/.test(key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess((prev) => prev + key.toUpperCase())
        }
      }
    },
    [currentGuess, turn, history, addNewGuess, onGuessSubmit, isCorrect],
  )

  return { turn, currentGuess, guesses, isCorrect, usedKeys, handleKeyup, addNewGuess }
}

