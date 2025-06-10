import type { Board, Square, Color } from "..";
import { isValidSquare, isSquareOccupiedBy } from "../board";

export function getKnightMoves(board: Board, square: Square, color: Color): Square[] {
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

export function isKnightAttackingSquare(
    knightSquare: Square,
    targetSquare: Square
): boolean {
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
            file: knightSquare.file + move.file,
            rank: knightSquare.rank + move.rank,
        };
        if (
            isValidSquare(target) &&
            target.file === targetSquare.file &&
            target.rank === targetSquare.rank
        ) {
            return true;
        }
    }

    return false;
}