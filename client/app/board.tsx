import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles, { BOARD_SIZE, WHITE, BLACK, DARK_BROWN, LIGHT_BROWN } from './styles/styles';
import Game from './game/game';

const game = new Game();

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
      if (cell.color === null) continue;
      const { color, king } = cell;

      board[row][col] = {
        color: color === "WHITE" ? WHITE : BLACK,
        isKing: king
      };
    }
  }

  return board;
};

const CheckersBoard = () => {
  const [board, setBoard] = useState<any[][]>([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [timeLeft, setTimeLeft] = useState<{ WHITE: number, BLACK: number }>({ WHITE: 300, BLACK: 300 });
  const [currentPlayer, setCurrentPlayer] = useState<"WHITE" | "BLACK">("WHITE");

  const currentPlayerRef = useRef(currentPlayer);
  currentPlayerRef.current = currentPlayer;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const player = currentPlayerRef.current;
        const newTime = { ...prev };

        if (newTime[player] > 0) {
          newTime[player] -= 1;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchBoard = async () => {
    try {
      const state = game.get_game_state();
      setTimeLeft(state.time_left);
      setCurrentPlayer(state.turn);
      setBoard(initialBoard(state.board));
    } catch (error) {
      console.error('Failed to fetch board:', error);
    }
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handlePress = (row: number, col: number) => {
    try {
      const res = game.select(row, col);
      const state = game.get_game_state();

      if (state.winner != null) {
        console.log(`Winner is ${state.winner}!`);
        game.reset();
        fetchBoard();
        return;
      }

      setBoard(initialBoard(state.board));
      setCurrentPlayer(state.turn);
      
      if (!res) {
        console.warn("No piece or invalid move.");
        setValidMoves([]);
        return;
      }

      const moves = state.valid_moves;
      if (moves) {
        const formattedMoves = moves.map(([r, c]) => [r, c] as [number, number]);
        setValidMoves(formattedMoves);
      }
    } catch (error) {
      console.error('Error selecting piece:', error);
    }
  };

  const handleReset = () => {
    try {
      game.reset();
      fetchBoard();
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
                    {cell && (  
                      cell.isKing ? (
                        <Image
                          source={
                            cell.color === WHITE
                              ? require('../assets/images/crown-white.png')
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