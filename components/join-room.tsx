"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

interface JoinRoomProps {
  onJoinRoom: (name: string, roomId: string, playerId: string) => void
  initialRoomId?: string
  isJoiningFromLink?: boolean
}

export default function JoinRoom({ onJoinRoom, initialRoomId = "", isJoiningFromLink = false }: JoinRoomProps) {
  const [name, setName] = useState("")
  const [roomId, setRoomId] = useState(initialRoomId)
  const [isCreating, setIsCreating] = useState(!isJoiningFromLink)

  useEffect(() => {
    if (initialRoomId) {
      setRoomId(initialRoomId)
      setIsCreating(false)
    }
  }, [initialRoomId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRoomId = `wordle-${Math.random().toString(36).substring(2, 9)}`

    // Use the generated room ID if creating, otherwise use the input room ID
    const finalRoomId = isCreating ? newRoomId : roomId

    // Generate a unique player ID
    const playerId = `player-${Math.random().toString(36).substring(2, 9)}`

    onJoinRoom(name, finalRoomId, playerId)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isCreating ? "Create a Game" : "Join a Game"}</CardTitle>
        <CardDescription>
          {isCreating
            ? "Create a new Wordle duel and challenge a friend"
            : "Enter a room code or use a shared link to join a game"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {!isCreating && (
            <div className="space-y-2">
              <Label htmlFor="roomId">Room Code</Label>
              <Input
                id="roomId"
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required={!isCreating}
                disabled={isJoiningFromLink}
              />
              {isJoiningFromLink && <p className="text-sm text-muted-foreground">You&apos;re joining via a shared link</p>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full">
            {isCreating ? "Create Game" : "Join Game"}
          </Button>
          {!isJoiningFromLink && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsCreating(!isCreating)
              }}
            >
              {isCreating ? "Join Existing Game Instead" : "Create New Game Instead"}
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}

