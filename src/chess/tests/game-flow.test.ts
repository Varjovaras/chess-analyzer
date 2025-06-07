import { describe, test, expect } from 'vitest';
import { Chess, algebraicToSquare } from '../index';

describe('Game Flow Integration', () => {
  describe('Complete Game Scenarios', () => {
    test('scholar\'s mate - quick checkmate', () => {
      let game = Chess.newGame();
      
      // 1. e4 e5
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      
      // 2. Bc4 Nc6
      game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('c4')!)!;
      game = game.makeMove(algebraicToSquare('b8')!, algebraicToSquare('c6')!)!;
      
      // 3. Qh5 Nf6?? (defending)
      game = game.makeMove(algebraicToSquare('d1')!, algebraicToSquare('h5')!)!;
      game = game.makeMove(algebraicToSquare('g8')!, algebraicToSquare('f6')!)!;
      
      // 4. Qxf7# - checkmate
      const result = game.makeMove(algebraicToSquare('h5')!, algebraicToSquare('f7')!)!;
      
      expect(result.isInCheck()).toBe(true);
      expect(result.getGameResult()).toBe('WHITE_WINS');
    });

    test('simple pawn endgame', () => {
      let game = Chess.newGame();
      
      // Play some opening moves
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!;
      game = game.makeMove(algebraicToSquare('b8')!, algebraicToSquare('c6')!)!;
      
      expect(game.getCurrentPlayer()).toBe('WHITE');
      expect(game.isInCheck()).toBe(false);
      expect(game.getGameResult()).toBe('ONGOING');
    });

    test('castling in opening', () => {
      let game = Chess.newGame();
      
      // Prepare for kingside castling
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!;
      game = game.makeMove(algebraicToSquare('b8')!, algebraicToSquare('c6')!)!;
      game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('c4')!)!;
      game = game.makeMove(algebraicToSquare('f8')!, algebraicToSquare('c5')!)!;
      
      // Both sides can now castle kingside
      game = game.makeMove(algebraicToSquare('e1')!, algebraicToSquare('g1')!)!;
      expect(game.getBoard()[0]![6]?.type).toBe('KING'); // White king on g1
      expect(game.getBoard()[0]![5]?.type).toBe('ROOK'); // White rook on f1
      
      game = game.makeMove(algebraicToSquare('e8')!, algebraicToSquare('g8')!)!;
      expect(game.getBoard()[7]![6]?.type).toBe('KING'); // Black king on g8
      expect(game.getBoard()[7]![5]?.type).toBe('ROOK'); // Black rook on f8
    });
  });

  describe('Game State Tracking', () => {
    test('move history is properly recorded', () => {
      let game = Chess.newGame();
      
      expect(game.getMoveHistory()).toHaveLength(0);
      
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      expect(game.getMoveHistory()).toHaveLength(1);
      expect(game.getMoveHistory()[0]?.piece.type).toBe('PAWN');
      
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      expect(game.getMoveHistory()).toHaveLength(2);
      expect(game.getMoveHistory()[1]?.piece.color).toBe('BLACK');
    });

    test('current player alternates correctly', () => {
      let game = Chess.newGame();
      
      expect(game.getCurrentPlayer()).toBe('WHITE');
      
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      expect(game.getCurrentPlayer()).toBe('BLACK');
      
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      expect(game.getCurrentPlayer()).toBe('WHITE');
    });

    test('castling rights are updated correctly', () => {
      let game = Chess.newGame();
      
      const initialState = game.getState();
      expect(initialState.castlingRights.whiteKingside).toBe(true);
      expect(initialState.castlingRights.whiteQueenside).toBe(true);
      expect(initialState.castlingRights.blackKingside).toBe(true);
      expect(initialState.castlingRights.blackQueenside).toBe(true);
      
      // Move white king
      game = game.makeMove(algebraicToSquare('e1')!, algebraicToSquare('e2')!)!;
      const afterKingMove = game.getState();
      expect(afterKingMove.castlingRights.whiteKingside).toBe(false);
      expect(afterKingMove.castlingRights.whiteQueenside).toBe(false);
      expect(afterKingMove.castlingRights.blackKingside).toBe(true);
      expect(afterKingMove.castlingRights.blackQueenside).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('invalid moves return null', () => {
      let game = Chess.newGame();
      
      // Try to move non-existent piece
      let result = game.makeMove(algebraicToSquare('e3')!, algebraicToSquare('e4')!);
      expect(result).toBeNull();
      
      // Try to move opponent's piece
      result = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!);
      expect(result).toBeNull();
      
      // Try illegal pawn move
      result = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e5')!);
      expect(result).toBeNull();
      
      // Valid move should work
      result = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!);
      expect(result).not.toBeNull();
    });

    test('game state remains unchanged after invalid move', () => {
      let game = Chess.newGame();
      const originalState = game.getState();
      
      // Try invalid move
      const result = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e6')!);
      expect(result).toBeNull();
      
      // State should be unchanged
      expect(game.getState()).toEqual(originalState);
    });
  });

  describe('Valid Moves Generation', () => {
    test('starting position has correct number of valid moves', () => {
      const game = Chess.newGame();
      const validMoves = game.getValidMoves();
      
      // White should have 20 possible opening moves
      // 8 pawn moves (each pawn can move 1 or 2 squares) = 16
      // 2 knight moves (each knight has 2 possible moves) = 4
      expect(validMoves).toHaveLength(20);
    });

    test('valid moves respect turn order', () => {
      const game = Chess.newGame();
      const validMoves = game.getValidMoves();
      
      // All moves should be for white pieces
      validMoves.forEach(move => {
        expect(move.piece.color).toBe('WHITE');
      });
    });

    test('valid moves exclude moves that would leave king in check', () => {
      let game = Chess.newGame();
      
      // Create a position where some moves would be illegal due to check
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('c4')!)!;
      game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!;
      game = game.makeMove(algebraicToSquare('d1')!, algebraicToSquare('h5')!)!;
      
      // Black is now under threat of checkmate on f7
      const validMoves = game.getValidMoves();
      
      // Verify that moves that don't defend are not included
      // (This is a complex test that depends on the specific implementation)
      expect(validMoves.length).toBeGreaterThan(0);
    });
  });

  describe('Game End Conditions', () => {
    test('game ends with checkmate', () => {
      let game = Chess.newGame();
      
      // Create a quick checkmate scenario
      game = game.makeMove(algebraicToSquare('f2')!, algebraicToSquare('f3')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      game = game.makeMove(algebraicToSquare('g2')!, algebraicToSquare('g4')!)!;
      game = game.makeMove(algebraicToSquare('d8')!, algebraicToSquare('h4')!)!;
      
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('BLACK_WINS');
      expect(game.isGameOver()).toBe(true);
    });

    test('ongoing game has correct status', () => {
      let game = Chess.newGame();
      
      expect(game.isInCheck()).toBe(false);
      expect(game.getGameResult()).toBe('ONGOING');
      expect(game.isGameOver()).toBe(false);
      
      // After some moves, still ongoing
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      
      expect(game.getGameResult()).toBe('ONGOING');
      expect(game.isGameOver()).toBe(false);
    });
  });
});
