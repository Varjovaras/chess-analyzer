import { describe, test, expect } from 'vitest';
import { Chess, createEmptyBoard, setPieceAt, algebraicToSquare } from '../index';

describe('Famous Chess Positions and Games', () => {
  describe('Famous Quick Checkmates', () => {
    test('Fool\'s Mate - fastest possible checkmate', () => {
      let game = Chess.newGame();
      
      // 1. f3 e5
      game = game.makeMove(algebraicToSquare('f2')!, algebraicToSquare('f3')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      
      // 2. g4 Qh4# - checkmate in 2 moves
      game = game.makeMove(algebraicToSquare('g2')!, algebraicToSquare('g4')!)!;
      const result = game.makeMove(algebraicToSquare('d8')!, algebraicToSquare('h4')!)!;
      
      expect(result.isInCheck()).toBe(true);
      expect(result.getGameResult()).toBe('BLACK_WINS');
    });

    test('Légal\'s Mate - famous trap', () => {
      let game = Chess.newGame();
      
      // 1. e4 e5 2. Nf3 d6 3. Bc4 Bg4
      game = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e4')!)!;
      game = game.makeMove(algebraicToSquare('e7')!, algebraicToSquare('e5')!)!;
      game = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!)!;
      game = game.makeMove(algebraicToSquare('d7')!, algebraicToSquare('d6')!)!;
      game = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('c4')!)!;
      game = game.makeMove(algebraicToSquare('c8')!, algebraicToSquare('g4')!)!;
      
      // 4. Nc3 g6? 5. Nxe5! - sacrificing the queen
      game = game.makeMove(algebraicToSquare('b1')!, algebraicToSquare('c3')!)!;
      game = game.makeMove(algebraicToSquare('g7')!, algebraicToSquare('g6')!)!;
      game = game.makeMove(algebraicToSquare('f3')!, algebraicToSquare('e5')!)!; // Sacrifices queen to Bxd1
      
      // Black takes the queen: 5...Bxd1
      game = game.makeMove(algebraicToSquare('g4')!, algebraicToSquare('d1')!)!;
      
      // 6. Bxf7+ Ke7 7. Nd5# - checkmate
      game = game.makeMove(algebraicToSquare('c4')!, algebraicToSquare('f7')!)!; // Check
      expect(game.isInCheck()).toBe(true);
      
      game = game.makeMove(algebraicToSquare('e8')!, algebraicToSquare('e7')!)!; // Forced king move
      const finalMove = game.makeMove(algebraicToSquare('c3')!, algebraicToSquare('d5')!)!; // Checkmate
      
      expect(finalMove.isInCheck()).toBe(true);
      expect(finalMove.getGameResult()).toBe('WHITE_WINS');
    });

    test('Anderssen\'s Immortal Game - famous sacrifice position', () => {
      // Recreate position after 17...Qa6 from the Immortal Game
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 4 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 4 }, { type: 'KNIGHT', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 3 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 5, rank: 2 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 6, rank: 1 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 1 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 5 }, { type: 'QUEEN', color: 'BLACK' });

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
        fullmoveNumber: 18,
      });

      // 18. Be7!! - the brilliant sacrifice move
      const result = game.makeMove({ file: 5, rank: 4 }, { file: 4, rank: 6 });
      expect(result).not.toBeNull();
      
      // This sets up a beautiful mating attack
      expect(result!.getBoard()[6]![4]?.type).toBe('BISHOP');
    });
  });

  describe('Famous Endgame Positions', () => {
    test('Lucena Position - rook endgame technique', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 6 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: 'KING', color: 'BLACK' });
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

      // This is a winning position for White with correct technique
      expect(game.getGameResult()).toBe('ONGOING');
      expect(game.getValidMoves().length).toBeGreaterThan(0);
    });

    test('Philidor Position - drawing technique in rook endgame', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 5 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 5 }, { type: 'ROOK', color: 'BLACK' });

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

      // Black can hold a draw with correct defense
      expect(game.getGameResult()).toBe('ONGOING');
      expect(game.getValidMoves().length).toBeGreaterThan(0);
    });

    test('Opposition in king and pawn endgame', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 4 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: 'KING', color: 'BLACK' });

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

      // Black has the opposition and can draw
      expect(game.getGameResult()).toBe('ONGOING');
      
      // Test key moves in the position
      const kingMoves = game.getValidMoves().filter(move => 
        move.piece.type === 'KING'
      );
      expect(kingMoves.length).toBeGreaterThan(0);
    });
  });

  describe('Famous Tactical Motifs', () => {
    test('Fork - knight attacking king and queen', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 0 }, { type: 'QUEEN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 1 }, { type: 'KNIGHT', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'WHITE' });

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

      // Knight can fork king and queen
      const forkMove = game.makeMove({ file: 2, rank: 1 }, { file: 1, rank: 3 });
      expect(forkMove).not.toBeNull();
      
      if (forkMove) {
        expect(forkMove.isInCheck()).toBe(true); // King is in check
        // Queen is also attacked (we'd need to verify this with a helper function)
      }
    });

    test('Pin - bishop pinning rook to king', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 1 }, { type: 'ROOK', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 2 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'WHITE' });

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

      // Rook cannot move off the diagonal because it would expose the king
      const rookMove = game.makeMove({ file: 1, rank: 1 }, { file: 1, rank: 4 });
      expect(rookMove).toBeNull(); // Should be illegal due to pin
    });

    test('Discovered Check - moving piece reveals check', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 4, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: 'BISHOP', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 6 }, { type: 'ROOK', color: 'WHITE' });
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

      // Moving the bishop discovers check from the rook
      const discoveredCheck = game.makeMove({ file: 4, rank: 4 }, { file: 6, rank: 2 });
      expect(discoveredCheck).not.toBeNull();
      
      if (discoveredCheck) {
        expect(discoveredCheck.isInCheck()).toBe(true);
      }
    });

    test('Skewer - attacking valuable piece behind less valuable one', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 1, rank: 0 }, { type: 'QUEEN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 0 }, { type: 'ROOK', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'WHITE' });

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

      // King must move, exposing the queen to capture
      expect(game.isInCheck()).toBe(true);
      
      const kingMoves = game.getValidMoves().filter(move => 
        move.piece.type === 'KING'
      );
      expect(kingMoves.length).toBeGreaterThan(0);
    });
  });

  describe('Complex Pawn Structures', () => {
    test('Passed pawn race', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 0, rank: 6 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 1 }, { type: 'PAWN', color: 'BLACK' });

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

      // Both sides have passed pawns - it's a race to promote
      expect(game.getGameResult()).toBe('ONGOING');
      
      const pawnMoves = game.getValidMoves().filter(move => 
        move.piece.type === 'PAWN'
      );
      expect(pawnMoves.length).toBeGreaterThan(0);
    });

    test('Pawn breakthrough', () => {
      const board = createEmptyBoard();
      let testBoard = setPieceAt(board, { file: 0, rank: 0 }, { type: 'KING', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 7, rank: 7 }, { type: 'KING', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 4 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 3, rank: 4 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 4 }, { type: 'PAWN', color: 'WHITE' });
      testBoard = setPieceAt(testBoard, { file: 2, rank: 5 }, { type: 'PAWN', color: 'BLACK' });
      testBoard = setPieceAt(testBoard, { file: 4, rank: 5 }, { type: 'PAWN', color: 'BLACK' });

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

      // White can sacrifice a pawn to break through
      const breakthrough = game.makeMove({ file: 3, rank: 4 }, { file: 3, rank: 5 });
      expect(breakthrough).not.toBeNull();
      
      if (breakthrough) {
        // This creates a passed pawn for white
        const validMoves = breakthrough.getValidMoves();
        expect(validMoves.length).toBeGreaterThan(0);
      }
    });
  });
});
