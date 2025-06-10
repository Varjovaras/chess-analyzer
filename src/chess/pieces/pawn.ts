import type { Board, Square, Color } from "..";
import { isValidSquare, isSquareEmpty, isSquareOccupiedBy } from "../board";

export function getPawnMoves(board: Board, square: Square, color: Color): Square[] {
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

export function isPawnAttackingSquare(
    pawnSquare: Square,
    targetSquare: Square,
    pawnColor: Color
): boolean {
    const direction = pawnColor === "WHITE" ? 1 : -1;

    // Check diagonal captures
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