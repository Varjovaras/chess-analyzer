// Basic piece movement logic

import type { Board, Piece, Square, Move, Color } from "./types";
import {
    isValidSquare,
    getPieceAt,
    isSquareEmpty,
    isSquareOccupiedBy,
} from "./board";

export function getPieceMoves(board: Board, square: Square): Square[] {
    const piece = getPieceAt(board, square);
    if (!piece) return [];

    switch (piece.type) {
        case "PAWN":
            return getPawnMoves(board, square, piece.color);
        case "ROOK":
            return getRookMoves(board, square, piece.color);
        case "KNIGHT":
            return getKnightMoves(board, square, piece.color);
        case "BISHOP":
            return getBishopMoves(board, square, piece.color);
        case "QUEEN":
            return getQueenMoves(board, square, piece.color);
        case "KING":
            return getKingMoves(board, square, piece.color);
        default:
            return [];
    }
}

function getPawnMoves(board: Board, square: Square, color: Color): Square[] {
    const moves: Square[] = [];
    const direction = color === "WHITE" ? 1 : -1;
    const startRank = color === "WHITE" ? 1 : 6;

    // One square forward
    const oneForward = { file: square.file, rank: square.rank + direction };
    if (isValidSquare(oneForward) && isSquareEmpty(board, oneForward)) {
        moves.push(oneForward);

        // Two squares forward from starting position
        if (square.rank === startRank) {
            const twoForward = {
                file: square.file,
                rank: square.rank + 2 * direction,
            };
            if (isValidSquare(twoForward) && isSquareEmpty(board, twoForward)) {
                moves.push(twoForward);
            }
        }
    }

    // Captures (diagonal)
    const captureLeft = {
        file: square.file - 1,
        rank: square.rank + direction,
    };
    const captureRight = {
        file: square.file + 1,
        rank: square.rank + direction,
    };

    if (
        isValidSquare(captureLeft) &&
        isSquareOccupiedBy(
            board,
            captureLeft,
            color === "WHITE" ? "BLACK" : "WHITE",
        )
    ) {
        moves.push(captureLeft);
    }
    if (
        isValidSquare(captureRight) &&
        isSquareOccupiedBy(
            board,
            captureRight,
            color === "WHITE" ? "BLACK" : "WHITE",
        )
    ) {
        moves.push(captureRight);
    }

    return moves;
}

function getRookMoves(board: Board, square: Square, color: Color): Square[] {
    const moves: Square[] = [];
    const directions = [
        { file: 0, rank: 1 }, // up
        { file: 0, rank: -1 }, // down
        { file: 1, rank: 0 }, // right
        { file: -1, rank: 0 }, // left
    ];

    for (const direction of directions) {
        moves.push(...getLineMoves(board, square, direction, color));
    }

    return moves;
}

function getKnightMoves(board: Board, square: Square, color: Color): Square[] {
    const moves: Square[] = [];
    const knightMoves = [
        { file: 2, rank: 1 },
        { file: 2, rank: -1 },
        { file: -2, rank: 1 },
        { file: -2, rank: -1 },
        { file: 1, rank: 2 },
        { file: 1, rank: -2 },
        { file: -1, rank: 2 },
        { file: -1, rank: -2 },
    ];

    for (const move of knightMoves) {
        const target = {
            file: square.file + move.file,
            rank: square.rank + move.rank,
        };
        if (
            isValidSquare(target) &&
            !isSquareOccupiedBy(board, target, color)
        ) {
            moves.push(target);
        }
    }

    return moves;
}

function getBishopMoves(board: Board, square: Square, color: Color): Square[] {
    const moves: Square[] = [];
    const directions = [
        { file: 1, rank: 1 }, // up-right
        { file: 1, rank: -1 }, // down-right
        { file: -1, rank: 1 }, // up-left
        { file: -1, rank: -1 }, // down-left
    ];

    for (const direction of directions) {
        moves.push(...getLineMoves(board, square, direction, color));
    }

    return moves;
}

function getQueenMoves(board: Board, square: Square, color: Color): Square[] {
    return [
        ...getRookMoves(board, square, color),
        ...getBishopMoves(board, square, color),
    ];
}

function getKingMoves(board: Board, square: Square, color: Color): Square[] {
    const moves: Square[] = [];
    const kingMoves = [
        { file: 0, rank: 1 },
        { file: 0, rank: -1 }, // up, down
        { file: 1, rank: 0 },
        { file: -1, rank: 0 }, // right, left
        { file: 1, rank: 1 },
        { file: 1, rank: -1 }, // diagonals
        { file: -1, rank: 1 },
        { file: -1, rank: -1 },
    ];

    for (const move of kingMoves) {
        const target = {
            file: square.file + move.file,
            rank: square.rank + move.rank,
        };
        if (
            isValidSquare(target) &&
            !isSquareOccupiedBy(board, target, color)
        ) {
            // Check if the target square is under attack by enemy pieces
            if (
                !isSquareUnderAttackBy(
                    board,
                    target,
                    color === "WHITE" ? "BLACK" : "WHITE",
                )
            ) {
                moves.push(target);
            }
        }
    }

    return moves;
}

// Note: Castling moves are handled separately in the game logic
// since they require access to game state (castling rights, check status)

export function isSquareUnderAttackBy(
    board: Board,
    square: Square,
    byColor: Color,
): boolean {
    for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
            const attackerSquare = { file: f, rank: r };
            const attackerPiece = getPieceAt(board, attackerSquare);

            if (attackerPiece && attackerPiece.color === byColor) {
                if (attackerPiece.type === "PAWN") {
                    const direction = attackerPiece.color === "WHITE" ? 1 : -1;
                    // Check diagonal captures
                    const captureLeft = {
                        file: attackerSquare.file - 1,
                        rank: attackerSquare.rank + direction,
                    };
                    const captureRight = {
                        file: attackerSquare.file + 1,
                        rank: attackerSquare.rank + direction,
                    };
                    if (
                        isValidSquare(captureLeft) &&
                        captureLeft.file === square.file &&
                        captureLeft.rank === square.rank
                    ) {
                        return true;
                    }
                    if (
                        isValidSquare(captureRight) &&
                        captureRight.file === square.file &&
                        captureRight.rank === square.rank
                    ) {
                        return true;
                    }
                } else if (attackerPiece.type === "KNIGHT") {
                    const knightMoves = [
                        { file: 2, rank: 1 },
                        { file: 2, rank: -1 },
                        { file: -2, rank: 1 },
                        { file: -2, rank: -1 },
                        { file: 1, rank: 2 },
                        { file: 1, rank: -2 },
                        { file: -1, rank: 2 },
                        { file: -1, rank: -2 },
                    ];
                    for (const move of knightMoves) {
                        const target = {
                            file: attackerSquare.file + move.file,
                            rank: attackerSquare.rank + move.rank,
                        };
                        if (
                            isValidSquare(target) &&
                            target.file === square.file &&
                            target.rank === square.rank
                        ) {
                            return true;
                        }
                    }
                } else if (attackerPiece.type === "KING") {
                    const kingMoves = [
                        { file: 0, rank: 1 },
                        { file: 0, rank: -1 },
                        { file: 1, rank: 0 },
                        { file: -1, rank: 0 },
                        { file: 1, rank: 1 },
                        { file: 1, rank: -1 },
                        { file: -1, rank: 1 },
                        { file: -1, rank: -1 },
                    ];
                    for (const move of kingMoves) {
                        const target = {
                            file: attackerSquare.file + move.file,
                            rank: attackerSquare.rank + move.rank,
                        };
                        if (
                            isValidSquare(target) &&
                            target.file === square.file &&
                            target.rank === square.rank
                        ) {
                            return true;
                        }
                    }
                } else {
                    // Sliding pieces: ROOK, BISHOP, QUEEN
                    const directions: { file: number; rank: number }[] = [];
                    if (
                        attackerPiece.type === "ROOK" ||
                        attackerPiece.type === "QUEEN"
                    ) {
                        directions.push(
                            ...[
                                { file: 0, rank: 1 },
                                { file: 0, rank: -1 }, // up, down
                                { file: 1, rank: 0 },
                                { file: -1, rank: 0 }, // right, left
                            ],
                        );
                    }
                    if (
                        attackerPiece.type === "BISHOP" ||
                        attackerPiece.type === "QUEEN"
                    ) {
                        directions.push(
                            ...[
                                { file: 1, rank: 1 },
                                { file: 1, rank: -1 }, // up-right, down-right
                                { file: -1, rank: 1 },
                                { file: -1, rank: -1 }, // up-left, down-left
                            ],
                        );
                    }

                    for (const dir of directions) {
                        const current = {
                            file: attackerSquare.file + dir.file,
                            rank: attackerSquare.rank + dir.rank,
                        };
                        while (isValidSquare(current)) {
                            if (
                                current.file === square.file &&
                                current.rank === square.rank
                            ) {
                                return true; // Found target square along this line
                            }
                            // If we encounter any piece on an intermediate square, the path is blocked.
                            // This check happens after we've already checked if 'current' is the target 'square'.
                            // So, if 'current' is occupied here, it must be an intermediate piece.
                            if (getPieceAt(board, current) !== null) {
                                break; // Path is blocked by an intermediate piece.
                            }
                            current.file += dir.file;
                            current.rank += dir.rank;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function getBasicKingMoves(
    board: Board,
    square: Square,
    color: Color,
): Square[] {
    const moves: Square[] = [];
    const kingMoves = [
        { file: 0, rank: 1 },
        { file: 0, rank: -1 }, // up, down
        { file: 1, rank: 0 },
        { file: -1, rank: 0 }, // right, left
        { file: 1, rank: 1 },
        { file: 1, rank: -1 }, // diagonals
        { file: -1, rank: 1 },
        { file: -1, rank: -1 },
    ];

    for (const move of kingMoves) {
        const target = {
            file: square.file + move.file,
            rank: square.rank + move.rank,
        };
        if (
            isValidSquare(target) &&
            !isSquareOccupiedBy(board, target, color)
        ) {
            moves.push(target);
        }
    }

    return moves;
}

function getLineMoves(
    board: Board,
    square: Square,
    direction: { file: number; rank: number },
    color: Color,
): Square[] {
    const moves: Square[] = [];
    const current = {
        file: square.file + direction.file,
        rank: square.rank + direction.rank,
    };

    while (isValidSquare(current)) {
        if (isSquareEmpty(board, current)) {
            moves.push({ ...current });
        } else {
            // Blocked by a piece
            if (!isSquareOccupiedBy(board, current, color)) {
                // Can capture opponent's piece
                moves.push({ ...current });
            }
            break; // Stop sliding in this direction
        }

        current.file += direction.file;
        current.rank += direction.rank;
    }

    return moves;
}

export function isValidPieceMove(
    board: Board,
    from: Square,
    to: Square,
): boolean {
    const piece = getPieceAt(board, from);
    if (!piece) return false;

    // Handle castling moves separately (king moving 2 squares horizontally)
    if (
        piece.type === "KING" &&
        Math.abs(to.file - from.file) === 2 &&
        to.rank === from.rank
    ) {
        // Castling moves are validated in the game logic, not here
        return true;
    }

    const possibleMoves = getPieceMoves(board, from);
    return possibleMoves.some(
        (move) => move.file === to.file && move.rank === to.rank,
    );
}
