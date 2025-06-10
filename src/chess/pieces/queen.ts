import type { Board, Square, Color } from "../types";
import { getRookMoves, isRookAttackingSquare } from "./rook";
import { getBishopMoves, isBishopAttackingSquare } from "./bishop";

export function getQueenMoves(board: Board, square: Square, color: Color): Square[] {
    return [
        ...getRookMoves(board, square, color),
        ...getBishopMoves(board, square, color),
    ];
}

export function isQueenAttackingSquare(
    queenSquare: Square,
    targetSquare: Square,
    board: Board
): boolean {
    return (
        isRookAttackingSquare(queenSquare, targetSquare, board) ||
        isBishopAttackingSquare(queenSquare, targetSquare, board)
    );
}