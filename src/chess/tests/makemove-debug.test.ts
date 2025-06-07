import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, getPieceAt } from "../board";
import { isValidPieceMove } from "../pieces";

describe("makeMove debugging", () => {
    test("debug basic pawn move failure", () => {
        const game = Chess.newGame();
        const from = algebraicToSquare("e2")!;
        const to = algebraicToSquare("e4")!;
        
        console.log("Initial state:");
        console.log("Current player:", game.getCurrentPlayer());
        
        // Check piece at source
        const piece = getPieceAt(game.getBoard(), from);
        console.log("Piece at e2:", piece);
        
        // Check if piece belongs to current player
        if (piece) {
            console.log("Piece color matches current player:", piece.color === game.getCurrentPlayer());
        }
        
        // Check if move is valid according to piece movement rules
        const isValidMove = isValidPieceMove(game.getBoard(), from, to);
        console.log("Is valid piece move:", isValidMove);
        
        // Check if target square is empty/capturable
        const targetPiece = getPieceAt(game.getBoard(), to);
        console.log("Target square piece:", targetPiece);
        
        // Try the move
        const result = game.makeMove(from, to);
        console.log("Move result:", result ? "SUCCESS" : "FAILED");
        
        expect(result).not.toBeNull();
    });

    test("debug bishop move failure from advanced-scenarios", () => {
        let game = Chess.newGame();
        
        // Make moves to set up the failing scenario
        game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e3")!)!; // White pawn
        game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!)!; // Black pawn
        
        // Now try the failing bishop move
        const from = algebraicToSquare("f1")!;
        const to = algebraicToSquare("e2")!;
        
        console.log("\nAfter pawn moves:");
        console.log("Current player:", game.getCurrentPlayer());
        
        // Check piece at source
        const piece = getPieceAt(game.getBoard(), from);
        console.log("Piece at f1:", piece);
        
        // Check target square
        const targetPiece = getPieceAt(game.getBoard(), to);
        console.log("Piece at e2:", targetPiece);
        
        // Check if move is valid according to piece movement rules
        const isValidMove = isValidPieceMove(game.getBoard(), from, to);
        console.log("Is valid piece move:", isValidMove);
        
        // Try the move
        const result = game.makeMove(from, to);
        console.log("Move result:", result ? "SUCCESS" : "FAILED");
        
        expect(result).not.toBeNull(); // This should succeed because e2 is now empty (pawn moved to e3)
    });
});
