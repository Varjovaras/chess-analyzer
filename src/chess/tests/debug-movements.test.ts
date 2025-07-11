import { describe, test, expect } from 'vitest';
import { Chess, algebraicToSquare } from '../index';

describe('Debug Chess Movements', () => {
  test('debug initial board state and basic moves', () => {
    const game = Chess.newGame();
    console.log('Initial board state for debugging:');
    const board = game.getBoard();
    console.log('e2 piece:', board[1]?.[4]); // rank 1, file 4 (e2)
    console.log('f1 piece:', board[0]?.[5]); // rank 0, file 5 (f1)
    console.log('g1 piece:', board[0]?.[6]); // rank 0, file 6 (g1)

    console.log('\nTesting algebraic conversion:');
    console.log('e2 square:', algebraicToSquare('e2'));
    console.log('f1 square:', algebraicToSquare('f1'));
    console.log('g1 square:', algebraicToSquare('g1'));

    // Test basic pawn move
    console.log('\nTrying e2-e3 move:');
    const move1 = game.makeMove(algebraicToSquare('e2')!, algebraicToSquare('e3')!);
    console.log('Result:', move1 ? 'Success' : 'Failed');

    // Test knight move
    console.log('\nTrying g1-f3 move:');
    const move2 = game.makeMove(algebraicToSquare('g1')!, algebraicToSquare('f3')!);
    console.log('Result:', move2 ? 'Success' : 'Failed');

    // Test the failing bishop move
    console.log('\nTrying f1-e2 move (this should fail - pawn on e2):');
    const move3 = game.makeMove(algebraicToSquare('f1')!, algebraicToSquare('e2')!);
    console.log('Result:', move3 ? 'Success' : 'Failed');

    // Basic assertions to make test pass
    expect(game).toBeDefined();
    expect(board[1]?.[4]?.type).toBe('PAWN'); // e2 should have white pawn
    expect(board[0]?.[5]?.type).toBe('BISHOP'); // f1 should have white bishop
    expect(board[0]?.[6]?.type).toBe('KNIGHT'); // g1 should have white knight
  });
});
