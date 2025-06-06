import { describe, test, expect } from "vitest";
import {
    createEmptyBoard,
    createInitialBoard,
    getPieceAt,
    setPieceAt,
    isValidSquare,
    algebraicToSquare,
    squareToAlgebraic,
    isSquareOccupiedBy,
    isSquareEmpty,
    getSquaresByColor,
    findKing,
} from "../board";
import type { Square, Piece } from "../types";

describe("Board utilities", () => {
    describe("createEmptyBoard", () => {
        test("creates 8x8 board with all null values", () => {
            const board = createEmptyBoard();
            expect(board).toHaveLength(8);
            board.forEach((rank) => {
                expect(rank).toHaveLength(8);
                rank.forEach((square) => {
                    expect(square).toBeNull();
                });
            });
        });
    });

    describe("createInitialBoard", () => {
        test("creates board with correct initial position", () => {
            const board = createInitialBoard();

            // White back rank
            expect(board[0]![0]).toEqual({ type: "ROOK", color: "WHITE" });
            expect(board[0]![1]).toEqual({ type: "KNIGHT", color: "WHITE" });
            expect(board[0]![2]).toEqual({ type: "BISHOP", color: "WHITE" });
            expect(board[0]![3]).toEqual({ type: "QUEEN", color: "WHITE" });
            expect(board[0]![4]).toEqual({ type: "KING", color: "WHITE" });
            expect(board[0]![5]).toEqual({ type: "BISHOP", color: "WHITE" });
            expect(board[0]![6]).toEqual({ type: "KNIGHT", color: "WHITE" });
            expect(board[0]![7]).toEqual({ type: "ROOK", color: "WHITE" });

            // White pawns
            for (let file = 0; file < 8; file++) {
                expect(board[1]![file]).toEqual({
                    type: "PAWN",
                    color: "WHITE",
                });
            }

            // Empty middle squares
            for (let rank = 2; rank < 6; rank++) {
                for (let file = 0; file < 8; file++) {
                    expect(board[rank]![file]).toBeNull();
                }
            }

            // Black pawns
            for (let file = 0; file < 8; file++) {
                expect(board[6]![file]).toEqual({
                    type: "PAWN",
                    color: "BLACK",
                });
            }

            // Black back rank
            expect(board[7]![0]).toEqual({ type: "ROOK", color: "BLACK" });
            expect(board[7]![1]).toEqual({ type: "KNIGHT", color: "BLACK" });
            expect(board[7]![2]).toEqual({ type: "BISHOP", color: "BLACK" });
            expect(board[7]![3]).toEqual({ type: "QUEEN", color: "BLACK" });
            expect(board[7]![4]).toEqual({ type: "KING", color: "BLACK" });
            expect(board[7]![5]).toEqual({ type: "BISHOP", color: "BLACK" });
            expect(board[7]![6]).toEqual({ type: "KNIGHT", color: "BLACK" });
            expect(board[7]![7]).toEqual({ type: "ROOK", color: "BLACK" });
        });
    });

    describe("isValidSquare", () => {
        test("returns true for valid squares", () => {
            expect(isValidSquare({ file: 0, rank: 0 })).toBe(true);
            expect(isValidSquare({ file: 7, rank: 7 })).toBe(true);
            expect(isValidSquare({ file: 3, rank: 4 })).toBe(true);
        });

        test("returns false for invalid squares", () => {
            expect(isValidSquare({ file: -1, rank: 0 })).toBe(false);
            expect(isValidSquare({ file: 0, rank: -1 })).toBe(false);
            expect(isValidSquare({ file: 8, rank: 0 })).toBe(false);
            expect(isValidSquare({ file: 0, rank: 8 })).toBe(false);
            expect(isValidSquare({ file: -1, rank: -1 })).toBe(false);
            expect(isValidSquare({ file: 8, rank: 8 })).toBe(false);
        });
    });

    describe("getPieceAt and setPieceAt", () => {
        test("getPieceAt returns correct piece", () => {
            const board = createInitialBoard();
            const whiteKing = getPieceAt(board, { file: 4, rank: 0 });
            expect(whiteKing).toEqual({ type: "KING", color: "WHITE" });

            const emptySquare = getPieceAt(board, { file: 4, rank: 4 });
            expect(emptySquare).toBeNull();
        });

        test("getPieceAt returns null for invalid squares", () => {
            const board = createInitialBoard();
            const piece = getPieceAt(board, { file: -1, rank: 0 });
            expect(piece).toBeNull();
        });

        test("setPieceAt creates new board with piece placed", () => {
            const board = createEmptyBoard();
            const piece: Piece = { type: "QUEEN", color: "WHITE" };
            const square: Square = { file: 4, rank: 4 };

            const newBoard = setPieceAt(board, square, piece);

            // Original board unchanged
            expect(getPieceAt(board, square)).toBeNull();
            // New board has piece
            expect(getPieceAt(newBoard, square)).toEqual(piece);
        });

        test("setPieceAt can remove piece by setting null", () => {
            const board = createInitialBoard();
            const square: Square = { file: 4, rank: 0 };

            const newBoard = setPieceAt(board, square, null);

            expect(getPieceAt(board, square)).toEqual({
                type: "KING",
                color: "WHITE",
            });
            expect(getPieceAt(newBoard, square)).toBeNull();
        });

        test("setPieceAt ignores invalid squares", () => {
            const board = createEmptyBoard();
            const piece: Piece = { type: "QUEEN", color: "WHITE" };

            const newBoard = setPieceAt(board, { file: -1, rank: 0 }, piece);

            expect(newBoard).toEqual(board);
        });
    });

    describe("algebraicToSquare", () => {
        test("converts lowercase algebraic notation correctly", () => {
            expect(algebraicToSquare("a1")).toEqual({ file: 0, rank: 0 });
            expect(algebraicToSquare("e4")).toEqual({ file: 4, rank: 3 });
            expect(algebraicToSquare("h8")).toEqual({ file: 7, rank: 7 });
        });

        test("converts uppercase algebraic notation correctly", () => {
            expect(algebraicToSquare("A1")).toEqual({ file: 0, rank: 0 });
            expect(algebraicToSquare("E4")).toEqual({ file: 4, rank: 3 });
            expect(algebraicToSquare("H8")).toEqual({ file: 7, rank: 7 });
        });

        test("handles mixed case", () => {
            expect(algebraicToSquare("A4")).toEqual({ file: 0, rank: 3 });
            expect(algebraicToSquare("h1")).toEqual({ file: 7, rank: 0 });
        });

        test("returns null for invalid input", () => {
            expect(algebraicToSquare("")).toBeNull();
            expect(algebraicToSquare("a")).toBeNull();
            expect(algebraicToSquare("12")).toBeNull();
            expect(algebraicToSquare("z9")).toBeNull();
            expect(algebraicToSquare("a0")).toBeNull();
            expect(algebraicToSquare("a9")).toBeNull();
            expect(algebraicToSquare("i1")).toBeNull();
            expect(algebraicToSquare("abc")).toBeNull();
        });
    });

    describe("squareToAlgebraic", () => {
        test("converts squares to lowercase algebraic notation", () => {
            expect(squareToAlgebraic({ file: 0, rank: 0 })).toBe("a1");
            expect(squareToAlgebraic({ file: 4, rank: 3 })).toBe("e4");
            expect(squareToAlgebraic({ file: 7, rank: 7 })).toBe("h8");
        });

        test("returns empty string for invalid squares", () => {
            expect(squareToAlgebraic({ file: -1, rank: 0 })).toBe("");
            expect(squareToAlgebraic({ file: 8, rank: 0 })).toBe("");
            expect(squareToAlgebraic({ file: 0, rank: -1 })).toBe("");
            expect(squareToAlgebraic({ file: 0, rank: 8 })).toBe("");
        });

        test("algebraicToSquare and squareToAlgebraic are inverse operations", () => {
            const testCases = ["a1", "e4", "h8", "d5", "b2", "g7"];

            testCases.forEach((algebraic) => {
                const square = algebraicToSquare(algebraic);
                expect(square).not.toBeNull();
                expect(squareToAlgebraic(square!)).toBe(algebraic);
            });
        });
    });

    describe("isSquareOccupiedBy", () => {
        test("returns true when square has piece of specified color", () => {
            const board = createInitialBoard();

            expect(
                isSquareOccupiedBy(board, { file: 0, rank: 0 }, "WHITE"),
            ).toBe(true);
            expect(
                isSquareOccupiedBy(board, { file: 0, rank: 7 }, "BLACK"),
            ).toBe(true);
        });

        test("returns false when square has piece of different color", () => {
            const board = createInitialBoard();

            expect(
                isSquareOccupiedBy(board, { file: 0, rank: 0 }, "BLACK"),
            ).toBe(false);
            expect(
                isSquareOccupiedBy(board, { file: 0, rank: 7 }, "WHITE"),
            ).toBe(false);
        });

        test("returns false when square is empty", () => {
            const board = createInitialBoard();

            expect(
                isSquareOccupiedBy(board, { file: 4, rank: 4 }, "WHITE"),
            ).toBe(false);
            expect(
                isSquareOccupiedBy(board, { file: 4, rank: 4 }, "BLACK"),
            ).toBe(false);
        });
    });

    describe("isSquareEmpty", () => {
        test("returns true for empty squares", () => {
            const board = createInitialBoard();

            expect(isSquareEmpty(board, { file: 4, rank: 4 })).toBe(true);
            expect(isSquareEmpty(board, { file: 0, rank: 3 })).toBe(true);
        });

        test("returns false for occupied squares", () => {
            const board = createInitialBoard();

            expect(isSquareEmpty(board, { file: 0, rank: 0 })).toBe(false);
            expect(isSquareEmpty(board, { file: 4, rank: 1 })).toBe(false);
        });
    });

    describe("getSquaresByColor", () => {
        test("returns all squares occupied by white pieces", () => {
            const board = createInitialBoard();
            const whiteSquares = getSquaresByColor(board, "WHITE");

            expect(whiteSquares).toHaveLength(16);

            // Check some specific squares
            expect(whiteSquares).toContainEqual({ file: 0, rank: 0 }); // White rook
            expect(whiteSquares).toContainEqual({ file: 4, rank: 0 }); // White king
            expect(whiteSquares).toContainEqual({ file: 0, rank: 1 }); // White pawn
        });

        test("returns all squares occupied by black pieces", () => {
            const board = createInitialBoard();
            const blackSquares = getSquaresByColor(board, "BLACK");

            expect(blackSquares).toHaveLength(16);

            // Check some specific squares
            expect(blackSquares).toContainEqual({ file: 0, rank: 7 }); // Black rook
            expect(blackSquares).toContainEqual({ file: 4, rank: 7 }); // Black king
            expect(blackSquares).toContainEqual({ file: 0, rank: 6 }); // Black pawn
        });

        test("returns empty array for empty board", () => {
            const board = createEmptyBoard();

            expect(getSquaresByColor(board, "WHITE")).toHaveLength(0);
            expect(getSquaresByColor(board, "BLACK")).toHaveLength(0);
        });
    });

    describe("findKing", () => {
        test("finds white king on initial board", () => {
            const board = createInitialBoard();
            const whiteKing = findKing(board, "WHITE");

            expect(whiteKing).toEqual({ file: 4, rank: 0 });
        });

        test("finds black king on initial board", () => {
            const board = createInitialBoard();
            const blackKing = findKing(board, "BLACK");

            expect(blackKing).toEqual({ file: 4, rank: 7 });
        });

        test("returns null when king is not found", () => {
            const board = createEmptyBoard();

            expect(findKing(board, "WHITE")).toBeNull();
            expect(findKing(board, "BLACK")).toBeNull();
        });

        test("finds king after it moves", () => {
            const board = createInitialBoard();
            const newSquare = { file: 4, rank: 1 };
            const boardWithMovedKing = setPieceAt(
                setPieceAt(board, { file: 4, rank: 0 }, null),
                newSquare,
                { type: "KING", color: "WHITE" },
            );

            const whiteKing = findKing(boardWithMovedKing, "WHITE");
            expect(whiteKing).toEqual(newSquare);
        });
    });
});
