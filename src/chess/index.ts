// Public API for the chess module

export { Chess } from './game';
export type {
  Color,
  PieceType,
  Piece,
  Square,
  Move,
  Board,
  GameState,
  Position,
  GameResult,
} from './types';

export {
  createEmptyBoard,
  createInitialBoard,
  getPieceAt,
  setPieceAt,
  isValidSquare,
  algebraicToSquare,
  squareToAlgebraic,
  isSquareOccupiedBy,
  isSquareEmpty,
  getSquaresByColor,
  findKing,
  FILES,
  RANKS,
} from './board';

export {
  getPieceMoves,
  isValidPieceMove,
} from './pieces';