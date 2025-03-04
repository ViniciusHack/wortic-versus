"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useGame } from "@/contexts/GameContext"
import { useState } from "react"

export function WordSettingScreen() {
  const { gameState, playerId, opponentId, submitWord } = useGame()
  const [customWord, setCustomWord] = useState("")
  
  const currentPlayer = gameState.players[playerId]
  const hasSetWord = currentPlayer?.hasSetWord || false
  
  const opponent = opponentId ? gameState.players[opponentId] : null
  const opponentHasSetWord = opponent?.hasSetWord || false
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate the word (5 letters)
    if (customWord.length !== 5) {
      alert("Please enter a 5-letter word")
      return
    }
    
    // Submit the word
    submitWord(customWord)
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Set a Word for Your Opponent</h2>
      
      <Card className="p-6">
        {!hasSetWord ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-word">Enter a 5-letter word:</Label>
              <Input
                id="custom-word"
                value={customWord}
                onChange={(e) => setCustomWord(e.target.value.toLowerCase())}
                maxLength={5}
                placeholder="Enter your word"
                className="text-center text-xl tracking-wider"
              />
              <p className="text-sm text-gray-500 text-center">
                This will be the word your opponent needs to guess
              </p>
            </div>
            
            <div className="flex justify-center">
              <Button type="submit">Set Word</Button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-2 bg-green-100 text-green-800 rounded">
              You've set a word for your opponent!
            </div>
            
            {opponentHasSetWord ? (
              <div className="p-2 bg-green-100 text-green-800 rounded">
                Your opponent has set a word for you!
              </div>
            ) : (
              <div className="p-2 bg-yellow-100 text-yellow-800 rounded">
                Waiting for your opponent to set a word...
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center p-2 border rounded">
            <p className="font-medium">Your Status:</p>
            <p>{hasSetWord ? "Word Set ✓" : "Waiting..."}</p>
          </div>
          
          {opponent && (
            <div className="text-center p-2 border rounded">
              <p className="font-medium">{opponent.name}'s Status:</p>
              <p>{opponentHasSetWord ? "Word Set ✓" : "Waiting..."}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
} 