import { describe, test, expect } from 'vitest';
import { Chess, createEmptyBoard, setPieceAt, algebraicToSquare } from '../index';

describe('Castling Moves', () => {
    describe('Kingside Castling', () => {
        test('white can castle kingside when conditions are met', () => {
            let game = Chess.newGame();

            // Clear path for kingside castling - make proper moves
            // Move knight out of the way first
            game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!; // Knight g1-f3
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!; // Black pawn move

            // Move pawn to open bishop's diagonal
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e3')!)!; // White pawn e2-e3
            game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!; // Black pawn move

            // Move bishop out of the way
            game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('d3')!)!; // Bishop f1-d3
            game = game.makeMove(algebraicToSquare('f7')!, algebraicToSquare('f6')!)!; // Black pawn move

            // Now try to castle kingside
            const result = game.makeMove(
                algebraicToSquare('e1')!,
                algebraicToSquare('g1')!
            );

            expect(result).not.toBeNull();
            if (result) {
                const board = result.getBoard();
                // King should be on g1
                expect(board[0]![6]?.type).toBe('KING');
                expect(board[0]![6]?.color).toBe('WHITE');
                // Rook should be on f1
                expect(board[0]![5]?.type).toBe('ROOK');
                expect(board[0]![5]?.color).toBe('WHITE');
            }
        });

        test('black can castle kingside when conditions are met', () => {
            let game = Chess.newGame();

            // White moves first
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;

            // Clear path for black kingside castling
            game = game.makeMove(algebraicToSquare('g8')!, algebraicToSquare('f6')!)!; // Black knight
            game = game.makeMove(algebraicToSquare('d2')!, algebraicToSquare('d4')!)!;

            // Move black pawn to open bishop's path
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!; // Black pawn
            game = game.makeMove(algebraicToSquare('c2')!, algebraicToSquare('c4')!)!;

            // Move black bishop
            game = game.makeMove(algebraicToSquare('f8')!, algebraicToSquare('d6')!)!; // Black bishop
            game = game.makeMove(algebraicToSquare('b1')!, algebraicToSquare('c3')!)!; // White knight to give turn to black

            // Black castles kingside
            const result = game.makeMove(
                algebraicToSquare('e8')!,
                algebraicToSquare('g8')!
            );

            expect(result).not.toBeNull();
            if (result) {
                const board = result.getBoard();
                // King should be on g8
                expect(board[7]![6]?.type).toBe('KING');
                expect(board[7]![6]?.color).toBe('BLACK');
                // Rook should be on f8
                expect(board[7]![5]?.type).toBe('ROOK');
                expect(board[7]![5]?.color).toBe('BLACK');
            }
        });
    });

    describe('Queenside Castling', () => {
        test('white can castle queenside when conditions are met', () => {
            let game = Chess.newGame();

            // Clear path for queenside castling
            game = game.makeMove(algebraicToSquare('b1')!, algebraicToSquare('c3')!)!; // Knight b1-c3
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!; // Black pawn

            // Move pawn to open bishop's path
            game = game.makeMove(algebraicToSquare('d2')!, algebraicToSquare('d3')!)!; // White pawn d2-d3
            game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!; // Black pawn

            // Move bishop
            game = game.makeMove(algebraicToSquare('c1')!, algebraicToSquare('f4')!)!; // Bishop c1-f4
            game = game.makeMove(algebraicToSquare('f7')!, algebraicToSquare('f6')!)!; // Black pawn

            // Move queen
            game = game.makeMove(algebraicToSquare('d1')!, algebraicToSquare('d2')!)!; // Queen d1-d2
            game = game.makeMove(algebraicToSquare('g7')!, algebraicToSquare('g6')!)!; // Black pawn

            // Now try to castle queenside
            const result = game.makeMove(
                algebraicToSquare('e1')!,
                algebraicToSquare('c1')!
            );

            expect(result).not.toBeNull();
            if (result) {
                const board = result.getBoard();
                // King should be on c1
                expect(board[0]![2]?.type).toBe('KING');
                expect(board[0]![2]?.color).toBe('WHITE');
                // Rook should be on d1
                expect(board[0]![3]?.type).toBe('ROOK');
                expect(board[0]![3]?.color).toBe('WHITE');
            }
        });
    });

    describe('Castling Restrictions', () => {
        test('cannot castle if king has moved', () => {
            let game = Chess.newGame();

            // First clear path for king movement
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e3')!)!; // Pawn e2-e3
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!; // Black pawn

            // Move king and then back
            game = game.makeMove(algebraicToSquare('e1')!, algebraicToSquare('e2')!)!; // King e1-e2
            game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!; // Black pawn
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e1')!)!; // King e2-e1 (back)
            game = game.makeMove(algebraicToSquare('f7')!, algebraicToSquare('f6')!)!; // Black pawn

            // Clear rest of castling path
            game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!; // Knight g1-f3
            game = game.makeMove(algebraicToSquare('g7')!, algebraicToSquare('g6')!)!; // Black pawn
            game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('d3')!)!; // Bishop f1-d3
            game = game.makeMove(algebraicToSquare('h7')!, algebraicToSquare('h6')!)!; // Black pawn

            // Try to castle - should fail because king has moved
            const result = game.makeMove(
                algebraicToSquare('e1')!,
                algebraicToSquare('g1')!
            );

            expect(result).toBeNull();
        });

        test('cannot castle if rook has moved', () => {
            let game = Chess.newGame();

            // First clear path for rook movement
            game = game.makeMove(algebraicToSquare('h2')!, algebraicToSquare('h3')!)!; // Pawn h2-h3
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!; // Black pawn

            // Move rook and then back
            game = game.makeMove(algebraicToSquare('h1')!, algebraicToSquare('h2')!)!; // Rook h1-h2
            game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!; // Black pawn
            game = game.makeMove(algebraicToSquare('h2')!, algebraicToSquare('h1')!)!; // Rook h2-h1 (back)
            game = game.makeMove(algebraicToSquare('f7')!, algebraicToSquare('f6')!)!; // Black pawn

            // Clear rest of castling path
            game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!; // Knight g1-f3
            game = game.makeMove(algebraicToSquare('g7')!, algebraicToSquare('g6')!)!; // Black pawn
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e3')!)!; // Pawn e2-e3
            game = game.makeMove(algebraicToSquare('h7')!, algebraicToSquare('h6')!)!; // Black pawn
            game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('d3')!)!; // Bishop f1-d3
            game = game.makeMove(algebraicToSquare('c7')!, algebraicToSquare('c6')!)!; // Black pawn

            // Try to castle - should fail because rook has moved
            const result = game.makeMove(
                algebraicToSquare('e1')!,
                algebraicToSquare('g1')!
            );

            expect(result).toBeNull();
        });

        test('cannot castle when in check', () => {
            // Create a position where white king is in check
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' }); // Checking the king
            testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

            const game = Chess.fromState({
                board: testBoard,
                currentPlayer: 'WHITE',
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
            });

            expect(game.isInCheck()).toBe(true);

            // Try to castle while in check - should fail
            const result = game.makeMove(
                algebraicToSquare('e1')!,
                algebraicToSquare('g1')!
            );

            expect(result).toBeNull();
        });

        test('cannot castle through check', () => {
            // Create a position where castling would move king through check
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'ROOK', color: 'BLACK' }); // Controlling f1
            testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

            const game = Chess.fromState({
                board: testBoard,
                currentPlayer: 'WHITE',
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
            });

            // Try to castle through check - should fail
            const result = game.makeMove(
                algebraicToSquare('e1')!,
                algebraicToSquare('g1')!
            );

            expect(result).toBeNull();
        });

        test('cannot castle if path is blocked', () => {
            let game = Chess.newGame();

            // Move knight but leave bishop in place (f1), so path is blocked
            game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!; // Knight only
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!; // Black pawn

            // Try to castle with bishop still on f1 - should fail
            const result = game.makeMove(
                algebraicToSquare('e1')!,
                algebraicToSquare('g1')!
            );

            expect(result).toBeNull();
        });
    });
});