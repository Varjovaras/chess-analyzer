import type { GameState, Move, Square, Color, Board, GameResult } from "../types";
import { createInitialGameState, cloneGameState, switchPlayer, updateMoveCounters, addMoveToHistory } from "./game-state";
import { isValidMove, simulateMove } from "./move-validation";
import { isKingInCheck } from "../rules/check-detection";
import { updateCastlingRights, getCastlingMoves, isCastlingMove, getCastlingType } from "../rules/castling";
import { evaluateDrawConditions } from "../rules/draw-conditions";
import { getPieceAt, setPieceAt } from "../board";
import { getPieceMoves } from "../pieces";

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
        return this.state.board.map((rank) => [...rank]);
    }

    getCurrentPlayer(): Color {
        return this.state.currentPlayer;
    }

    getMoveHistory(): Move[] {
        return [...this.state.moveHistory];
    }

    makeMove(from: Square, to: Square): Chess | null {
        if (!isValidMove(this.state, from, to)) {
            return null;
        }

        const piece = getPieceAt(this.state.board, from);
        if (!piece) return null;

        // Check if this is a castling move
        if (isCastlingMove(from, to, piece.type)) {
            return this.makeCastlingMove(from, to);
        }

        // Regular move
        return this.makeRegularMove(from, to);
    }

    private makeRegularMove(from: Square, to: Square): Chess | null {
        const piece = getPieceAt(this.state.board, from);
        if (!piece) return null;

        const capturedPiece = getPieceAt(this.state.board, to);
        const move: Move = {
            from,
            to,
            piece,
            captured: capturedPiece || undefined,
        };

        const newBoard = this.applyMoveToBoard(this.state.board, move);

        // Update castling rights
        const newCastlingRights = updateCastlingRights(
            this.state.castlingRights,
            from,
            to,
            piece.type,
            piece.color,
            capturedPiece?.type,
            capturedPiece?.color
        );

        // Update move counters
        const { halfmoveClock, fullmoveNumber } = updateMoveCounters(
            this.state,
            move,
            capturedPiece !== null || piece.type === "PAWN"
        );

        const newState: GameState = {
            ...this.state,
            board: newBoard,
            currentPlayer: switchPlayer(this.state.currentPlayer),
            moveHistory: addMoveToHistory(this.state, move),
            castlingRights: newCastlingRights,
            halfmoveClock,
            fullmoveNumber,
            enPassantTarget: null, // TODO: Implement en passant
        };

        return new Chess(newState);
    }

    private makeCastlingMove(from: Square, to: Square): Chess | null {
        const piece = getPieceAt(this.state.board, from);
        if (!piece || piece.type !== "KING") return null;

        const castlingType = getCastlingType(from, to);
        if (!castlingType) return null;

        const color = piece.color;
        const isKingside = castlingType === 'KINGSIDE';
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
            castling: castlingType
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
            piece.color
        );

        const { halfmoveClock, fullmoveNumber } = updateMoveCounters(
            this.state,
            move,
            false // Castling is not a pawn move or capture
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
        };

        return new Chess(newState);
    }

    private applyMoveToBoard(board: Board, move: Move): Board {
        let newBoard = setPieceAt(board, move.from, null);

        // Handle pawn promotion
        let pieceToPlace = move.piece;
        if (move.piece.type === "PAWN") {
            const isPromotion = (move.piece.color === "WHITE" && move.to.rank === 7) ||
                (move.piece.color === "BLACK" && move.to.rank === 0);

            if (isPromotion) {
                // Default promotion to queen
                pieceToPlace = {
                    type: "QUEEN",
                    color: move.piece.color
                };
            }
        }

        newBoard = setPieceAt(newBoard, move.to, pieceToPlace);
        return newBoard;
    }

    getValidMoves(): Move[] {
        const moves: Move[] = [];

        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const from = { file, rank };
                const piece = getPieceAt(this.state.board, from);

                if (piece && piece.color === this.state.currentPlayer) {
                    const possibleMoves = getPieceMoves(this.state.board, from);

                    for (const to of possibleMoves) {
                        if (isValidMove(this.state, from, to)) {
                            moves.push({
                                from,
                                to,
                                piece,
                                captured: getPieceAt(this.state.board, to) || undefined,
                            });
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
            this.isInCheck()
        );

        for (const castlingTo of castlingMoves) {
            const kingSquare = { file: 4, rank: this.state.currentPlayer === "WHITE" ? 0 : 7 };
            const king = getPieceAt(this.state.board, kingSquare);
            
            if (king && king.type === "KING") {
                const castlingType = getCastlingType(kingSquare, castlingTo);
                
                moves.push({
                    from: kingSquare,
                    to: castlingTo,
                    piece: king,
                    castling: castlingType || undefined
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