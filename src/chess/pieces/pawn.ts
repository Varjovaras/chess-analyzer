import type { Board, Square, Color } from "..";
import { isValidSquare, isSquareEmpty, isSquareOccupiedBy } from "../board";

export function getPawnMoves(
    board: Board,
    square: Square,
    color: Color,
    enPassantTarget?: Square | null,
): Square[] {
    const moves: Square[] = [];
    const direction = color === "WHITE" ? 1 : -1;
    const startRank = color === "WHITE" ? 1 : 6;

    // One square forward
    const oneForward = { file: square.file, rank: square.rank + direction };
    if (isValidSquare(oneForward) && isSquareEmpty(board, oneForward)) {
        moves.push(oneForward);

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

    if (enPassantTarget) {
        const enPassantRank = color === "WHITE" ? 5 : 2; // 6th rank for white, 3rd rank for black
        const pawnRank = color === "WHITE" ? 4 : 3; // 5th rank for white, 4th rank for black

        if (square.rank === pawnRank) {
            if (
                enPassantTarget.rank === enPassantRank &&
                Math.abs(enPassantTarget.file - square.file) === 1
            ) {
                moves.push(enPassantTarget);
            }
        }
    }

    return moves;
}

export function isPawnAttackingSquare(
    pawnSquare: Square,
    targetSquare: Square,
    pawnColor: Color,
): boolean {
    const direction = pawnColor === "WHITE" ? 1 : -1;

    const captureLeft = {
        file: pawnSquare.file - 1,
        rank: pawnSquare.rank + direction,
    };
    const captureRight = {
        file: pawnSquare.file + 1,
        rank: pawnSquare.rank + direction,
    };

    return (
        (isValidSquare(captureLeft) &&
            captureLeft.file === targetSquare.file &&
            captureLeft.rank === targetSquare.rank) ||
        (isValidSquare(captureRight) &&
            captureRight.file === targetSquare.file &&
            captureRight.rank === targetSquare.rank)
    );
}
