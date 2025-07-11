import type { Board, Color, Piece, PieceType, Square } from "..";

export const FILES = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function createEmptyBoard(): Board {
    return Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
}

export function createInitialBoard(): Board {
    const board = createEmptyBoard();

    const backRankPieces: PieceType[] = [
        "ROOK",
        "KNIGHT",
        "BISHOP",
        "QUEEN",
        "KING",
        "BISHOP",
        "KNIGHT",
        "ROOK",
    ];

    for (let file = 0; file < 8; file++) {
        const pieceType = backRankPieces[file];
        if (pieceType) {
            // White back rank
            if (board[0]) board[0][file] = { type: pieceType, color: "WHITE" };
            // White pawns
            if (board[1]) board[1][file] = { type: "PAWN", color: "WHITE" };
            // Black pawns
            if (board[6]) board[6][file] = { type: "PAWN", color: "BLACK" };
            // Black back rank
            if (board[7]) board[7][file] = { type: pieceType, color: "BLACK" };
        }
    }

    return board;
}

export function getPieceAt(board: Board, square: Square): Piece | null {
    if (!isValidSquare(square)) return null;
    return board[square.rank]?.[square.file] ?? null;
}

export function setPieceAt(
    board: Board,
    square: Square,
    piece: Piece | null,
): Board {
    if (!isValidSquare(square)) return board;

    const newBoard = board.map((rank: (Piece | null)[]) => [...rank]);
    const targetRank = newBoard[square.rank];
    if (targetRank) {
        targetRank[square.file] = piece;
    }
    return newBoard;
}

export function isValidSquare(square: Square): boolean {
    return (
        square.file >= 0 &&
        square.file < 8 &&
        square.rank >= 0 &&
        square.rank < 8
    );
}

export function isSquareOccupiedBy(
    board: Board,
    square: Square,
    color: Color,
): boolean {
    const piece = getPieceAt(board, square);
    return piece !== null && piece.color === color;
}

export function isSquareEmpty(board: Board, square: Square): boolean {
    return getPieceAt(board, square) === null;
}

export function getSquaresByColor(board: Board, color: Color): Square[] {
    const squares: Square[] = [];

    for (let rank = 0; rank < 8; rank++) {
        for (let file = 0; file < 8; file++) {
            const square = { file, rank };
            if (isSquareOccupiedBy(board, square, color)) {
                squares.push(square);
            }
        }
    }

    return squares;
}

export function findKing(board: Board, color: Color): Square | null {
    for (let rank = 0; rank < 8; rank++) {
        const boardRank = board[rank];
        if (boardRank) {
            for (let file = 0; file < 8; file++) {
                const piece = boardRank[file];
                if (piece && piece.type === "KING" && piece.color === color) {
                    return { file, rank };
                }
            }
        }
    }
    return null;
}