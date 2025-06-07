import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { createEmptyBoard, setPieceAt, squareToAlgebraic } from "../board";
import { getPieceMoves } from "../pieces";
import type { GameState } from "../types";

describe("Attack Check Debug", () => {
    test("verify black rook on d8 attacks d1", () => {
        console.log("=== TESTING ROOK ATTACK DETECTION ===");
        
        const board = createEmptyBoard();
        let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });
        testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: "ROOK", color: "BLACK" });
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
        console.log("Black rook on d8:", squareToAlgebraic({ file: 3, rank: 7 }));
        console.log("Black king on e8:", squareToAlgebraic({ file: 4, rank: 7 }));
        
        // Test direct rook moves
        const rookSquare = { file: 3, rank: 7 };
        const rookMoves = getPieceMoves(testBoard, rookSquare);
        console.log("\\nRook on d8 can attack squares:");
        rookMoves.forEach(move => {
            console.log(`  ${squareToAlgebraic(move)}`);
        });
        
        // Check if d1 is in the rook's attack range
        const d1Square = { file: 3, rank: 0 };
        const canAttackD1 = rookMoves.some(move => move.file === d1Square.file && move.rank === d1Square.rank);
        console.log(`\\nCan rook attack d1? ${canAttackD1}`);
        
        // Use the game's attack detection
        const isD1UnderAttack = (game as any).isSquareUnderAttack(d1Square, "BLACK");
        console.log(`Is d1 under attack by BLACK according to game? ${isD1UnderAttack}`);
        
        // Test castling possibilities
        const validMoves = game.getValidMoves();
        const castlingMoves = validMoves.filter(move =>
            move.piece.type === "KING" &&
            Math.abs(move.to.file - move.from.file) === 2
        );
        
        console.log(`\\nCastling moves available: ${castlingMoves.length}`);
        castlingMoves.forEach(move => {
            const side = move.to.file === 6 ? "kingside" : "queenside";
            console.log(`  ${side}: King ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
        });
        
        console.log("\\n=== END TEST ===");
        
        // The rook should attack d1
        expect(canAttackD1).toBe(true);
        expect(isD1UnderAttack).toBe(true);
    });
});
