import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Pressable, SafeAreaView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles, { BOARD_SIZE, WHITE, BLACK, DARK_BROWN, LIGHT_BROWN } from './styles/board_styles';
import Game from './game/game';
import { useGameSettings } from './game/gameSettingsContext';
import { minimax } from './game/minimax/algorithm';
import { Modal } from "@/components/Modal";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaProvider } from "react-native-safe-area-context";
const game = new Game();

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

  const initialBoard = (state: any[][], playerColor: string) => {
    let board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));

    // Fill the board first
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

    // Reverse the board if player is WHITE (to keep player's pieces at bottom)
    if (playerColor === 'WHITE') {
      board = board.reverse().map(row => row.reverse());
    }
    
    return board;
  };

const CheckersBoard = () => {
  const [board, setBoard] = useState<any[][]>([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [timeLeft, setTimeLeft] = useState<{ WHITE: number, BLACK: number }>({ WHITE: 300, BLACK: 300 });
  const [currentPlayer, setCurrentPlayer] = useState<"WHITE" | "BLACK">("WHITE");
  const [winModal, setwinModal] = useState(false);
  const [pauseModal, setpauseModal] = useState(false);
  const [winner, setWinner] =  useState<"WHITE" | "BLACK">("WHITE");
  
  const currentPlayerRef = useRef(currentPlayer);
  currentPlayerRef.current = currentPlayer;

  const { gameMode, playerColor, difficulty } = useGameSettings();
  const aiColor = playerColor === "WHITE" ? "BLACK" : "WHITE";
  
  console.log('Current settings:', gameMode, playerColor, difficulty);

  useEffect(() => {
    // Only start the interval if the game is not paused
    if (!pauseModal) {
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

      // Cleanup interval when component unmounts or modal opens
      return () => clearInterval(interval);
    }
  }, [pauseModal]); // Add pauseModal to dependencies

  useEffect(() => {
    if (game) {
      // Reset and initialize game with current settings
      game.reset();
      fetchBoard();
      console.log('Initializing board with settings:', {
        gameMode,
        playerColor,
        currentPlayer
      });
    }
  }, [gameMode, playerColor]); // Dependencies include gameMode and playerColor

  const fetchBoard = async () => {
    try {
      const state = game.get_game_state();

      if(state.winner != null){  
        console.log(`Winner is ${state.winner}!`);
        setWinner(state.winner);
        setwinModal(true);
        game.reset();
        fetchBoard();
        return;
      }

      setTimeLeft(state.time_left);
      setCurrentPlayer(state.turn);
      setBoard(initialBoard(state.board, playerColor));
      
      console.log('Board fetched with settings:', {
        gameMode,
        playerColor,
        currentPlayer: state.turn,
        orientation: playerColor === 'BLACK' ? 'normal' : 'reversed'
      });
    } catch (error) {
      console.error('Failed to fetch board:', error);
    } 
  };

  useEffect(() => {
    fetchBoard();
  }, []);

  const handlePress = (row: number, col: number) => { 
    try {
      // Convert visual coordinates to actual board coordinates if playing as WHITE
      const actualRow = playerColor === 'WHITE' ? BOARD_SIZE - 1 - row : row;
      const actualCol = playerColor === 'WHITE' ? BOARD_SIZE - 1 - col : col;

      if (gameMode === 'singleplayer' && currentPlayer !== playerColor) {
        console.log("Not your turn - waiting for AI");
        return;
      }

      const res = game.select(actualRow, actualCol);
      const state = game.get_game_state();

      if (state.winner != null) {
        fetchBoard();
        return;
      }

      setBoard(initialBoard(state.board, playerColor));
      setCurrentPlayer(state.turn);

      if (!res) {
        console.warn("No piece or invalid move.");
        setValidMoves([]);
        return;
      }

      const moves = state.valid_moves;
      if (moves) {
        const formattedMoves = moves.map(([r, c]) => {
          // Convert actual coordinates back to visual coordinates if playing as WHITE
          const visualRow = playerColor === 'WHITE' ? BOARD_SIZE - 1 - r : r;
          const visualCol = playerColor === 'WHITE' ? BOARD_SIZE - 1 - c : c;
          return [visualRow, visualCol] as [number, number];
        });
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

  const getDifficultyDepth = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 3;
    }
  };

  const handleAIMove = () => {
    if (gameMode === 'singleplayer' && currentPlayer !== playerColor) { 
      
      const aiTimeout = setTimeout(() => {
        try {
          const currentBoard = game.get_board();
          
          const isMaximizing = aiColor === currentPlayer;;
          const depth = getDifficultyDepth(difficulty);
          console.log(`Depth: ${depth}`);
          const [score, newBoard] = minimax(currentBoard, depth, isMaximizing, aiColor);
          
          if (newBoard) {
            game.ai_move(newBoard);
            console.log("AI moved with score:", score);
          } else {
            console.error("AI couldn't find a valid move: Surrending!");
            game.reset();
          }
          fetchBoard();
        } catch (error) {
          console.error("Error during AI move:", error);
        }
      }, 500);

      return () => clearTimeout(aiTimeout);
    }
  };

  useEffect(() => {
    handleAIMove();
  }, [currentPlayer]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.background}>
          <View style={[styles.iconContainer, { top: hp(2), left: wp(2) }]}>
            <Pressable onPress={() => setpauseModal(true)}> 
              <Ionicons name="pause-circle-outline" size={hp(6)} color="black"/>
            </Pressable>      
          </View>
            <Modal isOpen={pauseModal}>
              <View>
                <Text style={styles.modalText}>Pause</Text>
                <View style={{
                  flexDirection:'row', 
                  justifyContent:'space-between', 
                  gap: wp(1),
                  }}>
                <Pressable
                  style={[styles.button, styles.buttonResume]}
                  onPress={() => {
                    require('expo-router').router.push('/');
                    setpauseModal(false);
                  }}
                >
                  <Text style={styles.textStyle}>MENU</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonResume]}
                  onPress={() => {
                    handleReset();
                    setpauseModal(false);
                  }}
                >
                  <MaterialIcons name="restart-alt" size={24} color="black" />
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setpauseModal(false)}
                >
                  <Ionicons name="play-outline" size={24} color="black" />
                </Pressable>
                </View>
              </View>
            </Modal>
          <View style={[styles.userOutline, { marginTop: hp(5), top: hp(5), left: wp(5) }]}>
            <View style={styles.user}>
              <Text style={styles.userInfo}>
                {gameMode === 'singleplayer' ? 'Cheek' : 'John Doe'}
              </Text> 
            </View>
          </View>
          <View style={[styles.userOutline, {
            marginTop: currentPlayer !== playerColor ? hp(5) : undefined,
            top: currentPlayer !== playerColor ? hp(5) : undefined,
            right: currentPlayer !== playerColor ? wp(5) : undefined,
            marginBottom: currentPlayer === playerColor ? hp(5) : undefined,
            bottom: currentPlayer === playerColor ? hp(5) : undefined,
            left: currentPlayer === playerColor ? wp(5) : undefined,
          }]}>
            <View style={styles.timer}>
              <Text style={styles.timerText}>
              {gameMode === 'singleplayer' && currentPlayer === aiColor ? 'Thinking...' : formatTime(timeLeft[currentPlayer])}
              </Text>
            </View>
          </View> 
          <Modal isOpen={winModal}>
            <View>
              <Text style={styles.modalText}>Winner is {winner}!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setwinModal(false)}
              >
                <Text style={styles.textStyle}>CLOSE</Text>
              </Pressable>
            </View>
          </Modal>
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
                        style={[styles.cell, { backgroundColor: isDark ? DARK_BROWN : LIGHT_BROWN }, isValidMove && styles.validMove]}
                        onPress={() => handlePress(rowIndex, colIndex)}
                      >
                        {cell && (
                          cell.isKing ? (
                            <Image
                              source={cell.color === WHITE
                                ? require('../assets/images/crown-white.png')
                                : require('../assets/images/crown-black.png')}
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
          <View style={[styles.userOutline, { marginBottom: hp(5), bottom: hp(5), right: wp(5) }]}>
            <View style={styles.user}>
              <Text style={styles.userInfo}>
                You
              </Text>
            </View> 
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CheckersBoard;