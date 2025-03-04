"use client"

import { GameContent } from "@/components/GameContent"
import { GameProvider } from "@/contexts/GameContext"

interface GameRoomProps {
  playerName: string
  roomId: string
  playerId: string
}

export default function WordleGame({ playerName, roomId, playerId }: GameRoomProps) {
  return (
    <GameProvider 
      playerName={playerName} 
      roomId={roomId} 
      playerId={playerId}
    >
      <GameContent />
    </GameProvider>
  )
}

