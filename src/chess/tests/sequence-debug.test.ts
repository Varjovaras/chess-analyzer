import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, squareToAlgebraic } from "../board";
import { getPieceMoves } from "../pieces";

describe("Sequence Debug Tests", () => {
    test("debug the failing sequence from advanced-scenarios", () => {
        console.log("=== DEBUGGING FAILED SEQUENCE ===");
        let game = Chess.newGame();
        
        console.log("1. Testing knight move g1-f3...");
        console.log("   Current player:", game.getCurrentPlayer());
        console.log("   From square g1:", algebraicToSquare("g1"));
        console.log("   To square f3:", algebraicToSquare("f3"));
        
        const knightMove = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!);
        if (!knightMove) {
            console.log("   ❌ Knight move FAILED");
            
            // Debug why knight move failed
            const board = game.getBoard();
            const piece = board[0]![6]; // g1 position
            console.log("   Piece at g1:", piece);
            
            const validMoves = game.getValidMoves();
            const knightMoves = validMoves.filter(m => m.piece.type === "KNIGHT");
            console.log("   Available knight moves:", knightMoves.map(m => ({
                from: squareToAlgebraic(m.from),
                to: squareToAlgebraic(m.to)
            })));
            return;
        }
        game = knightMove;
        console.log("   ✅ Knight move successful");
        console.log("   Current player after knight move:", game.getCurrentPlayer());
        
        console.log("2. Testing black pawn move e7-e6...");
        const blackPawnMove = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!);
        if (!blackPawnMove) {
            console.log("   ❌ Black pawn move FAILED");
            return;
        }
        game = blackPawnMove;
        console.log("   ✅ Black pawn move successful");
        console.log("   Current player after black pawn move:", game.getCurrentPlayer());
        
        console.log("3. Testing bishop move f1-e2...");
        
        // Debug the board state first
        const boardBeforeBishop = game.getBoard();
        console.log("   Board state before bishop move:");
        console.log("   e2 square:", boardBeforeBishop[1]![4]); // e2 position
        console.log("   f1 square:", boardBeforeBishop[0]![5]); // f1 position
        
        // Check if bishop can move using piece movement logic
        const bishopMoves = getPieceMoves(boardBeforeBishop, { file: 5, rank: 0 }); // f1
        console.log("   Raw bishop moves from getPieceMoves:", bishopMoves);
        
        const bishopMove = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("e2")!);
        if (!bishopMove) {
            console.log("   ❌ Bishop move FAILED");
            
            // Debug why bishop move failed
            const board = game.getBoard();
            const piece = board[0]![5]; // f1 position
            console.log("   Piece at f1:", piece);
            
            const validMoves = game.getValidMoves();
            const bishopMoves = validMoves.filter(m => m.piece.type === "BISHOP");
            console.log("   Available bishop moves:", bishopMoves.map(m => ({
                from: squareToAlgebraic(m.from),
                to: squareToAlgebraic(m.to)
            })));
            return;
        }
        game = bishopMove;
        console.log("   ✅ Bishop move successful");
        console.log("   Current player after bishop move:", game.getCurrentPlayer());
        
        console.log("4. Testing black pawn move d7-d6...");
        const blackPawnMove2 = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!);
        if (!blackPawnMove2) {
            console.log("   ❌ Second black pawn move FAILED");
            return;
        }
        game = blackPawnMove2;
        console.log("   ✅ Second black pawn move successful");
        
        console.log("=== ALL MOVES SUCCESSFUL ===");
        expect(true).toBe(true); // Just to make it a valid test
    });
});
