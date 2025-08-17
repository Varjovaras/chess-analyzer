import type { Board, Color, Square } from "../types";
import { findKing, getPieceAt } from "../board";
import { isSquareUnderAttackBy } from "../pieces";

export function isKingInCheck(board: Board, color: Color): boolean {
    const kingSquare = findKing(board, color);
    if (!kingSquare) return false;

    const opponentColor = color === "WHITE" ? "BLACK" : "WHITE";
    return isSquareUnderAttackBy(board, kingSquare, opponentColor);
}

export function isSquareAttackedBy(
    board: Board,
    square: Square,
    byColor: Color,
): boolean {
    return isSquareUnderAttackBy(board, square, byColor);
}

export function getAttackingPieces(
    board: Board,
    targetSquare: Square,
    byColor: Color,
): Square[] {
    const attackers: Square[] = [];

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const square = { file, rank };
            const piece = getPieceAt(board, square);

            if (piece && piece.color === byColor) {
                if (isSquareUnderAttackBy(board, targetSquare, byColor)) {
                    // Test if this specific piece is attacking by temporarily removing it
                    // If removing this piece stops the attack, then it was an attacker
                    const testBoard = board.map((rank) => [...rank]);
                    const rankArray = testBoard[square.rank];
                    if (!rankArray) {
                        return attackers;
                    }
                    rankArray[square.file] = null;

                    if (
                        !isSquareUnderAttackBy(testBoard, targetSquare, byColor)
                    ) {
                        attackers.push(square);
                    }
                }
            }
        }
    }

    return attackers;
}

export function isDoubleCheck(board: Board, kingColor: Color): boolean {
    const kingSquare = findKing(board, kingColor);
    if (!kingSquare) return false;

    const opponentColor = kingColor === "WHITE" ? "BLACK" : "WHITE";
    const attackers = getAttackingPieces(board, kingSquare, opponentColor);

    return attackers.length >= 2;
}

export function getCheckingPieces(board: Board, kingColor: Color): Square[] {
    const kingSquare = findKing(board, kingColor);
    if (!kingSquare) return [];

    if (!isKingInCheck(board, kingColor)) return [];

    const opponentColor = kingColor === "WHITE" ? "BLACK" : "WHITE";
    return getAttackingPieces(board, kingSquare, opponentColor);
}

export function canBlockCheck(
    board: Board,
    kingColor: Color,
    blockingSquare: Square,
): boolean {
    const kingSquare = findKing(board, kingColor);
    if (!kingSquare) return false;

    const checkingPieces = getCheckingPieces(board, kingColor);

    // Can't block double check
    if (checkingPieces.length > 1) return false;

    // No check to block
    if (checkingPieces.length === 0) return false;

    const checkingPiece = checkingPieces[0];
    if (!checkingPiece) return false;

    const checkingPieceData = getPieceAt(board, checkingPiece);

    if (!checkingPieceData) return false;

    // Knight checks cannot be blocked (only captured or king moves)
    if (checkingPieceData.type === "KNIGHT") return false;

    // For sliding pieces (rook, bishop, queen), check if the blocking square
    // is on the line between the checking piece and the king
    return isSquareOnLineBetween(checkingPiece, kingSquare, blockingSquare);
}

export function isSquareOnLineBetween(
    start: Square,
    end: Square,
    middle: Square,
): boolean {
    // Check if three squares are collinear and middle is between start and end
    const dx1 = end.file - start.file;
    const dy1 = end.rank - start.rank;
    const dx2 = middle.file - start.file;
    const dy2 = middle.rank - start.rank;

    // Check if points are collinear (cross product should be 0)
    if (dx1 * dy2 !== dy1 * dx2) return false;

    // Check if middle is between start and end
    if (dx1 !== 0) {
        const t = dx2 / dx1;
        return t > 0 && t < 1 && dy2 === t * dy1;
    }
    if (dy1 !== 0) {
        const t = dy2 / dy1;
        return t > 0 && t < 1 && dx2 === t * dx1;
    }

    return false;
}

export function wouldMoveResolveCheck(
    board: Board,
    kingColor: Color,
    fromSquare: Square,
    toSquare: Square,
): boolean {
    // Simulate the move
    const piece = getPieceAt(board, fromSquare);
    if (!piece || piece.color !== kingColor) return false;

    // Create a copy of the board with the move applied
    const testBoard = board.map((rank) => [...rank]);
    const fromRank = testBoard[fromSquare.rank];
    const toRank = testBoard[toSquare.rank];
    if (!fromRank || !toRank) return false;

    fromRank[fromSquare.file] = null;
    toRank[toSquare.file] = piece;

    // Check if the king is still in check after the move
    return !isKingInCheck(testBoard, kingColor);
}

export function isPiecePinned(
    board: Board,
    pieceSquare: Square,
    kingColor: Color,
): boolean {
    const piece = getPieceAt(board, pieceSquare);
    if (!piece || piece.color !== kingColor || piece.type === "KING")
        return false;

    const kingSquare = findKing(board, kingColor);
    if (!kingSquare) return false;

    // Remove the piece temporarily and see if king comes under attack
    const testBoard = board.map((rank) => [...rank]);
    const pieceRank = testBoard[pieceSquare.rank];
    if (!pieceRank) return false;
    pieceRank[pieceSquare.file] = null;

    const opponentColor = kingColor === "WHITE" ? "BLACK" : "WHITE";
    return (
        isSquareUnderAttackBy(testBoard, kingSquare, opponentColor) &&
        !isKingInCheck(board, kingColor)
    );
}
