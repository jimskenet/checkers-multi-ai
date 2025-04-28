import board from '../board';
import Piece, { Color } from '../piece';
import { cloneDeep } from 'lodash';

const BLACK: Color = 'BLACK';
const WHITE: Color = 'WHITE';

export function minimax(
  position: board,
  depth: number,
  maxPlayer: boolean,
  aiColor: Color = WHITE 
): [number, board | null] {
  if (depth === 0 || position.winner() !== null) {
    return [position.evaluate(aiColor), position];   
  }

  const currentPlayerColor = maxPlayer 
    ? aiColor 
    : (aiColor === WHITE ? BLACK : WHITE);
    
  if (maxPlayer) {
    let maxEval = -Infinity;
    let bestMove: board | null = null;
    const moves = getAllMoves(position, currentPlayerColor);

    for (const move of moves) {
      const evaluation = minimax(move, depth - 1, false, aiColor)[0];
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
    }

    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    let bestMove: board | null = null;
    const moves = getAllMoves(position, currentPlayerColor);

    for (const move of moves) {
      const evaluation = minimax(move, depth - 1, true, aiColor)[0];
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
    }

    return [minEval, bestMove];
  }
}

function simulateMove(
  piece: Piece,
  move: [number, number],
  board: board,
  skip: Piece[]
): board {
  board.move(piece, move[0], move[1]);
  if (skip.length > 0) {
    board.remove(skip);
  }
  return board;
}

function getAllMoves(board: board, color: Color): board[] {
  const moves: board[] = [];
  const pieces = board.get_all_pieces(color);

  for (const piece of pieces) {
    const validMoves = board.get_valid_moves(piece);
    
    for (const [moveStr, skip] of Object.entries(validMoves)) {
      const tempboard = cloneDeep(board);
      const tempPiece = tempboard.get_piece(piece.row, piece.col);
      
      if (tempPiece) {
        const [row, col] = moveStr.split(',').map(Number);
        const newboard = simulateMove(tempPiece, [row, col], tempboard, skip);
        moves.push(newboard);
      }
    }
  }

  return moves;
}
