from checkers.board import Board

class Game:
    def __init__(self):
        self._init()
    
    def _init(self):
        self.selected = None
        self.board = Board()
        self.turn = "WHITE"
        self.valid_moves = {}

    def winner(self):
        return self.board.winner()

    def reset(self):
        self._init()

    def select(self, row, col):
        if self.selected:
            result = self._move(row, col)
            if not result:
                self.selected = None
                self.select(row, col)
        
        piece = self.board.get_piece(row, col)
        if piece != 0 and piece.color == self.turn:
            self.selected = piece
            self.valid_moves = self.board.get_valid_moves(piece)
            return True
            
        return False

    def _move(self, row, col):
        piece = self.board.get_piece(row, col)
        if self.selected and piece == 0 and (row, col) in self.valid_moves:
            self.board.move(self.selected, row, col)
            skipped = self.valid_moves[(row, col)]
            if skipped:
                self.board.remove(skipped)
            self.change_turn()
        else:
            return False

        return True

    def change_turn(self):
        self.valid_moves = {}
        if self.turn == "BLACK":
            self.turn = "WHITE"
        else:
            self.turn = "BLACK"

    def ai_move(self, board):
        self.board = board
        self.change_turn()

    def get_game_state(self):
        return {
            "board": self.board.serialized,         
            "turn": self.turn,                      
            "selected_piece": self._piece_to_json(self.selected),
            "valid_moves": list(self.valid_moves.keys()),
            "winner": self.board.winner()
        }

    def _piece_to_json(self, piece):
        if piece is None:
            return None
        return {
            "row": piece.row,
            "col": piece.col,
            "color": piece.color,
            "king": piece.king
        }