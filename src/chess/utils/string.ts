// String utilities for chess notation

export function fileCharToIndex(fileChar: string): number | null {
  if (fileChar.length !== 1) return null;
  
  const fileCharCode = fileChar.charCodeAt(0);
  
  // Handle both lowercase (a-h: 97-104) and uppercase (A-H: 65-72)
  if (fileCharCode >= 97 && fileCharCode <= 104) {
    // lowercase a-h
    return fileCharCode - 97;
  }
  
  if (fileCharCode >= 65 && fileCharCode <= 72) {
    // uppercase A-H
    return fileCharCode - 65;
  }
  
  return null; // Invalid file character
}

export function fileIndexToChar(fileIndex: number): string | null {
  if (fileIndex < 0 || fileIndex > 7) return null;
  return String.fromCharCode(97 + fileIndex); // 97 is 'a'
}

export function rankCharToIndex(rankChar: string): number | null {
  if (rankChar.length !== 1) return null;
  
  const rank = Number.parseInt(rankChar);
  if (rank >= 1 && rank <= 8) {
    return rank - 1;
  }
  
  return null;
}

export function rankIndexToChar(rankIndex: number): string | null {
  if (rankIndex < 0 || rankIndex > 7) return null;
  return (rankIndex + 1).toString();
}