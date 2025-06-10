// Core chess types and interfaces

export type Color = 'WHITE' | 'BLACK';

export type PieceType = 'PAWN' | 'ROOK' | 'KNIGHT' | 'BISHOP' | 'QUEEN' | 'KING';

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Square {
  file: number; // 0-7 (a-h)
  rank: number; // 0-7 (1-8)
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  captured?: Piece;
  promotion?: PieceType;
  castling?: 'KINGSIDE' | 'QUEENSIDE';
  enPassant?: boolean;
}

export type Board = (Piece | null)[][];

export interface GameState {
  board: Board;
  currentPlayer: Color;
  moveHistory: Move[];
  castlingRights: {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
  };
  enPassantTarget: Square | null;
  halfmoveClock: number; // For 50-move rule
  fullmoveNumber: number;
}

export interface Position {
  fen: string;
  board: Board;
}

export type GameResult = 'WHITE_WINS' | 'BLACK_WINS' | 'DRAW' | 'ONGOING';
