import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';

const BOARD_SIZE = 8;
const LIGHT_BROWN = "#DEB887";
const DARK_BROWN = "#8B4513";
const BLACK = "#222222";
const WHITE = "#F0EAD6";
const WHITE_KING = "FFFFFF"
const BLACK_KING = "333333"
const GREEN_HIGHLIGHT = "rgba(0, 255, 0, 0.5)";

const boardSize = wp(90); // Board takes 90% of screen width
const cellSize = boardSize / BOARD_SIZE; // Each cell is 1/8th of the board

let userTurn: boolean = true;

  async function selectPiece(row: number, col: number) {
    const res = await axios.post('http://192.168.100.70:5000/select', { row, col });
    console.log(res.data);
    return res.data;
  }  

  async function resetGame() {
    const res = await axios.post('http://192.168.100.70:5000/reset');
    return res.data;
  }
  
  const initialBoard = (state: any[][]) => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = state?.[row]?.[col];
        if (!cell) continue;
  
        const color = cell.color;
        const isKing = cell.king;
  
        if (color === "WHITE") {
          board[row][col] = isKing ? WHITE_KING : WHITE;
        } else if (color === "BLACK") {
          board[row][col] = isKing ? BLACK_KING : BLACK;
        }
      }
    }
  
    return board;
  };  

const CheckersBoard = () => {
  const [board, setBoard] = useState<any[]>([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);

  const fetchBoard = async () => {
    try {
      const res = await axios.get('http://192.168.100.70:5000/state');
      const state = res.data.board;
      setBoard(initialBoard(state));
    } catch (error) {
      console.error('Failed to fetch board:', error);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handlePress = async (row: number, col: number) => {
    try {
      const res = await selectPiece(row, col);  // Call the selectPiece function from backend
      const state = res.state;  // The state returned by the backend, including the valid moves
      
      if (!res.success) {
        console.warn("Invalid selection or move.");
        // If the selection is invalid, reset valid moves
        setValidMoves([]);
        return;
      }
      
      // Update the board
      setBoard(initialBoard(state.board));
  
      // Update valid moves
      const moves = state.valid_moves;
      if (moves) {
        const formattedMoves = moves.map((move: any) => [move[0], move[1]]);
        setValidMoves(formattedMoves);
      } else {
        setValidMoves([]);
      }
    } catch (error) {
      console.error('Error selecting piece:', error);
    }
  };  

   const handleReset = async () => {
    try {
      await resetGame(); // 🔄 Ask server to reset
      fetchBoard();       // 📥 Fetch fresh board after reset
    } catch (error) {
      console.error('Failed to reset game:', error);
    }
   };

  return (
    <View style={styles.background}>
      <View style={[styles.userOutline, { top: hp(5), left: wp(5) }]}>
        <View style={styles.user}>
          <Text style={styles.userInfo}>John Doe</Text>
        </View>
      </View>
      <View style={[styles.userOutline, {
        top: userTurn ? hp(5) : undefined,
        right: userTurn ? wp(5) : undefined,
        bottom: !userTurn ? hp(5) : undefined,
        left: !userTurn ? wp(5) : undefined,
      }]}>
        <View style={styles.timer}>
          <Text style={styles.timerText}>05:00</Text>
        </View>
      </View>
      <View style={styles.boardOutline}>
        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
               {row.map((cell: string | null, colIndex: number) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.cell,
                      { backgroundColor: isDark ? DARK_BROWN : LIGHT_BROWN },
                      isValidMove && styles.validMove
                    ]}
                    onPress={() => handlePress(rowIndex, colIndex)}
                  >
                    {cell && <View style={[styles.piece, { backgroundColor: cell }]} />}
                  </TouchableOpacity>
                );  
              })}
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetText}>Reset Game</Text>
      </TouchableOpacity>
      <View style={[styles.userOutline, { bottom: hp(5), right: wp(5) }]}>
        <View style={styles.user}>
          <Text style={styles.userInfo}>John Doe</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F6E8B1",
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: -2
  },
  boardOutline: {
    backgroundColor: "#6C360F",
    padding: 10,
    borderRadius: 10
  },
  board: {
    width: boardSize,
    height: boardSize,
    flexDirection: "column",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: "center",
    alignItems: "center",
  },
  validMove: {
    backgroundColor: GREEN_HIGHLIGHT,
  },
  piece: {
    width: cellSize * 0.8, // Pieces are 80% of the cell
    height: cellSize * 0.8,
    borderRadius: (cellSize * 0.8) / 2,
  },
  userInfo: {
    color: '#222222',
    fontSize: hp(4),
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
  userOutline: {
    position: 'absolute',
    padding: 5,
    borderRadius: 12,
    backgroundColor: "#222222",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  user: {
    backgroundColor: "#F5F5DC",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  timer: {
    backgroundColor: "#1f4f0f",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  timerText: {
    color: '#F5F5F5',
    fontSize: hp(4),
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
  },
  resetText: {
    color: "#fff",
    fontSize: hp(3),
    fontWeight: "bold",
  },
});

export default CheckersBoard;
