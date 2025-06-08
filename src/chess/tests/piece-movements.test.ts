import { describe, test, expect } from 'vitest';
import { Chess, createEmptyBoard, setPieceAt, algebraicToSquare } from '../index';

describe('Basic Piece Movements', () => {
    describe('Pawn Movement', () => {
        test('white pawn can move one square forward', () => {
            let game = Chess.newGame();
            const result = game.makeMove(
                algebraicToSquare('e2')!,
                algebraicToSquare('e3')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[2]![4]?.type).toBe('PAWN');
        });

        test('white pawn can move two squares from starting position', () => {
            let game = Chess.newGame();
            const result = game.makeMove(
                algebraicToSquare('e2')!,
                algebraicToSquare('e4')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[3]![4]?.type).toBe('PAWN');
        });

        test('black pawn can move one square forward', () => {
            let game = Chess.newGame();
            // White move first
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;

            const result = game.makeMove(
                algebraicToSquare('e7')!,
                algebraicToSquare('e6')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[5]![4]?.type).toBe('PAWN');
        });

        test('black pawn can move two squares from starting position', () => {
            let game = Chess.newGame();
            // White move first
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;

            const result = game.makeMove(
                algebraicToSquare('d7')!,
                algebraicToSquare('d5')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[4]![3]?.type).toBe('PAWN');
        });

        test('pawn cannot move if path is blocked', () => {
            let game = Chess.newGame();
            // Move white pawn
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
            // Move black pawn to block
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;

            // White pawn should not be able to move forward
            const result = game.makeMove(
                algebraicToSquare('e4')!,
                algebraicToSquare('e5')!
            );
            expect(result).toBeNull();
        });
    });

    describe('Rook Movement', () => {
        test('rook can move horizontally', () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'ROOK', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });

            const game = Chess.fromState({
                board: testBoard,
                currentPlayer: 'WHITE',
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
            });

            const result = game.makeMove({ file: 4, rank: 4 }, { file: 7, rank: 4 });
            expect(result).not.toBeNull();
            expect(result!.getBoard()[4]![7]?.type).toBe('ROOK');
        });

        test('rook can move vertically', () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'ROOK', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });

            const game = Chess.fromState({
                board: testBoard,
                currentPlayer: 'WHITE',
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
            });

            const result = game.makeMove({ file: 4, rank: 4 }, { file: 4, rank: 7 });
            expect(result).not.toBeNull();
            expect(result!.getBoard()[7]![4]?.type).toBe('ROOK');
        });
    });

    describe('Knight Movement', () => {
        test('knight can move in L-shape', () => {
            let game = Chess.newGame();
            const result = game.makeMove(
                algebraicToSquare('b1')!,
                algebraicToSquare('c3')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[2]![2]?.type).toBe('KNIGHT');
        });

        test('knight can jump over pieces', () => {
            let game = Chess.newGame();
            // Knight can move even with pawns in front
            const result = game.makeMove(
                algebraicToSquare('g1')!,
                algebraicToSquare('f3')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[2]![5]?.type).toBe('KNIGHT');
        });
    });

    describe('Bishop Movement', () => {
        test('bishop can move diagonally', () => {
            let game = Chess.newGame();
            // Clear path for bishop
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;

            const result = game.makeMove(
                algebraicToSquare('f1')!,
                algebraicToSquare('e2')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[1]![4]?.type).toBe('BISHOP');
        });
    });

    describe('Queen Movement', () => {
        test('queen can move like a rook', () => {
            let game = Chess.newGame();
            // Clear path for queen
            game = game.makeMove(algebraicToSquare('d2')!, algebraicToSquare('d4')!)!;
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;

            const result = game.makeMove(
                algebraicToSquare('d1')!,
                algebraicToSquare('d3')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[2]![3]?.type).toBe('QUEEN');
        });

        test('queen can move like a bishop', () => {
            let game = Chess.newGame();
            // Clear path for queen
            game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
            game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;

            const result = game.makeMove(
                algebraicToSquare('d1')!,
                algebraicToSquare('f3')!
            );
            expect(result).not.toBeNull();
            expect(result!.getBoard()[2]![5]?.type).toBe('QUEEN');
        });
    });

    describe('King Movement', () => {
        test('king can move one square in any direction', () => {
            const board = createEmptyBoard();
            let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
            testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });

            const game = Chess.fromState({
                board: testBoard,
                currentPlayer: 'WHITE',
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
            });

            const result = game.makeMove({ file: 4, rank: 4 }, { file: 5, rank: 4 });
            expect(result).not.toBeNull();
            expect(result!.getBoard()[4]![5]?.type).toBe('KING');
        });
    });
});
