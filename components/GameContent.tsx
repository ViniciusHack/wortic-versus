"use client"

import { GameHeader } from "@/components/GameHeader"
import { PlayingRoundScreen } from "@/components/screens/PlayingRoundScreen"
import { RoundCompleteScreen } from "@/components/screens/RoundCompleteScreen"
import { WaitingForPlayersScreen } from "@/components/screens/WaitingForPlayersScreen"
import { WordSettingScreen } from "@/components/screens/WordSettingScreen"
import { Card } from "@/components/ui/card"
import { GameScreen, useGame } from "@/contexts/GameContext"

export function GameContent() {
  const { gameState, currentScreen, playerId } = useGame()
  
  // Sort players by score
  const sortedPlayers = Object.values(gameState.players).sort(
    (a, b) => b.roundsWon - a.roundsWon
  )
  
  // Render different screens based on game state
  const renderScreen = () => {
    switch (currentScreen) {
      case GameScreen.WAITING_FOR_PLAYERS:
        return <WaitingForPlayersScreen />
      case GameScreen.WORD_SETTING:
        return <WordSettingScreen />
      case GameScreen.PLAYING_ROUND:
        return <PlayingRoundScreen />
      case GameScreen.ROUND_COMPLETE:
        return <RoundCompleteScreen />
      default:
        return <WaitingForPlayersScreen />
    }
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <GameHeader />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with players */}
        <aside className="w-full md:w-64 shrink-0">
          <Card className="p-4 h-full">
            <h2 className="text-lg font-semibold mb-4">Players</h2>
            <div className="space-y-3">
              {sortedPlayers.map(player => (
                <div 
                  key={player.id} 
                  className={`flex justify-between items-center p-2 rounded-md ${player.id === playerId ? 'bg-blue-50 border border-blue-200' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${player.hasSetWord ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="font-medium">{player.name} {player.id === playerId ? "(You)" : ""}</span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {player.roundsWon} {player.roundsWon === 1 ? "win" : "wins"}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Game status info */}
            {gameState.currentRound > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-md font-medium mb-2">Game Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Round:</span>
                    <span className="font-medium">{gameState.currentRound}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">
                      {gameState.roundStarted ? "In progress" : "Setting up"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </aside>
        
        {/* Main content */}
        <main className="flex-1">
          {renderScreen()}
        </main>
      </div>
    </div>
  )
} 