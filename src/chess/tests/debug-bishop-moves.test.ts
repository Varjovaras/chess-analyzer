import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare } from "../board";
import { getPieceMoves } from "../pieces";

describe("Debug Bishop Moves", () => {
    test("debug exact bishop move issue", () => {
        let game = Chess.newGame();
        
        console.log("=== DEBUGGING BISHOP MOVE ISSUE ===");
        
        // Make the sequence that should work
        console.log("1. Knight move g1-f3");
        game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
        
        console.log("2. Black pawn e7-e6");
        game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!)!;
        
        console.log("3. Pawn move e2-e3 (clearing e2)");
        game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e3")!)!;
        
        console.log("4. Black pawn d7-d6");
        game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!;
        
        // Now check what's at e2 and f1
        const board = game.getBoard();
        console.log("5. Checking board state:");
        console.log("   e2 square:", board[1]![4]); // e2 = file 4, rank 1
        console.log("   f1 square:", board[0]![5]); // f1 = file 5, rank 0
        
        // Check bishop moves
        const bishopMoves = getPieceMoves(board, { file: 5, rank: 0 }); // f1
        console.log("6. Bishop moves from f1:");
        bishopMoves.forEach(move => {
            console.log(`   to file ${move.file}, rank ${move.rank}`);
        });
        
        // Try the move
        console.log("7. Attempting bishop move f1-e2");
        const result = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("e2")!);
        console.log("   Result:", result ? "SUCCESS" : "FAILED");
        
        expect(result).not.toBeNull();
    });
});
