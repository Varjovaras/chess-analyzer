import { describe, test, expect } from "vitest";
import {
    Chess,
    createEmptyBoard,
    setPieceAt,
    algebraicToSquare,
} from "../index";

describe("Pawn Promotion", () => {
    describe("Basic Promotion", () => {
        test("white pawn promotes to queen when reaching 8th rank", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            const result = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
            );

            expect(result).not.toBeNull();
            const resultBoard = result!.getBoard();
            expect(resultBoard[7]![4]?.type).toBe("QUEEN");
            expect(resultBoard[7]![4]?.color).toBe("WHITE");
        });

        test("black pawn promotes to queen when reaching 1st rank", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 1 },
                { type: "PAWN", color: "BLACK" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            const result = game.makeMove(
                { file: 4, rank: 1 },
                { file: 4, rank: 0 },
            );

            expect(result).not.toBeNull();
            const resultBoard = result!.getBoard();
            expect(resultBoard[0]![4]?.type).toBe("QUEEN");
            expect(resultBoard[0]![4]?.color).toBe("BLACK");
        });
    });

    describe("Promotion by Capture", () => {
        test("white pawn can promote by capturing on 8th rank", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 5, rank: 7 },
                { type: "ROOK", color: "BLACK" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            const result = game.makeMove(
                { file: 4, rank: 6 },
                { file: 5, rank: 7 },
            );

            expect(result).not.toBeNull();
            const resultBoard = result!.getBoard();
            expect(resultBoard[7]![5]?.type).toBe("QUEEN");
            expect(resultBoard[7]![5]?.color).toBe("WHITE");
        });

        test("black pawn can promote by capturing on 1st rank", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 1 },
                { type: "PAWN", color: "BLACK" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 3, rank: 0 },
                { type: "ROOK", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            const result = game.makeMove(
                { file: 4, rank: 1 },
                { file: 3, rank: 0 },
            );

            expect(result).not.toBeNull();
            const resultBoard = result!.getBoard();
            expect(resultBoard[0]![3]?.type).toBe("QUEEN");
            expect(resultBoard[0]![3]?.color).toBe("BLACK");
        });
    });

    describe("Promotion Choices", () => {
        test("pawn can promote to different pieces", () => {
            // Note: This test depends on the promotion choice mechanism
            // For now, we'll test the default promotion behavior

            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            // Test default promotion (should be to queen)
            const queenResult = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
            );
            expect(queenResult).not.toBeNull();
            expect(queenResult!.getBoard()[7]![4]?.type).toBe("QUEEN");

            // Test promotion to knight
            const knightResult = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
                "KNIGHT",
            );
            expect(knightResult).not.toBeNull();
            expect(knightResult!.getBoard()[7]![4]?.type).toBe("KNIGHT");
            expect(knightResult!.getBoard()[7]![4]?.color).toBe("WHITE");

            // Test promotion to rook
            const rookResult = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
                "ROOK",
            );
            expect(rookResult).not.toBeNull();
            expect(rookResult!.getBoard()[7]![4]?.type).toBe("ROOK");

            // Test promotion to bishop
            const bishopResult = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
                "BISHOP",
            );
            expect(bishopResult).not.toBeNull();
            expect(bishopResult!.getBoard()[7]![4]?.type).toBe("BISHOP");
        });

        test("underpromotion - pawn can promote to knight", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 6, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );

            const game = Chess.fromState({
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
            });

            // Test knight promotion
            const result = game.makeMove(
                { file: 6, rank: 6 },
                { file: 6, rank: 7 },
                "KNIGHT",
            );

            expect(result).not.toBeNull();
            const resultBoard = result!.getBoard();
            expect(resultBoard[7]![6]?.type).toBe("KNIGHT");
            expect(resultBoard[7]![6]?.color).toBe("WHITE");
        });
    });

    describe("Promotion Edge Cases", () => {
        test("pawn cannot move to 8th rank without promoting", () => {
            // This test ensures that reaching the promotion rank automatically promotes
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            const result = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
            );

            expect(result).not.toBeNull();
            const resultBoard = result!.getBoard();
            // Should not remain a pawn
            expect(resultBoard[7]![4]?.type).not.toBe("PAWN");
            // Should be promoted to some piece (queen by default)
            expect(resultBoard[7]![4]?.type).toBe("QUEEN");
        });

        test("promotion works in normal circumstances", () => {
            // Simple test that promotion works when not in check
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            ); // e7
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            ); // a1
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            ); // h8

            const game = Chess.fromState({
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
            });

            expect(game.isInCheck()).toBe(false);

            // Promote to queen
            const result = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
            );

            expect(result).not.toBeNull();
            expect(result!.getBoard()[7]![4]?.type).toBe("QUEEN");
        });

        test("cannot promote if it would leave king in check", () => {
            // Test where promotion would expose king to discovered check
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 4, rank: 2 },
                { type: "ROOK", color: "BLACK" },
            ); // Would create discovered check
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            // This move would expose king to check from the rook
            const result = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
            );

            // Should be illegal
            expect(result).toBeNull();

            // Test that even underpromotion is blocked
            const knightResult = game.makeMove(
                { file: 4, rank: 6 },
                { file: 4, rank: 7 },
                "KNIGHT",
            );
            expect(knightResult).toBeNull();
        });
    });

    describe("Promotion Helper Methods", () => {
        test("requiresPromotion correctly identifies promotion moves", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 3, rank: 1 },
                { type: "PAWN", color: "BLACK" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 0, rank: 0 },
                { type: "KING", color: "WHITE" },
            );
            testBoard = setPieceAt(
                testBoard,
                { file: 7, rank: 7 },
                { type: "KING", color: "BLACK" },
            );

            const game = Chess.fromState({
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
            });

            // White pawn moving to 8th rank requires promotion
            expect(
                game.requiresPromotion(
                    { file: 4, rank: 6 },
                    { file: 4, rank: 7 },
                ),
            ).toBe(true);

            // Black pawn moving to 1st rank requires promotion
            expect(
                game.requiresPromotion(
                    { file: 3, rank: 1 },
                    { file: 3, rank: 0 },
                ),
            ).toBe(true);

            // Regular pawn move doesn't require promotion
            expect(
                game.requiresPromotion(
                    { file: 4, rank: 6 },
                    { file: 4, rank: 5 },
                ),
            ).toBe(false);

            // Non-pawn piece doesn't require promotion
            expect(
                game.requiresPromotion(
                    { file: 0, rank: 0 },
                    { file: 0, rank: 1 },
                ),
            ).toBe(false);
        });
    });
});
