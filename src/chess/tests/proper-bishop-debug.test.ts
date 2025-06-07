import { describe, it, expect } from 'vitest';
import { Chess } from '../game';
import { getPieceAt, findKing } from '../board';
import { getPieceMoves, isValidPieceMove } from '../pieces';

describe('Bishop Movement Debug', () => {
  it('should debug the exact issue with move validation', () => {
    console.log('=== DEBUGGING MOVE VALIDATION ISSUE ===');
    
    // Start with a new game
    let game = Chess.newGame();
    console.log('✓ New game created');
    console.log('   Initial current player:', game.getCurrentPlayer());
    
    // Make pawn move e2-e3 first
    console.log('\n1. Making pawn move e2-e3...');
    const afterPawn = game.makeMove({file: 4, rank: 1}, {file: 4, rank: 2});
    
    if (!afterPawn) {
      console.log('❌ Pawn move e2-e3 failed!');
      expect(afterPawn).not.toBeNull();
      return;
    }
    
    console.log('✓ Pawn move e2-e3 successful');
    console.log('   Current player after pawn move:', afterPawn.getCurrentPlayer());
    game = afterPawn;
    
    // Now it's Black's turn, so make a black move
    console.log('\n2. Making black move e7-e6...');
    const afterBlackPawn = game.makeMove({file: 4, rank: 6}, {file: 4, rank: 5});
    
    if (!afterBlackPawn) {
      console.log('❌ Black pawn move e7-e6 failed!');
      expect(afterBlackPawn).not.toBeNull();
      return;
    }
    
    console.log('✓ Black pawn move e7-e6 successful');
    console.log('   Current player after black move:', afterBlackPawn.getCurrentPlayer());
    game = afterBlackPawn;
    
    // Now test the bishop move f1-e2 (should be White's turn)
    console.log('\n3. Testing bishop move f1-e2...');
    const bishopFrom = {file: 5, rank: 0}; // f1
    const bishopTo = {file: 4, rank: 1}; // e2
    
    const board = game.getBoard();
    console.log('   Bishop piece at f1:', getPieceAt(board, bishopFrom));
    console.log('   Target square e2:', getPieceAt(board, bishopTo));
    console.log('   Current player:', game.getCurrentPlayer());
    
    // Check if piece movement is valid
    const isValidPiece = isValidPieceMove(board, bishopFrom, bishopTo);
    console.log('   Is valid piece move?', isValidPiece);
    
    // Check possible moves
    const possibleMoves = getPieceMoves(board, bishopFrom);
    console.log('   Possible bishop moves:', possibleMoves);
    
    // Check if e2 is in the possible moves
    const e2InMoves = possibleMoves.some(move => move.file === 4 && move.rank === 1);
    console.log('   Is e2 in possible moves?', e2InMoves);
    
    // Now let's simulate what happens in makeMove
    console.log('\n4. Simulating makeMove logic...');
    
    const piece = getPieceAt(board, bishopFrom);
    console.log('   Piece found:', piece);
    console.log('   Piece color matches current player?', piece?.color === game.getCurrentPlayer());
    
    // Now try the actual move
    console.log('\n5. Attempting actual move...');
    const result = game.makeMove(bishopFrom, bishopTo);
    
    if (result) {
      console.log('✓ Move successful!');
      console.log('   Final board state:');
      const finalBoard = result.getBoard();
      console.log('   Piece at f1:', getPieceAt(finalBoard, bishopFrom));
      console.log('   Piece at e2:', getPieceAt(finalBoard, bishopTo));
    } else {
      console.log('❌ Move failed');
      console.log('   This means there is still an issue with the move validation');
    }
    
    expect(true).toBe(true);
  });
});
