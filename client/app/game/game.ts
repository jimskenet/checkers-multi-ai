import { Board } from './board';
import { Piece, Color } from './piece';

interface TimeLeft {
  WHITE: number;
  BLACK: number;
}

interface GameState {
  board: { color: Color | null; king?: boolean }[][];
  turn: Color;
  selected_piece: {
    row: number;
    col: number;
    color: Color;
    king: boolean;
  } | null;
  valid_moves: [number, number][];
  winner: Color | null;
  time_left: TimeLeft;
}

export class Game {
  private selected: Piece | null;
  private board: Board;
  private turn: Color;
  private valid_moves: Record<string, Piece[]>;
  private time_left: TimeLeft;
  private turn_start_time: number;
  private _isPaused: boolean;

  public get isPaused(): boolean {
    return this._isPaused;
  }

  constructor(turnDuration: number) {
    this.selected = null;
    this.board = new Board();
    this.turn = "WHITE";
    this.valid_moves = {};
    this.time_left = { 
      WHITE: turnDuration, 
      BLACK: turnDuration 
    };
    this.turn_start_time = Date.now() / 1000;
    this._isPaused = false;
  }

  winner(): Color | null {
    return this.board.winner();
  }

  reset(turnDuration?: number): void {
    this.selected = null;
    this.board = new Board();
    this.turn = "WHITE";
    this.valid_moves = {};
    this.time_left = { 
      WHITE: turnDuration || this.time_left.WHITE, 
      BLACK: turnDuration || this.time_left.BLACK 
    };
    this.turn_start_time = Date.now() / 1000;
    this._isPaused = false;
  }

  clear(): void {
    this.selected = null;
    this.board = new Board();
    this.turn = "WHITE";
    this.valid_moves = {};
    this._isPaused = false;
    this.turn_start_time = Date.now() / 1000;
    // Change this line to use the initial turnDuration
    this.time_left = { 
        WHITE: this.time_left.WHITE,  // Keep existing time instead of 300
        BLACK: this.time_left.BLACK 
    };
  }

  select(row: number, col: number): boolean {
    if (this.selected) {
      const moved = this._move(row, col);
      if (!moved) {
        this.selected = null;
        return this.select(row, col);
      }
    }

    const piece = this.board.get_piece(row, col);
    if (piece !== null && piece.color === this.turn) {
      this.selected = piece;
      this.valid_moves = this.board.get_valid_moves(piece);
      return true;
    }

    return false;
  }

  private _move(row: number, col: number): boolean {
    const piece = this.board.get_piece(row, col);
    const key = `${row},${col}`;
    if (this.selected && piece === null && key in this.valid_moves) {
      this.board.move(this.selected, row, col);
      const skipped = this.valid_moves[key];
      if (skipped.length > 0) this.board.remove(skipped);
      this.change_turn();
      return true;
    }
    return false;
  }

  pause(): void {
    if (!this._isPaused) {
      const now = Date.now() / 1000;
      const elapsed = now - this.turn_start_time;
      this.time_left[this.turn] = Math.max(0, this.time_left[this.turn] - Math.floor(elapsed));
      this._isPaused = true;
    }
  }

  resume(): void {
    if (this._isPaused) {
      this.turn_start_time = Date.now() / 1000;
      this._isPaused = false;
    }
  }

  private change_turn(): void {
    this.valid_moves = {};
    if (!this._isPaused) {
      const now = Date.now() / 1000;
      const elapsed = now - this.turn_start_time;
      this.time_left[this.turn] = Math.max(0, this.time_left[this.turn] - Math.floor(elapsed));
      this.turn = this.turn === 'WHITE' ? 'BLACK' : 'WHITE';
      this.turn_start_time = now;
    }
  }

  ai_move(board: Board): void {
    this.board = board;
    this.change_turn();
  }

  get_board(): Board {
    return this.board;
  }
  
  get_game_state(): GameState {
    return {
      board: this.board.serialized,
      turn: this.turn,
      selected_piece: this.selected ? {
        row: this.selected.row,
        col: this.selected.col,
        color: this.selected.color,
        king: this.selected.king
      } : null,
      valid_moves: Object.keys(this.valid_moves).map(k => k.split(',').map(Number) as [number, number]),
      winner: this.board.winner(),
      time_left: this.time_left
    };
  }
}

export default Game;
