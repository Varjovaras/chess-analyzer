import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, squareToAlgebraic } from "../board";

describe("Castling Fix Debug", () => {
    test("understand what moves are actually available for bishop", () => {
        console.log("=== BISHOP MOVEMENT DEBUG ===");
        let game = Chess.newGame();
        
        // Move knight out of the way
        game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
        game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!)!;
        
        // Check what moves are available for the white bishop
        const validMoves = game.getValidMoves();
        const bishopMoves = validMoves.filter(m => m.piece.type === "BISHOP");
        
        console.log("Available bishop moves:");
        bishopMoves.forEach(move => {
            console.log(`- ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
        });
        
        // Let's try to understand why the test expects f1-e2
        // Maybe we need to move the e2 pawn first?
        console.log("\nTrying to move e2 pawn to e3...");
        const pawnMove = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e3")!);
        if (pawnMove) {
            game = pawnMove;
            console.log("✅ e2-e3 pawn move successful");
            
            game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!;
            console.log("✅ Black pawn move");
            
            // Now check bishop moves again
            const newValidMoves = game.getValidMoves();
            const newBishopMoves = newValidMoves.filter(m => m.piece.type === "BISHOP");
            console.log("\nBishop moves after clearing e2:");
            newBishopMoves.forEach(move => {
                console.log(`- ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
            });
            
            // Try the f1-e2 move now
            const bishopToE2 = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("e2")!);
            if (bishopToE2) {
                console.log("✅ f1-e2 bishop move now works!");
            } else {
                console.log("❌ f1-e2 bishop move still fails");
            }
        } else {
            console.log("❌ e2-e3 pawn move failed");
        }
        
        expect(true).toBe(true);
    });
});
