import { Board } from '../board';
import Piece, { Color } from '../piece';
import { cloneDeep } from 'lodash'; // for deep copy (install lodash if needed)

// Constants for players
const RED: Color = 'BLACK';
const WHITE: Color = 'WHITE';

// Minimax algorithm for AI
export function minimax(
  position: Board,
  depth: number,
  maxPlayer: boolean
): [number, Board] {
  const winner = position.winner();
  if (depth === 0 || winner !== null) {
    return [position.evaluate(), position];
  }

  if (maxPlayer) {
    let maxEval = -Infinity;
    let bestMove: Board | null = null;

    const moves = getAllMoves(position, WHITE);
    for (const move of moves) {
      const evaluation = minimax(move, depth - 1, false)[0];
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestMove = move;
      }
    }

    return [maxEval, bestMove!];
  } else {
    let minEval = Infinity;
    let bestMove: Board | null = null;

    const moves = getAllMoves(position, RED);
    for (const move of moves) {
      const evaluation = minimax(move, depth - 1, true)[0];
      if (evaluation < minEval) {
        minEval = evaluation;
        bestMove = move;
      }
    }

    return [minEval, bestMove!];
  }
}

// Simulate a move on a temporary board
function simulateMove(
  piece: Piece,
  move: [number, number],
  board: Board,
  skip: Piece[] | undefined
): Board {
  board.move(piece, move[0], move[1]);
  if (skip) {
    board.remove(skip);
  }
  return board;
}

// Get all possible boards after making every valid move
function getAllMoves(board: Board, color: Color): Board[] {
  const moves: Board[] = [];
  const pieces = board.get_all_pieces(color);

  for (const piece of pieces) {
    const validMoves = board.get_valid_moves(piece);

    for (const [moveStr, skip] of Object.entries(validMoves)) {
      const [row, col] = moveStr.split(',').map(Number);

      const tempBoard = cloneDeep(board);
      const tempPiece = tempBoard.get_piece(piece.row, piece.col);
      if (tempPiece) {
        const newBoard = simulateMove(tempPiece, [row, col], tempBoard, skip);
        moves.push(newBoard);
      }
    }
  }

  return moves;
}
