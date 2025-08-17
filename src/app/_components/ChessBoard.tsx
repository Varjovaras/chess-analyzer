"use client";

import type { Board, Piece, Square } from "~/chess";

interface ChessBoardProps {
    board: Board;
    selectedSquare: Square | null;
    onSquareClickAction: (square: Square) => void;
}

const pieceSymbols: Record<string, string> = {
    WHITE_KING: "♔",
    WHITE_QUEEN: "♕",
    WHITE_ROOK: "♖",
    WHITE_BISHOP: "♗",
    WHITE_KNIGHT: "♘",
    WHITE_PAWN: "♙",
    BLACK_KING: "♚",
    BLACK_QUEEN: "♛",
    BLACK_ROOK: "♜",
    BLACK_BISHOP: "♝",
    BLACK_KNIGHT: "♞",
    BLACK_PAWN: "♟",
};

function getPieceSymbol(piece: Piece): string {
    const key = `${piece.color}_${piece.type}`;
    return pieceSymbols[key] || "";
}

function getSquareColor(file: number, rank: number): string {
    const isLight = (file + rank) % 2 === 0;
    return isLight ? "bg-amber-100" : "bg-amber-800";
}

function getSquareLabel(file: number, rank: number): string {
    const fileChar = String.fromCharCode(97 + file); // a-h
    const rankNum = rank + 1; // 1-8
    return `${fileChar}${rankNum}`;
}

export default function ChessBoard({
    board,
    selectedSquare,
    onSquareClickAction,
}: ChessBoardProps) {
    return (
        <div className="inline-block border-4 border-amber-900 shadow-2xl">
            <div className="grid grid-cols-8 gap-0">
                {/* Render board from rank 7 to 0 (8th rank to 1st rank) for proper orientation */}
                {Array.from({ length: 8 }, (_, rankIndex) => {
                    const rank = 7 - rankIndex; // Start from rank 7 (8th rank)
                    return Array.from({ length: 8 }, (_, file) => {
                        const square: Square = { file, rank };
                        const piece = board[rank]?.[file];
                        const isSelected =
                            selectedSquare?.file === file &&
                            selectedSquare?.rank === rank;

                        return (
                            <button
                                key={`${file}-${rank}`}
                                className={`relative flex h-16 w-16 cursor-pointer items-center justify-center transition-all duration-150 hover:brightness-110 ${getSquareColor(file, rank)}
                  ${isSelected ? "ring-4 ring-blue-500 ring-inset" : ""}
                `}
                                onClick={() => onSquareClickAction(square)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        onSquareClickAction(square);
                                    }
                                }}
                                tabIndex={0}
                                type="button"
                            >
                                {/* Square coordinates for debugging */}
                                <div className="absolute top-0 left-0 p-0.5 text-gray-600 text-xs opacity-50">
                                    {getSquareLabel(file, rank)}
                                </div>

                                {/* Piece */}
                                {piece && (
                                    <div className="select-none text-4xl">
                                        {getPieceSymbol(piece)}
                                    </div>
                                )}
                            </button>
                        );
                    });
                }).flat()}
            </div>
        </div>
    );
}
