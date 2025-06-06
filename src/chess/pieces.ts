// Basic piece movement logic

import type { Board, Piece, Square, Move, Color } from './types';
import { isValidSquare, getPieceAt, isSquareEmpty, isSquareOccupiedBy } from './board';

/**
 * Gets all possible moves for a piece at a given square
 */
export function getPieceMoves(board: Board, square: Square): Square[] {
  const piece = getPieceAt(board, square);
  if (!piece) return [];

  switch (piece.type) {
    case 'PAWN':
      return getPawnMoves(board, square, piece.color);
    case 'ROOK':
      return getRookMoves(board, square, piece.color);
    case 'KNIGHT':
      return getKnightMoves(board, square, piece.color);
    case 'BISHOP':
      return getBishopMoves(board, square, piece.color);
    case 'QUEEN':
      return getQueenMoves(board, square, piece.color);
    case 'KING':
      return getKingMoves(board, square, piece.color);
    default:
      return [];
  }
}

/**
 * Pawn movement logic
 */
function getPawnMoves(board: Board, square: Square, color: Color): Square[] {
  const moves: Square[] = [];
  const direction = color === 'WHITE' ? 1 : -1;
  const startRank = color === 'WHITE' ? 1 : 6;

  // One square forward
  const oneForward = { file: square.file, rank: square.rank + direction };
  if (isValidSquare(oneForward) && isSquareEmpty(board, oneForward)) {
    moves.push(oneForward);

    // Two squares forward from starting position
    if (square.rank === startRank) {
      const twoForward = { file: square.file, rank: square.rank + 2 * direction };
      if (isValidSquare(twoForward) && isSquareEmpty(board, twoForward)) {
        moves.push(twoForward);
      }
    }
  }

  // Captures (diagonal)
  const captureLeft = { file: square.file - 1, rank: square.rank + direction };
  const captureRight = { file: square.file + 1, rank: square.rank + direction };

  if (isValidSquare(captureLeft) && isSquareOccupiedBy(board, captureLeft, color === 'WHITE' ? 'BLACK' : 'WHITE')) {
    moves.push(captureLeft);
  }
  if (isValidSquare(captureRight) && isSquareOccupiedBy(board, captureRight, color === 'WHITE' ? 'BLACK' : 'WHITE')) {
    moves.push(captureRight);
  }

  return moves;
}

/**
 * Rook movement logic (horizontal and vertical lines)
 */
function getRookMoves(board: Board, square: Square, color: Color): Square[] {
  const moves: Square[] = [];
  const directions = [
    { file: 0, rank: 1 },   // up
    { file: 0, rank: -1 },  // down
    { file: 1, rank: 0 },   // right
    { file: -1, rank: 0 }   // left
  ];

  for (const direction of directions) {
    moves.push(...getLineMoves(board, square, direction, color));
  }

  return moves;
}

/**
 * Knight movement logic (L-shapes)
 */
function getKnightMoves(board: Board, square: Square, color: Color): Square[] {
  const moves: Square[] = [];
  const knightMoves = [
    { file: 2, rank: 1 }, { file: 2, rank: -1 },
    { file: -2, rank: 1 }, { file: -2, rank: -1 },
    { file: 1, rank: 2 }, { file: 1, rank: -2 },
    { file: -1, rank: 2 }, { file: -1, rank: -2 }
  ];

  for (const move of knightMoves) {
    const target = { file: square.file + move.file, rank: square.rank + move.rank };
    if (isValidSquare(target) && !isSquareOccupiedBy(board, target, color)) {
      moves.push(target);
    }
  }

  return moves;
}

/**
 * Bishop movement logic (diagonal lines)
 */
function getBishopMoves(board: Board, square: Square, color: Color): Square[] {
  const moves: Square[] = [];
  const directions = [
    { file: 1, rank: 1 },   // up-right
    { file: 1, rank: -1 },  // down-right
    { file: -1, rank: 1 },  // up-left
    { file: -1, rank: -1 }  // down-left
  ];

  for (const direction of directions) {
    moves.push(...getLineMoves(board, square, direction, color));
  }

  return moves;
}

/**
 * Queen movement logic (combines rook and bishop)
 */
function getQueenMoves(board: Board, square: Square, color: Color): Square[] {
  return [
    ...getRookMoves(board, square, color),
    ...getBishopMoves(board, square, color)
  ];
}

/**
 * King movement logic (one square in any direction)
 */
function getKingMoves(board: Board, square: Square, color: Color): Square[] {
  const moves: Square[] = [];
  const kingMoves = [
    { file: 0, rank: 1 }, { file: 0, rank: -1 },   // up, down
    { file: 1, rank: 0 }, { file: -1, rank: 0 },   // right, left
    { file: 1, rank: 1 }, { file: 1, rank: -1 },   // diagonals
    { file: -1, rank: 1 }, { file: -1, rank: -1 }
  ];

  for (const move of kingMoves) {
    const target = { file: square.file + move.file, rank: square.rank + move.rank };
    if (isValidSquare(target) && !isSquareOccupiedBy(board, target, color)) {
      moves.push(target);
    }
  }

  return moves;
}

/**
 * Helper function for sliding pieces (rook, bishop, queen)
 * Gets moves along a line until blocked or edge of board
 */
function getLineMoves(board: Board, square: Square, direction: { file: number; rank: number }, color: Color): Square[] {
  const moves: Square[] = [];
  const current = {
    file: square.file + direction.file,
    rank: square.rank + direction.rank
  };

  while (isValidSquare(current)) {
    if (isSquareEmpty(board, current)) {
      moves.push({ ...current });
    } else {
      // Blocked by a piece
      if (!isSquareOccupiedBy(board, current, color)) {
        // Can capture opponent's piece
        moves.push({ ...current });
      }
      break; // Stop sliding in this direction
    }

    current.file += direction.file;
    current.rank += direction.rank;
  }

  return moves;
}

/**
 * Checks if a move is a valid piece movement (doesn't check game rules like check)
 */
export function isValidPieceMove(board: Board, from: Square, to: Square): boolean {
  const piece = getPieceAt(board, from);
  if (!piece) return false;

  const possibleMoves = getPieceMoves(board, from);
  return possibleMoves.some(move => move.file === to.file && move.rank === to.rank);
}