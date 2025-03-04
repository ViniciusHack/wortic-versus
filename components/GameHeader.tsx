"use client"

import { Button } from "@/components/ui/button"
import { GameScreen, useGame } from "@/contexts/GameContext"
import { useState } from "react"

export function GameHeader() {
  const { roomId, timeRemaining, currentScreen } = useGame()
  const [linkCopied, setLinkCopied] = useState(false)
  
  // Function to copy room link
  const copyRoomLink = () => {
    const url = `${window.location.origin}/rooms/${roomId}`
    navigator.clipboard.writeText(url)
      .then(() => {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy link:', err)
      })
  }
  
  // Format time remaining
  const formatTime = (ms: number) => {
    if (ms <= 0) return "0:00"
    const minutes = Math.floor(ms / 60)
    const seconds = Math.floor(ms % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b pb-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Wordle Battle</h1>
        <div className="flex items-center text-gray-500 font-mono">
          <span className="text-xs">Room: {roomId}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Timer */}
        {timeRemaining > 0 && currentScreen === GameScreen.PLAYING_ROUND && (
          <div className="px-3 py-1 bg-gray-100 rounded-md text-lg font-semibold">
            Time: {formatTime(timeRemaining)}
          </div>
        )}
        
        {/* Copy link button */}
        <Button
          onClick={copyRoomLink}
          variant={linkCopied ? "outline" : "default"}
          size="sm"
        >
          {linkCopied ? "Copied! ✓" : "Share Link"}
        </Button>
      </div>
    </header>
  )
} 