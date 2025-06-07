import type {
    GameState,
    Move,
    Square,
    Color,
    GameResult,
    Board,
} from "./types";
import { createInitialBoard, getPieceAt, setPieceAt, findKing } from "./board";
import { getPieceMoves, isValidPieceMove } from "./pieces";

export class Chess {
    private constructor(private state: GameState) {}


    static newGame(): Chess {
        const initialState: GameState = {
            board: createInitialBoard(),
            currentPlayer: "WHITE",
            moveHistory: [],
            castlingRights: {
                whiteKingside: true,
                whiteQueenside: true,
                blackKingside: true,
                blackQueenside: true,
            },
            enPassantTarget: null,
            halfmoveClock: 0,
            fullmoveNumber: 1,
        };

        return new Chess(initialState);
    }


    static fromState(state: GameState): Chess {
        return new Chess({ ...state });
    }


    getState(): Readonly<GameState> {
        return { ...this.state };
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
        const piece = getPieceAt(this.state.board, from);

        // Basic validation
        if (!piece) return null;
        if (piece.color !== this.state.currentPlayer) return null;

        // Check if this is a castling move
        const isCastlingMove = piece.type === "KING" && Math.abs(to.file - from.file) === 2;
        
        if (isCastlingMove) {
            return this.makeCastlingMove(from, to);
        }

        if (!isValidPieceMove(this.state.board, from, to)) return null;

        const capturedPiece = getPieceAt(this.state.board, to);
        const move: Move = {
            from,
            to,
            piece,
            captured: capturedPiece || undefined,
        };

        const newBoard = this.applyMoveToBoard(this.state.board, move);

        if (this.isKingInCheck(newBoard, this.state.currentPlayer)) {
            return null;
        }

        // Update castling rights
        const newCastlingRights = this.updateCastlingRights(move);

        const newState: GameState = {
            ...this.state,
            board: newBoard,
            currentPlayer:
                this.state.currentPlayer === "WHITE" ? "BLACK" : "WHITE",
            moveHistory: [...this.state.moveHistory, move],
            castlingRights: newCastlingRights,
            halfmoveClock:
                capturedPiece || piece.type === "PAWN"
                    ? 0
                    : this.state.halfmoveClock + 1,
            fullmoveNumber:
                this.state.currentPlayer === "BLACK"
                    ? this.state.fullmoveNumber + 1
                    : this.state.fullmoveNumber,
            enPassantTarget: null, // TODO: Handle en passant
        };

        return new Chess(newState);
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
                        const testMove = this.makeMove(from, to);
                        if (testMove) {
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

        // Add castling moves
        moves.push(...this.getCastlingMoves());

        return moves;
    }

    isInCheck(): boolean {
        return this.isKingInCheck(this.state.board, this.state.currentPlayer);
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

        // Check for draw by 50-move rule
        if (this.state.halfmoveClock >= 100) {
            return "DRAW";
        }

        return "ONGOING";
    }


    isGameOver(): boolean {
        return this.getGameResult() !== "ONGOING";
    }


    private applyMoveToBoard(board: Board, move: Move): Board {
        let newBoard = setPieceAt(board, move.from, null);
        newBoard = setPieceAt(newBoard, move.to, move.piece);
        return newBoard;
    }


    private isKingInCheck(board: Board, color: Color): boolean {
        const kingSquare = findKing(board, color);
        if (!kingSquare) return false;

        const opponentColor = color === "WHITE" ? "BLACK" : "WHITE";

        // Check if any opponent piece can attack the king
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const square = { file, rank };
                const piece = getPieceAt(board, square);

                if (piece && piece.color === opponentColor) {
                    const moves = getPieceMoves(board, square);
                    if (
                        moves.some(
                            (move) =>
                                move.file === kingSquare.file &&
                                move.rank === kingSquare.rank,
                        )
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private getCastlingMoves(): Move[] {
        const moves: Move[] = [];
        
        // Can't castle if in check
        if (this.isInCheck()) {
            return moves;
        }

        const color = this.state.currentPlayer;
        const kingRank = color === "WHITE" ? 0 : 7;
        const kingSquare = { file: 4, rank: kingRank };

        // Verify king is in starting position
        const king = getPieceAt(this.state.board, kingSquare);
        if (!king || king.type !== "KING" || king.color !== color) {
            return moves;
        }

        // Check kingside castling
        if (this.canCastleKingside(color)) {
            const castlingMove: Move = {
                from: kingSquare,
                to: { file: 6, rank: kingRank },
                piece: king,
                castling: 'KINGSIDE'
            };
            moves.push(castlingMove);
        }

        // Check queenside castling
        if (this.canCastleQueenside(color)) {
            const castlingMove: Move = {
                from: kingSquare,
                to: { file: 2, rank: kingRank },
                piece: king,
                castling: 'QUEENSIDE'
            };
            moves.push(castlingMove);
        }

        return moves;
    }

    private canCastleKingside(color: Color): boolean {
        const rights = color === "WHITE" ? this.state.castlingRights.whiteKingside : this.state.castlingRights.blackKingside;
        if (!rights) return false;

        const rank = color === "WHITE" ? 0 : 7;
        
        // Check if rook exists in starting position
        const rookSquare = { file: 7, rank };
        const rook = getPieceAt(this.state.board, rookSquare);
        if (!rook || rook.type !== "ROOK" || rook.color !== color) {
            return false;
        }
        
        // Check if path is clear (f and g files)
        for (let file = 5; file <= 6; file++) {
            if (!this.isSquareEmpty({ file, rank })) {
                return false;
            }
        }

        // Check if king would pass through or land in check
        for (let file = 4; file <= 6; file++) {
            const testSquare = { file, rank };
            if (this.isSquareUnderAttack(testSquare, color === "WHITE" ? "BLACK" : "WHITE")) {
                return false;
            }
        }

        return true;
    }

    private canCastleQueenside(color: Color): boolean {
        const rights = color === "WHITE" ? this.state.castlingRights.whiteQueenside : this.state.castlingRights.blackQueenside;
        if (!rights) return false;

        const rank = color === "WHITE" ? 0 : 7;
        
        // Check if rook exists in starting position
        const rookSquare = { file: 0, rank };
        const rook = getPieceAt(this.state.board, rookSquare);
        if (!rook || rook.type !== "ROOK" || rook.color !== color) {
            return false;
        }
        
        // Check if path is clear (b, c, d files)
        for (let file = 1; file <= 3; file++) {
            if (!this.isSquareEmpty({ file, rank })) {
                return false;
            }
        }

        // Check if king would pass through or land in check (c, d, e files)
        for (let file = 2; file <= 4; file++) {
            const testSquare = { file, rank };
            if (this.isSquareUnderAttack(testSquare, color === "WHITE" ? "BLACK" : "WHITE")) {
                return false;
            }
        }

        return true;
    }

    private isSquareEmpty(square: Square): boolean {
        return getPieceAt(this.state.board, square) === null;
    }

    private isSquareUnderAttack(square: Square, byColor: Color): boolean {
        // Check if any piece of the given color can attack the square
        for (let rank = 0; rank < 8; rank++) {
            for (let file = 0; file < 8; file++) {
                const from = { file, rank };
                const piece = getPieceAt(this.state.board, from);

                if (piece && piece.color === byColor) {
                    const moves = getPieceMoves(this.state.board, from);
                    if (moves.some(move => move.file === square.file && move.rank === square.rank)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private makeCastlingMove(from: Square, to: Square): Chess | null {
        const piece = getPieceAt(this.state.board, from);
        if (!piece || piece.type !== "KING") return null;

        const color = piece.color;
        const isKingside = to.file === 6;
        const isQueenside = to.file === 2;

        if (!isKingside && !isQueenside) return null;

        // Validate castling is legal
        if (isKingside && !this.canCastleKingside(color)) return null;
        if (isQueenside && !this.canCastleQueenside(color)) return null;

        const castlingType = isKingside ? 'KINGSIDE' : 'QUEENSIDE';
        const rookFromFile = isKingside ? 7 : 0;
        const rookToFile = isKingside ? 5 : 3;
        const rank = color === "WHITE" ? 0 : 7;

        const rookFrom = { file: rookFromFile, rank };
        const rookTo = { file: rookToFile, rank };
        const rook = getPieceAt(this.state.board, rookFrom);

        if (!rook || rook.type !== "ROOK" || rook.color !== color) {
            return null;
        }

        // Create the castling move
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
        const newCastlingRights = { ...this.state.castlingRights };
        if (color === "WHITE") {
            newCastlingRights.whiteKingside = false;
            newCastlingRights.whiteQueenside = false;
        } else {
            newCastlingRights.blackKingside = false;
            newCastlingRights.blackQueenside = false;
        }

        const newState: GameState = {
            ...this.state,
            board: newBoard,
            currentPlayer: color === "WHITE" ? "BLACK" : "WHITE",
            moveHistory: [...this.state.moveHistory, move],
            castlingRights: newCastlingRights,
            halfmoveClock: this.state.halfmoveClock + 1,
            fullmoveNumber:
                this.state.currentPlayer === "BLACK"
                    ? this.state.fullmoveNumber + 1
                    : this.state.fullmoveNumber,
            enPassantTarget: null,
        };

        return new Chess(newState);
    }

    private updateCastlingRights(move: Move): typeof this.state.castlingRights {
        const newRights = { ...this.state.castlingRights };

        // If king moves, lose all castling rights for that color
        if (move.piece.type === "KING") {
            if (move.piece.color === "WHITE") {
                newRights.whiteKingside = false;
                newRights.whiteQueenside = false;
            } else {
                newRights.blackKingside = false;
                newRights.blackQueenside = false;
            }
        }

        // If rook moves from starting position, lose castling rights for that side
        if (move.piece.type === "ROOK") {
            const { from, piece } = move;
            
            if (piece.color === "WHITE" && from.rank === 0) {
                if (from.file === 0) newRights.whiteQueenside = false;
                if (from.file === 7) newRights.whiteKingside = false;
            } else if (piece.color === "BLACK" && from.rank === 7) {
                if (from.file === 0) newRights.blackQueenside = false;
                if (from.file === 7) newRights.blackKingside = false;
            }
        }

        // If rook is captured, lose castling rights for that side
        if (move.captured?.type === "ROOK") {
            const { to, captured } = move;
            
            if (captured.color === "WHITE" && to.rank === 0) {
                if (to.file === 0) newRights.whiteQueenside = false;
                if (to.file === 7) newRights.whiteKingside = false;
            } else if (captured.color === "BLACK" && to.rank === 7) {
                if (to.file === 0) newRights.blackQueenside = false;
                if (to.file === 7) newRights.blackKingside = false;
            }
        }

        return newRights;
    }
}
