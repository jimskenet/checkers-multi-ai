import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import styles, { BOARD_SIZE, WHITE, BLACK, DARK_BROWN, LIGHT_BROWN } from './styles/styles';
import { API_ENDPOINTS } from '../apiConfig';

  async function selectPiece(row: number, col: number) {
    const res = await axios.post(API_ENDPOINTS.SELECT, { row, col });
    console.log(res.data);
    return res.data;
  }  

  async function resetGame() {  
    const res = await axios.post(API_ENDPOINTS.RESET);
    return res.data;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  
  const initialBoard = (state: any[][]) => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
  
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = state?.[row]?.[col];
        if (!cell) continue;
  
        const { color, king: isKing } = cell;

        if (color === "WHITE" || color === "BLACK") {
          board[row][col] = {
            color: color === "WHITE" ? WHITE : BLACK,
            isKing: isKing
          };
        }
      }
    }
  
    return board;
  };  

const CheckersBoard = () => {
  const [board, setBoard] = useState<any[]>([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [timeLeft, setTimeLeft] = useState<{ WHITE: number, BLACK: number }>({ WHITE: 300, BLACK: 300 });
  const [currentPlayer, setCurrentPlayer] = useState<"WHITE" | "BLACK">("WHITE");
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft[currentPlayer] > 0) {
        setTimeLeft((prevTimeLeft) => ({
          ...prevTimeLeft,
          [currentPlayer]: prevTimeLeft[currentPlayer] - 1,
        }));
      }
    }, 1000); // Decrement every second

    return () => clearInterval(interval); // Clean up interval when the component is unmounted or changes
  }, [currentPlayer, timeLeft]);

  // Fetch the game state (including remaining time)
  const fetchBoard = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.STATE);
      const state = res.data;

      // Set the initial timer values and other game data
      setTimeLeft(state.time_left);  // Remaining time for both players
      setCurrentPlayer(state.turn);  // Set the current player's turn
      setBoard(initialBoard(state.board)); // Set the board state

    } catch (error) {
      console.error('Failed to fetch board:', error);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handlePress = async (row: number, col: number) => {
    try {
      const res = await selectPiece(row, col); 
      const state = res.state;

      setBoard(initialBoard(state.board));
      if (state.turn === "BLACK") setCurrentPlayer("BLACK");
      else setCurrentPlayer("WHITE");

      if (!res.success) {
        console.warn("Invalid selection or move.");
        // If the selection is invalid, reset valid moves
        setValidMoves([]);
        return;
      }
      
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
        top: currentPlayer === "WHITE" ? hp(5) : undefined,
        right: currentPlayer === "WHITE" ? wp(5) : undefined,
        bottom: currentPlayer !== "WHITE" ? hp(5) : undefined,
        left: currentPlayer !== "WHITE" ? wp(5) : undefined,
      }]}>
        <View style={styles.timer}>
          <Text style={styles.timerText}>
            {formatTime(timeLeft[currentPlayer])}
          </Text>
        </View>
      </View>
      <View style={styles.boardOutline}>
        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
               {row.map((cell: { color: string, isKing: boolean } | null, colIndex: number) => {
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
                    {cell && (
                      cell.isKing ? (
                        <Image
                          source={
                            cell.color === WHITE
                              ? require('../assets/images/crown-white.png')
                              // : require('../assets/images/checkers-king-black.png')
                              : require('../assets/images/crown-black.png')
                            }
                          style={[styles.piece, { backgroundColor: cell.color }]}
                        />
                      ) : (
                        <View style={[styles.piece, { backgroundColor: cell.color }]} />
                      )
                    )}
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

export default CheckersBoard;