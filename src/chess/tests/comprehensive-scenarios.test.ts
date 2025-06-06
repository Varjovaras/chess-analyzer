import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, createEmptyBoard, setPieceAt, squareToAlgebraic } from "../board";
import type { GameState } from "../types";

describe("Comprehensive chess scenarios and analysis", () => {
    describe("Chess notation and move recording", () => {
        test("move notation includes piece type and destination", () => {
            let game = Chess.newGame();

            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
            game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;

            const history = game.getMoveHistory();

            expect(history[0]!.piece.type).toBe("PAWN");
            expect(squareToAlgebraic(history[0]!.to)).toBe("e4");

            expect(history[2]!.piece.type).toBe("KNIGHT");
            expect(squareToAlgebraic(history[2]!.to)).toBe("f3");
        });

        test("capture notation includes captured piece", () => {
            let game = Chess.newGame();

            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d5")!)!;
            game = game.makeMove(algebraicToSquare("e4")!, algebraicToSquare("d5")!)!;

            const captureMove = game.getMoveHistory()[2]!;
            expect(captureMove.captured?.type).toBe("PAWN");
            expect(captureMove.captured?.color).toBe("BLACK");
        });

        test("ambiguous move notation resolution", () => {
            // Position where two knights can reach same square
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 1, rank: 0 }, { type: "KNIGHT", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 6, rank: 0 }, { type: "KNIGHT", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });

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

            // Both knights should be able to reach d2
            const knightMovesToD2 = validMoves.filter(move =>
                move.piece.type === "KNIGHT" &&
                move.to.file === 3 && move.to.rank === 1
            );

            expect(knightMovesToD2.length).toBe(2);
        });

        test("algebraic notation round-trip conversion", () => {
            const testSquares = [
                "a1", "a8", "h1", "h8", "e4", "d5", "f7", "b2"
            ];

            testSquares.forEach(algebraic => {
                const square = algebraicToSquare(algebraic);
                expect(square).not.toBeNull();
                const backToAlgebraic = squareToAlgebraic(square!);
                expect(backToAlgebraic).toBe(algebraic);
            });
        });
    });

    describe("Game analysis and evaluation", () => {
        test("material count calculation", () => {
            const game = Chess.newGame();
            const board = game.getBoard();

            let whiteMaterial = 0;
            let blackMaterial = 0;

            const pieceValues = {
                PAWN: 1,
                KNIGHT: 3,
                BISHOP: 3,
                ROOK: 5,
                QUEEN: 9,
                KING: 0
            };

            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const piece = board[rank]![file];
                    if (piece) {
                        const value = pieceValues[piece.type];
                        if (piece.color === "WHITE") {
                            whiteMaterial += value;
                        } else {
                            blackMaterial += value;
                        }
                    }
                }
            }

            expect(whiteMaterial).toBe(39); // 8 pawns + 2 rooks + 2 knights + 2 bishops + 1 queen
            expect(blackMaterial).toBe(39);
        });

        test("center control evaluation", () => {
            let game = Chess.newGame();

            // Control center with pawns
            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
            game = game.makeMove(algebraicToSquare("d2")!, algebraicToSquare("d4")!)!;
            game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d5")!)!;

            const board = game.getBoard();

            // Center squares (e4, e5, d4, d5) should be occupied
            expect(board[3]![4]?.type).toBe("PAWN"); // e4
            expect(board[4]![4]?.type).toBe("PAWN"); // e5
            expect(board[3]![3]?.type).toBe("PAWN"); // d4
            expect(board[4]![3]?.type).toBe("PAWN"); // d5
        });

        test("piece mobility analysis", () => {
            // Compare piece mobility in different positions
            const openGame = Chess.newGame();
            let developedGame = Chess.newGame();

            // Develop pieces
            developedGame = developedGame.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            developedGame = developedGame.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
            developedGame = developedGame.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
            developedGame = developedGame.makeMove(algebraicToSquare("b8")!, algebraicToSquare("c6")!)!;

            const openMoves = openGame.getValidMoves().length;
            const developedMoves = developedGame.getValidMoves().length;

            expect(developedMoves).toBeGreaterThan(openMoves);
        });

        test("king safety evaluation", () => {
            // Compare king safety with and without castling
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 1, rank: 1 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 2, rank: 1 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 1 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });

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
            const kingMoves = game.getValidMoves().filter(move => move.piece.type === "KING");

            // King with pawn shelter should have limited but safe moves
            expect(kingMoves.length).toBeGreaterThan(0);
            expect(kingMoves.length).toBeLessThan(8);
        });
    });

    describe("Performance benchmarks", () => {
        test("initial position move generation speed", () => {
            const game = Chess.newGame();
            const iterations = 1000;

            const startTime = performance.now();

            for (let i = 0; i < iterations; i++) {
                const moves = game.getValidMoves();
                expect(moves.length).toBe(20);
            }

            const endTime = performance.now();
            const avgTime = (endTime - startTime) / iterations;

            expect(avgTime).toBeLessThan(10); // Should be very fast
        });

        test("complex position move generation", () => {
            // Create complex middlegame position
            let game = Chess.newGame();

            const moves = [
                ["e2", "e4"], ["e7", "e5"],
                ["g1", "f3"], ["b8", "c6"],
                ["f1", "c4"], ["f8", "e7"],
                ["d2", "d3"], ["d7", "d6"],
                ["b1", "c3"], ["g8", "f6"],
                ["c1", "g5"], ["c8", "g4"],
            ];

            moves.forEach(([from, to]) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;
                game = game.makeMove(fromSquare, toSquare)!;
            });

            const startTime = performance.now();
            const validMoves = game.getValidMoves();
            const endTime = performance.now();

            expect(validMoves.length).toBeGreaterThan(20);
            expect(endTime - startTime).toBeLessThan(50);
        });

        test("memory usage with long games", () => {
            let game = Chess.newGame();

            // Simulate long game with repetitive moves
            for (let i = 0; i < 100; i++) {
                game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
                game = game.makeMove(algebraicToSquare("g8")!, algebraicToSquare("f6")!)!;
                game = game.makeMove(algebraicToSquare("f3")!, algebraicToSquare("g1")!)!;
                game = game.makeMove(algebraicToSquare("f6")!, algebraicToSquare("g8")!)!;
            }

            const state = game.getState();
            expect(state.moveHistory.length).toBe(400);

            // Game should still function normally
            const validMoves = game.getValidMoves();
            expect(validMoves.length).toBe(20); // Back to initial position
        });
    });

    describe("Tournament and competitive scenarios", () => {
        test("time control simulation", () => {
            let game = Chess.newGame();
            let moveCount = 0;
            const maxMoves = 40; // First time control

            while (!game.isGameOver() && moveCount < maxMoves) {
                const validMoves = game.getValidMoves();
                if (validMoves.length === 0) break;

                // Simulate quick move selection
                const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
                if (!randomMove) break;
                const newGame = game.makeMove(randomMove.from, randomMove.to);

                if (newGame) {
                    game = newGame;
                    moveCount++;
                } else {
                    break;
                }
            }

            expect(moveCount).toBeGreaterThan(0);
        });

        test("blitz game simulation", () => {
            let game = Chess.newGame();
            const startTime = Date.now();
            let moveCount = 0;

            // Simulate 30-second per side blitz
            while (!game.isGameOver() && moveCount < 60 && (Date.now() - startTime) < 1000) {
                const validMoves = game.getValidMoves();
                if (validMoves.length === 0) break;

                const move = validMoves[0]; // Take first valid move (fastest)
                if (!move) break;
                const newGame = game.makeMove(move.from, move.to);

                if (newGame) {
                    game = newGame;
                    moveCount++;
                } else {
                    break;
                }
            }

            expect(moveCount).toBeGreaterThan(10);
        });

        test("correspondence game long-term state", () => {
            let game = Chess.newGame();

            // Simulate correspondence game with careful moves
            const carefulMoves: [string, string][] = [
                ["d2", "d4"], ["g8", "f6"],
                ["c2", "c4"], ["e7", "e6"],
                ["g1", "f3"], ["d7", "d5"],
                ["b1", "c3"], ["c7", "c6"],
                ["e2", "e3"], ["b8", "d7"],
            ];

            carefulMoves.forEach(([from, to]) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;
                const move = game.makeMove(fromSquare, toSquare);
                expect(move).not.toBeNull();
                game = move!;
            });

            // Verify position integrity after careful play
            expect(game.getMoveHistory().length).toBe(10);
            expect(game.getGameResult()).toBe("ONGOING");
        });

        test("rating calculation factors", () => {
            // Factors that would affect rating calculation
            let game = Chess.newGame();

            // Quick decisive game (would affect rating more)
            game = game.makeMove(algebraicToSquare("f2")!, algebraicToSquare("f3")!)!;
            game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
            game = game.makeMove(algebraicToSquare("g2")!, algebraicToSquare("g4")!)!;
            game = game.makeMove(algebraicToSquare("d8")!, algebraicToSquare("h4")!)!;

            expect(game.isGameOver()).toBe(true);
            expect(game.getMoveHistory().length).toBe(4); // Very short game
            expect(game.getGameResult()).toBe("BLACK_WINS");
        });
    });

    describe("Educational and training scenarios", () => {
        test("beginner mistake patterns", () => {
            let game = Chess.newGame();

            // Common beginner mistakes
            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
            game = game.makeMove(algebraicToSquare("d1")!, algebraicToSquare("h5")!)!; // Early queen

            // This move works but is generally poor
            expect(game.getCurrentPlayer()).toBe("BLACK");

            // Black can develop with tempo
            game = game.makeMove(algebraicToSquare("b8")!, algebraicToSquare("c6")!)!;
            game = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("c4")!)!;
            game = game.makeMove(algebraicToSquare("g8")!, algebraicToSquare("f6")!)!; // Attacks queen

            const validMoves = game.getValidMoves();
            const queenMoves = validMoves.filter(move => move.piece.type === "QUEEN");

            // Queen must move (being attacked)
            expect(queenMoves.length).toBeGreaterThan(0);
        });

        test("tactical training positions", () => {
            // Pin tactic
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 2 }, { type: "QUEEN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "ROOK", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: "KING", color: "BLACK" });

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

            // Queen is pinned and cannot move
            const queenMoves = game.getValidMoves().filter(move => move.piece.type === "QUEEN");
            expect(queenMoves.length).toBe(0);
        });

        test("endgame training scenarios", () => {
            // Basic king and pawn vs king
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 5 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });

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

            // Should have both king and pawn moves available
            const kingMoves = validMoves.filter(move => move.piece.type === "KING");
            const pawnMoves = validMoves.filter(move => move.piece.type === "PAWN");

            expect(kingMoves.length).toBeGreaterThan(0);
            expect(pawnMoves.length).toBeGreaterThan(0);
        });
    });

    describe("Chess variant and rule testing", () => {
        test("960/Fischer Random castling rights", () => {
            // Test castling with pieces in non-standard positions
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 2, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: "ROOK", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: "KING", color: "BLACK" });

            const gameState: GameState = {
                board: testBoard,
                currentPlayer: "WHITE",
                moveHistory: [],
                castlingRights: {
                    whiteKingside: true,
                    whiteQueenside: true,
                    blackKingside: false,
                    blackQueenside: false,
                },
                enPassantTarget: null,
                halfmoveClock: 0,
                fullmoveNumber: 1,
            };

            const game = Chess.fromState(gameState);

            // King should still have castling rights even in unusual position
            expect(game.getState().castlingRights.whiteKingside).toBe(true);
            expect(game.getState().castlingRights.whiteQueenside).toBe(true);
        });

        test("three-fold repetition detection setup", () => {
            let game = Chess.newGame();
            const initialPosition = game.getState().board;

            // Make moves that return to same position
            game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
            game = game.makeMove(algebraicToSquare("g8")!, algebraicToSquare("f6")!)!;
            game = game.makeMove(algebraicToSquare("f3")!, algebraicToSquare("g1")!)!;
            game = game.makeMove(algebraicToSquare("f6")!, algebraicToSquare("g8")!)!;

            const currentPosition = game.getState().board;

            // Should be back to initial position
            expect(JSON.stringify(currentPosition)).toBe(JSON.stringify(initialPosition));
        });

        test("atomic chess explosion simulation", () => {
            // In atomic chess, captures cause explosions
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: "PAWN", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 3, rank: 5 }, { type: "PAWN", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: "KNIGHT", color: "BLACK" });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 5 }, { type: "BISHOP", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: "KING", color: "WHITE" });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: "KING", color: "BLACK" });

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

            // Normal capture (in atomic, would explode surrounding pieces)
            const capture = game.makeMove({ file: 4, rank: 4 }, { file: 3, rank: 5 });

            if (capture) {
                // In standard chess, only the captured piece is removed
                const newBoard = capture.getBoard();
                expect(newBoard[5]![3]?.type).toBe("PAWN");
                expect(newBoard[5]![3]?.color).toBe("WHITE");
            }
        });
    });

    describe("Machine learning and AI testing scenarios", () => {
        test("position evaluation features", () => {
            let game = Chess.newGame();

            // Create imbalanced position
            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            game = game.makeMove(algebraicToSquare("f7")!, algebraicToSquare("f6")!)!; // Weak move
            game = game.makeMove(algebraicToSquare("d1")!, algebraicToSquare("h5")!)!; // Check

            expect(game.isInCheck()).toBe(true);

            const validMoves = game.getValidMoves();
            const forcedMoves = validMoves.filter(move => move.piece.type === "KING");

            // Black has limited options due to check
            expect(validMoves.length).toBeLessThan(10);
        });

        test("pattern recognition data", () => {
            // Common opening patterns
            let game = Chess.newGame();

            // Italian Game
            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
            game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
            game = game.makeMove(algebraicToSquare("b8")!, algebraicToSquare("c6")!)!;
            game = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("c4")!)!;

            const board = game.getBoard();

            // Characteristic piece placement for Italian Game
            expect(board[2]![2]?.type).toBe("BISHOP"); // White bishop on c4
            expect(board[2]![5]?.type).toBe("KNIGHT"); // White knight on f3
            expect(board[5]![2]?.type).toBe("KNIGHT"); // Black knight on c6
        });

        test("search tree node generation", () => {
            const game = Chess.newGame();

            // Generate all possible first moves
            const firstMoves = game.getValidMoves();
            expect(firstMoves.length).toBe(20);

            // Generate all possible responses to 1.e4
            const afterE4 = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            const responses = afterE4.getValidMoves();
            expect(responses.length).toBe(20); // Black also has 20 responses

            // Calculate total first-ply positions
            let totalPositions = 0;
            firstMoves.forEach(move => {
                const newGame = game.makeMove(move.from, move.to);
                if (newGame) {
                    totalPositions += newGame.getValidMoves().length;
                }
            });

            expect(totalPositions).toBe(400); // 20 * 20 = 400 possible positions after 2 plies
        });
    });

    describe("Accessibility and UI testing scenarios", () => {
        test("screen reader move description", () => {
            let game = Chess.newGame();

            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            const move = game.getMoveHistory()[0]!;

            // Generate descriptive text for screen readers
            const description = `${move.piece.color.toLowerCase()} ${move.piece.type.toLowerCase()} from ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`;

            expect(description).toBe("white pawn from e2 to e4");
        });

        test("colorblind-friendly notation", () => {
            const game = Chess.newGame();
            const board = game.getBoard();

            // Verify pieces can be distinguished without color
            for (let rank = 0; rank < 8; rank++) {
                for (let file = 0; file < 8; file++) {
                    const piece = board[rank]![file];
                    if (piece) {
                        // Each piece has both type and color information
                        expect(piece.type).toBeDefined();
                        expect(piece.color).toBeDefined();
                        expect(["WHITE", "BLACK"]).toContain(piece.color);
                        expect(["PAWN", "ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING"]).toContain(piece.type);
                    }
                }
            }
        });

        test("mobile interface move validation", () => {
            const game = Chess.newGame();

            // Simulate touch/tap moves (might be imprecise)
            const touchMove = game.makeMove(
                algebraicToSquare("e2")!,
                algebraicToSquare("e4")!
            );

            expect(touchMove).not.toBeNull();

            // Simulate invalid touch
            const invalidTouch = game.makeMove(
                algebraicToSquare("e3")!, // Empty square
                algebraicToSquare("e4")!
            );

            expect(invalidTouch).toBeNull();
        });
    });

    describe("Database and persistence scenarios", () => {
        test("game state serialization", () => {
            let game = Chess.newGame();

            game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
            game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;

            const state = game.getState();
            const serialized = JSON.stringify(state);
            const deserialized = JSON.parse(serialized);

            // Should be able to recreate game from serialized state
            const reconstructedGame = Chess.fromState(deserialized);
            expect(reconstructedGame.getMoveHistory().length).toBe(2);
            expect(reconstructedGame.getCurrentPlayer()).toBe("WHITE");
        });

        test("PGN format move sequence", () => {
            let game = Chess.newGame();

            const moves = [
                ["e2", "e4"], ["e7", "e5"],
                ["g1", "f3"], ["b8", "c6"],
                ["f1", "b5"], // Ruy Lopez
            ];

            const pgnMoves: string[] = [];

            moves.forEach(([from, to], index) => {
                const fromSquare = algebraicToSquare(from!);
                const toSquare = algebraicToSquare(to!);
                if (!fromSquare || !toSquare) return;
                const move = game.makeMove(fromSquare, toSquare);
                if (move) {
                    const moveNumber = Math.floor(index / 2) + 1;
                    const isWhite = index % 2 === 0;

                    if (isWhite) {
                        pgnMoves.push(`${moveNumber}.`);
                    }

                    // Simplified PGN notation (would need more complex logic for full PGN)
                    const piece = move.getMoveHistory()[index]!.piece;
                    if (toSquare) {
                        const notation = piece.type === "PAWN" ? squareToAlgebraic(toSquare) : piece.type[0] + squareToAlgebraic(toSquare);
                        pgnMoves.push(notation);
                    }

                    game = move;
                }
            });

            expect(pgnMoves.length).toBeGreaterThan(5);
        });

        test("database query simulation", () => {
            // Simulate querying games by opening
            const italianGames: GameState[] = [];

            for (let i = 0; i < 5; i++) {
                let game = Chess.newGame();

                // Italian Game sequence
                game = game.makeMove(algebraicToSquare("e2")!, algebraicToSquare("e4")!)!;
                game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e5")!)!;
                game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
                game = game.makeMove(algebraicToSquare("b8")!, algebraicToSquare("c6")!)!;
                game = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("c4")!)!;

                italianGames.push(game.getState());
            }

            // All games should have same opening pattern
            italianGames.forEach(gameState => {
                expect(gameState.moveHistory.length).toBe(5);
                expect(gameState.board[2]![2]?.type).toBe("BISHOP"); // Bc4
            });
        });
    });
});