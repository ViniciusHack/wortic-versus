interface WordleBoardProps {
  guesses: string[]
  targetWord: string
  currentGuess?: string
  isActive?: boolean
}

export default function WordleBoard({ guesses, targetWord, currentGuess = "", isActive = true }: WordleBoardProps) {
  // Function to determine the state of each letter
  const getLetterState = (letter: string, index: number, row: number) => {
    if (!targetWord || !letter) return ""
    
    // Don't show colors for the current guess (row with currentGuess)
    if (guesses[row] === "" && row < guesses.length && currentGuess && currentGuess.length > 0) {
      return ""
    }

    if (letter === targetWord[index]) {
      return "bg-green-500 text-white"
    } else if (targetWord.includes(letter)) {
      return "bg-yellow-500 text-white"
    } else {
      return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="grid gap-2">
      {Array.from({ length: 6 }).map((_, rowIndex) => {
        // If this is the current row and we have a currentGuess, use that
        const rowContent = rowIndex === guesses.findIndex(g => g === "") && currentGuess
          ? currentGuess.padEnd(5)
          : guesses[rowIndex] || "";

        return (
          <div key={rowIndex} className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, colIndex) => {
              const letter = rowContent[colIndex] || ""
              const state = getLetterState(letter, colIndex, rowIndex)

              return (
                <div
                  key={colIndex}
                  className={`
                    w-full aspect-square flex items-center justify-center
                    text-xl font-bold border-2 
                    ${!isActive ? "border-gray-300" : rowContent === currentGuess ? "border-black" : "border-gray-300"}
                    ${state}
                    ${!isActive ? "transform scale-95" : ""}
                  `}
                >
                  {letter}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

