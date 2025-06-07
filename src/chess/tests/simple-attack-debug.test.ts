import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { createEmptyBoard, setPieceAt, algebraicToSquare, squareToAlgebraic } from "../board";
import { getPieceMoves } from "../pieces";
import type { GameState } from "../types";

describe("Simple Attack Debug", () => {
    test("verify rook on f8 attacks f1", () => {
        console.log("=== SIMPLE ATTACK TEST ===");
        
        const board = createEmptyBoard();
        // Place only a black rook on f8 and white king on e1
        let testBoard = setPieceAt(board, { file: 5, rank: 7 }, { type: "ROOK", color: "BLACK" });
        testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });

        const rookMoves = getPieceMoves(testBoard, { file: 5, rank: 7 });
        
        console.log("Rook on f8 can move to:");
        rookMoves.forEach(move => {
            console.log(`  ${squareToAlgebraic(move)}`);
        });
        
        const attacksF1 = rookMoves.some(move => move.file === 5 && move.rank === 0);
        console.log(`\\nDoes rook attack f1? ${attacksF1}`);
        
        // Test the isSquareUnderAttack function directly
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
        
        // Test if f1 is detected as under attack
        const f1Square = { file: 5, rank: 0 };
        // We need to access the private method, so let's test via castling logic
        
        const validMoves = game.getValidMoves();
        const castlingMoves = validMoves.filter(move =>
            move.piece.type === "KING" &&
            Math.abs(move.to.file - move.from.file) === 2
        );
        
        console.log(`\\nValid moves count: ${validMoves.length}`);
        console.log(`Castling moves found: ${castlingMoves.length}`);
        
        if (castlingMoves.length > 0) {
            console.log("Castling moves:");
            castlingMoves.forEach(move => {
                console.log(`  King ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
            });
        }
        
        console.log("\\n=== END TEST ===");
        
        expect(attacksF1).toBe(true);
        expect(castlingMoves).toHaveLength(0); // Should be blocked
    });
});
