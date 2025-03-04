"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGame } from "@/contexts/GameContext"

export function RoundCompleteScreen() {
  const { gameState, playerId, opponentId, startRound, isHost } = useGame()
  
  const currentPlayer = gameState.players[playerId]
  const opponent = opponentId ? gameState.players[opponentId] : null
  
  // Get target words
  const playerTargetWord = gameState.targetWords[playerId] || ""
  const opponentTargetWord = opponentId ? gameState.targetWords[opponentId] || "" : ""
  
  // Determine performance
  const playerWon = currentPlayer?.isWinner || false
  const playerCompleted = currentPlayer?.gameComplete || false
  const opponentWon = opponent?.isWinner || false
  const opponentCompleted = opponent?.gameComplete || false
  
  const playerTurns = currentPlayer?.currentRow || 0
  const opponentTurns = opponent?.currentRow || 0
  
  // Calculate results
  const getResultMessage = () => {
    if (playerWon && opponentWon) {
      if (playerTurns < opponentTurns) {
        return "You won! You solved it faster than your opponent."
      } else if (playerTurns > opponentTurns) {
        return "You both solved it, but your opponent was faster."
      } else {
        return "It's a tie! You both solved it in the same number of turns."
      }
    } else if (playerWon) {
      return "You won! Your opponent couldn't solve their word."
    } else if (opponentWon) {
      return "Your opponent won. Better luck next time!"
    } else {
      return "Neither player solved their word this round."
    }
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Round Complete!</h2>
      
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">{getResultMessage()}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Your Results:</h4>
            <p>Target Word: <span className="font-bold">{playerTargetWord.toUpperCase()}</span></p>
            <p>Solved: <span className="font-bold">{playerCompleted ? (playerWon ? "Yes" : "No") : "Incomplete"}</span></p>
            <p>Turns Used: <span className="font-bold">{playerTurns}</span></p>
          </div>
          
          {opponent && (
            <div className="space-y-2">
              <h4 className="font-medium">{opponent.name}'s Results:</h4>
              <p>Target Word: <span className="font-bold">{opponentTargetWord.toUpperCase()}</span></p>
              <p>Solved: <span className="font-bold">{opponentCompleted ? (opponentWon ? "Yes" : "No") : "Incomplete"}</span></p>
              <p>Turns Used: <span className="font-bold">{opponentTurns}</span></p>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center">
        {isHost ? (
          <div className="text-center space-y-2">
            <Button 
              onClick={startRound}
              className="w-full"
            >
              Start Next Round
            </Button>
          </div>
        ) : (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-center">
            <p className="text-blue-800">Waiting for host to start the new round...</p>
          </div>
        )}
        </div>
      </Card>
    </div>
  )
} 