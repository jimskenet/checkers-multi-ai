import React, { useState } from "react";
import { View, Text,TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const BOARD_SIZE = 8;
const LIGHT_BROWN = "#DEB887";
const DARK_BROWN = "#8B4513";
const BLACK = "black";
const WHITE = "#F0EAD6";
const GREEN_HIGHLIGHT = "rgba(0, 255, 0, 0.5)";

const boardSize = wp(90); // Board takes 90% of screen width
const cellSize = boardSize / BOARD_SIZE; // Each cell is 1/8th of the board

let userTurn: boolean = true;

const initialBoard = () => {
  let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        if (row < 3) board[row][col] = WHITE;
        else if (row > 4) board[row][col] = BLACK;
      }
    }
  }
  return board;
};

const CheckersBoard = () => {
  const [board, setBoard] = useState(initialBoard());
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  
  const handlePress = (row: number, col: number) => {
    userTurn = !userTurn;
    // Example logic to highlight valid moves (dummy logic for now)
    if (board[row][col]) {
      setValidMoves([
        [row + 1, col - 1],
        [row + 1, col + 1],
      ]);
    } else {
      setValidMoves([]);
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
              {row.map((cell, colIndex) => {
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
      <View style={[styles.userOutline, { bottom: hp(5), right: wp(5) }]}>
        <View style={styles.user}>
            <Text style={styles.userInfo}>John Doe</Text>
        </View>
      </View>
    </View>
  );  
};

const styles = StyleSheet.create({
  background:{
    flex: 1, 
    backgroundColor: "#F6E8B1", 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingTop: -2
  },
  boardOutline:{ 
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
  imageBg:{
    height: hp(100),
    width: wp(100),
    resizeMode: 'cover',
    opacity: 2
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
  userInfo:{
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
});

export default CheckersBoard;
