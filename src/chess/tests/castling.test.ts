import { describe, test, expect } from 'vitest';
import { Chess, createEmptyBoard, setPieceAt, algebraicToSquare } from '../index';

describe('Castling', () => {
  describe('Kingside Castling', () => {
    test('white can castle kingside when conditions are met', () => {
      let game = Chess.newGame();
      
      // Clear path for kingside castling
      game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!; // Knight
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!; // Black pawn
      game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('e2')!)!; // Bishop
      game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!; // Black pawn

      // Now try to castle
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
        // Original positions should be empty
        expect(board[0]![4]).toBeNull(); // e1
        expect(board[0]![7]).toBeNull(); // h1
      }
    });

    test('black can castle kingside when conditions are met', () => {
      let game = Chess.newGame();
      
      // White moves
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('g8')!, algebraicToSquare('f6')!)!; // Black knight
      game = game.makeMove(algebraicToSquare('d2')!, algebraicToSquare('d4')!)!;
      game = game.makeMove(algebraicToSquare('f8')!, algebraicToSquare('e7')!)!; // Black bishop
      game = game.makeMove(algebraicToSquare('c2')!, algebraicToSquare('c4')!)!;

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
      game = game.makeMove(algebraicToSquare('b1')!, algebraicToSquare('c3')!)!; // Knight
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!;
      game = game.makeMove(algebraicToSquare('c1')!, algebraicToSquare('d2')!)!; // Bishop
      game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!;
      game = game.makeMove(algebraicToSquare('d1')!, algebraicToSquare('c2')!)!; // Queen
      game = game.makeMove(algebraicToSquare('c7')!, algebraicToSquare('c6')!)!;

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
        // Original positions should be empty
        expect(board[0]![4]).toBeNull(); // e1
        expect(board[0]![0]).toBeNull(); // a1
      }
    });
  });

  describe('Castling Restrictions', () => {
    test('cannot castle if king has moved', () => {
      let game = Chess.newGame();
      
      // Move king and then back
      game = game.makeMove(algebraicToSquare('e1')!, algebraicToSquare('e2')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!;
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e1')!)!;
      game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!;
      
      // Clear path
      game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!;
      game = game.makeMove(algebraicToSquare('c7')!, algebraicToSquare('c6')!)!;
      game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('e2')!)!;
      game = game.makeMove(algebraicToSquare('b7')!, algebraicToSquare('b6')!)!;

      // Try to castle - should fail
      const result = game.makeMove(
        algebraicToSquare('e1')!,
        algebraicToSquare('g1')!
      );
      
      expect(result).toBeNull();
    });

    test('cannot castle if rook has moved', () => {
      let game = Chess.newGame();
      
      // Move rook and then back
      game = game.makeMove(algebraicToSquare('h1')!, algebraicToSquare('h2')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!)!;
      game = game.makeMove(algebraicToSquare('h2')!, algebraicToSquare('h1')!)!;
      game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!;
      
      // Clear path
      game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!;
      game = game.makeMove(algebraicToSquare('c7')!, algebraicToSquare('c6')!)!;
      game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('e2')!)!;
      game = game.makeMove(algebraicToSquare('b7')!, algebraicToSquare('b6')!)!;

      // Try to castle - should fail
      const result = game.makeMove(
        algebraicToSquare('e1')!,
        algebraicToSquare('g1')!
      );
      
      expect(result).toBeNull();
    });

    test('cannot castle when in check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' }); // Attacks king
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
      
      // Try to castle - should fail
      const result = game.makeMove(
        { file: 4, rank: 0 },
        { file: 6, rank: 0 }
      );
      
      expect(result).toBeNull();
    });

    test('cannot castle through check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'ROOK', color: 'BLACK' }); // Attacks f1
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
        { file: 4, rank: 0 },
        { file: 6, rank: 0 }
      );
      
      expect(result).toBeNull();
    });

    test('cannot castle if path is blocked', () => {
      let game = Chess.newGame();
      
      // Try to castle with pieces still in the way
      const result = game.makeMove(
        algebraicToSquare('e1')!,
        algebraicToSquare('g1')!
      );
      
      expect(result).toBeNull();
    });
  });
});
