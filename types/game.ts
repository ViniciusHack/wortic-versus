export interface Player {
  id: string
  name: string
  x?: number
  y?: number
  color?: string
  guesses?: string[]
  currentRow?: number
  gameComplete?: boolean
  isWinner?: boolean
  score?: number
  roundsWon?: number
}

export interface Room {
  id: string
  name: string
  players: Player[]
}

export interface GameState {
  players: Record<string, Player>
  targetWord?: string
  gameOver?: boolean
  currentRound?: number
  roundEndTime?: number
  wordSetter?: string
}

