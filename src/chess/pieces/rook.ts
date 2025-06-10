import type { Board, Square, Color } from "..";
import { isValidSquare, isSquareEmpty, isSquareOccupiedBy } from "../board";

export function getRookMoves(board: Board, square: Square, color: Color): Square[] {
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

export function isRookAttackingSquare(
    rookSquare: Square,
    targetSquare: Square,
    board: Board
): boolean {
    // Check if target is on same rank or file
    const sameRank = rookSquare.rank === targetSquare.rank;
    const sameFile = rookSquare.file === targetSquare.file;

    if (!sameRank && !sameFile) {
        return false;
    }

    // Check if path is clear
    const directions = [
        { file: 0, rank: 1 }, // up
        { file: 0, rank: -1 }, // down
        { file: 1, rank: 0 }, // right
        { file: -1, rank: 0 }, // left
    ];

    for (const dir of directions) {
        const current = {
            file: rookSquare.file + dir.file,
            rank: rookSquare.rank + dir.rank,
        };

        while (isValidSquare(current)) {
            if (current.file === targetSquare.file && current.rank === targetSquare.rank) {
                return true; // Found target square along this line
            }

            // If we encounter any piece on an intermediate square, the path is blocked
            if (!isSquareEmpty(board, current)) {
                break; // Path is blocked by an intermediate piece
            }

            current.file += dir.file;
            current.rank += dir.rank;
        }
    }

    return false;
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