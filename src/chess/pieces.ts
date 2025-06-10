// Re-export from the new modular pieces structure
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
} from './pieces/index';