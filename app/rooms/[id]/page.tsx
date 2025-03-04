"use client"

import GameContainer from "@/components/game-container"
import JoinRoom from "@/components/join-room"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomId = params.id as string
  
  // Get player info from search params or session storage
  const [playerName, setPlayerName] = useState<string>("")
  const [playerId, setPlayerId] = useState<string>("")
  const [needsToJoin, setNeedsToJoin] = useState(true)
  
  // Handle player joining the room
  const handleJoinRoom = (name: string, room: string, id: string) => {
    setPlayerName(name)
    setPlayerId(id)
    setNeedsToJoin(false)
    
    // Save to session storage for persistence
    sessionStorage.setItem(`wordle_room_${roomId}_player`, JSON.stringify({
      name,
      id
    }))
    
    // Update URL with player info
    router.push(`/rooms/${roomId}?playerName=${encodeURIComponent(name)}&playerId=${id}`)
  }
  
  // On component load, check if we have player info
  useEffect(() => {
    const nameFromUrl = searchParams.get("playerName")
    const idFromUrl = searchParams.get("playerId")
    
    // First check URL params
    if (nameFromUrl && idFromUrl) {
      setPlayerName(nameFromUrl)
      setPlayerId(idFromUrl)
      setNeedsToJoin(false)
      return
    }
    
    // Then check session storage
    const savedPlayer = sessionStorage.getItem(`wordle_room_${roomId}_player`)
    if (savedPlayer) {
      try {
        const { name, id } = JSON.parse(savedPlayer)
        setPlayerName(name)
        setPlayerId(id)
        setNeedsToJoin(false)
        
        // Update URL with player info
        router.push(`/rooms/${roomId}?playerName=${encodeURIComponent(name)}&playerId=${id}`)
      } catch (e) {
        console.error("Error parsing saved player data:", e)
      }
    }
  }, [roomId, searchParams, router])
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-gray-100">
      {needsToJoin ? (
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Join Wordle Room</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">Enter Your Name</h2>
            <JoinRoom 
              onJoinRoom={handleJoinRoom} 
              initialRoomId={roomId} 
              isJoiningFromLink={true} 
            />
          </div>
        </div>
      ) : (
        <GameContainer 
          playerName={playerName} 
          roomId={roomId} 
          playerId={playerId} 
        />
      )}
    </main>
  )
} 