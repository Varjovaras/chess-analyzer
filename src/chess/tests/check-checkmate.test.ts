import { describe, test, expect } from 'vitest';
import { Chess, createEmptyBoard, setPieceAt, algebraicToSquare } from '../index';

describe('Check and Checkmate', () => {
  describe('Check Detection', () => {
    test('detects check from rook', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
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

      expect(game.isInCheck()).toBe(true);
    });

    test('detects check from bishop', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'BISHOP', color: 'BLACK' });
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
    });

    test('detects check from knight', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 5 }, { type: 'KNIGHT', color: 'BLACK' });
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
    });

    test('detects check from queen', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'QUEEN', color: 'BLACK' });
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
    });

    test('detects check from pawn', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 5 }, { type: 'PAWN', color: 'BLACK' });
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
    });

    test('no check when king is safe', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'BLACK' });
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

      expect(game.isInCheck()).toBe(false);
    });
  });

  describe('Check Resolution', () => {
    test('king can move out of check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
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

      expect(game.isInCheck()).toBe(true);
      
      // King moves to escape check
      const result = game.makeMove({ file: 4, rank: 0 }, { file: 5, rank: 0 });
      expect(result).not.toBeNull();
      expect(result!.isInCheck()).toBe(false);
    });

    test('can capture attacking piece to resolve check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 2 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 1 }, { type: 'QUEEN', color: 'WHITE' });
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
      
      // Queen captures attacking rook
      const result = game.makeMove({ file: 5, rank: 1 }, { file: 4, rank: 2 });
      expect(result).not.toBeNull();
      expect(result!.isInCheck()).toBe(false);
    });

    test('can block check with another piece', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'BISHOP', color: 'WHITE' });
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
      
      // Bishop blocks the check
      const result = game.makeMove({ file: 0, rank: 0 }, { file: 4, rank: 4 });
      expect(result).not.toBeNull();
      expect(result!.isInCheck()).toBe(false);
    });
  });

  describe('Checkmate', () => {
    test('detects simple checkmate', () => {
      // Back rank mate
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 6, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 1 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 1 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 1 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
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
      expect(game.getGameResult()).toBe('BLACK_WINS');
    });

    test('detects queen and king checkmate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'QUEEN', color: 'WHITE' });

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

      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });
  });

  describe('Stalemate', () => {
    test('detects stalemate when no legal moves but not in check', () => {
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

  describe('Illegal Moves in Check', () => {
    test('cannot make move that leaves king in check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 1 }, { type: 'BISHOP', color: 'WHITE' });
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

      // Bishop is pinned - moving it would expose king to check
      const result = game.makeMove({ file: 4, rank: 1 }, { file: 5, rank: 2 });
      expect(result).toBeNull();
    });

    test('must resolve check - cannot make unrelated moves', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
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

      expect(game.isInCheck()).toBe(true);
      
      // Cannot move rook to unrelated square while in check
      const result = game.makeMove({ file: 0, rank: 0 }, { file: 1, rank: 0 });
      expect(result).toBeNull();
    });
  });
});
