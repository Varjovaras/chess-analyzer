import { describe, test, expect } from "vitest";
import { Chess } from "../game";

describe("Board Setup Debug", () => {
    test("check initial board setup", () => {
        const game = Chess.newGame();
        const board = game.getBoard();
        
        console.log("Initial board setup:");
        console.log("e1 (king):", board[0]![4]);
        console.log("e2 (pawn):", board[1]![4]);
        console.log("f1 (bishop):", board[0]![5]);
        console.log("f2 (pawn):", board[1]![5]);
        console.log("g1 (knight):", board[0]![6]);
        console.log("g2 (pawn):", board[1]![6]);
        console.log("h1 (rook):", board[0]![7]);
        console.log("h2 (pawn):", board[1]![7]);
        
        // Check that we can see the output
        console.log("=== TEST COMPLETED ===");
        expect(board[1]![4]?.type).toBe("PAWN"); // Expect pawn on e2
    });
});
