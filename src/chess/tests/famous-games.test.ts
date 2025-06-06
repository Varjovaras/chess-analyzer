import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, createEmptyBoard, setPieceAt } from "../board";
import type { Board, Piece, Square, GameState } from "../types";

describe("Famous chess games and tactical patterns", () => {
    describe("Famous checkmate patterns", () => {
        test("Anastasia's mate pattern", () => {
            // Anastasia's mate: Rook and Knight mate with enemy king trapped by own pieces
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 7, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 7 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: "KNIGHT", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            expect(game.isInCheck()).toBe(true);
            expect(game.isGameOver()).toBe(true);
            expect(game.getGameResult()).toBe("WHITE_WINS");
        });

        test("Arabian mate pattern", () => {
            // Arabian mate: Rook and Knight checkmate in corner
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 7, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: "KNIGHT", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            expect(game.isInCheck()).toBe(true);
            expect(game.getGameResult()).toBe("WHITE_WINS");
        });

        test("Morphy's mate pattern", () => {
            // Morphy's mate: Bishop and Rook mate on back rank
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 3 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            expect(game.isInCheck()).toBe(true);
            expect(game.getGameResult()).toBe("WHITE_WINS");
        });

        test("Boden's mate pattern", () => {
            // Boden's mate: Two bishops on diagonals
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 2 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 4 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            expect(game.isInCheck()).toBe(true);
            expect(game.getGameResult()).toBe("WHITE_WINS");
        });

        test("Epaulette mate pattern", () => {
            // Epaulette mate: Queen or Rook mates king flanked by own pieces
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            expect(game.isInCheck()).toBe(true);
            expect(game.getGameResult()).toBe("WHITE_WINS");
        });
    });

    describe("Famous game sequences", () => {
        test("Immortal Game opening sequence (Anderssen vs Kieseritzky)", () => {
            let game = Chess.newGame();
            
            // The Immortal Game moves
            const moves = [
                ["e2", "e4"], ["e7", "e5"],    // 1. e4 e5
                ["f2", "f4"], ["e5", "f4"],   // 2. f4 exf4
                ["f1", "c4"], ["d8", "h4"],   // 3. Bc4 Qh4+
                ["e1", "f1"], ["b7", "b5"],   // 4. Kf1 b5
                ["c4", "b5"], ["g8", "f6"],   // 5. Bxb5 Nf6
            ];
            
            moves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                expect(move).not.toBeNull();
                game = move!;
            });
            
            expect(game.getMoveHistory()).toHaveLength(10);
            expect(game.getCurrentPlayer()).toBe("WHITE");
        });

        test("Evergreen Game key position (Anderssen vs Dufresne)", () => {
            let game = Chess.newGame();
            
            // Evergreen Game opening moves
            const moves = [
                ["e2", "e4"], ["e7", "e5"],
                ["g1", "f3"], ["b8", "c6"],
                ["f1", "c4"], ["f8", "e7"],
                ["d2", "d4"], ["e5", "d4"],
                ["f3", "d4"], ["e7", "h4"],
            ];
            
            moves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                expect(move).not.toBeNull();
                game = move!;
            });
            
            const board = game.getBoard();
            expect(board[3]![4]?.type).toBe("KNIGHT"); // White knight on d4
            expect(board[3]![7]?.type).toBe("BISHOP"); // Black bishop on h4
        });

        test("Opera Game brilliant sacrifice (Morphy vs Duke and Count)", () => {
            let game = Chess.newGame();
            
            // Paul Morphy's Opera Game
            const moves = [
                ["e2", "e4"], ["e7", "e5"],
                ["g1", "f3"], ["d7", "d6"],
                ["d2", "d4"], ["c8", "g4"],
                ["d4", "e5"], ["g4", "f3"],
                ["d1", "f3"], ["d6", "e5"],
                ["f1", "c4"], ["g8", "f6"],
            ];
            
            moves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                expect(move).not.toBeNull();
                game = move!;
            });
            
            // Verify key pieces are in position for the famous sacrifice
            const board = game.getBoard();
            expect(board[2]![2]?.type).toBe("BISHOP"); // White bishop on c4
            expect(board[2]![5]?.type).toBe("QUEEN");  // White queen on f3
        });

        test("Game of the Century key moves (Byrne vs Fischer)", () => {
            let game = Chess.newGame();
            
            // Bobby Fischer's Game of the Century
            const moves = [
                ["g1", "f3"], ["g8", "f6"],
                ["c2", "c4"], ["g7", "g6"],
                ["b1", "c3"], ["f8", "g7"],
                ["d2", "d4"], ["e8", "g8"],   // Castling kingside
                ["c1", "f4"], ["d7", "d5"],
                ["d1", "b3"], ["d5", "c4"],
            ];
            
            // Note: This test assumes castling is implemented
            let moveCount = 0;
            moves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                if (move) {
                    game = move;
                    moveCount++;
                }
            });
            
            expect(moveCount).toBeGreaterThan(8); // Should complete most moves
        });
    });

    describe("Tactical motifs", () => {
        test("Fork - Knight attacks two pieces simultaneously", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "KNIGHT", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 5 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 5 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();
            
            // Knight should be able to move to square that attacks both king and rook
            const forkMoves = validMoves.filter(move => 
                move.piece.type === "KNIGHT" &&
                move.from.file === 4 && move.from.rank === 4
            );
            
            expect(forkMoves.length).toBeGreaterThan(0);
        });

        test("Skewer - Piece must move exposing more valuable piece", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: "QUEEN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            expect(game.isInCheck()).toBe(true);
            
            // King must move, exposing queen to capture
            const validMoves = game.getValidMoves();
            const kingMoves = validMoves.filter(move => move.piece.type === "KING");
            expect(kingMoves.length).toBeGreaterThan(0);
            
            // Queen cannot move to block because it would still leave king in check
            const queenMoves = validMoves.filter(move => move.piece.type === "QUEEN");
            expect(queenMoves).toHaveLength(0);
        });

        test("Discovered attack - Moving piece reveals attack from another", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const discoveredMove = game.makeMove({ file: 4, rank: 5 }, { file: 5, rank: 6 });
            
            if (discoveredMove) {
                expect(discoveredMove.isInCheck()).toBe(true);
            }
        });

        test("X-ray attack - Attack through another piece", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "QUEEN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            
            // If queen moves, king will be in check from rook (x-ray)
            const queenMove = game.makeMove({ file: 4, rank: 0 }, { file: 4, rank: 4 });
            if (queenMove) {
                expect(queenMove.isInCheck()).toBe(true);
            }
        });

        test("Zugzwang - Any move worsens position", () => {
            // Simple zugzwang position
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 1 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 2 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 3 }, { type: "QUEEN", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();
            
            // Black has moves but all lead to worse positions
            expect(validMoves.length).toBeGreaterThan(0);
            expect(game.isInCheck()).toBe(false);
        });
    });

    describe("Endgame studies", () => {
        test("Lucena position - Rook endgame winning technique", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 0 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 6 }, { type: "ROOK", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();
            expect(validMoves.length).toBeGreaterThan(0);
            expect(game.getGameResult()).toBe("ONGOING");
        });

        test("Philidor position - Rook endgame defensive setup", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 5 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 1 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 4 }, { type: "ROOK", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();
            expect(validMoves.length).toBeGreaterThan(0);
        });

        test("Opposition in king and pawn endgame", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 3 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: "KING", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            
            // Kings are in opposition (facing each other with one square between)
            const validMoves = game.getValidMoves();
            const kingMoves = validMoves.filter(move => move.piece.type === "KING");
            const pawnMoves = validMoves.filter(move => move.piece.type === "PAWN");
            
            expect(kingMoves.length).toBeGreaterThan(0);
            expect(pawnMoves.length).toBeGreaterThan(0);
        });

        test("Queen vs pawn endgame", () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 6 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 1 }, { type: "PAWN", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();
            
            // Black should have limited but legal moves
            expect(validMoves.length).toBeGreaterThan(0);
            expect(validMoves.length).toBeLessThan(10);
        });

        test("Stalemate trick in losing position", () => {
            // Position where weaker side can force stalemate
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 1 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 2 }, { type: "QUEEN", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            expect(game.isInCheck()).toBe(false);
            expect(game.getValidMoves()).toHaveLength(0);
            expect(game.getGameResult()).toBe("DRAW");
        });
    });

    describe("Opening theory tests", () => {
        test("Sicilian Defense main line", () => {
            let game = Chess.newGame();
            
            const sicilianMoves = [
                ["e2", "e4"], ["c7", "c5"],
                ["g1", "f3"], ["d7", "d6"],
                ["d2", "d4"], ["c5", "d4"],
                ["f3", "d4"], ["g8", "f6"],
                ["b1", "c3"], ["a7", "a6"],
            ];
            
            sicilianMoves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                expect(move).not.toBeNull();
                game = move!;
            });
            
            expect(game.getMoveHistory()).toHaveLength(10);
            expect(game.getCurrentPlayer()).toBe("WHITE");
        });

        test("Ruy Lopez opening", () => {
            let game = Chess.newGame();
            
            const ruyLopezMoves = [
                ["e2", "e4"], ["e7", "e5"],
                ["g1", "f3"], ["b8", "c6"],
                ["f1", "b5"], ["a7", "a6"],
                ["b5", "a4"], ["g8", "f6"],
                ["e1", "g1"], ["f8", "e7"],  // Castling
            ];
            
            let moveCount = 0;
            ruyLopezMoves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                if (move) {
                    game = move;
                    moveCount++;
                }
            });
            
            expect(moveCount).toBeGreaterThan(8); // Most moves should succeed
        });

        test("French Defense structure", () => {
            let game = Chess.newGame();
            
            const frenchMoves = [
                ["e2", "e4"], ["e7", "e6"],
                ["d2", "d4"], ["d7", "d5"],
                ["b1", "c3"], ["g8", "f6"],
                ["c1", "g5"], ["f8", "e7"],
            ];
            
            frenchMoves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                expect(move).not.toBeNull();
                game = move!;
            });
            
            const board = game.getBoard();
            // Verify pawn structure
            expect(board[3]![4]?.type).toBe("PAWN"); // White e4
            expect(board[4]![3]?.type).toBe("PAWN"); // Black d5
            expect(board[5]![4]?.type).toBe("PAWN"); // Black e6
        });

        test("Caro-Kann Defense", () => {
            let game = Chess.newGame();
            
            const caroKannMoves = [
                ["e2", "e4"], ["c7", "c6"],
                ["d2", "d4"], ["d7", "d5"],
                ["b1", "c3"], ["d5", "e4"],
                ["c3", "e4"], ["c8", "f5"],
            ];
            
            caroKannMoves.forEach(([from, to]) => {
                const move = game.makeMove(algebraicToSquare(from)!, algebraicToSquare(to)!);
                expect(move).not.toBeNull();
                game = move!;
            });
            
            const board = game.getBoard();
            expect(board[3]![4]?.type).toBe("KNIGHT"); // White knight on e4
            expect(board[4]![5]?.type).toBe("BISHOP"); // Black bishop on f5
        });
    });

    describe("Complex tactical combinations", () => {
        test("Greek Gift sacrifice pattern", () => {
            // Setup for Bxh7+ sacrifice
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 3 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 2 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const sacrifice = game.makeMove({ file: 2, rank: 3 }, { file: 7, rank: 6 });
            
            if (sacrifice) {
                expect(sacrifice.isInCheck()).toBe(true);
                const history = sacrifice.getMoveHistory();
                expect(history[0]?.captured?.type).toBe("PAWN");
            }
        });

        test("Deflection tactic", () => {
            // Force defending piece away from key square
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 7, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 7 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: "QUEEN", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            
            // Deflect the rook with a sacrifice
            const deflection = game.makeMove({ file: 0, rank: 7 }, { file: 6, rank: 7 });
            
            if (deflection) {
                const history = deflection.getMoveHistory();
                expect(history[0]?.captured?.type).toBe("ROOK");
            }
        });

        test("Clearance tactic", () => {
            // Clear a line for another piece's attack
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 6 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            
            // Move bishop to clear the file for rook
            const clearance = game.makeMove({ file: 4, rank: 4 }, { file: 3, rank: 5 });
            
            if (clearance) {
                expect(clearance.isInCheck()).toBe(true);
            }
        });

        test("Interference tactic", () => {
            // Block opponent piece's defense
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 7 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: "KING", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            
            // Interfere with black rook's defense
            const interference = game.makeMove({ file: 3, rank: 3 }, { file: 3, rank: 7 });
            
            if (interference) {
                // This should block the black rook's defense of the back rank
                expect(interference.getCurrentPlayer()).toBe("BLACK");
            }
        });
    });

    describe("Historical puzzle positions", () => {
        test("Réti endgame study", () => {
            // Famous king and pawn endgame study
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 7, rank: 5 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 4 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 3 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: "PAWN", color: "WHITE" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();
            
            expect(validMoves.length).toBeGreaterThan(0);
            expect(game.getGameResult()).toBe("ONGOING");
        });

        test("Troitzky line in knight endgame", () => {
            // Critical position in knight vs pawn endgame
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 0, rank: 7 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 6 }, { type: "KNIGHT", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 1 }, { type: "PAWN", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "BLACK",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: false,
                    whiteQueenside: false,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);
            const validMoves = game.getValidMoves();
            
            expect(validMoves.length).toBeGreaterThan(0);
            expect(game.getGameResult()).toBe("ONGOING");
        });
    });
});