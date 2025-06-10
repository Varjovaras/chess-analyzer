import type { Board, Square, Color } from "..";
import { isValidSquare, isSquareOccupiedBy } from "../board";

export function getKingMoves(board: Board, square: Square, color: Color): Square[] {
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

export function isKingAttackingSquare(
    kingSquare: Square,
    targetSquare: Square
): boolean {
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
            file: kingSquare.file + move.file,
            rank: kingSquare.rank + move.rank,
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