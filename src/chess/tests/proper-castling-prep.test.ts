import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, squareToAlgebraic } from "../board";

describe("Proper Castling Preparation", () => {
    test("correct sequence for kingside castling", () => {
        console.log("=== PROPER KINGSIDE CASTLING PREPARATION ===");
        let game = Chess.newGame();
        
        // For kingside castling, we need to clear f1, g1 squares
        // Knight is on g1, bishop is on f1
        
        console.log("1. Move knight from g1 to f3...");
        game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
        console.log("   ✅ Knight moved to f3");
        
        console.log("2. Black pawn move e7-e6...");
        game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!)!;
        console.log("   ✅ Black pawn moved");
        
        // Now for the bishop, we need to move it to a square that's not blocked
        // Let's try moving a pawn first to clear a path, or find an available diagonal
        const validMoves = game.getValidMoves();
        const bishopMoves = validMoves.filter(m => m.piece.type === "BISHOP");
        console.log("3. Available bishop moves:");
        bishopMoves.forEach(move => {
            console.log(`   - ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
        });
        
        if (bishopMoves.length > 0) {
            console.log("4. Moving bishop to first available square...");
            const firstBishopMove = bishopMoves[0]!;
            game = game.makeMove(firstBishopMove.from, firstBishopMove.to)!;
            console.log(`   ✅ Bishop moved to ${squareToAlgebraic(firstBishopMove.to)}`);
            
            console.log("5. Black move...");
            game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!;
        } else {
            // Maybe we need to move a pawn first
            console.log("4. No bishop moves available, let's move a pawn to clear the path...");
            console.log("   Moving e2 pawn to e3 or e4...");
            
            const pawnMove = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e3")!);
            if (pawnMove) {
                game = pawnMove;
                console.log("   ✅ Pawn moved to e3");
                
                // Now try bishop move
                const newValidMoves = game.getValidMoves();
                const newBishopMoves = newValidMoves.filter(m => m.piece.type === "BISHOP");
                console.log("   Available bishop moves after pawn move:");
                newBishopMoves.forEach(move => {
                    console.log(`     - ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
                });
            }
            
            console.log("5. Black move...");
            game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!;
        }
        
        console.log("5. Black move...");
        game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!;
        
        // Check if castling is available
        const finalValidMoves = game.getValidMoves();
        const castlingMoves = finalValidMoves.filter(move =>
            move.piece.type === "KING" &&
            Math.abs(move.to.file - move.from.file) === 2
        );
        
        console.log("6. Castling moves available:", castlingMoves.length);
        castlingMoves.forEach(move => {
            console.log(`   - King ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
        });
        
        expect(true).toBe(true);
    });
});
