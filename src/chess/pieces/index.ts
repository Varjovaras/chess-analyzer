import type { Board, Square, Color } from "../types";
import { getPieceAt } from "../board";
import { getPawnMoves, isPawnAttackingSquare } from "./pawn";
import { getRookMoves, isRookAttackingSquare } from "./rook";
import { getKnightMoves, isKnightAttackingSquare } from "./knight";
import { getBishopMoves, isBishopAttackingSquare } from "./bishop";
import { getQueenMoves, isQueenAttackingSquare } from "./queen";
import { getKingMoves, isKingAttackingSquare } from "./king";

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
                if (
                    isPieceAttackingSquare(
                        attackerSquare,
                        square,
                        attackerPiece.type,
                        board,
                    )
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function isPieceAttackingSquare(
    pieceSquare: Square,
    targetSquare: Square,
    pieceType: string,
    board: Board,
): boolean {
    switch (pieceType) {
        case "PAWN": {
            const piece = getPieceAt(board, pieceSquare);
            return piece
                ? isPawnAttackingSquare(pieceSquare, targetSquare, piece.color)
                : false;
        }
        case "ROOK":
            return isRookAttackingSquare(pieceSquare, targetSquare, board);
        case "KNIGHT":
            return isKnightAttackingSquare(pieceSquare, targetSquare);
        case "BISHOP":
            return isBishopAttackingSquare(pieceSquare, targetSquare, board);
        case "QUEEN":
            return isQueenAttackingSquare(pieceSquare, targetSquare, board);
        case "KING":
            return isKingAttackingSquare(pieceSquare, targetSquare);
        default:
            return false;
    }
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

// Re-export individual piece functions
export {
    getPawnMoves,
    isPawnAttackingSquare,
    getRookMoves,
    isRookAttackingSquare,
    getKnightMoves,
    isKnightAttackingSquare,
    getBishopMoves,
    isBishopAttackingSquare,
    getQueenMoves,
    isQueenAttackingSquare,
    getKingMoves,
    isKingAttackingSquare,
};
