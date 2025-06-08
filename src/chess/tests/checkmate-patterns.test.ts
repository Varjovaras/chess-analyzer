import { describe, test, expect } from 'vitest';
import { Chess, createEmptyBoard, setPieceAt, algebraicToSquare } from '../index';

describe('Famous Checkmate Patterns', () => {
  describe('Basic Checkmate Patterns', () => {
    test('Queen and King vs King - basic technique', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 1 }, { type: 'QUEEN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'KING', color: 'BLACK' });

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

      // This should be a winning position for White
      expect(game.getGameResult()).toBe('ONGOING');
      
      // Queen can deliver checkmate
      const checkmate = game.makeMove({ file: 3, rank: 1 }, { file: 3, rank: 7 });
      expect(checkmate).not.toBeNull();
      
      if (checkmate) {
        expect(checkmate.isInCheck()).toBe(true);
        expect(checkmate.getGameResult()).toBe('WHITE_WINS');
      }
    });

    test('Rook and King vs King - back rank mate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 6, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 1 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 1 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 1 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'WHITE' });

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

      // Classic back rank mate
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Two Bishops Checkmate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 1 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 2 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 3 }, { type: 'BISHOP', color: 'WHITE' });

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

      // This is checkmate with two bishops
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Bishop and Knight Checkmate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 1 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 2 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 2 }, { type: 'KNIGHT', color: 'WHITE' });

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

      // This is checkmate with bishop and knight
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });
  });

  describe('Special Checkmate Patterns', () => {
    test('Smothered Mate - knight checkmate with own pieces blocking', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 5 }, { type: 'KNIGHT', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // Knight delivers smothered mate
      const smotheredMate = game.makeMove({ file: 5, rank: 5 }, { file: 7, rank: 4 });
      expect(smotheredMate).not.toBeNull();
      
      if (smotheredMate) {
        // This should be checkmate as the king is surrounded by its own pieces
        expect(smotheredMate.isInCheck()).toBe(true);
        expect(smotheredMate.getGameResult()).toBe('WHITE_WINS');
      }
    });

    test('Arabian Mate - rook and knight checkmate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'KNIGHT', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // This is Arabian mate - rook attacks along the rank, knight covers escape squares
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Anastasia\'s Mate - rook and knight pattern', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: 'KNIGHT', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // This is Anastasia's mate pattern
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Ladder Mate - two rooks checkmate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 7, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 1 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 2 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 7 }, { type: 'KING', color: 'WHITE' });

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

      // King is driven to the edge by the "ladder" of rooks
      expect(game.getValidMoves()).toHaveLength(0);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Epaulette Mate - queen checkmate with own pieces blocking', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: 'QUEEN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // King is trapped by its own pieces (rooks acting like epaulettes)
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });
  });

  describe('Advanced Checkmate Patterns', () => {
    test('Boden\'s Mate - two bishops on crossing diagonals', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 2, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: 'BISHOP', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 5 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 4 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // Two bishops deliver mate on crossing diagonals
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Morphy\'s Mate - bishop and rook pattern', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 4 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // Classic Morphy's mate pattern
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Damiano\'s Mate - queen and pawn pattern', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 5 }, { type: 'QUEEN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // Damiano's mate with queen and pawn
      expect(game.isInCheck()).toBe(true);
      expect(game.getGameResult()).toBe('WHITE_WINS');
    });

    test('Lolli\'s Mate - queen and pawn sacrifice mate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 6, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 7 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 4 }, { type: 'QUEEN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });

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

      // Queen sacrifice leads to mate
      const sacrifice = game.makeMove({ file: 3, rank: 4 }, { file: 6, rank: 7 });
      expect(sacrifice).not.toBeNull();
      
      if (sacrifice) {
        // After Qxg8+ Kxg8, pawn promotes with mate
        const kingTakes = sacrifice.makeMove({ file: 6, rank: 7 }, { file: 3, rank: 4 });
        expect(kingTakes).not.toBeNull();
        
        if (kingTakes) {
          const pawnPromotes = kingTakes.makeMove({ file: 5, rank: 6 }, { file: 5, rank: 7 });
          expect(pawnPromotes).not.toBeNull();
          
          if (pawnPromotes) {
            expect(pawnPromotes.isInCheck()).toBe(true);
            expect(pawnPromotes.getGameResult()).toBe('WHITE_WINS');
          }
        }
      }
    });
  });

  describe('Puzzle-like Checkmates', () => {
    test('Opera House Game finale - sacrifice and mate', () => {
      // Position after 15...b5 in the Opera Game
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 2, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 7 }, { type: 'KNIGHT', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 5 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      
      testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: 'KNIGHT', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 4 }, { type: 'BISHOP', color: 'WHITE' });

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
        fullmoveNumber: 16,
      });

      // The famous 16. Nxd7! sacrifice
      const sacrifice = game.makeMove({ file: 4, rank: 5 }, { file: 3, rank: 7 });
      expect(sacrifice).not.toBeNull();
      
      if (sacrifice) {
        // This sets up a forced mate
        expect(sacrifice.isInCheck()).toBe(true);
      }
    });

    test('Petrov Defense trap - queen sacrifice mate', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 6 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 4 }, { type: 'KNIGHT', color: 'BLACK' });
      
      testBoard = setPieceAt(testBoard, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 0 }, { type: 'QUEEN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 4 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 2 }, { type: 'KNIGHT', color: 'WHITE' });

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

      // Queen sacrifice for mate
      const sacrifice = game.makeMove({ file: 3, rank: 0 }, { file: 5, rank: 4 });
      expect(sacrifice).not.toBeNull();
      
      if (sacrifice) {
        // After Nxq, Nd4+ and mate follows
        const capture = sacrifice.makeMove({ file: 5, rank: 4 }, { file: 3, rank: 0 });
        expect(capture).not.toBeNull();
        
        if (capture) {
          const check = capture.makeMove({ file: 5, rank: 2 }, { file: 3, rank: 3 });
          expect(check).not.toBeNull();
          
          if (check) {
            expect(check.isInCheck()).toBe(true);
          }
        }
      }
    });
  });
});
