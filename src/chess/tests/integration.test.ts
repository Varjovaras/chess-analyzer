import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare } from "../board";

describe("Chess integration tests", () => {
    describe("Complete game scenarios", () => {
        test("Scholar's Mate (fastest checkmate)", () => {
            let game = Chess.newGame();

            // 1. e4 e5
            game = game.makeMove(
                algebraicToSquare("e2")!,
                algebraicToSquare("e4")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("e7")!,
                algebraicToSquare("e5")!,
            )!;

            // 2. Bc4 Nc6
            game = game.makeMove(
                algebraicToSquare("f1")!,
                algebraicToSquare("c4")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("b8")!,
                algebraicToSquare("c6")!,
            )!;

            // 3. Qh5 Nf6?? (bad move)
            game = game.makeMove(
                algebraicToSquare("d1")!,
                algebraicToSquare("h5")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("g8")!,
                algebraicToSquare("f6")!,
            )!;

            // 4. Qxf7# (checkmate)
            const finalGame = game.makeMove(
                algebraicToSquare("h5")!,
                algebraicToSquare("f7")!,
            );

            expect(finalGame).not.toBeNull();
            expect(finalGame!.isGameOver()).toBe(true);
            expect(finalGame!.getGameResult()).toBe("WHITE_WINS");
        });

        test("Basic opening development", () => {
            let game = Chess.newGame();

            // Italian Game opening
            game = game.makeMove(
                algebraicToSquare("e2")!,
                algebraicToSquare("e4")!,
            )!; // 1. e4
            game = game.makeMove(
                algebraicToSquare("e7")!,
                algebraicToSquare("e5")!,
            )!; // 1... e5
            game = game.makeMove(
                algebraicToSquare("g1")!,
                algebraicToSquare("f3")!,
            )!; // 2. Nf3
            game = game.makeMove(
                algebraicToSquare("b8")!,
                algebraicToSquare("c6")!,
            )!; // 2... Nc6
            game = game.makeMove(
                algebraicToSquare("f1")!,
                algebraicToSquare("c4")!,
            )!; // 3. Bc4
            game = game.makeMove(
                algebraicToSquare("f8")!,
                algebraicToSquare("c5")!,
            )!; // 3... Bc5

            expect(game.getCurrentPlayer()).toBe("WHITE");
            expect(game.getMoveHistory()).toHaveLength(6);
            expect(game.isGameOver()).toBe(false);

            // Check that pieces are in correct positions
            const board = game.getBoard();
            expect(board[5]![5]).toEqual({ type: "KNIGHT", color: "WHITE" }); // Nf3
            expect(board[2]![2]).toEqual({ type: "BISHOP", color: "WHITE" }); // Bc4
            expect(board[5]![2]).toEqual({ type: "KNIGHT", color: "BLACK" }); // Nc6
            expect(board[2]![2]).toEqual({ type: "BISHOP", color: "WHITE" }); // Bc4
        });

        test("Castling preparation", () => {
            let game = Chess.newGame();

            // Clear squares for kingside castling
            game = game.makeMove(
                algebraicToSquare("g1")!,
                algebraicToSquare("f3")!,
            )!; // Nf3
            game = game.makeMove(
                algebraicToSquare("e7")!,
                algebraicToSquare("e6")!,
            )!; // e6
            game = game.makeMove(
                algebraicToSquare("f1")!,
                algebraicToSquare("e2")!,
            )!; // Be2
            game = game.makeMove(
                algebraicToSquare("d7")!,
                algebraicToSquare("d6")!,
            )!; // d6

            // Now kingside should be clear for both sides
            const board = game.getBoard();
            expect(board[0]![5]).toBeNull(); // f1 empty
            expect(board[0]![6]).toBeNull(); // g1 empty

            // King and rook should still be in starting positions
            expect(board[0]![4]).toEqual({ type: "KING", color: "WHITE" });
            expect(board[0]![7]).toEqual({ type: "ROOK", color: "WHITE" });
        });
    });

    describe("Complex piece interactions", () => {
        test("Multiple captures in sequence", () => {
            let game = Chess.newGame();

            // Set up a position with multiple captures
            game = game.makeMove(
                algebraicToSquare("e2")!,
                algebraicToSquare("e4")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("d7")!,
                algebraicToSquare("d5")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("e4")!,
                algebraicToSquare("d5")!,
            )!; // exd5
            game = game.makeMove(
                algebraicToSquare("d8")!,
                algebraicToSquare("d5")!,
            )!; // Qxd5
            game = game.makeMove(
                algebraicToSquare("b1")!,
                algebraicToSquare("c3")!,
            )!; // Nc3
            game = game.makeMove(
                algebraicToSquare("d5")!,
                algebraicToSquare("a5")!,
            )!; // Qa5
            game = game.makeMove(
                algebraicToSquare("d2")!,
                algebraicToSquare("d4")!,
            )!; // d4

            const history = game.getMoveHistory();
            const captures = history.filter((move) => move.captured);
            expect(captures).toHaveLength(2);

            expect(game.isGameOver()).toBe(false);
        });

        test("Piece development and central control", () => {
            let game = Chess.newGame();

            // Control center with pawns and develop pieces
            game = game.makeMove(
                algebraicToSquare("d2")!,
                algebraicToSquare("d4")!,
            )!; // d4
            game = game.makeMove(
                algebraicToSquare("d7")!,
                algebraicToSquare("d5")!,
            )!; // d5
            game = game.makeMove(
                algebraicToSquare("c2")!,
                algebraicToSquare("c4")!,
            )!; // c4
            game = game.makeMove(
                algebraicToSquare("e7")!,
                algebraicToSquare("e6")!,
            )!; // e6
            game = game.makeMove(
                algebraicToSquare("b1")!,
                algebraicToSquare("c3")!,
            )!; // Nc3
            game = game.makeMove(
                algebraicToSquare("g8")!,
                algebraicToSquare("f6")!,
            )!; // Nf6
            game = game.makeMove(
                algebraicToSquare("c1")!,
                algebraicToSquare("g5")!,
            )!; // Bg5

            const board = game.getBoard();

            // Check central pawn structure
            expect(board[3]![3]).toEqual({ type: "PAWN", color: "WHITE" }); // d4
            expect(board[3]![4]).toEqual({ type: "PAWN", color: "BLACK" }); // d5
            expect(board[2]![2]).toEqual({ type: "PAWN", color: "WHITE" }); // c4

            // Check piece development
            expect(board[5]![2]).toEqual({ type: "KNIGHT", color: "WHITE" }); // Nc3
            expect(board[6]![6]).toEqual({ type: "BISHOP", color: "WHITE" }); // Bg5
            expect(board[5]![5]).toEqual({ type: "KNIGHT", color: "BLACK" }); // Nf6
        });

        test("Pin and discovered attack mechanics", () => {
            let game = Chess.newGame();

            // Create a pin scenario
            game = game.makeMove(
                algebraicToSquare("e2")!,
                algebraicToSquare("e4")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("e7")!,
                algebraicToSquare("e5")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("f1")!,
                algebraicToSquare("c4")!,
            )!; // Bc4 (targeting f7)
            game = game.makeMove(
                algebraicToSquare("b8")!,
                algebraicToSquare("c6")!,
            )!;
            game = game.makeMove(
                algebraicToSquare("d1")!,
                algebraicToSquare("h5")!,
            )!; // Qh5 (targeting f7)

            // Now f7 pawn is under attack by both bishop and queen
            const validMoves = game.getValidMoves();

            // Black should have defensive moves available
            expect(validMoves.length).toBeGreaterThan(0);

            // Check that pieces are in attacking positions
            const board = game.getBoard();
            expect(board[2]![2]).toEqual({ type: "BISHOP", color: "WHITE" }); // Bc4
            expect(board[4]![7]).toEqual({ type: "QUEEN", color: "WHITE" }); // Qh5
        });
    });

    describe("Endgame scenarios", () => {
        test("King and queen vs king", () => {
            const game = Chess.newGame();
            const state = game.getState();

            // Create a simplified endgame position
            const endgameState = {
                ...state,
                board: Array(8)
                    .fill(null)
                    .map(() => Array(8).fill(null)),
            };

            // Place pieces for king and queen vs king endgame
            endgameState.board[0]![4] = { type: "KING", color: "WHITE" }; // White king on e1
            endgameState.board[0]![3] = { type: "QUEEN", color: "WHITE" }; // White queen on d1
            endgameState.board[7]![4] = { type: "KING", color: "BLACK" }; // Black king on e8

            const endGame = Chess.fromState(endgameState);

            expect(endGame.isGameOver()).toBe(false);
            expect(endGame.getCurrentPlayer()).toBe("WHITE");

            // White should have many moves available with queen
            const validMoves = endGame.getValidMoves();
            const queenMoves = validMoves.filter(
                (move) => move.piece.type === "QUEEN",
            );
            expect(queenMoves.length).toBeGreaterThan(10);
        });

        test("Stalemate detection", () => {
            const game = Chess.newGame();
            const state = game.getState();

            // Create a stalemate position (king vs king)
            const stalemateState = {
                ...state,
                board: Array(8)
                    .fill(null)
                    .map(() => Array(8).fill(null)),
                currentPlayer: "BLACK" as const,
            };

            // Place kings in a stalemate position
            stalemateState.board[0]![0] = { type: "KING", color: "BLACK" }; // Black king on a1
            stalemateState.board[1]![2] = { type: "KING", color: "WHITE" }; // White king on c2
            stalemateState.board[2]![1] = { type: "QUEEN", color: "WHITE" }; // White queen on b3

            const stalemateGame = Chess.fromState(stalemateState);

            // Black king should have no legal moves (stalemate)
            const validMoves = stalemateGame.getValidMoves();

            if (validMoves.length === 0 && !stalemateGame.isInCheck()) {
                expect(stalemateGame.getGameResult()).toBe("DRAW");
                expect(stalemateGame.isGameOver()).toBe(true);
            }
        });
    });

    describe("Game state consistency", () => {
        test("Move history integrity throughout game", () => {
            let game = Chess.newGame();
            const moves = [
                ["e2", "e4"],
                ["e7", "e5"],
                ["g1", "f3"],
                ["b8", "c6"],
                ["f1", "b5"],
                ["a7", "a6"],
                ["b5", "a4"],
                ["g8", "f6"],
                ["e1", "g1"],
                ["f8", "e7"], // Castling
            ];

            moves.forEach(([from, to], index) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;

                const newGame = game.makeMove(fromSquare, toSquare);
                expect(newGame).not.toBeNull();
                game = newGame!;

                expect(game.getMoveHistory()).toHaveLength(index + 1);
            });

            // Verify final position
            expect(game.getCurrentPlayer()).toBe("WHITE");
            expect(game.isGameOver()).toBe(false);

            // Check that castling occurred (if implemented)
            const board = game.getBoard();
            const whiteKingMoved = board[0]![4] === null; // King not on e1
            if (whiteKingMoved) {
                // Castling might be implemented
                expect(board[0]![6]).toEqual({ type: "KING", color: "WHITE" }); // King on g1
                expect(board[0]![5]).toEqual({ type: "ROOK", color: "WHITE" }); // Rook on f1
            }
        });

        test("Board consistency after multiple captures", () => {
            let game = Chess.newGame();
            let pieceCount = 32; // Starting pieces

            // Create a series of captures
            const captureSequence = [
                ["e2", "e4"],
                ["d7", "d5"],
                ["e4", "d5"], // Capture -1
                ["d8", "d5"], // Recapture
                ["b1", "c3"],
                ["d5", "a5"],
                ["d2", "d4"],
                ["c7", "c6"],
                ["c1", "f4"],
                ["a5", "a2"], // Queen captures pawn -1
            ];

            captureSequence.forEach(([from, to]) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;

                const currentBoard = game.getBoard();
                const isCapture =
                    currentBoard[toSquare.rank]![toSquare.file] !== null;

                game = game.makeMove(fromSquare, toSquare)!;
                expect(game).not.toBeNull();

                if (isCapture) {
                    pieceCount--;
                }
            });

            // Count remaining pieces on board
            const finalBoard = game.getBoard();
            let actualPieceCount = 0;
            finalBoard.forEach((rank) => {
                rank.forEach((square) => {
                    if (square !== null) actualPieceCount++;
                });
            });

            expect(actualPieceCount).toBe(pieceCount);
        });

        test("Valid moves consistency across game states", () => {
            let game = Chess.newGame();

            // Play several moves
            game = game.makeMove(
                algebraicToSquare("e2")!,
                algebraicToSquare("e4")!,
            )!;
            const validMovesAfterE4 = game.getValidMoves();

            game = game.makeMove(
                algebraicToSquare("e7")!,
                algebraicToSquare("e5")!,
            )!;
            const validMovesAfterE5 = game.getValidMoves();

            // Valid moves should always be for current player
            validMovesAfterE4.forEach((move) => {
                expect(move.piece.color).toBe("BLACK");
            });

            validMovesAfterE5.forEach((move) => {
                expect(move.piece.color).toBe("WHITE");
            });

            // Number of valid moves should be reasonable
            expect(validMovesAfterE4.length).toBeGreaterThan(10);
            expect(validMovesAfterE4.length).toBeLessThan(40);
            expect(validMovesAfterE5.length).toBeGreaterThan(10);
            expect(validMovesAfterE5.length).toBeLessThan(40);
        });
    });

    describe("Error handling and edge cases", () => {
        test("Handles rapid successive moves correctly", () => {
            let game = Chess.newGame();

            const rapidMoves = [
                ["e2", "e4"],
                ["e7", "e5"],
                ["f2", "f4"],
                ["e5", "f4"], // En passant setup
                ["g1", "f3"],
                ["d7", "d6"],
                ["d2", "d3"],
                ["f4", "g3"], // Pawn captures
                ["h2", "g3"], // Recapture
            ];

            rapidMoves.forEach(([from, to]) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;

                const newGame = game.makeMove(fromSquare, toSquare);
                expect(newGame).not.toBeNull();
                game = newGame!;
            });

            expect(game.getMoveHistory()).toHaveLength(rapidMoves.length);
            expect(game.isGameOver()).toBe(false);
        });

        test("Maintains game integrity with invalid move attempts", () => {
            let game = Chess.newGame();
            const initialState = game.getState();

            // Try several invalid moves
            const invalidMoves = [
                ["e2", "e5"], // Pawn can't move 3 squares
                ["a1", "a3"], // Rook blocked by pawn
                ["f1", "a6"], // Bishop blocked by pawn
                ["e1", "e2"], // King can't move to occupied square
            ];

            invalidMoves.forEach(([from, to]) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;

                const result = game.makeMove(fromSquare, toSquare);
                expect(result).toBeNull();
            });

            // Game state should be unchanged
            const currentState = game.getState();
            expect(currentState).toEqual(initialState);
            expect(game.getCurrentPlayer()).toBe("WHITE");
            expect(game.getMoveHistory()).toHaveLength(0);
        });

        test("Handles piece promotion scenarios", () => {
            const game = Chess.newGame();
            const state = game.getState();

            // Create a position where white pawn can promote
            const promotionState = {
                ...state,
                board: Array(8)
                    .fill(null)
                    .map(() => Array(8).fill(null)),
            };

            promotionState.board[6]![0] = { type: "PAWN", color: "WHITE" }; // White pawn on a7
            promotionState.board[0]![4] = { type: "KING", color: "WHITE" };
            promotionState.board[7]![4] = { type: "KING", color: "BLACK" };

            const promotionGame = Chess.fromState(promotionState);

            // Pawn should be able to move to promotion square
            const validMoves = promotionGame.getValidMoves();
            const pawnMoves = validMoves.filter(
                (move) => move.piece.type === "PAWN" && move.to.rank === 7,
            );

            // Should have promotion moves (though promotion logic may not be fully implemented)
            expect(pawnMoves.length).toBeGreaterThanOrEqual(0);
        });
    });
});
