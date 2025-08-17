import type { GameState, Move, Square, Color, Board, GameResult } from "..";
import {
    createInitialGameState,
    cloneGameState,
    switchPlayer,
    updateMoveCounters,
    addMoveToHistory,
    addPositionToHistory,
} from "./game-state";
import { isValidMove } from "./move-validation";
import { isKingInCheck } from "../rules/check-detection";
import {
    updateCastlingRights,
    getCastlingMoves,
    isCastlingMove,
    getCastlingType,
} from "../rules/castling";
import { evaluateDrawConditions } from "../rules/draw-conditions";
import { getPieceAt, setPieceAt } from "../board";
import { getPieceMoves } from "../pieces";
import type { Piece, PieceType } from "../types";

export class Chess {
    private constructor(private state: GameState) {}

    static newGame(): Chess {
        return new Chess(createInitialGameState());
    }

    static fromState(state: GameState): Chess {
        return new Chess(cloneGameState(state));
    }

    getState(): Readonly<GameState> {
        return cloneGameState(this.state);
    }

    getBoard(): Board {
        return this.state.board.map((rank: (Piece | null)[]) => [...rank]);
    }

    getCurrentPlayer(): Color {
        return this.state.currentPlayer;
    }

    getMoveHistory(): Move[] {
        return [...this.state.moveHistory];
    }

    makeMove(
        from: Square,
        to: Square,
        promotionPiece?: PieceType,
    ): Chess | null {
        if (!isValidMove(this.state, from, to)) {
            return null;
        }

        const piece = getPieceAt(this.state.board, from);
        if (!piece) return null;

        if (promotionPiece && !this.isValidPromotionPiece(promotionPiece)) {
            return null;
        }

        if (isCastlingMove(from, to, piece.type)) {
            return this.makeCastlingMove(from, to);
        }

        if (this.isEnPassantMove(from, to, piece)) {
            return this.makeEnPassantMove(from, to);
        }

        return this.makeRegularMove(from, to, promotionPiece);
    }

    private makeRegularMove(
        from: Square,
        to: Square,
        promotionPiece?: PieceType,
    ): Chess | null {
        const piece = getPieceAt(this.state.board, from);
        if (!piece) return null;

        const capturedPiece = getPieceAt(this.state.board, to);

        // Check if this is a promotion move
        const isPromotion =
            piece.type === "PAWN" &&
            ((piece.color === "WHITE" && to.rank === 7) ||
                (piece.color === "BLACK" && to.rank === 0));

        let finalPromotionPiece = promotionPiece;
        if (isPromotion) {
            if (promotionPiece && !this.isValidPromotionPiece(promotionPiece)) {
                return null;
            }

            if (!promotionPiece) {
                finalPromotionPiece = "QUEEN";
            }
        }

        const move: Move = {
            from,
            to,
            piece,
            captured: capturedPiece || undefined,
            promotion: isPromotion ? finalPromotionPiece : undefined,
        };

        const newBoard = this.applyMoveToBoard(this.state.board, move);

        const newCastlingRights = updateCastlingRights(
            this.state.castlingRights,
            from,
            to,
            piece.type,
            piece.color,
            capturedPiece?.type,
            capturedPiece?.color,
        );

        const { halfmoveClock, fullmoveNumber } = updateMoveCounters(
            this.state,
            move,
            capturedPiece !== null || piece.type === "PAWN",
        );

        const enPassantTarget = this.getEnPassantTarget(from, to, piece);

        const newState: GameState = {
            ...this.state,
            board: newBoard,
            currentPlayer: switchPlayer(this.state.currentPlayer),
            moveHistory: addMoveToHistory(this.state, move),
            castlingRights: newCastlingRights,
            halfmoveClock,
            fullmoveNumber,
            enPassantTarget,
            positionHistory: [], // Will be updated below
        };

        // Add position to history
        newState.positionHistory = addPositionToHistory(this.state, newState);

        return new Chess(newState);
    }

    private makeCastlingMove(from: Square, to: Square): Chess | null {
        const piece = getPieceAt(this.state.board, from);
        if (!piece || piece.type !== "KING") return null;

        const castlingType = getCastlingType(from, to);
        if (!castlingType) return null;

        const color = piece.color;
        const isKingside = castlingType === "KINGSIDE";
        const rookFromFile = isKingside ? 7 : 0;
        const rookToFile = isKingside ? 5 : 3;
        const rank = color === "WHITE" ? 0 : 7;

        const rookFrom = { file: rookFromFile, rank };
        const rookTo = { file: rookToFile, rank };
        const rook = getPieceAt(this.state.board, rookFrom);

        if (!rook || rook.type !== "ROOK" || rook.color !== color) {
            return null;
        }

        const move: Move = {
            from,
            to,
            piece,
            castling: castlingType,
        };

        // Apply castling to board (move both king and rook)
        let newBoard = setPieceAt(this.state.board, from, null);
        newBoard = setPieceAt(newBoard, rookFrom, null);
        newBoard = setPieceAt(newBoard, to, piece);
        newBoard = setPieceAt(newBoard, rookTo, rook);

        // Update castling rights (lose all rights for this color after castling)
        const newCastlingRights = updateCastlingRights(
            this.state.castlingRights,
            from,
            to,
            piece.type,
            piece.color,
        );

        const { halfmoveClock, fullmoveNumber } = updateMoveCounters(
            this.state,
            move,
            false, // Castling is not a pawn move or capture
        );

        const newState: GameState = {
            ...this.state,
            board: newBoard,
            currentPlayer: switchPlayer(this.state.currentPlayer),
            moveHistory: addMoveToHistory(this.state, move),
            castlingRights: newCastlingRights,
            halfmoveClock,
            fullmoveNumber,
            enPassantTarget: null,
            positionHistory: [], // Will be updated below
        };

        // Add position to history
        newState.positionHistory = addPositionToHistory(this.state, newState);

        return new Chess(newState);
    }

    private applyMoveToBoard(board: Board, move: Move): Board {
        let newBoard = setPieceAt(board, move.from, null);

        // Handle pawn promotion
        let pieceToPlace = move.piece;
        if (move.promotion) {
            // Use the specified promotion piece
            pieceToPlace = {
                type: move.promotion,
                color: move.piece.color,
            };
        }

        newBoard = setPieceAt(newBoard, move.to, pieceToPlace);
        return newBoard;
    }

    private isEnPassantMove(from: Square, to: Square, piece: Piece): boolean {
        if (piece.type !== "PAWN") return false;
        if (!this.state.enPassantTarget) return false;

        return (
            to.file === this.state.enPassantTarget.file &&
            to.rank === this.state.enPassantTarget.rank
        );
    }

    private makeEnPassantMove(from: Square, to: Square): Chess | null {
        const piece = getPieceAt(this.state.board, from);
        if (!piece || piece.type !== "PAWN") return null;
        if (!this.state.enPassantTarget) return null;

        // Determine the captured pawn's position
        const capturedPawnRank = piece.color === "WHITE" ? 4 : 3;
        const capturedPawnSquare = {
            file: this.state.enPassantTarget.file,
            rank: capturedPawnRank,
        };

        const capturedPawn = getPieceAt(this.state.board, capturedPawnSquare);
        if (!capturedPawn || capturedPawn.type !== "PAWN") return null;

        const move: Move = {
            from,
            to,
            piece,
            captured: capturedPawn,
            enPassant: true,
        };

        // Apply en passant move to board
        let newBoard = setPieceAt(this.state.board, from, null);
        newBoard = setPieceAt(newBoard, capturedPawnSquare, null); // Remove captured pawn
        newBoard = setPieceAt(newBoard, to, piece); // Place moving pawn

        // Check if this move would leave king in check
        if (isKingInCheck(newBoard, this.state.currentPlayer)) {
            return null;
        }

        // Update castling rights (shouldn't change for en passant, but be consistent)
        const newCastlingRights = updateCastlingRights(
            this.state.castlingRights,
            from,
            to,
            piece.type,
            piece.color,
        );

        const { halfmoveClock, fullmoveNumber } = updateMoveCounters(
            this.state,
            move,
            true, // En passant is a pawn move and capture
        );

        const newState: GameState = {
            ...this.state,
            board: newBoard,
            currentPlayer: switchPlayer(this.state.currentPlayer),
            moveHistory: addMoveToHistory(this.state, move),
            castlingRights: newCastlingRights,
            halfmoveClock,
            fullmoveNumber,
            enPassantTarget: null, // Clear en passant target after use
            positionHistory: [], // Will be updated below
        };

        // Add position to history
        newState.positionHistory = addPositionToHistory(this.state, newState);

        return new Chess(newState);
    }

    private getEnPassantTarget(
        from: Square,
        to: Square,
        piece: Piece,
    ): Square | null {
        if (piece.type !== "PAWN") return null;

        const twoSquareMove = Math.abs(to.rank - from.rank) === 2;
        if (!twoSquareMove) return null;

        const startRank = piece.color === "WHITE" ? 1 : 6;
        if (from.rank !== startRank) return null;

        const targetRank = piece.color === "WHITE" ? 2 : 5;
        return { file: to.file, rank: targetRank };
    }

    private isValidPromotionPiece(piece: PieceType): boolean {
        return (
            piece === "QUEEN" ||
            piece === "ROOK" ||
            piece === "BISHOP" ||
            piece === "KNIGHT"
        );
    }

    requiresPromotion(from: Square, to: Square): boolean {
        const piece = getPieceAt(this.state.board, from);
        if (!piece || piece.type !== "PAWN") return false;

        return (
            (piece.color === "WHITE" && to.rank === 7) ||
            (piece.color === "BLACK" && to.rank === 0)
        );
    }

    isPromotionMove(from: Square, to: Square): boolean {
        const piece = getPieceAt(this.state.board, from);
        if (!piece || piece.type !== "PAWN") return false;

        return (
            (piece.color === "WHITE" && to.rank === 7) ||
            (piece.color === "BLACK" && to.rank === 0)
        );
    }

    getPromotionMoves(from: Square, to: Square): Move[] {
        if (!this.isPromotionMove(from, to)) return [];

        const piece = getPieceAt(this.state.board, from);
        if (!piece) return [];

        const capturedPiece = getPieceAt(this.state.board, to);
        const promotionPieces: PieceType[] = [
            "QUEEN",
            "ROOK",
            "BISHOP",
            "KNIGHT",
        ];

        return promotionPieces.map((promotionType) => ({
            from,
            to,
            piece,
            captured: capturedPiece || undefined,
            promotion: promotionType,
        }));
    }

    getValidMoves(): Move[] {
        const moves: Move[] = [];

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const from = { file, rank };
                const piece = getPieceAt(this.state.board, from);

                if (piece && piece.color === this.state.currentPlayer) {
                    const possibleMoves = getPieceMoves(
                        this.state.board,
                        from,
                        this.state.enPassantTarget,
                    );

                    for (const to of possibleMoves) {
                        if (isValidMove(this.state, from, to)) {
                            // Check if this is a promotion move
                            if (this.isPromotionMove(from, to)) {
                                // Add all promotion options
                                const promotionMoves = this.getPromotionMoves(
                                    from,
                                    to,
                                );
                                moves.push(...promotionMoves);
                            } else {
                                // Regular move
                                moves.push({
                                    from,
                                    to,
                                    piece,
                                    captured:
                                        getPieceAt(this.state.board, to) ||
                                        undefined,
                                });
                            }
                        }
                    }
                }
            }
        }

        // Add castling moves
        const castlingMoves = getCastlingMoves(
            this.state.board,
            this.state.currentPlayer,
            this.state.castlingRights,
            this.isInCheck(),
        );

        for (const castlingTo of castlingMoves) {
            const kingSquare = {
                file: 4,
                rank: this.state.currentPlayer === "WHITE" ? 0 : 7,
            };
            const king = getPieceAt(this.state.board, kingSquare);

            if (king && king.type === "KING") {
                const castlingType = getCastlingType(kingSquare, castlingTo);

                moves.push({
                    from: kingSquare,
                    to: castlingTo,
                    piece: king,
                    castling: castlingType || undefined,
                });
            }
        }

        return moves;
    }

    isInCheck(): boolean {
        return isKingInCheck(this.state.board, this.state.currentPlayer);
    }

    getGameResult(): GameResult {
        const validMoves = this.getValidMoves();

        if (validMoves.length === 0) {
            if (this.isInCheck()) {
                // Checkmate
                return this.state.currentPlayer === "WHITE"
                    ? "BLACK_WINS"
                    : "WHITE_WINS";
            }
            // Stalemate
            return "DRAW";
        }

        // Check for draw conditions
        if (evaluateDrawConditions(this.state, validMoves, this.isInCheck())) {
            return "DRAW";
        }

        return "ONGOING";
    }

    isGameOver(): boolean {
        return this.getGameResult() !== "ONGOING";
    }
}
