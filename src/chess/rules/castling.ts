import type { Board, Color, Square } from "..";
import { getPieceAt, isSquareEmpty } from "../board";
import { isSquareUnderAttackBy } from "../pieces";

export interface CastlingRights {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
}

export function canCastleKingside(
    board: Board,
    color: Color,
    castlingRights: CastlingRights,
    isInCheck: boolean,
): boolean {
    if (isInCheck) return false;

    const rights =
        color === "WHITE"
            ? castlingRights.whiteKingside
            : castlingRights.blackKingside;
    if (!rights) return false;

    const rank = color === "WHITE" ? 0 : 7;
    const kingSquare = { file: 4, rank };
    const rookSquare = { file: 7, rank };

    const king = getPieceAt(board, kingSquare);
    if (!king || king.type !== "KING" || king.color !== color) {
        return false;
    }

    const rook = getPieceAt(board, rookSquare);
    if (!rook || rook.type !== "ROOK" || rook.color !== color) {
        return false;
    }

    // Check if path is clear (f and g files)
    for (let file = 5; file <= 6; file++) {
        if (!isSquareEmpty(board, { file, rank })) {
            return false;
        }
    }

    // Check if king would pass through or land in check
    const opponentColor = color === "WHITE" ? "BLACK" : "WHITE";
    for (let file = 4; file <= 6; file++) {
        const testSquare = { file, rank };
        if (isSquareUnderAttackBy(board, testSquare, opponentColor)) {
            return false;
        }
    }

    return true;
}

export function canCastleQueenside(
    board: Board,
    color: Color,
    castlingRights: CastlingRights,
    isInCheck: boolean,
): boolean {
    // Can't castle if in check
    if (isInCheck) return false;

    const rights =
        color === "WHITE"
            ? castlingRights.whiteQueenside
            : castlingRights.blackQueenside;
    if (!rights) return false;

    const rank = color === "WHITE" ? 0 : 7;
    const kingSquare = { file: 4, rank };
    const rookSquare = { file: 0, rank };

    const king = getPieceAt(board, kingSquare);
    if (!king || king.type !== "KING" || king.color !== color) {
        return false;
    }

    const rook = getPieceAt(board, rookSquare);
    if (!rook || rook.type !== "ROOK" || rook.color !== color) {
        return false;
    }

    // Check if path is clear (b, c, d files)
    for (let file = 1; file <= 3; file++) {
        if (!isSquareEmpty(board, { file, rank })) {
            return false;
        }
    }

    // Check if king would pass through or land in check (c, d, e files)
    const opponentColor = color === "WHITE" ? "BLACK" : "WHITE";
    for (let file = 2; file <= 4; file++) {
        const testSquare = { file, rank };
        if (isSquareUnderAttackBy(board, testSquare, opponentColor)) {
            return false;
        }
    }

    return true;
}

export function updateCastlingRights(
    currentRights: CastlingRights,
    fromSquare: Square,
    toSquare: Square,
    pieceType: string,
    pieceColor: Color,
    capturedPieceType?: string,
    capturedPieceColor?: Color,
): CastlingRights {
    const newRights = { ...currentRights };

    // If king moves, lose all castling rights for that color
    if (pieceType === "KING") {
        if (pieceColor === "WHITE") {
            newRights.whiteKingside = false;
            newRights.whiteQueenside = false;
        } else {
            newRights.blackKingside = false;
            newRights.blackQueenside = false;
        }
    }

    // If rook moves from starting position, lose castling rights for that side
    if (pieceType === "ROOK") {
        if (pieceColor === "WHITE" && fromSquare.rank === 0) {
            if (fromSquare.file === 0) newRights.whiteQueenside = false;
            if (fromSquare.file === 7) newRights.whiteKingside = false;
        } else if (pieceColor === "BLACK" && fromSquare.rank === 7) {
            if (fromSquare.file === 0) newRights.blackQueenside = false;
            if (fromSquare.file === 7) newRights.blackKingside = false;
        }
    }

    // If rook is captured, lose castling rights for that side
    if (capturedPieceType === "ROOK" && capturedPieceColor) {
        if (capturedPieceColor === "WHITE" && toSquare.rank === 0) {
            if (toSquare.file === 0) newRights.whiteQueenside = false;
            if (toSquare.file === 7) newRights.whiteKingside = false;
        } else if (capturedPieceColor === "BLACK" && toSquare.rank === 7) {
            if (toSquare.file === 0) newRights.blackQueenside = false;
            if (toSquare.file === 7) newRights.blackKingside = false;
        }
    }

    return newRights;
}

export function getCastlingMoves(
    board: Board,
    color: Color,
    castlingRights: CastlingRights,
    isInCheck: boolean,
): Square[] {
    const moves: Square[] = [];
    const kingRank = color === "WHITE" ? 0 : 7;

    if (canCastleKingside(board, color, castlingRights, isInCheck)) {
        moves.push({ file: 6, rank: kingRank });
    }

    if (canCastleQueenside(board, color, castlingRights, isInCheck)) {
        moves.push({ file: 2, rank: kingRank });
    }

    return moves;
}

export function isCastlingMove(
    from: Square,
    to: Square,
    pieceType: string,
): boolean {
    return (
        pieceType === "KING" &&
        Math.abs(to.file - from.file) === 2 &&
        to.rank === from.rank
    );
}

export function getCastlingType(
    from: Square,
    to: Square,
): "KINGSIDE" | "QUEENSIDE" | null {
    if (!isCastlingMove(from, to, "KING")) return null;

    return to.file === 6 ? "KINGSIDE" : "QUEENSIDE";
}
