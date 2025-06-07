import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { createEmptyBoard, setPieceAt, algebraicToSquare, squareToAlgebraic } from "../board";
import type { GameState } from "../types";

describe("Castling Through Check Debug", () => {
    test("debug castling through check detection", () => {
        console.log("=== CASTLING THROUGH CHECK DEBUG ===");
        
        // Create position where castling would move king through attacked square
        const board = createEmptyBoard();
        let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });
        testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: "ROOK", color: "WHITE" });
        testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "ROOK", color: "WHITE" }); // Queenside rook
        testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: "ROOK", color: "BLACK" }); // Should attack d1 (queenside path)
        testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });

        const gameState: GameState = {
            board: testBoard,
            currentPlayer: "WHITE",
            moveHistory: [],
            castlingRights: {
                whiteKingside: true,
                whiteQueenside: true,
                blackKingside: true,
                blackQueenside: true,
            },
            enPassantTarget: null,
            halfmoveClock: 0,
            fullmoveNumber: 1,
        };

        const game = Chess.fromState(gameState);
        
        console.log("Board setup:");
        console.log("White king on e1:", squareToAlgebraic({ file: 4, rank: 0 }));
        console.log("White rook on h1:", squareToAlgebraic({ file: 7, rank: 0 }));
        console.log("White rook on a1:", squareToAlgebraic({ file: 0, rank: 0 }));
        console.log("Black rook on d8:", squareToAlgebraic({ file: 3, rank: 7 }));
        console.log("Black king on e8:", squareToAlgebraic({ file: 4, rank: 7 }));
        
        // Check if d1 is under attack (this blocks queenside castling)
        const d1Square = { file: 3, rank: 0 };
        console.log(`\\nChecking if d1 (${squareToAlgebraic(d1Square)}) is under attack by BLACK...`);
        
        // Manually check black rook attacks
        const blackRookSquare = { file: 3, rank: 7 };
        console.log(`Black rook position: ${squareToAlgebraic(blackRookSquare)}`);
        
        const validMoves = game.getValidMoves();
        const castlingMoves = validMoves.filter(move =>
            move.piece.type === "KING" &&
            Math.abs(move.to.file - move.from.file) === 2
        );

        console.log(`\\nTotal valid moves: ${validMoves.length}`);
        console.log(`Castling moves found: ${castlingMoves.length}`);
        
        if (castlingMoves.length > 0) {
            console.log("Castling moves:");
            castlingMoves.forEach(move => {
                console.log(`  King ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
            });
        }

        console.log("\\n=== END DEBUG ===");

        // Only queenside castling should be blocked (d1 under attack)
        // Kingside castling should still be allowed (f1, g1 not under attack)
        expect(castlingMoves).toHaveLength(1);
        if (castlingMoves.length > 0) {
            expect(castlingMoves[0]!.to.file).toBe(6); // Should be kingside (king to g1)
        }
    });
});
