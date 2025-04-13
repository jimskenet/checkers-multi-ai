from flask import Flask, request, jsonify
from flask_cors import CORS
from checkers.game import Game

app = Flask(__name__)
CORS(app)
game = Game()

@app.route('/state', methods=['GET'])
def get_game_state():
    return jsonify(game.get_game_state())

@app.route('/select', methods=['POST'])
def select_piece():
    data = request.get_json()
    row = data.get('row')
    col = data.get('col')
    success = game.select(row, col)
    return jsonify({
        "success": success,
        "state": game.get_game_state()
    })

@app.route('/reset', methods=['POST'])
def reset_game():
    global game
    game = Game()
    return jsonify({
        "message": "Game reset.",
        "state": game.get_game_state()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)