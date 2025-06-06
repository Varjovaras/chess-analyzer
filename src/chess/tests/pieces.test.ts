import { describe, test, expect } from "vitest";
import { getPieceMoves, isValidPieceMove } from "../pieces";
import { createEmptyBoard, setPieceAt } from "../board";
import type { Board, Piece, Square } from "../types";

describe("Piece movements", () => {
    const createBoardWithPiece = (piece: Piece, square: Square): Board => {
        return setPieceAt(createEmptyBoard(), square, piece);
    };

    describe("Pawn movements", () => {
        test("white pawn can move one square forward from starting position", () => {
            const board = createBoardWithPiece(
                { type: "PAWN", color: "WHITE" },
                { file: 4, rank: 1 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 1 });

            expect(moves).toContainEqual({ file: 4, rank: 2 });
        });

        test("white pawn can move two squares forward from starting position", () => {
            const board = createBoardWithPiece(
                { type: "PAWN", color: "WHITE" },
                { file: 4, rank: 1 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 1 });

            expect(moves).toContainEqual({ file: 4, rank: 3 });
            expect(moves).toHaveLength(2);
        });

        test("white pawn cannot move two squares if not on starting rank", () => {
            const board = createBoardWithPiece(
                { type: "PAWN", color: "WHITE" },
                { file: 4, rank: 2 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 2 });

            expect(moves).not.toContainEqual({ file: 4, rank: 4 });
            expect(moves).toContainEqual({ file: 4, rank: 3 });
            expect(moves).toHaveLength(1);
        });

        test("black pawn can move one square forward from starting position", () => {
            const board = createBoardWithPiece(
                { type: "PAWN", color: "BLACK" },
                { file: 4, rank: 6 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 6 });

            expect(moves).toContainEqual({ file: 4, rank: 5 });
        });

        test("black pawn can move two squares forward from starting position", () => {
            const board = createBoardWithPiece(
                { type: "PAWN", color: "BLACK" },
                { file: 4, rank: 6 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 6 });

            expect(moves).toContainEqual({ file: 4, rank: 4 });
            expect(moves).toHaveLength(2);
        });

        test("pawn cannot move forward if blocked", () => {
            let board = createBoardWithPiece(
                { type: "PAWN", color: "WHITE" },
                { file: 4, rank: 1 },
            );
            board = setPieceAt(
                board,
                { file: 4, rank: 2 },
                { type: "PAWN", color: "BLACK" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 1 });
            expect(moves).toHaveLength(0);
        });

        test("white pawn can capture diagonally", () => {
            let board = createBoardWithPiece(
                { type: "PAWN", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 3, rank: 5 },
                { type: "PAWN", color: "BLACK" },
            );
            board = setPieceAt(
                board,
                { file: 5, rank: 5 },
                { type: "PAWN", color: "BLACK" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            expect(moves).toContainEqual({ file: 4, rank: 5 }); // forward
            expect(moves).toContainEqual({ file: 3, rank: 5 }); // capture left
            expect(moves).toContainEqual({ file: 5, rank: 5 }); // capture right
            expect(moves).toHaveLength(3);
        });

        test("black pawn can capture diagonally", () => {
            let board = createBoardWithPiece(
                { type: "PAWN", color: "BLACK" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 3, rank: 3 },
                { type: "PAWN", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 5, rank: 3 },
                { type: "PAWN", color: "WHITE" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            expect(moves).toContainEqual({ file: 4, rank: 3 }); // forward
            expect(moves).toContainEqual({ file: 3, rank: 3 }); // capture left
            expect(moves).toContainEqual({ file: 5, rank: 3 }); // capture right
            expect(moves).toHaveLength(3);
        });

        test("pawn cannot capture own pieces", () => {
            let board = createBoardWithPiece(
                { type: "PAWN", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 3, rank: 5 },
                { type: "PAWN", color: "WHITE" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            expect(moves).not.toContainEqual({ file: 3, rank: 5 });
            expect(moves).toContainEqual({ file: 4, rank: 5 });
            expect(moves).toHaveLength(1);
        });
    });

    describe("Rook movements", () => {
        test("rook can move horizontally and vertically when unobstructed", () => {
            const board = createBoardWithPiece(
                { type: "ROOK", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Should have 14 moves (7 horizontal + 7 vertical)
            expect(moves).toHaveLength(14);

            // Check some specific moves
            expect(moves).toContainEqual({ file: 0, rank: 4 }); // left
            expect(moves).toContainEqual({ file: 7, rank: 4 }); // right
            expect(moves).toContainEqual({ file: 4, rank: 0 }); // down
            expect(moves).toContainEqual({ file: 4, rank: 7 }); // up
        });

        test("rook movement is blocked by own pieces", () => {
            let board = createBoardWithPiece(
                { type: "ROOK", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 2, rank: 4 },
                { type: "PAWN", color: "WHITE" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Should not be able to move past own pieces
            expect(moves).not.toContainEqual({ file: 4, rank: 6 });
            expect(moves).not.toContainEqual({ file: 4, rank: 7 });
            expect(moves).not.toContainEqual({ file: 2, rank: 4 });
            expect(moves).not.toContainEqual({ file: 1, rank: 4 });
            expect(moves).not.toContainEqual({ file: 0, rank: 4 });

            // But should be able to move to squares before blocking pieces
            expect(moves).toContainEqual({ file: 4, rank: 5 });
            expect(moves).toContainEqual({ file: 3, rank: 4 });
        });

        test("rook can capture enemy pieces but not move past them", () => {
            let board = createBoardWithPiece(
                { type: "ROOK", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "BLACK" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Should be able to capture enemy piece
            expect(moves).toContainEqual({ file: 4, rank: 6 });
            // But not move past it
            expect(moves).not.toContainEqual({ file: 4, rank: 7 });
            // Should be able to move to squares before enemy piece
            expect(moves).toContainEqual({ file: 4, rank: 5 });
        });
    });

    describe("Knight movements", () => {
        test("knight moves in L-shape pattern", () => {
            const board = createBoardWithPiece(
                { type: "KNIGHT", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            const expectedMoves = [
                { file: 6, rank: 5 },
                { file: 6, rank: 3 },
                { file: 2, rank: 5 },
                { file: 2, rank: 3 },
                { file: 5, rank: 6 },
                { file: 5, rank: 2 },
                { file: 3, rank: 6 },
                { file: 3, rank: 2 },
            ];

            expect(moves).toHaveLength(8);
            expectedMoves.forEach((move) => {
                expect(moves).toContainEqual(move);
            });
        });

        test("knight moves from corner have limited options", () => {
            const board = createBoardWithPiece(
                { type: "KNIGHT", color: "WHITE" },
                { file: 0, rank: 0 },
            );
            const moves = getPieceMoves(board, { file: 0, rank: 0 });

            expect(moves).toHaveLength(2);
            expect(moves).toContainEqual({ file: 2, rank: 1 });
            expect(moves).toContainEqual({ file: 1, rank: 2 });
        });

        test("knight can jump over pieces", () => {
            let board = createBoardWithPiece(
                { type: "KNIGHT", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            // Surround knight with pieces
            board = setPieceAt(
                board,
                { file: 3, rank: 4 },
                { type: "PAWN", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 5, rank: 4 },
                { type: "PAWN", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 4, rank: 3 },
                { type: "PAWN", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 4, rank: 5 },
                { type: "PAWN", color: "WHITE" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Knight should still be able to make all 8 L-shaped moves
            expect(moves).toHaveLength(8);
        });

        test("knight cannot move to squares occupied by own pieces", () => {
            let board = createBoardWithPiece(
                { type: "KNIGHT", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 6, rank: 5 },
                { type: "PAWN", color: "WHITE" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            expect(moves).not.toContainEqual({ file: 6, rank: 5 });
            expect(moves).toHaveLength(7);
        });
    });

    describe("Bishop movements", () => {
        test("bishop moves diagonally when unobstructed", () => {
            const board = createBoardWithPiece(
                { type: "BISHOP", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Should have 13 moves (4+3+3+3 diagonal moves)
            expect(moves).toHaveLength(13);

            // Check some specific diagonal moves
            expect(moves).toContainEqual({ file: 0, rank: 0 }); // down-left
            expect(moves).toContainEqual({ file: 7, rank: 7 }); // up-right
            expect(moves).toContainEqual({ file: 7, rank: 1 }); // down-right
            expect(moves).toContainEqual({ file: 1, rank: 7 }); // up-left
        });

        test("bishop movement is blocked by pieces", () => {
            let board = createBoardWithPiece(
                { type: "BISHOP", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 6, rank: 6 },
                { type: "PAWN", color: "WHITE" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Should not be able to move past own piece
            expect(moves).not.toContainEqual({ file: 6, rank: 6 });
            expect(moves).not.toContainEqual({ file: 7, rank: 7 });
            // But should be able to move to squares before blocking piece
            expect(moves).toContainEqual({ file: 5, rank: 5 });
        });

        test("bishop can capture enemy pieces", () => {
            let board = createBoardWithPiece(
                { type: "BISHOP", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 6, rank: 6 },
                { type: "PAWN", color: "BLACK" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Should be able to capture enemy piece
            expect(moves).toContainEqual({ file: 6, rank: 6 });
            // But not move past it
            expect(moves).not.toContainEqual({ file: 7, rank: 7 });
        });
    });

    describe("Queen movements", () => {
        test("queen combines rook and bishop movements", () => {
            const board = createBoardWithPiece(
                { type: "QUEEN", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Should have 27 moves (14 rook + 13 bishop)
            expect(moves).toHaveLength(27);

            // Check rook-like moves
            expect(moves).toContainEqual({ file: 0, rank: 4 });
            expect(moves).toContainEqual({ file: 7, rank: 4 });
            expect(moves).toContainEqual({ file: 4, rank: 0 });
            expect(moves).toContainEqual({ file: 4, rank: 7 });

            // Check bishop-like moves
            expect(moves).toContainEqual({ file: 0, rank: 0 });
            expect(moves).toContainEqual({ file: 7, rank: 7 });
            expect(moves).toContainEqual({ file: 7, rank: 1 });
            expect(moves).toContainEqual({ file: 1, rank: 7 });
        });
    });

    describe("King movements", () => {
        test("king moves one square in any direction", () => {
            const board = createBoardWithPiece(
                { type: "KING", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            const expectedMoves = [
                { file: 3, rank: 3 },
                { file: 3, rank: 4 },
                { file: 3, rank: 5 },
                { file: 4, rank: 3 },
                { file: 4, rank: 5 },
                { file: 5, rank: 3 },
                { file: 5, rank: 4 },
                { file: 5, rank: 5 },
            ];

            expect(moves).toHaveLength(8);
            expectedMoves.forEach((move) => {
                expect(moves).toContainEqual(move);
            });
        });

        test("king in corner has limited moves", () => {
            const board = createBoardWithPiece(
                { type: "KING", color: "WHITE" },
                { file: 0, rank: 0 },
            );
            const moves = getPieceMoves(board, { file: 0, rank: 0 });

            expect(moves).toHaveLength(3);
            expect(moves).toContainEqual({ file: 0, rank: 1 });
            expect(moves).toContainEqual({ file: 1, rank: 0 });
            expect(moves).toContainEqual({ file: 1, rank: 1 });
        });

        test("king cannot move to squares occupied by own pieces", () => {
            let board = createBoardWithPiece(
                { type: "KING", color: "WHITE" },
                { file: 4, rank: 4 },
            );
            board = setPieceAt(
                board,
                { file: 4, rank: 5 },
                { type: "PAWN", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 5, rank: 4 },
                { type: "PAWN", color: "WHITE" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            expect(moves).not.toContainEqual({ file: 4, rank: 5 });
            expect(moves).not.toContainEqual({ file: 5, rank: 4 });
            expect(moves).toHaveLength(6);
        });
    });

    describe("isValidPieceMove", () => {
        test("returns true for valid moves", () => {
            const board = createBoardWithPiece(
                { type: "ROOK", color: "WHITE" },
                { file: 0, rank: 0 },
            );

            expect(
                isValidPieceMove(
                    board,
                    { file: 0, rank: 0 },
                    { file: 0, rank: 7 },
                ),
            ).toBe(true);
            expect(
                isValidPieceMove(
                    board,
                    { file: 0, rank: 0 },
                    { file: 7, rank: 0 },
                ),
            ).toBe(true);
        });

        test("returns false for invalid moves", () => {
            const board = createBoardWithPiece(
                { type: "ROOK", color: "WHITE" },
                { file: 0, rank: 0 },
            );

            expect(
                isValidPieceMove(
                    board,
                    { file: 0, rank: 0 },
                    { file: 1, rank: 1 },
                ),
            ).toBe(false);
        });

        test("returns false when no piece on source square", () => {
            const board = createEmptyBoard();

            expect(
                isValidPieceMove(
                    board,
                    { file: 0, rank: 0 },
                    { file: 0, rank: 1 },
                ),
            ).toBe(false);
        });
    });

    describe("complex scenarios", () => {
        test("multiple pieces interaction", () => {
            let board = createEmptyBoard();
            board = setPieceAt(
                board,
                { file: 4, rank: 4 },
                { type: "QUEEN", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 4, rank: 6 },
                { type: "PAWN", color: "BLACK" },
            );
            board = setPieceAt(
                board,
                { file: 2, rank: 4 },
                { type: "ROOK", color: "WHITE" },
            );
            board = setPieceAt(
                board,
                { file: 6, rank: 6 },
                { type: "BISHOP", color: "BLACK" },
            );

            const moves = getPieceMoves(board, { file: 4, rank: 4 });

            // Can capture black pieces
            expect(moves).toContainEqual({ file: 4, rank: 6 });
            expect(moves).toContainEqual({ file: 6, rank: 6 });

            // Cannot move to or past own pieces
            expect(moves).not.toContainEqual({ file: 2, rank: 4 });
            expect(moves).not.toContainEqual({ file: 1, rank: 4 });
            expect(moves).not.toContainEqual({ file: 0, rank: 4 });

            // Can move to squares before own pieces
            expect(moves).toContainEqual({ file: 3, rank: 4 });
        });
    });
});
