"use client"

import { Toaster } from "./ui/sonner"
import WordleGame from "./wordle-game"

interface GameContainerProps {
  playerName: string
  roomId: string
  playerId: string
}

export default function GameContainer({ playerName, roomId, playerId }: GameContainerProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <WordleGame 
        playerName={playerName} 
        roomId={roomId} 
        playerId={playerId} 
      />
      <Toaster />
    </div>
  )
}

