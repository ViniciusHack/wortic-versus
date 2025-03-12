import { getColorClass } from "@/lib/utils"
import type { Player } from "@/types/game"

interface PlayerAvatarProps {
  player: Player
  isCurrentPlayer: boolean
}

export default function PlayerAvatar({ player, isCurrentPlayer }: PlayerAvatarProps) {
  return (
    <div
      className={`absolute flex flex-col items-center transition-all duration-200 ease-out`}
      style={{
        left: `${player.x}px`,
        top: `${player.y}px`,
      }}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getColorClass(player.color || "blue")} ${isCurrentPlayer ? "ring-2 ring-black" : ""}`}
      >
        {player.name.charAt(0).toUpperCase()}
      </div>
      {isCurrentPlayer && <div className="mt-1 px-2 py-0.5 bg-black text-white text-xs rounded-full">You</div>}
      {!isCurrentPlayer && (
        <div className="mt-1 px-2 py-0.5 bg-gray-200 text-gray-800 text-xs rounded-full">{player.name}</div>
      )}
    </div>
  )
}

