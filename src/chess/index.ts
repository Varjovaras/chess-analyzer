// Public API for the chess module

// Main game class
export { Chess } from "./game";

// Type definitions
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
} from "./types";

// Board utilities
export {
    createEmptyBoard,
    createInitialBoard,
    getPieceAt,
    setPieceAt,
    isValidSquare,
    algebraicToSquare,
    squareToAlgebraic,
    parseSquareList,
    formatSquareList,
    isValidAlgebraicNotation,
    isSquareOccupiedBy,
    isSquareEmpty,
    getSquaresByColor,
    findKing,
    FILES,
    RANKS,
} from "./board";

// Piece movement logic
export {
    getPieceMoves,
    isValidPieceMove,
    isSquareUnderAttackBy,
    getPawnMoves,
    isPawnAttackingSquare,
    getRookMoves,
    isRookAttackingSquare,
    getKnightMoves,
    isKnightAttackingSquare,
    getBishopMoves,
    isBishopAttackingSquare,
    getQueenMoves,
    isQueenAttackingSquare,
    getKingMoves,
    isKingAttackingSquare,
} from "./pieces";

// Game rules
export {
    canCastleKingside,
    canCastleQueenside,
    updateCastlingRights,
    getCastlingMoves,
    isCastlingMove,
    getCastlingType,
} from "./rules/castling";

export {
    isKingInCheck,
    isSquareAttackedBy,
    getAttackingPieces,
    isDoubleCheck,
    getCheckingPieces,
    canBlockCheck,
    wouldMoveResolveCheck,
    isPiecePinned,
} from "./rules/check-detection";

export {
    isInsufficientMaterial,
    countMaterial,
    isFiftyMoveRule,
    isThreefoldRepetition,
    isStalemate,
    evaluateDrawConditions,
    getTotalMaterialValue,
    hasMinimumMatingMaterial,
} from "./rules/draw-conditions";

// Game state management
export {
    createInitialGameState,
    cloneGameState,
    switchPlayer,
    updateMoveCounters,
    addMoveToHistory,
    getLastMove,
    getMoveNumber,
    getHalfmoveClock,
    isPawnMove,
    isCaptureMove,
    wasCaptureOrPawnMove,
    isGameStateEqual,
    validateGameState,
    getGameStateSignature,
} from "./game/game-state";

export {
    isValidMove,
    isValidCastlingMove,
    simulateMove,
    wouldMoveExposeKing,
    isMoveLegal,
    validateMoveSequence,
    getMoveValidationError,
    isSquareAttacked,
    canPieceReachSquare,
    isKingInCheckAfterMove,
} from "./game/move-validation";

// String utilities
export {
    fileCharToIndex,
    fileIndexToChar,
    rankCharToIndex,
    rankIndexToChar,
} from "./utils";
