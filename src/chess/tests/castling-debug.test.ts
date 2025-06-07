import { describe, test, expect } from "vitest";
import { Chess } from "../game";
import { algebraicToSquare, squareToAlgebraic } from "../board";

describe("Castling Debug Tests", () => {
    test("basic castling setup", () => {
        let game = Chess.newGame();
        
        console.log("Initial castling rights:", game.getState().castlingRights);
        
        // Move knight out of the way
        game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!;
        expect(game).not.toBeNull();
        
        // Black move
        game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!)!;
        expect(game).not.toBeNull();
        
        // Check what moves are available for the bishop
        const validMoves = game.getValidMoves();
        const bishopMoves = validMoves.filter(move => 
            move.piece.type === "BISHOP" && 
            move.from.file === 5 && move.from.rank === 0
        );
        
        console.log("Bishop moves from f1:");
        bishopMoves.forEach(move => {
            console.log(`  to ${squareToAlgebraic(move.to)}`);
        });
        
        expect(bishopMoves.length).toBeGreaterThan(0);
        
        // Move bishop to clear the path
        const bishopToE2 = bishopMoves.find(move => 
            move.to.file === 4 && move.to.rank === 1
        );
        
        if (bishopToE2) {
            game = game.makeMove(bishopToE2.from, bishopToE2.to)!;
            expect(game).not.toBeNull();
        }
        
        // Another black move
        game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!;
        expect(game).not.toBeNull();
        
        // Now check for castling moves
        const finalMoves = game.getValidMoves();
        const kingMoves = finalMoves.filter(move => move.piece.type === "KING");
        
        console.log("King moves available:");
        kingMoves.forEach(move => {
            console.log(`  from ${squareToAlgebraic(move.from)} to ${squareToAlgebraic(move.to)}`);
            if (move.castling) {
                console.log(`    This is ${move.castling} castling`);
            }
        });
        
        const castlingMoves = finalMoves.filter(move => move.castling);
        console.log(`Found ${castlingMoves.length} castling moves`);
        
        expect(castlingMoves.length).toBeGreaterThan(0);
    });
    
    test("manual castling attempt", () => {
        let game = Chess.newGame();
        
        // Clear kingside path
        game = game.makeMove(algebraicToSquare("g1")!, algebraicToSquare("f3")!)!; // Knight
        game = game.makeMove(algebraicToSquare("e7")!, algebraicToSquare("e6")!)!; // Black pawn
        game = game.makeMove(algebraicToSquare("f1")!, algebraicToSquare("e2")!)!; // Bishop
        game = game.makeMove(algebraicToSquare("d7")!, algebraicToSquare("d6")!)!; // Black pawn
        
        console.log("Castling rights before attempt:", game.getState().castlingRights);
        console.log("Current player:", game.getCurrentPlayer());
        console.log("Is in check:", game.isInCheck());
        
        // Try to castle kingside
        const castlingAttempt = game.makeMove(
            algebraicToSquare("e1")!,
            algebraicToSquare("g1")!
        );
        
        if (castlingAttempt) {
            console.log("Castling succeeded!");
            const board = castlingAttempt.getBoard();
            console.log("King on g1:", board[0]![6]?.type === "KING");
            console.log("Rook on f1:", board[0]![5]?.type === "ROOK");
        } else {
            console.log("Castling failed");
            
            // Check what moves ARE available for the king
            const kingMoves = game.getValidMoves().filter(move => move.piece.type === "KING");
            console.log("Available king moves:");
            kingMoves.forEach(move => {
                console.log(`  ${squareToAlgebraic(move.from)} -> ${squareToAlgebraic(move.to)}`);
            });
        }
        
        expect(castlingAttempt).not.toBeNull();
    });
});