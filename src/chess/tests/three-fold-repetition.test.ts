import { describe, it, expect } from "vitest";
import { Chess } from "../game/chess";

describe("Three-fold Repetition", () => {
    it("should detect three-fold repetition with simple back-and-forth moves", () => {
        const game = Chess.newGame();

        // Move knight out and back repeatedly
        const knightMoves = [
            // First repetition
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8

            // Second repetition
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8
        ];

        let currentGame = game;
        for (let i = 0; i < knightMoves.length; i++) {
            const move = knightMoves[i]!;
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;

            // After first 7 moves, should still be ongoing
            if (i < knightMoves.length - 1) {
                expect(currentGame.getGameResult()).toBe("ONGOING");
            }
        }

        // After 8 moves (2 complete cycles), we should have three-fold repetition
        expect(currentGame.getGameResult()).toBe("DRAW");
    });

    it("should detect three-fold repetition with knight moves from different starting position", () => {
        const game = Chess.newGame();

        // Create a simple repetition pattern with knights only
        const moves = [
            // First occurrence of target position
            { from: { file: 6, rank: 0 }, to: { file: 5, rank: 2 } }, // Ng1-f3
            { from: { file: 6, rank: 7 }, to: { file: 5, rank: 5 } }, // Ng8-f6

            // Move away from target position
            { from: { file: 5, rank: 2 }, to: { file: 6, rank: 0 } }, // Nf3-g1
            { from: { file: 5, rank: 5 }, to: { file: 6, rank: 7 } }, // Nf6-g8

            // Second occurrence of target position
            { from: { file: 6, rank: 0 }, to: { file: 5, rank: 2 } }, // Ng1-f3
            { from: { file: 6, rank: 7 }, to: { file: 5, rank: 5 } }, // Ng8-f6

            // Move away again
            { from: { file: 5, rank: 2 }, to: { file: 6, rank: 0 } }, // Nf3-g1
            { from: { file: 5, rank: 5 }, to: { file: 6, rank: 7 } }, // Nf6-g8

            // Third occurrence - should trigger draw
            { from: { file: 6, rank: 0 }, to: { file: 5, rank: 2 } }, // Ng1-f3
            { from: { file: 6, rank: 7 }, to: { file: 5, rank: 5 } }, // Ng8-f6
        ];

        let currentGame = game;
        for (const move of moves) {
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;
        }

        expect(currentGame.getGameResult()).toBe("DRAW");
    });

    it("should track different positions correctly even with similar board states", () => {
        const game = Chess.newGame();

        // Make some knight moves
        const moves = [
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8

            // Make a different sequence that doesn't create repetition
            { from: { file: 6, rank: 0 }, to: { file: 5, rank: 2 } }, // Ng1-f3
            { from: { file: 6, rank: 7 }, to: { file: 5, rank: 5 } }, // Ng8-f6
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
        ];

        let currentGame = game;
        for (const move of moves) {
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;
        }

        // Should not be a draw because board state is different from original
        expect(currentGame.getGameResult()).toBe("ONGOING");
    });

    it("should not detect three-fold repetition with different en passant possibilities", () => {
        const game = Chess.newGame();

        // Create a position where en passant is possible in one case but not in repetition
        const moves = [
            { from: { file: 4, rank: 1 }, to: { file: 4, rank: 2 } }, // e2-e3
            { from: { file: 3, rank: 6 }, to: { file: 3, rank: 4 } }, // d7-d5
            { from: { file: 4, rank: 2 }, to: { file: 4, rank: 3 } }, // e3-e4
            { from: { file: 3, rank: 4 }, to: { file: 4, rank: 3 } }, // dxe4
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8

            // Create en passant possibility
            { from: { file: 5, rank: 1 }, to: { file: 5, rank: 3 } }, // f2-f4
            { from: { file: 4, rank: 3 }, to: { file: 5, rank: 2 } }, // exf3 (en passant)
        ];

        let currentGame = game;
        for (const move of moves) {
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;
        }

        // Continue with knight moves
        const knightMoves = [
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8
        ];

        for (const move of knightMoves) {
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;
        }

        // Should not be a draw because the positions are different (no en passant in current position)
        expect(currentGame.getGameResult()).toBe("ONGOING");
    });

    it("should detect three-fold repetition with alternating pieces", () => {
        const game = Chess.newGame();

        // Create alternating knight moves that eventually repeat the starting position
        const moves = [
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 6, rank: 7 }, to: { file: 5, rank: 5 } }, // Ng8-f6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 5, rank: 5 }, to: { file: 6, rank: 7 } }, // Nf6-g8
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 6, rank: 7 }, to: { file: 5, rank: 5 } }, // Ng8-f6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 5, rank: 5 }, to: { file: 6, rank: 7 } }, // Nf6-g8
        ];

        let currentGame = game;
        for (const move of moves) {
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;
        }

        // Should be a draw after reaching the starting position for the third time
        expect(currentGame.getGameResult()).toBe("DRAW");
    });

    it("should reset position history after captures or pawn moves", () => {
        const game = Chess.newGame();

        // Create a repetition, then make a pawn move
        const moves = [
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8

            // Make a pawn move (this doesn't reset position history, but changes the position)
            { from: { file: 4, rank: 1 }, to: { file: 4, rank: 3 } }, // e2-e4
            { from: { file: 4, rank: 6 }, to: { file: 4, rank: 4 } }, // e7-e5

            // Try to repeat the original knight moves
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8

            // Repeat again
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
        ];

        let currentGame = game;
        for (const move of moves) {
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;
        }

        // Should not be a draw because the positions are different (pawns moved)
        expect(currentGame.getGameResult()).toBe("ONGOING");
    });

    it("should handle position counting correctly in complex scenarios", () => {
        const game = Chess.newGame();

        // Create a specific sequence that tests position counting
        const moves = [
            // Create first occurrence of a position
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6

            // Move away from that position
            { from: { file: 2, rank: 2 }, to: { file: 3, rank: 4 } }, // Nc3-d5
            { from: { file: 2, rank: 5 }, to: { file: 3, rank: 3 } }, // Nc6-d4

            // Return to create second occurrence
            { from: { file: 3, rank: 4 }, to: { file: 2, rank: 2 } }, // Nd5-c3
            { from: { file: 3, rank: 3 }, to: { file: 2, rank: 5 } }, // Nd4-c6

            // Move away again
            { from: { file: 2, rank: 2 }, to: { file: 1, rank: 0 } }, // Nc3-b1
            { from: { file: 2, rank: 5 }, to: { file: 1, rank: 7 } }, // Nc6-b8

            // Return to create third occurrence (should trigger draw)
            { from: { file: 1, rank: 0 }, to: { file: 2, rank: 2 } }, // Nb1-c3
            { from: { file: 1, rank: 7 }, to: { file: 2, rank: 5 } }, // Nb8-c6
        ];

        let currentGame = game;
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i]!;
            const newGame = currentGame.makeMove(move.from, move.to);
            expect(newGame).toBeTruthy();
            currentGame = newGame!;

            // Should not be draw until we reach the third occurrence
            if (i < moves.length - 1) {
                expect(currentGame.getGameResult()).toBe("ONGOING");
            }
        }

        // Final position should be a draw due to three-fold repetition
        expect(currentGame.getGameResult()).toBe("DRAW");
    });
});
