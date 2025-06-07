import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { createEmptyBoard, setPieceAt, algebraicToSquare, squareToAlgebraic } from "../board";
import { getPieceMoves } from "../pieces";
import type { GameState } from "../types";

describe("Attack Analysis Debug", () => {
    test("analyze what black rook on d8 attacks", () => {
        console.log("=== ATTACK ANALYSIS DEBUG ===");
        
        const board = createEmptyBoard();
        let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });
        testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: "ROOK", color: "WHITE" });
        testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "ROOK", color: "WHITE" });
        testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: "ROOK", color: "BLACK" }); // d8
        testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });

        const blackRookSquare = { file: 3, rank: 7 }; // d8
        const rookMoves = getPieceMoves(testBoard, blackRookSquare);
        
        console.log("Black rook on d8 attacks these squares:");
        rookMoves.forEach(move => {
            console.log(`  ${squareToAlgebraic(move)}`);
        });
        
        // Check specifically for squares in castling paths
        const f1 = { file: 5, rank: 0 };
        const g1 = { file: 6, rank: 0 };
        const d1 = { file: 3, rank: 0 };
        const c1 = { file: 2, rank: 0 };
        
        const attacksF1 = rookMoves.some(move => move.file === f1.file && move.rank === f1.rank);
        const attacksG1 = rookMoves.some(move => move.file === g1.file && move.rank === g1.rank);
        const attacksD1 = rookMoves.some(move => move.file === d1.file && move.rank === d1.rank);
        const attacksC1 = rookMoves.some(move => move.file === c1.file && move.rank === c1.rank);
        
        console.log(`\\nCastling path analysis:`);
        console.log(`  Attacks f1 (kingside): ${attacksF1}`);
        console.log(`  Attacks g1 (kingside): ${attacksG1}`);
        console.log(`  Attacks d1 (queenside): ${attacksD1}`);
        console.log(`  Attacks c1 (queenside): ${attacksC1}`);
        
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
        const validMoves = game.getValidMoves();
        const castlingMoves = validMoves.filter(move =>
            move.piece.type === "KING" &&
            Math.abs(move.to.file - move.from.file) === 2
        );

        console.log(`\\nCastling moves allowed: ${castlingMoves.length}`);
        castlingMoves.forEach(move => {
            console.log(`  King ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
        });
        
        console.log("\\n=== END ANALYSIS ===");
        
        // Since rook on d8 attacks d1, queenside castling should be blocked
        // Since rook on d8 does NOT attack f1 or g1, kingside castling should be allowed
        // But this contradicts our expectation - let me check if there's an issue
        expect(attacksD1).toBe(true); // Rook should attack d1
        expect(attacksF1).toBe(false); // Rook should NOT attack f1
        expect(attacksG1).toBe(false); // Rook should NOT attack g1
    });
});
