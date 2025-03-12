"use client"

import { WordGrid } from "@/components/WordGrid"
import { Board } from "@/components/WordleGame"
import { useGame } from "@/contexts/GameContext"

export function PlayingRoundScreen() {
  const { gameState, playerId, opponentId, submitGuess } = useGame()
  
  const opponent = opponentId ? gameState.players[opponentId] : null
  
  // Get current target word for this player
  const targetWord = gameState.targetWords[playerId] || ""
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Player's board */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Board</h3>
        <Board 
          solution={targetWord} 
          onGuessSubmit={submitGuess}
        />
      </div>

      {/* Opponent's board */}
      {opponent && opponentId && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{opponent.name}&apos;s Board</h3>
          {/* Format opponent's guesses for WordGrid */}
          <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
            <WordGrid 
              currentGuess="" 
              guesses={opponent.guesses.map(guess => {
                if (!guess) return null;
                
                // Format the guess string into letter objects with colors
                const opponentTargetWord = gameState.targetWords[opponentId] || "";
                const formattedGuess = [...guess].map((letter, i) => {
                  let color = "grey";
                  
                  // Check for exact match (green)
                  if (opponentTargetWord[i] === letter) {
                    color = "green";
                  } 
                  // Check for letter in word but wrong position (yellow)
                  else if (opponentTargetWord.includes(letter)) {
                    color = "yellow";
                  }
                  
                  return { key: letter, color };
                });
                
                return formattedGuess;
              })} 
              turn={opponent.currentRow}
            />
          </div>
        </div>
      )}
    </div>
  )
} 