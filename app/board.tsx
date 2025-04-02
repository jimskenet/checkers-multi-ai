import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const BOARD_SIZE = 8;
const LIGHT_BROWN = "#DEB887";
const DARK_BROWN = "#8B4513";
const BLACK = "black";
const RED = "red";
const GREEN_HIGHLIGHT = "rgba(0, 255, 0, 0.5)";


const boardSize = wp(90); // Board takes 90% of screen width
const cellSize = boardSize / BOARD_SIZE; // Each cell is 1/8th of the board

const initialBoard = () => {
  let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if ((row + col) % 2 === 1) {
        if (row < 3) board[row][col] = RED;
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
    <ImageBackground style={styles.imageBg} source={require('../assets/images/wooden-bg.jpg')}>
    <View style={styles.board}>      
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isValidMove = validMoves.some(([r, c]) => r === rowIndex && c === colIndex);
            return (
              <TouchableOpacity
                key={colIndex}
                style={[styles.cell, { backgroundColor: isDark ? DARK_BROWN : LIGHT_BROWN }, isValidMove && styles.validMove]}
                onPress={() => handlePress(rowIndex, colIndex)}
              >
                {cell && <View style={[styles.piece, { backgroundColor: cell }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  board: {
    width: boardSize,
    height: boardSize,
    flexDirection: "column",
    alignSelf: "center",
    marginTop: hp(25)
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
});

export default CheckersBoard;
