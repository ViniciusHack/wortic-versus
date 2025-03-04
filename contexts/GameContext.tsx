"use client"

import { supabase } from "@/lib/supabase"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

// Define payload types
interface WordSetPayload {
  setterId: string
  targetPlayerId: string
  word: string
}

interface RoundStartPayload {
  roundEndTime: number
  currentRound: number
}

interface GuessUpdatePayload {
  id: string
  guesses: string[]
  currentRow: number
  gameComplete: boolean
  isWinner: boolean
  solveTime?: number
}

interface Player {
  id: string
  name: string
  guesses: string[]
  currentRow: number
  gameComplete: boolean
  isWinner: boolean
  score: number
  roundsWon: number
  solveTime?: number
  hasSetWord?: boolean
}

export interface GameState {
  players: Record<string, Player>
  targetWords: Record<string, string>
  gameOver: boolean
  currentRound: number
  roundEndTime: number
  roundStarted: boolean
}

export enum GameScreen {
  WAITING_FOR_PLAYERS,
  WORD_SETTING,
  PLAYING_ROUND,
  ROUND_COMPLETE
}

interface GameContextType {
  // Game state
  gameState: GameState
  isGameStarted: boolean
  isHost: boolean
  opponentId: string | null
  currentScreen: GameScreen
  timeRemaining: number
  
  // Player info
  playerId: string
  playerName: string
  roomId: string
  
  // Actions
  startGame: () => void
  submitWord: (word: string) => void
  submitGuess: (guess: string) => void
  startRound: () => void
  
  // Supabase channel
  channel: any
}

const GameContext = createContext<GameContextType | null>(null)

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

interface GameProviderProps {
  children: ReactNode
  playerName: string
  roomId: string
  playerId: string
}

export function GameProvider({ children, playerName, roomId, playerId }: GameProviderProps) {
  const [gameState, setGameState] = useState<GameState>({
    players: {},
    targetWords: {},
    gameOver: false,
    currentRound: 0,
    roundEndTime: 0,
    roundStarted: false
  })
  const [channel, setChannel] = useState<any>(null)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [hasSetInitialHost, setHasSetInitialHost] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [opponentId, setOpponentId] = useState<string | null>(null)
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.WAITING_FOR_PLAYERS)

  // Initialize the game and connect to Supabase Realtime
  useEffect(() => {
    // Create a new player object
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      guesses: Array(6).fill(""),
      currentRow: 0,
      gameComplete: false,
      isWinner: false,
      score: 0,
      roundsWon: 0,
      hasSetWord: false
    }

    // Initialize Supabase Realtime channel
    const roomChannel = supabase.channel(roomId, {
      config: {
        presence: {
          key: playerId,
        },
      },
    })

    // Set up presence tracking for this player
    roomChannel
      .on("presence", { event: "sync" }, () => {
        // Get the current state of all players in the room
        const presenceState = roomChannel.presenceState()

        // Convert the presence state to our game state format
        const players: Record<string, Player> = {}

        Object.keys(presenceState).forEach((presenceId) => {
          // Use a safer type conversion approach
          const playerPresence: unknown = presenceState[presenceId][0]
          
          // Only include valid player objects that match our Player structure
          if (playerPresence &&
              typeof playerPresence === 'object' &&
              'id' in playerPresence && 
              'name' in playerPresence) {
            players[presenceId] = playerPresence as Player
          }
        })

        // Only set host status once when first player joins
        if (!hasSetInitialHost) {
          const isFirstPlayer = Object.keys(players).length === 0 || 
                               (Object.keys(players).length === 1 && Object.keys(players)[0] === playerId)
          setIsHost(isFirstPlayer)
          setHasSetInitialHost(true)
        }

        // Find opponent ID
        if (Object.keys(players).length === 2) {
          const otherId = Object.keys(players).find(id => id !== playerId) || null
          setOpponentId(otherId)
        }

        // Update game state with players
        setGameState((prevState) => ({
          ...prevState,
          players,
        }))
        
        // Update current screen based on number of players
        if (Object.keys(players).length < 2) {
          setCurrentScreen(GameScreen.WAITING_FOR_PLAYERS)
        } else if (!isGameStarted) {
          // Keep current screen if already in a different state
          setCurrentScreen(prev => 
            prev === GameScreen.WAITING_FOR_PLAYERS ? GameScreen.WAITING_FOR_PLAYERS : prev
          )
        }
      })
      .on("broadcast", { event: "word-set" }, (payload: { payload: WordSetPayload }) => {
        // A player has set a word for their opponent
        setGameState(prevState => {
          const updatedPlayers = { ...prevState.players }
          if (updatedPlayers[payload.payload.setterId]) {
            updatedPlayers[payload.payload.setterId] = {
              ...updatedPlayers[payload.payload.setterId],
              hasSetWord: true
            }
          }

          // Update target words
          const updatedTargetWords = { ...prevState.targetWords }
          updatedTargetWords[payload.payload.targetPlayerId] = payload.payload.word

          // Check if all players have set words
          const allPlayersSetWords = Object.values(updatedPlayers).every(player => player.hasSetWord)
          
          // Start the round if all players have set words
          if (allPlayersSetWords && !prevState.roundStarted) {
            // Set a 3-minute timer for the round
            const roundEndTime = Date.now() + 3 * 60 * 1000
            
            // Only the host broadcasts round start
            if (isHost) {
              roomChannel.send({
                type: "broadcast",
                event: "start-to-play",
                payload: {
                  roundEndTime,
                  currentRound: prevState.currentRound + 1
                }
              })

              setIsGameStarted(true)
        
              setGameState(prevState => ({
                ...prevState,
                roundStarted: true,
                roundEndTime: roundEndTime,
                currentRound: prevState.currentRound + 1
              }))
              
              // Update to playing screen
              setCurrentScreen(GameScreen.PLAYING_ROUND)
            }

            return {
              ...prevState,
              players: updatedPlayers,
              targetWords: updatedTargetWords,
              roundStarted: true,
              roundEndTime: roundEndTime,
              currentRound: prevState.currentRound + 1
            }
          }

          return {
            ...prevState,
            players: updatedPlayers,
            targetWords: updatedTargetWords
          }
        })
      })
      .on("broadcast", { event: "start-to-play" }, (payload: { payload: RoundStartPayload }) => {
        // Round has officially started
        setIsGameStarted(true)
        
        setGameState(prevState => ({
          ...prevState,
          roundStarted: true,
          roundEndTime: payload.payload.roundEndTime,
          currentRound: payload.payload.currentRound
        }))
        
        // Update to playing screen
        setCurrentScreen(GameScreen.PLAYING_ROUND)
      })
      .on("broadcast", { event: "guess-update" }, (payload: { payload: GuessUpdatePayload }) => {
        // Update a specific player's guesses
        setGameState((prevState) => {
          const updatedPlayers = { ...prevState.players }
          if (updatedPlayers[payload.payload.id]) {
            // Ensure guesses are properly formatted as strings
            const formattedGuesses = [...payload.payload.guesses]
            
            updatedPlayers[payload.payload.id] = {
              ...updatedPlayers[payload.payload.id],
              guesses: formattedGuesses,
              currentRow: payload.payload.currentRow,
              gameComplete: payload.payload.gameComplete,
              isWinner: payload.payload.isWinner,
              solveTime: payload.payload.solveTime
            }
          }

          // Check if round is over (all players have completed their game)
          const roundOver = Object.values(updatedPlayers).every(player => 
            player.gameComplete || player.currentRow >= 6
          )
          
          // Update screen if game is over
          if (roundOver) {
            setCurrentScreen(GameScreen.ROUND_COMPLETE)
          }

          return {
            ...prevState,
            players: updatedPlayers,
            gameOver: roundOver,
          }
        })
      })
      .on("broadcast", { event: "round-end" }, (payload: { payload: { roundWinnerId: string | null, players: Record<string, Player> } }) => {
        // Update scores and prepare for next round
        setGameState(prevState => {
          // Use the updated players state from the payload
          const updatedPlayers = { ...payload.payload.players }
          
          // Reset player's state for the next round
          Object.keys(updatedPlayers).forEach(pid => {
            updatedPlayers[pid] = {
              ...updatedPlayers[pid],
              guesses: Array(6).fill(""),
              currentRow: 0,
              gameComplete: false,
              isWinner: false,
              solveTime: undefined,
              hasSetWord: false
            }
          })

          // Set game as completed - waiting for host to start next round
          setCurrentScreen(GameScreen.ROUND_COMPLETE)

          return {
            ...prevState,
            players: updatedPlayers,
            targetWords: {},
            gameOver: true,
            roundStarted: false
          }
        })
      })
      .on("broadcast", { event: "round-start" }, () => {
        // Reset players' game state for the next round
        setGameState(prevState => {
          const updatedPlayers = { ...prevState.players }
          
          // Reset each player's round-specific state
          Object.keys(updatedPlayers).forEach(pid => {
            updatedPlayers[pid] = {
              ...updatedPlayers[pid],
              guesses: Array(6).fill(""),
              currentRow: 0,
              gameComplete: false,
              isWinner: false,
              solveTime: undefined,
              hasSetWord: false
            }
          })

          return {
            ...prevState,
            players: updatedPlayers,
            targetWords: {},
            gameOver: false,
            currentRound: prevState.currentRound + 1,
            roundEndTime: 0,
            roundStarted: false
          }
        })
        
        // Move to word setting screen for next round
        setCurrentScreen(GameScreen.WORD_SETTING)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track this player's presence once subscribed
          await roomChannel.track(newPlayer)
        }
      })

    setChannel(roomChannel)

    // Clean up the channel when component unmounts
    return () => {
      roomChannel.unsubscribe()
    }
  }, [playerId, playerName, roomId, isHost, hasSetInitialHost])

  // Timer effect for countdown
  useEffect(() => {
    if (!gameState.roundStarted || !gameState.roundEndTime) return

    const intervalId = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((gameState.roundEndTime - now) / 1000))
      setTimeRemaining(remaining)

      if (remaining === 0 && !gameState.gameOver && isHost) {
        // Time's up - end the round
        channel?.send({
          type: "broadcast",
          event: "round-end",
          payload: {}
        })
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [gameState.roundStarted, gameState.roundEndTime, gameState.gameOver, channel, isHost])

  // Function to start a brand new game (host only)
  const startGame = () => {
    if (!isHost || Object.keys(gameState.players).length < 2) return
    
    // Reset the game state completely for a new game
    setGameState(prev => ({
      ...prev,
      gameOver: false,
      currentRound: 1, // Start at round 1
      roundEndTime: 0,
      roundStarted: false,
      targetWords: {},
      // Reset players scores and state
      players: Object.entries(prev.players).reduce((acc, [id, player]) => {
        acc[id] = {
          ...player,
          guesses: Array(6).fill(""),
          currentRow: 0,
          gameComplete: false,
          isWinner: false,
          solveTime: undefined,
          hasSetWord: false,
          score: 0,
          roundsWon: 0
        }
        return acc
      }, {} as Record<string, Player>)
    }))
    
    startRound()
  }

  // Function to submit a word for opponent
  const submitWord = (word: string) => {
    if (!word || word.length !== 5) return
    if (!opponentId) return

    const upperWord = word.toUpperCase()
    
    // Broadcast the word set for the opponent
    if (channel) {
      channel.send({
        type: "broadcast",
        event: "word-set",
        payload: {
          setterId: playerId,
          targetPlayerId: opponentId,
          word: upperWord
        }
      })
    }

    // Update local player state
    setGameState(prevState => {
      const updatedPlayers = { ...prevState.players }
      if (updatedPlayers[playerId]) {
        updatedPlayers[playerId] = {
          ...updatedPlayers[playerId],
          hasSetWord: true
        }
      }

      const updatedTargetWords = { ...prevState.targetWords }
      if (opponentId) {
        updatedTargetWords[opponentId] = upperWord
      }

      // Update presence data
      if (channel) {
        channel.track(updatedPlayers[playerId])
      }

      // Check if all players have set words
      const allPlayersSetWords = Object.values(updatedPlayers).every(player => player.hasSetWord)
      
      // If all players have set words and we're the host, start the round
      if (allPlayersSetWords && !prevState.roundStarted && isHost) {
        const roundEndTime = Date.now() + 3 * 60 * 1000
        
        channel.send({
          type: "broadcast",
          event: "start-to-play",
          payload: {
            roundEndTime,
            currentRound: prevState.currentRound + 1
          }
        })
        
        return {
          ...prevState,
          players: updatedPlayers,
          targetWords: updatedTargetWords,
          roundStarted: true,
          roundEndTime: roundEndTime,
          currentRound: prevState.currentRound + 1
        }
      }

      return {
        ...prevState,
        players: updatedPlayers,
        targetWords: updatedTargetWords
      }
    })
  }

  // Function to submit a guess
  const submitGuess = (guess: string) => {
    if (!gameState.roundStarted) return
    
    const currentPlayer = gameState.players[playerId]
    if (!currentPlayer || currentPlayer.gameComplete) return

    const targetWord = gameState.targetWords[playerId] || ""
    if (!targetWord) return

    const upperGuess = guess.toUpperCase()
    const updatedGuesses = [...currentPlayer.guesses]
    updatedGuesses[currentPlayer.currentRow] = upperGuess

    // Check if the guess is correct
    const isCorrect = upperGuess === targetWord

    // Check if game is complete for this player
    const gameComplete = isCorrect || currentPlayer.currentRow === 5

    // Record solve time if correct
    const solveTime = isCorrect ? Date.now() : undefined

    const updatedPlayer = {
      ...currentPlayer,
      guesses: updatedGuesses,
      currentRow: currentPlayer.currentRow + 1,
      gameComplete,
      isWinner: isCorrect,
      solveTime
    }

    // Broadcast the updated guesses
    if (channel) {
      channel.send({
        type: "broadcast",
        event: "guess-update",
        payload: {
          id: playerId,
          guesses: updatedGuesses,
          currentRow: updatedPlayer.currentRow,
          gameComplete: updatedPlayer.gameComplete,
          isWinner: updatedPlayer.isWinner,
          solveTime
        },
      })
    }

    // Update local game state
    setGameState((prevState) => {
      const updatedPlayers = { ...prevState.players }
      updatedPlayers[playerId] = updatedPlayer

      // Check if round is over
      const roundOver = Object.values(updatedPlayers).every(player => 
        player.gameComplete || player.currentRow >= 6
      )

      // If round is over and we're the host, broadcast round-end
      if (roundOver && !prevState.gameOver && isHost) {
        // Compute scores and determine winner before ending round
        let roundWinnerId: string | null = null
        let bestAttempts = 7 // More than max attempts possible
        let bestTime = Infinity

        Object.keys(updatedPlayers).forEach(pid => {
          const player = updatedPlayers[pid]
          if (player.isWinner) {
            const attempts = player.currentRow
            
            // Player wins if they used fewer attempts
            if (attempts < bestAttempts) {
              bestAttempts = attempts
              bestTime = player.solveTime || Infinity
              roundWinnerId = pid
            } 
            // If same attempts, the faster player wins
            else if (attempts === bestAttempts && 
                    (player.solveTime || Infinity) < bestTime) {
              bestTime = player.solveTime || Infinity
              roundWinnerId = pid
            }
          }
        })

        // Update scores for the winner
        if (roundWinnerId) {
          updatedPlayers[roundWinnerId].score += Math.max(6 - updatedPlayers[roundWinnerId].currentRow, 1) * 10
          updatedPlayers[roundWinnerId].roundsWon += 1
        }

        // End the round
        if (channel) {
          channel.send({
            type: "broadcast",
            event: "round-end",
            payload: {
              roundWinnerId,
              players: updatedPlayers
            }
          })
        }
      }

      // If round is over, update the screen
      if (roundOver) {
        setCurrentScreen(GameScreen.ROUND_COMPLETE)
      }

      return {
        ...prevState,
        players: updatedPlayers,
        gameOver: roundOver,
      }
    })
  }

  // Start next round
  const startRound = () => {
    if (!isHost) return
  
    setGameState(prevState => {
      const updatedPlayers = { ...prevState.players }
      
      // Reset each player's round-specific state
      Object.keys(updatedPlayers).forEach(pid => {
        updatedPlayers[pid] = {
          ...updatedPlayers[pid],
          guesses: Array(6).fill(""),
          currentRow: 0,
          gameComplete: false,
          isWinner: false,
          solveTime: undefined,
          hasSetWord: false,
        }
      })

      return {
        ...prevState,
        players: updatedPlayers,
        targetWords: {},
        gameOver: false,
        currentRound: prevState.currentRound + 1,
        roundEndTime: 0,
        roundStarted: false
      }
    })
    
    // Move to word setting screen for next round
    setCurrentScreen(GameScreen.WORD_SETTING)
    
    // Broadcast next round start
    if (channel) {
      channel.send({
        type: "broadcast",
        event: "round-start",
        payload: {}
      })
    }
  }

  const value = {
    gameState,
    isGameStarted,
    isHost,
    opponentId,
    currentScreen,
    timeRemaining,
    playerId,
    playerName,
    roomId,
    startGame,
    submitWord,
    submitGuess,
    startRound,
    channel
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
} 