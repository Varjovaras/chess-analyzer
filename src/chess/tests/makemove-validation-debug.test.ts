import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, squareToAlgebraic } from "../board";
import { isValidPieceMove } from "../pieces";

describe("MakeMove Validation Debug", () => {
    test("analyze the exact failing sequence from advanced-scenarios", () => {
        console.log("=== MAKEMOVE VALIDATION DEBUG ===");
        let game = Chess.newGame();
        
        // Follow the exact sequence from advanced-scenarios.test.ts
        console.log("1. g1-f3 (knight)");
        game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
        console.log("   Current player:", game.getCurrentPlayer());
        
        console.log("2. e7-e6 (black pawn)");
        game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!)!;
        console.log("   Current player:", game.getCurrentPlayer());
        
        console.log("3. e2-e3 (white pawn to clear bishop path)");
        const pawnMove = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e3")!);
        if (!pawnMove) {
            console.log("   ❌ Pawn move e2-e3 FAILED");
            const board = game.getBoard();
            console.log("   e2 contains:", board[1]![4]);
            console.log("   e3 contains:", board[2]![4]);
            return;
        }
        game = pawnMove;
        console.log("   ✅ Pawn moved e2-e3");
        console.log("   Current player:", game.getCurrentPlayer());
        
        console.log("4. d7-d6 (black pawn)");
        game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!;
        console.log("   Current player:", game.getCurrentPlayer());
        
        console.log("5. f1-e2 (white bishop to now-empty e2)");
        const board = game.getBoard();
        console.log("   f1 contains:", board[0]![5]);
        console.log("   e2 contains:", board[1]![4]);
        console.log("   Current player:", game.getCurrentPlayer());
        
        // Check if the move is valid according to piece movement logic
        const isValidMove = isValidPieceMove(board, 
            { file: 5, rank: 0 }, // f1
            { file: 4, rank: 1 }  // e2
        );
        console.log("   Is f1-e2 valid piece move?", isValidMove);
        
        const bishopMove = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("e2")!);
        if (!bishopMove) {
            console.log("   ❌ Bishop move f1-e2 FAILED");
            
            // Debug all validation steps
            const piece = board[0]![5]; // f1
            console.log("   Piece at f1:", piece);
            console.log("   Piece color matches current player?", piece?.color === game.getCurrentPlayer());
            
            // Check if king would be in check after move
            console.log("   Checking if move would put king in check...");
            
            return;
        }
        
        console.log("   ✅ Bishop moved f1-e2");
        game = bishopMove;
        
        console.log("6. c7-c6 (black pawn)");
        game = game.makeMove(algebraicToSquare("c7")!, algebraicToSquare("c6")!)!;
        
        console.log("=== ALL MOVES SUCCESSFUL ===");
        expect(true).toBe(true);
    });
    
    test("debug makeMove validation steps in detail", () => {
        console.log("=== DETAILED MAKEMOVE VALIDATION ===");
        const game = Chess.newGame();
        
        // Try a simple pawn move that should work
        console.log("Testing simple pawn move e2-e4...");
        const result = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!);
        
        if (result) {
            console.log("✅ e2-e4 succeeded");
        } else {
            console.log("❌ e2-e4 failed - this indicates a fundamental problem");
        }
        
        // Try the problematic bishop move from initial position
        console.log("Testing bishop move f1-e2 from initial position (should fail)...");
        const bishopResult = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("e2")!);
        
        if (bishopResult) {
            console.log("❌ f1-e2 succeeded (should have failed - e2 occupied by pawn)");
        } else {
            console.log("✅ f1-e2 correctly failed (e2 occupied by own pawn)");
        }
        
        expect(true).toBe(true);
    });
});
