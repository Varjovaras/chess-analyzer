import type { Square } from "../types";
import { fileCharToIndex, rankCharToIndex, fileIndexToChar, rankIndexToChar } from "../utils/string";
import { isValidSquare } from "./board";

export function algebraicToSquare(algebraic: string): Square | null {
    if (algebraic.length !== 2) return null;

    const fileChar = algebraic[0];
    const rankChar = algebraic[1];
    if (!fileChar || !rankChar) return null;

    const file = fileCharToIndex(fileChar);
    const rank = rankCharToIndex(rankChar);

    if (file === null || rank === null) return null;

    const square = { file, rank };
    return isValidSquare(square) ? square : null;
}

export function squareToAlgebraic(square: Square): string {
    if (!isValidSquare(square)) return "";
    const file = fileIndexToChar(square.file);
    const rank = rankIndexToChar(square.rank);
    return file && rank ? file + rank : "";
}

export function parseSquareList(algebraicList: string[]): Square[] {
    return algebraicList
        .map(algebraicToSquare)
        .filter((square): square is Square => square !== null);
}

export function formatSquareList(squares: Square[]): string[] {
    return squares.map(squareToAlgebraic).filter(notation => notation !== "");
}

export function isValidAlgebraicNotation(notation: string): boolean {
    return algebraicToSquare(notation) !== null;
}