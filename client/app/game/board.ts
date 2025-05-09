import { ROWS, COLS } from './constants';
import Piece, { Color } from './piece';

type MoveMap = Record<string, Piece[]>;

export class Board {
  board: (Piece | null)[][] = [];
        
  serialized: { color: Color | null; king?: boolean }[][] = [];
  black_left = 12;
  white_left = 12;
  black_kings = 0;
  white_kings = 0;

  constructor() {
    this.create_board();
  }

  evaluate(aiColor: Color): number {
    const whitePieces = this.get_all_pieces("WHITE");
    const blackPieces = this.get_all_pieces("BLACK");
  
    // Basic scoring: pieces + kings are worth more
    let whiteScore = whitePieces.length + (whitePieces.filter(p => p.king).length * 2);
    let blackScore = blackPieces.length + (blackPieces.filter(p => p.king).length * 2);
  
    const rawScore = whiteScore - blackScore;
  
    // If AI is white, rawScore is good. If AI is black, flip it.
    return aiColor === "WHITE" ? rawScore : -rawScore;
  }

  move(piece: Piece, row: number, col: number): void {
    this.board[piece.row][piece.col] = null;
    this.board[row][col] = piece;
    piece.move(row, col);

    if (row === 0 || row === ROWS - 1) {
      if (!piece.king) {
        piece.makeKing();
        if (piece.color === 'WHITE') 
          this.white_kings++;
        else 
          this.black_kings++;
      }
    }      

    this._update_serialized();
  }

  get_piece(row: number, col: number): Piece | null {
    return this.board[row][col];
  }

 
  create_board(): void {
    this.board = [];

    for (let row = 0; row < ROWS; row++) {
      const currentRow: (Piece | null)[] = [];
      for (let col = 0; col < COLS; col++) {
        if ((row + col) % 2 !== 0) {
          if (row < 3) {
            currentRow.push(new Piece(row, col, 'WHITE'));
          } else if (row > 4) {
            currentRow.push(new Piece(row, col, 'BLACK'));
          } else {
            currentRow.push(null);
          }
        } else {
          currentRow.push(null);
        }
      }
      this.board.push(currentRow);
    }

    this._update_serialized();
  }

  private _update_serialized(): void {
    this.serialized = this.board.map(row =>
      row.map(piece =>
        piece === null ? { color: null } : { color: piece.color, king: piece.king }
      )
    );
  }

  remove(pieces: Piece[]): void {
    for (const piece of pieces) {
      this.board[piece.row][piece.col] = null;
      if (piece.color === 'BLACK') this.black_left--;
      else this.white_left--;
    }
    this._update_serialized();
  }

  winner(): Color | null {
    if (this.black_left <= 0) return 'WHITE';
    if (this.white_left <= 0) return 'BLACK';
    return null;
  } 

  get_all_pieces(color: Color): Piece[] {
    return this.board.flat().filter(p => p !== null && p.color === color) as Piece[]; 
  }

  get_valid_moves(piece: Piece): MoveMap {
    // Check if any piece has a capture move globally
    const hasCaptureMove = this.has_capture_move(piece.color);
    
    // Get all possible moves for this piece
    const allMoves = this._get_all_moves(piece);
    
    // If no moves, return empty object
    if (Object.keys(allMoves).length === 0) {
      return {};
    }
    
    // If there are capture moves globally, only return capture moves for this piece
    if (hasCaptureMove) {
      const captureMoves: MoveMap = {};
    
      // First, determine the maximum number of pieces this piece can capture in one move
      let maxCaptures = 0;
    
      for (const capturedPieces of Object.values(allMoves)) {
        if (capturedPieces.length > maxCaptures) {
          maxCaptures = capturedPieces.length;
        }
      }
    
      // Then, keep only the moves that result in the max number of captures
      for (const [moveKey, capturedPieces] of Object.entries(allMoves)) {
        if (capturedPieces.length === maxCaptures && maxCaptures > 0) {
          captureMoves[moveKey] = capturedPieces;
        }
      }
    
      return captureMoves;
    }    
    
    // If no captures required globally, return all valid moves
    return allMoves;
  }
  
  // Get all possible moves for a piece
  _get_all_moves(piece: Piece): MoveMap {
    const moves: MoveMap = {};
    const left = piece.col - 1;
    const right = piece.col + 1;
    const row = piece.row;

    if (piece.color === 'BLACK' || piece.king) {
      Object.assign(moves, this._traverse_left(row - 1, Math.max(row - 3, -1), -1, piece.color, left));
      Object.assign(moves, this._traverse_right(row - 1, Math.max(row - 3, -1), -1, piece.color, right));
    }

    if (piece.color === 'WHITE' || piece.king) {
      Object.assign(moves, this._traverse_left(row + 1, Math.min(row + 3, ROWS), 1, piece.color, left));
      Object.assign(moves, this._traverse_right(row + 1, Math.min(row + 3, ROWS), 1, piece.color, right));
    }

    return moves;
  }

  // Check if any piece of the given color has a capture move
  has_capture_move(color: Color): boolean {
    const pieces = this.get_all_pieces(color);
    
    for (const piece of pieces) {
      const moves = this._get_all_moves(piece);
      
      // Check if any move captures at least one piece
      for (const capturedPieces of Object.values(moves)) {
        if (capturedPieces.length > 0) {
          return true;
        }
      }
    }
    
    return false;
  }

  private _traverse_left(
    start: number,  
    stop: number,
    step: number,
    color: Color,
    left: number,
    skipped: Piece[] = []
  ): MoveMap {
    const moves: MoveMap = {};
    let last: Piece[] = [];

    for (let r = start; step > 0 ? r < stop : r > stop; r += step) {
      if (left < 0) {
        break;
      }

      const current = this.board[r][left];
      if (current === null) {
        if (skipped.length > 0 && last.length === 0) {
          break;
        } else if (skipped.length > 0) {
          moves[`${r},${left}`] = [...last, ...skipped];
        } else {
          moves[`${r},${left}`] = [...last];
        }

        if (last.length > 0) {
          let row: number;
          if (step === -1) {
            row = Math.max(r - 3, -1);
          } else {
            row = Math.min(r + 3, ROWS);
          }
          Object.assign(
            moves,
            this._traverse_left(r + step, row, step, color, left - 1, [...last])
          );
          Object.assign(
            moves,
            this._traverse_right(r + step, row, step, color, left + 1, [...last])
          );
        }
        break;
      } else if (current && current.color === color) {
        break;
      } else if (current) {
        last = [current];
      }

      left -= 1;
    }

    return moves;
  }

  private _traverse_right(
    start: number,
    stop: number,
    step: number,
    color: Color,
    right: number,
    skipped: Piece[] = []
  ): MoveMap {
    const moves: MoveMap = {};
    let last: Piece[] = [];

    for (let r = start; step > 0 ? r < stop : r > stop; r += step) {
      if (right >= COLS) {
        break;
      }

      const current = this.board[r][right];
      if (current === null) {
        if (skipped.length > 0 && last.length === 0) {
          break;
        } else if (skipped.length > 0) {
          moves[`${r},${right}`] = [...last, ...skipped];
        } else {
          moves[`${r},${right}`] = [...last];
        }

        if (last.length > 0) {
          let row: number;
          if (step === -1) {
            row = Math.max(r - 3, -1);
          } else {
            row = Math.min(r + 3, ROWS);
          }
          Object.assign(
            moves,
            this._traverse_left(r + step, row, step, color, right - 1, [...last])
          );
          Object.assign(
            moves,
            this._traverse_right(r + step, row, step, color, right + 1, [...last])
          );
        }
        break;
      } else if (current && current.color === color) {
        break;
      } else if (current) {
        last = [current];
      }

      right += 1;
    }

    return moves;
  }
}

export default Board;