import type { Board, Color, GameState } from "../types";
import { getPieceAt } from "../board";
import {
    getGameStateSignature,
    isThreefoldRepetition as isThreefoldRepetitionFromHistory,
} from "../game/game-state";

export interface MaterialCount {
    KING: number;
    QUEEN: number;
    ROOK: number;
    BISHOP: number;
    KNIGHT: number;
    PAWN: number;
}

export function isInsufficientMaterial(board: Board): boolean {
    const whitePieces = countMaterial(board, "WHITE");
    const blackPieces = countMaterial(board, "BLACK");

    // Helper to check if a side has only king
    const hasOnlyKing = (pieces: MaterialCount) => {
        return (
            pieces.KING === 1 &&
            pieces.QUEEN === 0 &&
            pieces.ROOK === 0 &&
            pieces.BISHOP === 0 &&
            pieces.KNIGHT === 0 &&
            pieces.PAWN === 0
        );
    };

    // Helper to check if a side has king + bishop or king + knight only
    const hasKingAndMinorPiece = (pieces: MaterialCount) => {
        return (
            pieces.KING === 1 &&
            pieces.QUEEN === 0 &&
            pieces.ROOK === 0 &&
            pieces.PAWN === 0 &&
            ((pieces.BISHOP === 1 && pieces.KNIGHT === 0) ||
                (pieces.KNIGHT === 1 && pieces.BISHOP === 0))
        );
    };

    // King vs King
    if (hasOnlyKing(whitePieces) && hasOnlyKing(blackPieces)) {
        return true;
    }

    // King vs King + Bishop or King + Knight
    if (
        (hasOnlyKing(whitePieces) && hasKingAndMinorPiece(blackPieces)) ||
        (hasOnlyKing(blackPieces) && hasKingAndMinorPiece(whitePieces))
    ) {
        return true;
    }

    // King + Bishop vs King + Bishop (bishops on same color squares)
    if (
        whitePieces.KING === 1 &&
        whitePieces.BISHOP === 1 &&
        whitePieces.QUEEN === 0 &&
        whitePieces.ROOK === 0 &&
        whitePieces.KNIGHT === 0 &&
        whitePieces.PAWN === 0 &&
        blackPieces.KING === 1 &&
        blackPieces.BISHOP === 1 &&
        blackPieces.QUEEN === 0 &&
        blackPieces.ROOK === 0 &&
        blackPieces.KNIGHT === 0 &&
        blackPieces.PAWN === 0
    ) {
        // Get bishops of each color
        let whiteBishopSquareColor: number | null = null;
        let blackBishopSquareColor: number | null = null;

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const piece = getPieceAt(board, { file, rank });
                if (piece && piece.type === "BISHOP") {
                    const squareColor = (file + rank) % 2;
                    if (piece.color === "WHITE") {
                        whiteBishopSquareColor = squareColor;
                    } else {
                        blackBishopSquareColor = squareColor;
                    }
                }
            }
        }

        // If both bishops are on the same color squares, it's a draw
        if (
            whiteBishopSquareColor !== null &&
            blackBishopSquareColor !== null &&
            whiteBishopSquareColor === blackBishopSquareColor
        ) {
            return true;
        }
    }

    return false;
}

export function countMaterial(board: Board, color: Color): MaterialCount {
    const count: MaterialCount = {
        KING: 0,
        QUEEN: 0,
        ROOK: 0,
        BISHOP: 0,
        KNIGHT: 0,
        PAWN: 0,
    };

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const piece = getPieceAt(board, { file, rank });
            if (piece && piece.color === color) {
                if (piece.type in count) {
                    count[piece.type as keyof MaterialCount]++;
                }
            }
        }
    }

    return count;
}

function hasKingAndSameColorBishops(
    board: Board,
    pieces: MaterialCount,
): boolean {
    if (
        pieces.KING !== 1 ||
        pieces.BISHOP === 0 ||
        pieces.QUEEN > 0 ||
        pieces.ROOK > 0 ||
        pieces.KNIGHT > 0 ||
        pieces.PAWN > 0
    ) {
        return false;
    }

    return true;
}

export function isFiftyMoveRule(halfmoveClock: number): boolean {
    return halfmoveClock >= 100; // 50 moves for each side = 100 half-moves
}

export function isThreefoldRepetition(gameState: GameState): boolean {
    const currentPosition = getGameStateSignature(gameState);
    const positionHistory = gameState.positionHistory || [];
    return isThreefoldRepetitionFromHistory(positionHistory, currentPosition);
}

export function isStalemate(
    board: Board,
    color: Color,
    validMoves: unknown[],
    isInCheck: boolean,
): boolean {
    // Stalemate occurs when:
    // 1. The player to move is not in check
    // 2. The player has no legal moves
    return !isInCheck && validMoves.length === 0;
}

export function evaluateDrawConditions(
    gameState: GameState,
    validMoves: unknown[],
    isInCheck: boolean,
): boolean {
    // Check insufficient material
    if (isInsufficientMaterial(gameState.board)) {
        return true;
    }

    // Check 50-move rule
    if (isFiftyMoveRule(gameState.halfmoveClock)) {
        return true;
    }

    // Check stalemate
    if (
        isStalemate(
            gameState.board,
            gameState.currentPlayer,
            validMoves,
            isInCheck,
        )
    ) {
        return true;
    }

    // Check threefold repetition (simplified)
    if (isThreefoldRepetition(gameState)) {
        return true;
    }

    return false;
}

export function getTotalMaterialValue(board: Board, color: Color): number {
    const pieceValues = {
        PAWN: 1,
        KNIGHT: 3,
        BISHOP: 3,
        ROOK: 5,
        QUEEN: 9,
        KING: 0, // King has no material value for this calculation
    };

    let totalValue = 0;
    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const piece = getPieceAt(board, { file, rank });
            if (piece && piece.color === color) {
                if (piece.type in pieceValues) {
                    totalValue +=
                        pieceValues[piece.type as keyof MaterialCount];
                }
            }
        }
    }

    return totalValue;
}

export function hasMinimumMatingMaterial(board: Board, color: Color): boolean {
    const material = countMaterial(board, color);

    // Queen can mate
    if (material.QUEEN > 0) return true;

    // Rook can mate
    if (material.ROOK > 0) return true;

    // Pawn can mate (can promote)
    if (material.PAWN > 0) return true;

    // Two bishops can mate
    if (material.BISHOP >= 2) return true;

    // Bishop and knight can mate
    if (material.BISHOP >= 1 && material.KNIGHT >= 1) return true;

    // Three knights can mate (rare but possible)
    if (material.KNIGHT >= 3) return true;

    return false;
}
