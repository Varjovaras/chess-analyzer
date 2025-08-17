// Re-export from the new modular board structure
export {
    FILES,
    RANKS,
    createEmptyBoard,
    createInitialBoard,
    getPieceAt,
    setPieceAt,
    isValidSquare,
    isSquareOccupiedBy,
    isSquareEmpty,
    getSquaresByColor,
    findKing,
} from "./board/board";

export {
    algebraicToSquare,
    squareToAlgebraic,
    parseSquareList,
    formatSquareList,
    isValidAlgebraicNotation,
} from "./board/notation";
