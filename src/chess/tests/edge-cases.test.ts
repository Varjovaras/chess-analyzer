import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, createEmptyBoard, setPieceAt, createInitialBoard } from "../board";
import { getPieceMoves } from "../pieces";
import type { GameState } from "../types";

describe("Chess edge cases and boundary conditions", () => {
    describe("Board boundary edge cases", () => {
        test("pieces cannot move outside board boundaries", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 7, rank: 7 }, { type: "ROOK", color: "WHITE" });

            const moves = getPieceMoves(testBoard, { file: 7, rank: 7 });

            // Rook on h8 should not have moves to rank 8 or file 8 (outside board)
            const invalidMoves = moves.filter(move =>
                move.file > 7 || move.rank > 7 || move.file < 0 || move.rank < 0
            );
            expect(invalidMoves).toHaveLength(0);
        });

        test("knight on edge squares has limited moves", () => {
            // Knight on a1
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: "KNIGHT", color: "WHITE" });

            const moves = getPieceMoves(testBoard, { file: 0, rank: 0 });

            // Knight on a1 should only have 2 legal moves
            expect(moves).toHaveLength(2);
            expect(moves).toContainEqual({ file: 1, rank: 2 }); // b3
            expect(moves).toContainEqual({ file: 2, rank: 1 }); // c2
        });

        test("king on edge cannot move outside board", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const moves = getPieceMoves(testBoard, { file: 0, rank: 0 });

            // King on a1 should have exactly 3 moves
            expect(moves).toHaveLength(3);
            expect(moves).toContainEqual({ file: 0, rank: 1 }); // a2
            expect(moves).toContainEqual({ file: 1, rank: 0 }); // b1
            expect(moves).toContainEqual({ file: 1, rank: 1 }); // b2
        });

        test("pawn on promotion rank edge case", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 7 }, { type: "PAWN", color: "WHITE" });

            const moves = getPieceMoves(testBoard, { file: 4, rank: 7 });

            // Pawn on 8th rank should have no moves (already promoted)
            expect(moves).toHaveLength(0);
        });

        test("pawn on starting rank opposite color", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 1 }, { type: "PAWN", color: "BLACK" });

            const moves = getPieceMoves(testBoard, { file: 4, rank: 1 });

            // Black pawn on 2nd rank should only move one square (not starting position for black)
            expect(moves).toHaveLength(1);
            expect(moves).toContainEqual({ file: 4, rank: 0 });
        });
    });

    describe("Complex pawn edge cases", () => {
        test("pawn blocked by piece one square ahead", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 1 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 2 }, { type: "PAWN", color: "BLACK" });

            const moves = getPieceMoves(testBoard, { file: 4, rank: 1 });

            expect(moves).toHaveLength(0);
        });

        test("pawn blocked by piece two squares ahead", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 1 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 3 }, { type: "PAWN", color: "BLACK" });

            const moves = getPieceMoves(testBoard, { file: 4, rank: 1 });

            // Should be able to move one square but not two
            expect(moves).toHaveLength(1);
            expect(moves).toContainEqual({ file: 4, rank: 2 });
        });

        test("pawn diagonal capture at board edge", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 4 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 5 }, { type: "PAWN", color: "BLACK" });

            const moves = getPieceMoves(testBoard, { file: 0, rank: 4 });

            // Should be able to move forward and capture diagonally
            expect(moves).toHaveLength(2);
            expect(moves).toContainEqual({ file: 0, rank: 5 }); // Forward
            expect(moves).toContainEqual({ file: 1, rank: 5 }); // Capture
        });

        test("pawn cannot capture own piece", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 5 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 5 }, { type: "PAWN", color: "WHITE" });

            const moves = getPieceMoves(testBoard, { file: 4, rank: 4 });

            // Should only be able to move forward
            expect(moves).toHaveLength(1);
            expect(moves).toContainEqual({ file: 4, rank: 5 });
        });

        test("en passant edge case - pawn on 5th rank for white", () => {
            let game = Chess.newGame();

            // Create en passant scenario
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 4 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [{
                    from: { file: 3, rank: 6 },
                    to: { file: 3, rank: 4 },
                    piece: { type: "PAWN", color: "BLACK" }
                }],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: { file: 3, rank: 5 },
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const testGame = Chess.fromState(gameState);
            const enPassantMove = testGame.makeMove({ file: 4, rank: 4 }, { file: 3, rank: 5 });

            // Test will work once en passant is implemented
            expect(enPassantMove).not.toBeNull();
        });
    });

    describe("Piece collision and blocking", () => {
        test("rook blocked by multiple pieces in same direction", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "ROOK", color: "BLACK" });

            const moves = getPieceMoves(testBoard, { file: 4, rank: 4 });

            // Should be able to move to rank 5 but not past own pawn
            expect(moves).toContainEqual({ file: 4, rank: 5 });
            expect(moves).not.toContainEqual({ file: 4, rank: 6 });
            expect(moves).not.toContainEqual({ file: 4, rank: 7 });
        });

        test("bishop blocked diagonally", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "QUEEN", color: "BLACK" });

            const moves = getPieceMoves(testBoard, { file: 4, rank: 4 });

            // Should be able to capture on f6 but not move to h8
            expect(moves).toContainEqual({ file: 5, rank: 5 });
            expect(moves).toContainEqual({ file: 6, rank: 6 }); // Capture
            expect(moves).not.toContainEqual({ file: 7, rank: 7 });
        });

        test("queen movement combines rook and bishop blocking", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: "PAWN", color: "WHITE" }); // Blocks vertically
            testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: "PAWN", color: "BLACK" }); // Blocks diagonally

            const moves = getPieceMoves(testBoard, { file: 4, rank: 4 });

            // Should be blocked in both vertical and diagonal directions
            expect(moves).not.toContainEqual({ file: 4, rank: 6 });
            expect(moves).not.toContainEqual({ file: 4, rank: 7 });
            expect(moves).toContainEqual({ file: 6, rank: 6 }); // Can capture
            expect(moves).not.toContainEqual({ file: 7, rank: 7 });
        });
    });

    describe("Multiple piece interactions", () => {
        test("multiple pieces attacking same square", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 3, rank: 3 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 1 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 5 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "KING", color: "BLACK" });

            const rookMoves = getPieceMoves(testBoard, { file: 3, rank: 3 });
            const bishopMoves = getPieceMoves(testBoard, { file: 1, rank: 1 });

            // Both pieces should be able to attack e5
            expect(rookMoves).toContainEqual({ file: 5, rank: 5 });
            expect(bishopMoves).toContainEqual({ file: 5, rank: 5 });
        });

        test("piece defends another piece", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 4 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 4 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "KING", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);

            // Black rook captures white rook, but queen can recapture
            const capture = game.makeMove({ file: 7, rank: 4 }, { file: 5, rank: 4 });
            expect(capture).not.toBeNull();

            if (capture) {
                const recapture = capture.makeMove({ file: 4, rank: 4 }, { file: 5, rank: 4 });
                expect(recapture).not.toBeNull();
            }
        });
    });

    describe("Game state edge cases", () => {
        test("alternating turns maintained through complex sequence", () => {
            let game = Chess.newGame();

            // Play many moves
            for (let i = 0; i < 20; i++) {
                const currentPlayer = game.getCurrentPlayer();

                // Make knight moves back and forth
                if (currentPlayer === "WHITE") {
                    game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
                } else {
                    game = game.makeMove(algebraicToSquare("g8")!, algebraicToSquare("f6")!)!;
                }

                expect(game.getCurrentPlayer()).not.toBe(currentPlayer);

                if (currentPlayer === "WHITE") {
                    game = game.makeMove(algebraicToSquare("f6")!, algebraicToSquare("g8")!)!;
                } else {
                    game = game.makeMove(algebraicToSquare("f3")!, algebraicToSquare("g1")!)!;
                }

                expect(game.getCurrentPlayer()).toBe(currentPlayer);
            }
        });

        test("move history maintains correct order", () => {
            let game = Chess.newGame();

            const moves = [
                ["e2", "e4"], ["e7", "e5"],
                ["g1", "f3"], ["b8", "c6"],
                ["f1", "c4"], ["f8", "e7"],
            ];

            moves.forEach(([from, to], index) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;

                game = game.makeMove(fromSquare, toSquare)!;

                const history = game.getMoveHistory();
                expect(history).toHaveLength(index + 1);

                const lastMove = history[index]!;
                expect(lastMove.from).toEqual(fromSquare);
                expect(lastMove.to).toEqual(toSquare);
            });
        });

        test("fullmove number increments correctly", () => {
            let game = Chess.newGame();

            expect(game.getState().fullmoveNumber).toBe(1);

            // White move
            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            expect(game.getState().fullmoveNumber).toBe(1);

            // Black move
            game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
            expect(game.getState().fullmoveNumber).toBe(2);

            // White move
            game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
            expect(game.getState().fullmoveNumber).toBe(2);

            // Black move
            game = game.makeMove(algebraicToSquare("b8")!, algebraicToSquare("c6")!)!;
            expect(game.getState().fullmoveNumber).toBe(3);
        });

        test("halfmove clock increments and resets correctly", () => {
            let game = Chess.newGame();

            expect(game.getState().halfmoveClock).toBe(0);

            // Pawn move - should reset to 0
            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            expect(game.getState().halfmoveClock).toBe(0);

            // Knight move - should increment
            game = game.makeMove(algebraicToSquare("g8")!, algebraicToSquare("f6")!)!;
            expect(game.getState().halfmoveClock).toBe(1);

            // Knight move - should increment
            game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
            expect(game.getState().halfmoveClock).toBe(2);

            // Pawn move - should reset
            game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d5")!)!;
            expect(game.getState().halfmoveClock).toBe(0);
        });
    });

    describe("Invalid move handling", () => {
        test("cannot move piece to square it already occupies", () => {
            const game = Chess.newGame();
            const invalidMove = game.makeMove(
                algebraicToSquare("e2")!,
                algebraicToSquare("e2")!
            );
            expect(invalidMove).toBeNull();
        });

        test("cannot move to negative coordinates", () => {
            const game = Chess.newGame();
            const invalidMove = game.makeMove(
                { file: 0, rank: 0 },
                { file: -1, rank: 0 }
            );
            expect(invalidMove).toBeNull();
        });

        test("cannot move to coordinates beyond board", () => {
            const game = Chess.newGame();
            const invalidMove = game.makeMove(
                { file: 7, rank: 7 },
                { file: 8, rank: 8 }
            );
            expect(invalidMove).toBeNull();
        });

        test("cannot move from square with no piece", () => {
            const game = Chess.newGame();
            const invalidMove = game.makeMove(
                algebraicToSquare("e4")!,
                algebraicToSquare("e5")!
            );
            expect(invalidMove).toBeNull();
        });

        test("cannot move opponent's piece", () => {
            const game = Chess.newGame();
            const invalidMove = game.makeMove(
                algebraicToSquare("e7")!,
                algebraicToSquare("e5")!
            );
            expect(invalidMove).toBeNull();
        });

        test("piece type validation", () => {
            const board = createEmptyBoard();

            // Test with invalid piece type
            expect(() => {
                setPieceAt(board, { file: 4, rank: 4 }, { type: "INVALID" as any, color: "WHITE" });
            }).not.toThrow(); // setPieceAt doesn't validate, but moves should fail
        });
    });

    describe("Complex board positions", () => {
        test("crowded board with many pieces", () => {
            const board = createInitialBoard();

            // Add extra pieces to create crowded position
            let testBoard = setPieceAt(board, { file: 4, rank: 3 }, { type: "KNIGHT", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: "KNIGHT", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 4 }, { type: "BISHOP", color: "BLACK" });

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
            const validMoves = game.getValidMoves();

            // Should still have legal moves despite crowded board
            expect(validMoves.length).toBeGreaterThan(0);
        });

        test("sparse board with few pieces", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "QUEEN", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();

            // Should have many moves available with sparse board
            expect(validMoves.length).toBeGreaterThan(20);
        });

        test("symmetric positions", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 5 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 2 }, { type: "QUEEN", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();

            // Position is roughly symmetric, should have reasonable move count
            expect(validMoves.length).toBeGreaterThan(10);
            expect(validMoves.length).toBeLessThan(50);
        });
    });

    describe("State immutability edge cases", () => {
        test("original game unchanged after multiple move attempts", () => {
            const originalGame = Chess.newGame();
            const originalState = originalGame.getState();

            // Try many invalid moves
            originalGame.makeMove({ file: -1, rank: 0 }, { file: 0, rank: 0 });
            originalGame.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!);
            originalGame.makeMove(algebraicToSquare("e4")!, algebraicToSquare("e5")!);

            // Try valid move
            const newGame = originalGame.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!);

            // Original should be completely unchanged
            const currentState = originalGame.getState();
            expect(currentState).toEqual(originalState);
            expect(currentState.moveHistory).toHaveLength(0);
            expect(currentState.currentPlayer).toBe("WHITE");

            // New game should be different
            if (newGame) {
                expect(newGame.getState().moveHistory).toHaveLength(1);
                expect(newGame.getState().currentPlayer).toBe("BLACK");
            }
        });

        test("board state immutability after piece placement", () => {
            const game = Chess.newGame();
            const originalBoard = game.getBoard();

            // Modify the returned board
            originalBoard[4]![4] = { type: "QUEEN", color: "WHITE" };

            // Original game board should be unchanged
            const currentBoard = game.getBoard();
            expect(currentBoard[4]![4]).toBeNull();
        });

        test("move history immutability", () => {
            let game = Chess.newGame();
            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;

            const history = game.getMoveHistory();

            // Modify the returned history
            history.push({
                from: { file: 0, rank: 0 },
                to: { file: 1, rank: 1 },
                piece: { type: "PAWN", color: "WHITE" }
            });

            // Original game history should be unchanged
            const currentHistory = game.getMoveHistory();
            expect(currentHistory).toHaveLength(1);
            expect(currentHistory[0]!.from).toEqual({ file: 4, rank: 1 });
        });
    });

    describe("Performance edge cases", () => {
        test("large number of valid moves calculated efficiently", () => {
            // Position with queen in center of empty board (maximum mobility)
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "KING", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const startTime = Date.now();
            const validMoves = game.getValidMoves();
            const endTime = Date.now();

            // Should calculate many moves quickly
            expect(validMoves.length).toBeGreaterThan(20);
            expect(endTime - startTime).toBeLessThan(100); // Should complete in reasonable time
        });

        test("rapid successive move generation", () => {
            let game = Chess.newGame();

            const startTime = Date.now();

            // Generate valid moves many times
            for (let i = 0; i < 100; i++) {
                const moves = game.getValidMoves();
                expect(moves.length).toBe(20); // Initial position always has 20 moves
            }

            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(1000); // Should be fast
        });
    });

    describe("Memory and resource edge cases", () => {
        test("deep game state copying", () => {
            let game = Chess.newGame();

            // Make many moves to create deep state
            for (let i = 0; i < 10; i++) {
                game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
                game = game.makeMove(algebraicToSquare("g8")!, algebraicToSquare("f6")!)!;
                game = game.makeMove(algebraicToSquare("f3")!, algebraicToSquare("g1")!)!;
                game = game.makeMove(algebraicToSquare("f6")!, algebraicToSquare("g8")!)!;
            }

            const state1 = game.getState();
            const state2 = game.getState();

            // States should be equal but not the same object
            expect(state1).toEqual(state2);
            expect(state1).not.toBe(state2);
            expect(state1.moveHistory).not.toBe(state2.moveHistory);
        });

        test("large move history handling", () => {
            let game = Chess.newGame();

            // Create long game
            for (let i = 0; i < 50; i++) {
                game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
                game = game.makeMove(algebraicToSquare("g8")!, algebraicToSquare("f6")!)!;
                game = game.makeMove(algebraicToSquare("f3")!, algebraicToSquare("g1")!)!;
                game = game.makeMove(algebraicToSquare("f6")!, algebraicToSquare("g8")!)!;
            }

            const history = game.getMoveHistory();
            expect(history).toHaveLength(200);

            // All moves should be recorded correctly
            history.forEach((move, index) => {
                expect(move.piece.type).toBe("KNIGHT");
                if (index % 4 < 2) {
                    expect(move.piece.color).toBe(index % 2 === 0 ? "WHITE" : "BLACK");
                }
            });
        });
    });
});