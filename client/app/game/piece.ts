import { SQUARE_SIZE } from './constants';

export type Color = 'WHITE' | 'BLACK';

export class Piece {
  static PADDING = 15;
  static OUTLINE = 2;

  row: number;
  col: number;
  color: Color;
  king: boolean;
  x: number;
  y: number;

  constructor(row: number, col: number, color: Color, king: boolean = false) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.king = king;
    this.x = 0;
    this.y = 0;
    this.calcPos();
  }

  calcPos(): void {
    this.x = SQUARE_SIZE * this.col + SQUARE_SIZE / 2;
    this.y = SQUARE_SIZE * this.row + SQUARE_SIZE / 2;
  }

  makeKing(): void {
    this.king = true;
  }

  move(row: number, col: number): void {
    this.row = row;
    this.col = col;
    this.calcPos();
  }

  toString(): string {
    return `${this.color}${this.king ? ' (King)' : ''}`;
  }
}

export default Piece;