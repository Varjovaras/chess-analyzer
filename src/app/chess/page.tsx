"use client";

import { useState } from "react";
import ChessBoard from "~/app/_components/ChessBoard";
import { Chess, type Square } from "~/chess";

export default function ChessPage() {
    const [game, setGame] = useState(() => Chess.newGame());
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

    const handleSquareClick = (square: Square) => {
        if (selectedSquare) {
            // Try to make a move
            const newGame = game.makeMove(selectedSquare, square);
            if (newGame) {
                setGame(newGame);
                setSelectedSquare(null);
            } else {
                // Invalid move, select new square if it has a piece
                const piece = game.getBoard()[square.rank]?.[square.file];
                if (piece && piece.color === game.getCurrentPlayer()) {
                    setSelectedSquare(square);
                } else {
                    setSelectedSquare(null);
                }
            }
        } else {
            // Select a square if it has a piece of the current player
            const piece = game.getBoard()[square.rank]?.[square.file];
            if (piece && piece.color === game.getCurrentPlayer()) {
                setSelectedSquare(square);
            }
        }
    };

    const resetGame = () => {
        setGame(Chess.newGame());
        setSelectedSquare(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4">
            <div className="container mx-auto">
                <div className="flex flex-col items-center gap-6">
                    <h1 className="font-bold text-4xl text-white">
                        Chess Game
                    </h1>

                    <div className="text-center">
                        <p className="mb-2 text-white text-xl">
                            Current Player:{" "}
                            <span className="font-bold">
                                {game.getCurrentPlayer()}
                            </span>
                        </p>
                        {game.isInCheck() && (
                            <p className="font-bold text-red-400">Check!</p>
                        )}
                        {game.getGameResult() !== "ONGOING" && (
                            <p className="font-bold text-xl text-yellow-400">
                                Game Over: {game.getGameResult()}
                            </p>
                        )}
                    </div>

                    <ChessBoard
                        board={game.getBoard()}
                        selectedSquare={selectedSquare}
                        onSquareClickAction={handleSquareClick}
                    />

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={resetGame}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            New Game
                        </button>
                    </div>

                    <div className="max-w-md text-center text-sm text-white">
                        <p>
                            Click on a piece to select it, then click on a
                            destination square to move.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
