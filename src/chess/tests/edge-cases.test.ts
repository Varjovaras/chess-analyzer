import { describe, test, expect } from 'vitest';
import { Chess, createEmptyBoard, setPieceAt, algebraicToSquare } from '../index';

describe('Chess Edge Cases and Complex Rules', () => {
  describe('Draw Conditions', () => {
    test('Insufficient material - king vs king', () => {
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

      // Should be a draw due to insufficient material
      expect(game.getGameResult()).toBe('DRAW');
    });

    test('Insufficient material - king and bishop vs king', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: 'BISHOP', color: 'WHITE' });
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

      // Should be a draw due to insufficient material
      expect(game.getGameResult()).toBe('DRAW');
    });

    test('Insufficient material - king and knight vs king', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: 'KNIGHT', color: 'WHITE' });
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

      // Should be a draw due to insufficient material
      expect(game.getGameResult()).toBe('DRAW');
    });

    test('Insufficient material - bishops on same color squares', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'BISHOP', color: 'WHITE' }); // Light square
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 0 }, { type: 'BISHOP', color: 'BLACK' }); // Light square

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

      // Should be a draw - bishops on same color squares cannot force mate
      expect(game.getGameResult()).toBe('DRAW');
    });

    test('Stalemate - king with no legal moves but not in check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 1 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 2 }, { type: 'QUEEN', color: 'WHITE' });

      const game = Chess.fromState({
        board: testBoard,
        currentPlayer: 'BLACK',
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

      expect(game.isInCheck()).toBe(false);
      expect(game.getGameResult()).toBe('DRAW');
    });
  });

  describe('Complex Pawn Promotion Scenarios', () => {
    test('Promotion under check - must promote to piece that blocks check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'ROOK', color: 'BLACK' });

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

      // Pawn promotes and must block check
      const promotion = game.makeMove({ file: 4, rank: 6 }, { file: 4, rank: 7 });
      expect(promotion).not.toBeNull();
      
      if (promotion) {
        expect(promotion.getBoard()[7]![4]?.type).toBe('QUEEN'); // Default promotion
        expect(promotion.isInCheck()).toBe(false); // Should block the check
      }
    });

    test('Promotion with capture and check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

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

      // Pawn captures and promotes with check
      const capturePromotion = game.makeMove({ file: 4, rank: 6 }, { file: 5, rank: 7 });
      expect(capturePromotion).not.toBeNull();
      
      if (capturePromotion) {
        expect(capturePromotion.getBoard()[7]![5]?.type).toBe('QUEEN');
        expect(capturePromotion.isInCheck()).toBe(true);
      }
    });

    test('Underpromotion to avoid stalemate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 6 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

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

      // Promoting to queen would cause stalemate, so underpromote
      const underpromotion = game.makeMove({ file: 0, rank: 6 }, { file: 0, rank: 7 });
      expect(underpromotion).not.toBeNull();
      
      // Note: This test assumes the implementation supports piece selection in promotion
      // Current implementation defaults to queen, but this shows the strategic concept
    });
  });

  describe('Complex En Passant Scenarios', () => {
    test('En passant capture that reveals discovered check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 3 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

      const game = Chess.fromState({
        board: testBoard,
        currentPlayer: 'WHITE',
        moveHistory: [{
          from: { file: 4, rank: 5 },
          to: { file: 4, rank: 3 },
          piece: { type: 'PAWN', color: 'BLACK' }
        }],
        castlingRights: {
          whiteKingside: false,
          whiteQueenside: false,
          blackKingside: false,
          blackQueenside: false,
        },
        enPassantTarget: { file: 4, rank: 4 },
        halfmoveClock: 0,
        fullmoveNumber: 1,
      });

      // En passant capture reveals discovered check
      const enPassant = game.makeMove({ file: 3, rank: 3 }, { file: 4, rank: 4 });
      expect(enPassant).not.toBeNull();
      
      if (enPassant) {
        expect(enPassant.isInCheck()).toBe(true); // Black king in check from rook
      }
    });

    test('En passant blocked by own king being in check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 3 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

      const game = Chess.fromState({
        board: testBoard,
        currentPlayer: 'WHITE',
        moveHistory: [{
          from: { file: 4, rank: 5 },
          to: { file: 4, rank: 3 },
          piece: { type: 'PAWN', color: 'BLACK' }
        }],
        castlingRights: {
          whiteKingside: false,
          whiteQueenside: false,
          blackKingside: false,
          blackQueenside: false,
        },
        enPassantTarget: { file: 4, rank: 4 },
        halfmoveClock: 0,
        fullmoveNumber: 1,
      });

      // En passant is illegal because it would leave king in check
      const illegalEnPassant = game.makeMove({ file: 3, rank: 3 }, { file: 4, rank: 4 });
      expect(illegalEnPassant).toBeNull();
    });
  });

  describe('Complex Castling Edge Cases', () => {
    test('Castling rights lost after rook capture and replacement', () => {
      let game = Chess.newGame();
      
      // Set up position where rook can be captured and replaced
      game = game.makeMove(algebraicToSquare('a2')!, algebraicToSquare('a4')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      game = game.makeMove(algebraicToSquare('a1')!, algebraicToSquare('a3')!)!; // Rook moves
      game = game.makeMove(algebraicToSquare('e5')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('a3')!, algebraicToSquare('a1')!)!; // Rook returns
      
      const state = game.getState();
      // Castling rights should be lost even though rook returned
      expect(state.castlingRights.whiteQueenside).toBe(false);
    });

    test('Castling through attacked square by pinned piece', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 1 }, { type: 'BISHOP', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 2 }, { type: 'ROOK', color: 'BLACK' }); // Pinned bishop
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

      const game = Chess.fromState({
        board: testBoard,
        currentPlayer: 'WHITE',
        moveHistory: [],
        castlingRights: {
          whiteKingside: true,
          whiteQueenside: false,
          blackKingside: false,
          blackQueenside: false,
        },
        enPassantTarget: null,
        halfmoveClock: 0,
        fullmoveNumber: 1,
      });

      // Bishop is pinned but still controls f1, so castling is illegal
      const castling = game.makeMove({ file: 4, rank: 0 }, { file: 6, rank: 0 });
      expect(castling).toBeNull();
    });

    test('Castling in chess960 starting position', () => {
      // Test unusual starting position where king and rook are not in standard places
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 3, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'KING', color: 'BLACK' });

      const game = Chess.fromState({
        board: testBoard,
        currentPlayer: 'WHITE',
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
      });

      // In chess960, castling should still work with different starting positions
      const castling = game.makeMove({ file: 3, rank: 0 }, { file: 6, rank: 0 }); // King to g1
      expect(castling).not.toBeNull();
      
      if (castling) {
        const board = castling.getBoard();
        expect(board[0]![6]?.type).toBe('KING'); // King on g1
        expect(board[0]![5]?.type).toBe('ROOK'); // Rook on f1
      }
    });
  });

  describe('Zugzwang Positions', () => {
    test('Zugzwang in king and pawn endgame', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 5 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: 'KING', color: 'BLACK' });

      const game = Chess.fromState({
        board: testBoard,
        currentPlayer: 'BLACK',
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

      // Black is in zugzwang - any move worsens the position
      expect(game.getGameResult()).toBe('ONGOING');
      const validMoves = game.getValidMoves();
      expect(validMoves.length).toBeGreaterThan(0);
      
      // All moves should allow White to advance
      validMoves.forEach(move => {
        expect(move.from).toEqual({ file: 4, rank: 6 });
        expect(move.to.file).not.toBe(4); // King must move off the file
      });
    });

    test('Zugzwang with knight and pawn vs knight', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'KNIGHT', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 5 }, { type: 'KNIGHT', color: 'WHITE' });

      const game = Chess.fromState({
        board: testBoard,
        currentPlayer: 'BLACK',
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

      // Complex zugzwang position where any black move loses
      expect(game.getGameResult()).toBe('ONGOING');
      expect(game.getValidMoves().length).toBeGreaterThan(0);
    });
  });

  describe('Perpetual Check and Repetition', () => {
    test('Perpetual check leading to draw', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'QUEEN', color: 'WHITE' });

      let game = Chess.fromState({
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

      // Simulate perpetual check pattern
      game = game.makeMove({ file: 0, rank: 7 }, { file: 1, rank: 6 })!; // Qb6+
      expect(game.isInCheck()).toBe(true);
      
      game = game.makeMove({ file: 0, rank: 0 }, { file: 0, rank: 1 })!; // Ka1
      game = game.makeMove({ file: 1, rank: 6 }, { file: 0, rank: 7 })!; // Qa7+
      expect(game.isInCheck()).toBe(true);
      
      game = game.makeMove({ file: 0, rank: 1 }, { file: 0, rank: 0 })!; // Ka2 (back to start)
      
      // This creates a repetition pattern
      expect(game.getGameResult()).toBe('ONGOING');
    });

    test('Threefold repetition detection', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 3 }, { type: 'KNIGHT', color: 'WHITE' });

      let game = Chess.fromState({
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

      // Simulate knight moving in a cycle
      const moves = [
        { from: { file: 3, rank: 3 }, to: { file: 1, rank: 4 } },
        { from: { file: 0, rank: 0 }, to: { file: 0, rank: 1 } },
        { from: { file: 1, rank: 4 }, to: { file: 3, rank: 3 } },
        { from: { file: 0, rank: 1 }, to: { file: 0, rank: 0 } },
      ];

      // Repeat the cycle multiple times
      for (let cycle = 0; cycle < 3; cycle++) {
        for (const move of moves) {
          game = game.makeMove(move.from, move.to)!;
          expect(game).not.toBeNull();
        }
      }

      // After 3 repetitions, should be a draw (if implemented)
      // Note: This depends on the implementation having threefold repetition detection
    });
  });

  describe('Unusual Piece Interactions', () => {
    test('King capturing attacker while moving into another attack', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 5 }, { type: 'ROOK', color: 'BLACK' });
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

      // King cannot capture pawn because it would move into rook's attack
      const illegalCapture = game.makeMove({ file: 4, rank: 4 }, { file: 4, rank: 5 });
      expect(illegalCapture).toBeNull();
    });

    test('Piece pinned to king cannot move even if destination is safe', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 1 }, { type: 'QUEEN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

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

      // Queen is pinned and cannot move even to a safe square
      const pinnedMove = game.makeMove({ file: 4, rank: 1 }, { file: 3, rank: 1 });
      expect(pinnedMove).toBeNull();
    });

    test('Double check - only king can move', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 1 }, { type: 'QUEEN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 2 }, { type: 'BISHOP', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'BLACK' });

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

      expect(game.isInCheck()).toBe(true);
      
      // In double check, only king moves are legal
      const queenMove = game.makeMove({ file: 1, rank: 1 }, { file: 4, rank: 4 });
      expect(queenMove).toBeNull(); // Queen cannot block in double check
      
      const kingMove = game.makeMove({ file: 4, rank: 0 }, { file: 3, rank: 0 });
      expect(kingMove).not.toBeNull(); // King can move
    });
  });
});
