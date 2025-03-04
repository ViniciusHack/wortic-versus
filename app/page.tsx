"use client"

import JoinRoom from "@/components/join-room"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  
  const handleJoinRoom = (name: string, room: string, id: string) => {
    // Navigate to the room page with query parameters
    router.push(`/rooms/${room}?playerName=${encodeURIComponent(name)}&playerId=${id}`)
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Wordle Battle</h1>
          <p className="text-lg text-gray-600 mb-8">Challenge a friend to a multiplayer word duel!</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          {isCreating ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Create or Join Room</h2>
              <JoinRoom onJoinRoom={handleJoinRoom} isJoiningFromLink={false} />
              <div className="mt-4 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsCreating(false)}
                >
                  Go Back
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">How to Play</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="font-medium">1. Create a Room</p>
                  <p className="text-sm text-gray-600">Start a new game and invite a friend.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">2. Set Words</p>
                  <p className="text-sm text-gray-600">Each player creates a 5-letter word for their opponent to guess.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">3. Solve Faster</p>
                  <p className="text-sm text-gray-600">Try to solve your word in fewer guesses than your opponent.</p>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => setIsCreating(true)}
              >
                Start Playing
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

