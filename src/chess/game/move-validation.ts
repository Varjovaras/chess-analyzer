import type { Board, Square, Color, Move, GameState, PieceType } from "..";
import { getPieceAt, setPieceAt } from "../board";
import { isValidPieceMove } from "../pieces";
import { isKingInCheck } from "../rules/check-detection";
import {
    isCastlingMove,
    canCastleKingside,
    canCastleQueenside,
} from "../rules/castling";

export function isValidMove(
    gameState: GameState,
    from: Square,
    to: Square,
): boolean {
    const piece = getPieceAt(gameState.board, from);

    // Basic validation
    if (!piece) return false;
    if (piece.color !== gameState.currentPlayer) return false;

    // Check if this is a castling move
    if (isCastlingMove(from, to, piece.type)) {
        return isValidCastlingMove(gameState, from, to);
    }

    // Check if the piece can legally move to the target square
    if (!isValidPieceMove(gameState.board, from, to, gameState.enPassantTarget))
        return false;

    // Check if the move would leave own king in check
    const testBoard = simulateMove(
        gameState.board,
        from,
        to,
        gameState.enPassantTarget,
        undefined, // No promotion piece for basic validation
    );
    if (isKingInCheck(testBoard, gameState.currentPlayer)) {
        return false;
    }

    return true;
}

export function isValidCastlingMove(
    gameState: GameState,
    from: Square,
    to: Square,
): boolean {
    const piece = getPieceAt(gameState.board, from);
    if (!piece || piece.type !== "KING") return false;

    const color = piece.color;
    const isKingside = to.file === 6;
    const isQueenside = to.file === 2;

    if (!isKingside && !isQueenside) return false;

    const isCurrentlyInCheck = isKingInCheck(gameState.board, color);

    if (isKingside) {
        return canCastleKingside(
            gameState.board,
            color,
            gameState.castlingRights,
            isCurrentlyInCheck,
        );
    }

    if (isQueenside) {
        return canCastleQueenside(
            gameState.board,
            color,
            gameState.castlingRights,
            isCurrentlyInCheck,
        );
    }

    return false;
}

export function simulateMove(
    board: Board,
    from: Square,
    to: Square,
    enPassantTarget?: Square | null,
    promotionPiece?: PieceType,
): Board {
    const piece = getPieceAt(board, from);
    if (!piece) return board;

    let newBoard = setPieceAt(board, from, null);

    // Handle en passant capture
    if (
        piece.type === "PAWN" &&
        enPassantTarget &&
        to.file === enPassantTarget.file &&
        to.rank === enPassantTarget.rank
    ) {
        // Remove the captured pawn (not at the destination square)
        const capturedPawnRank = piece.color === "WHITE" ? 4 : 3;
        const capturedPawnSquare = {
            file: enPassantTarget.file,
            rank: capturedPawnRank,
        };
        newBoard = setPieceAt(newBoard, capturedPawnSquare, null);
    }

    // Handle pawn promotion
    let pieceToPlace = piece;
    if (piece.type === "PAWN") {
        const isPromotion =
            (piece.color === "WHITE" && to.rank === 7) ||
            (piece.color === "BLACK" && to.rank === 0);

        if (isPromotion) {
            const promoteToType = promotionPiece || "QUEEN";
            pieceToPlace = {
                type: promoteToType,
                color: piece.color,
            };
        }
    }

    newBoard = setPieceAt(newBoard, to, pieceToPlace);
    return newBoard;
}

export function wouldMoveExposeKing(
    board: Board,
    from: Square,
    to: Square,
    kingColor: Color,
    enPassantTarget?: Square | null,
    promotionPiece?: PieceType,
): boolean {
    const testBoard = simulateMove(
        board,
        from,
        to,
        enPassantTarget,
        promotionPiece,
    );
    return isKingInCheck(testBoard, kingColor);
}

export function isMoveLegal(gameState: GameState, move: Move): boolean {
    return isValidMove(gameState, move.from, move.to);
}

export function validateMoveSequence(
    initialState: GameState,
    moves: Move[],
): { isValid: boolean; errorMove?: Move; errorMessage?: string } {
    let currentState = initialState;

    for (const move of moves) {
        if (!isValidMove(currentState, move.from, move.to)) {
            return {
                isValid: false,
                errorMove: move,
                errorMessage: `Invalid move: ${JSON.stringify(move)}`,
            };
        }

        // Apply the move (simplified - in practice would use the full game logic)
        const newBoard = simulateMove(
            currentState.board,
            move.from,
            move.to,
            currentState.enPassantTarget,
            move.promotion,
        );
        currentState = {
            ...currentState,
            board: newBoard,
            currentPlayer:
                currentState.currentPlayer === "WHITE" ? "BLACK" : "WHITE",
        };
    }

    return { isValid: true };
}

export function getMoveValidationError(
    gameState: GameState,
    from: Square,
    to: Square,
    promotionPiece?: PieceType,
): string | null {
    const piece = getPieceAt(gameState.board, from);

    if (!piece) {
        return "No piece at source square";
    }

    if (piece.color !== gameState.currentPlayer) {
        return "Cannot move opponent's piece";
    }

    if (isCastlingMove(from, to, piece.type)) {
        if (!isValidCastlingMove(gameState, from, to)) {
            return "Invalid castling move";
        }
    } else if (
        !isValidPieceMove(gameState.board, from, to, gameState.enPassantTarget)
    ) {
        return "Piece cannot move to target square";
    }

    if (
        wouldMoveExposeKing(
            gameState.board,
            from,
            to,
            gameState.currentPlayer,
            gameState.enPassantTarget,
            promotionPiece,
        )
    ) {
        return "Move would leave king in check";
    }

    return null;
}

export function isSquareAttacked(
    board: Board,
    square: Square,
    byColor: Color,
): boolean {
    // This is a helper function that uses the check detection logic
    return isKingInCheck(
        setPieceAt(board, square, {
            type: "KING",
            color: byColor === "WHITE" ? "BLACK" : "WHITE",
        }),
        byColor === "WHITE" ? "BLACK" : "WHITE",
    );
}

export function canPieceReachSquare(
    board: Board,
    pieceSquare: Square,
    targetSquare: Square,
    enPassantTarget?: Square | null,
): boolean {
    return isValidPieceMove(board, pieceSquare, targetSquare, enPassantTarget);
}

export function isKingInCheckAfterMove(
    gameState: GameState,
    from: Square,
    to: Square,
    promotionPiece?: PieceType,
): boolean {
    const testBoard = simulateMove(
        gameState.board,
        from,
        to,
        gameState.enPassantTarget,
        promotionPiece,
    );
    return isKingInCheck(testBoard, gameState.currentPlayer);
}
