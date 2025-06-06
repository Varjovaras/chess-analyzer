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

    /**
     * Creates a new chess game
     */
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

    /**
     * Creates a chess game from a given state
     */
    static fromState(state: GameState): Chess {
        return new Chess({ ...state });
    }

    /**
     * Gets the current game state (immutable)
     */
    getState(): Readonly<GameState> {
        return { ...this.state };
    }

    /**
     * Gets the current board
     */
    getBoard(): Board {
        return this.state.board.map((rank) => [...rank]);
    }

    /**
     * Gets the current player to move
     */
    getCurrentPlayer(): Color {
        return this.state.currentPlayer;
    }

    /**
     * Gets the move history
     */
    getMoveHistory(): Move[] {
        return [...this.state.moveHistory];
    }

    /**
     * Attempts to make a move, returns new Chess instance or null if invalid
     */
    makeMove(from: Square, to: Square): Chess | null {
        const piece = getPieceAt(this.state.board, from);

        // Basic validation
        if (!piece) return null;
        if (piece.color !== this.state.currentPlayer) return null;
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

        const newState: GameState = {
            ...this.state,
            board: newBoard,
            currentPlayer:
                this.state.currentPlayer === "WHITE" ? "BLACK" : "WHITE",
            moveHistory: [...this.state.moveHistory, move],
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

        return moves;
    }

    /**
     * Checks if the current player is in check
     */
    isInCheck(): boolean {
        return this.isKingInCheck(this.state.board, this.state.currentPlayer);
    }

    /**
     * Checks if the game is over and returns the result
     */
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

    /**
     * Checks if the game is over
     */
    isGameOver(): boolean {
        return this.getGameResult() !== "ONGOING";
    }

    /**
     * Private helper: applies a move to the board
     */
    private applyMoveToBoard(board: Board, move: Move): Board {
        let newBoard = setPieceAt(board, move.from, null);
        newBoard = setPieceAt(newBoard, move.to, move.piece);
        return newBoard;
    }

    /**
     * Private helper: checks if a king is in check
     */
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
}
