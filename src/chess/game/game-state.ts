import type { GameState, Board, Color, Move } from "../types";
import { createInitialBoard } from "../board";

export function getGameStateSignature(state: GameState): string {
    // Create a simplified signature for position comparison
    // This is used for repetition detection
    const boardStr = state.board
        .map((rank) =>
            rank
                .map((piece) => (piece ? `${piece.type}${piece.color}` : "."))
                .join(""),
        )
        .join("");

    const castlingStr = [
        state.castlingRights.whiteKingside ? "K" : "",
        state.castlingRights.whiteQueenside ? "Q" : "",
        state.castlingRights.blackKingside ? "k" : "",
        state.castlingRights.blackQueenside ? "q" : "",
    ].join("");

    const enPassantStr = state.enPassantTarget
        ? `${state.enPassantTarget.file}${state.enPassantTarget.rank}`
        : "-";

    return `${boardStr}|${state.currentPlayer}|${castlingStr}|${enPassantStr}`;
}

export function createInitialGameState(): GameState {
    const initialState: GameState = {
        board: createInitialBoard(),
        currentPlayer: "WHITE" as Color,
        moveHistory: [],
        castlingRights: {
            whiteKingside: true,
            whiteQueenside: true,
            blackKingside: true,
            blackQueenside: true,
        },
        enPassantTarget: null,
        halfmoveClock: 0,
        fullmoveNumber: 1,
    };

    // Add the initial position to history
    initialState.positionHistory = [getGameStateSignature(initialState)];
    return initialState;
}

export function cloneGameState(state: GameState): GameState {
    // Handle backward compatibility for states without positionHistory
    const positionHistory = state.positionHistory || [];

    return {
        board: state.board.map((rank) => [...rank]),
        currentPlayer: state.currentPlayer,
        moveHistory: [...state.moveHistory],
        castlingRights: { ...state.castlingRights },
        enPassantTarget: state.enPassantTarget
            ? { ...state.enPassantTarget }
            : null,
        halfmoveClock: state.halfmoveClock,
        fullmoveNumber: state.fullmoveNumber,
        positionHistory: [...positionHistory],
    };
}

export function switchPlayer(color: Color): Color {
    return color === "WHITE" ? "BLACK" : "WHITE";
}

export function updateMoveCounters(
    state: GameState,
    move: Move,
    wasCaptureOrPawnMove: boolean,
): { halfmoveClock: number; fullmoveNumber: number } {
    const halfmoveClock = wasCaptureOrPawnMove ? 0 : state.halfmoveClock + 1;
    const fullmoveNumber =
        state.currentPlayer === "BLACK"
            ? state.fullmoveNumber + 1
            : state.fullmoveNumber;

    return { halfmoveClock, fullmoveNumber };
}

export function addMoveToHistory(state: GameState, move: Move): Move[] {
    return [...state.moveHistory, move];
}

export function addPositionToHistory(
    state: GameState,
    newState: GameState,
): string[] {
    const positionSignature = getGameStateSignature(newState);
    const currentHistory = state.positionHistory || [];
    return [...currentHistory, positionSignature];
}

export function getLastMove(state: GameState): Move | undefined {
    return state.moveHistory.length > 0
        ? state.moveHistory[state.moveHistory.length - 1]
        : undefined;
}

export function getMoveNumber(state: GameState): number {
    return state.fullmoveNumber;
}

export function getHalfmoveClock(state: GameState): number {
    return state.halfmoveClock;
}

export function isPawnMove(move: Move): boolean {
    return move.piece.type === "PAWN";
}

export function isCaptureMove(move: Move): boolean {
    return move.captured !== undefined;
}

export function wasCaptureOrPawnMove(move: Move): boolean {
    return isPawnMove(move) || isCaptureMove(move);
}

export function isGameStateEqual(
    state1: GameState,
    state2: GameState,
): boolean {
    // Simple comparison - in a full implementation, this would need to be more thorough
    return (
        state1.currentPlayer === state2.currentPlayer &&
        state1.halfmoveClock === state2.halfmoveClock &&
        state1.fullmoveNumber === state2.fullmoveNumber &&
        JSON.stringify(state1.castlingRights) ===
            JSON.stringify(state2.castlingRights) &&
        JSON.stringify(state1.enPassantTarget) ===
            JSON.stringify(state2.enPassantTarget)
        // Note: Board comparison would need deep equality check
    );
}

export function validateGameState(state: GameState): boolean {
    // Basic validation
    if (!state.board || state.board.length !== 8) return false;
    if (!["WHITE", "BLACK"].includes(state.currentPlayer)) return false;
    if (state.halfmoveClock < 0) return false;
    if (state.fullmoveNumber < 1) return false;

    // Validate board dimensions
    for (const rank of state.board) {
        if (!rank || rank.length !== 8) return false;
    }

    return true;
}

export function countPositionOccurrences(
    positionHistory: string[],
    position: string,
): number {
    return positionHistory.filter((p) => p === position).length;
}

export function isThreefoldRepetition(
    positionHistory: string[],
    currentPosition: string,
): boolean {
    const occurrences = countPositionOccurrences(
        positionHistory,
        currentPosition,
    );
    return occurrences >= 3;
}
