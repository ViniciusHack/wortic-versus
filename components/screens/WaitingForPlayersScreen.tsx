"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGame } from "@/contexts/GameContext"
import { useState } from "react"

export function WaitingForPlayersScreen() {
  const { gameState, isHost, startGame, roomId } = useGame()
  const [copying, setCopying] = useState(false)
  
  // Get number of players in the game
  const playerCount = Object.keys(gameState.players).length
  
  // Function to copy room link to clipboard
  const copyRoomLink = () => {
    const url = `${window.location.origin}/rooms/${roomId}`
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopying(true)
        setTimeout(() => setCopying(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy: ', err)
      })
  }
  
  return (
    <div className="flex flex-col p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Welcome to Wordle Battle!</h2>
        <p className="text-gray-600">Challenge your friends to see who can solve the word puzzle faster.</p>
      </div>
      
      <Card className="p-6 max-w-md mx-auto">
        <div className="space-y-6">
          {playerCount < 2 ? (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-center">
                <p className="text-amber-800">Waiting for opponent to join</p>
              </div>
              
              <div className="text-center space-y-2">
                <p>Invite a friend to play with you:</p>
                <Button 
                  onClick={copyRoomLink} 
                  variant={copying ? "outline" : "default"}
                  className="w-full"
                >
                  {copying ? "Copied!" : "Copy Invite Link"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
                <p className="text-green-800">All players have joined!</p>
              </div>
              
              {isHost ? (
                <div className="text-center space-y-2">
                  <p>You&apos;re the host. Start the game when ready:</p>
                  <Button 
                    onClick={startGame}
                    className="w-full"
                  >
                    Start Game
                  </Button>
                </div>
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-center">
                  <p className="text-blue-800">Waiting for host to start the game...</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-sm text-gray-500 text-center">
            <p>Each player will set a word for their opponent to guess.</p>
            <p>The player who solves their word in fewer attempts wins!</p>
          </div>
        </div>
      </Card>
    </div>
  )
} 