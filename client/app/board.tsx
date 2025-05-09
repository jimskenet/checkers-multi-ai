import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Pressable, SafeAreaView, BackHandler, StatusBar } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import styles, { BOARD_SIZE, WHITE, BLACK, DARK_BROWN, LIGHT_BROWN } from './styles/board_styles';
import Game from './game/game';
import { useGameSettings } from './game/gameSettingsContext';
import { minimax } from './game/minimax/algorithm';
import { Modal } from "@/components/Modal";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaProvider } from "react-native-safe-area-context";

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

// Replace the global game instance with a ref
const CheckersBoard = () => {
  const gameRef = useRef<Game>(undefined);
  const { gameMode, playerColor, turnDuration, difficulty } = useGameSettings();
  
  // Initialize game with selected duration
  useEffect(() => {
    if (!gameRef.current) {
      (gameRef.current as Game | undefined) = new Game(turnDuration!);
    } else {
      gameRef.current.reset(turnDuration);
    }
    fetchBoard();
  }, [turnDuration]);

  // Update timeLeft state initialization
  const [timeLeft, setTimeLeft] = useState<{ WHITE: number | undefined, BLACK: number | undefined }>({ 
    WHITE: turnDuration, 
    BLACK: turnDuration 
  });

  const [board, setBoard] = useState<any[][]>([]);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<"WHITE" | "BLACK">("WHITE");
  const [winModal, setwinModal] = useState(false);
  const [pauseModal, setpauseModal] = useState(false);
  const [winner, setWinner] =  useState<"WHITE" | "BLACK">("WHITE");
  
  const currentPlayerRef = useRef(currentPlayer);
  currentPlayerRef.current = currentPlayer;

  const aiColor = playerColor === "WHITE" ? "BLACK" : "WHITE";  

  // 1. Add a mounted ref
  const isMounted = useRef(true);
  
  // 2. Modify the timer effect
  useEffect(() => { 
    if (!isMounted.current) return;
    const win = gameRef.current?.get_game_state().winner;
    let interval: NodeJS.Timeout | null = null;
    
    if (!pauseModal && gameRef.current && !gameRef.current.isPaused) {
        interval = setInterval(() => {
            if (!isMounted.current) {
                if (interval) clearInterval(interval);
                return;
            }
            setTimeLeft(prev => {
                const player = currentPlayerRef.current;
                const newTime = { ...prev };
                console.log(newTime);
                if ((newTime[player] ?? 0) > 0) {
                    newTime[player] = (newTime[player] ?? 0) - 1;
                    if (newTime[player] === 0) {
                        if (interval) clearInterval(interval); 
                        const timeoutWinner= player === 'WHITE' ? 'BLACK' : 'WHITE';
                        setWinner(timeoutWinner);
                        setwinModal(true);
                    }
                }
                return newTime;
            });
        }, 1000);
    }

    return () => {
        if (interval) clearInterval(interval);
    };
}, [pauseModal]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.reset();
      fetchBoard();
      console.log('Initializing board with settings:', {
        gameMode,
        playerColor,
        currentPlayer
      });
    }
  }, [gameMode, playerColor]);

  const fetchBoard = async () => {
    try {
      const state = gameRef.current?.get_game_state();
      if (!state) return;
  
      if(state.winner != null) {
        console.log(`Winner is ${state.winner}!`);
        setWinner(state.winner);
        setwinModal(true);
        return;
      }
  
      setTimeLeft(state.time_left);
      setCurrentPlayer(state.turn);
      setBoard(initialBoard(state.board, playerColor));
      
    } catch (error) {
      console.error('Failed to fetch board:', error);
    } 
  };

  useEffect(() => {
    fetchBoard();
  }, []);


  const pathname = require('expo-router').usePathname();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (winModal) {
        return false;
      }
      
      // Only handle back button if we're on the board screen
      if (pathname === '/board') {
        setpauseModal(true);
        return true;
      }
      
      return false;
    });

    return () => backHandler.remove();
  }, [winModal, pathname]);
  
  const handlePress = (row: number, col: number) => { 
    try {
      // Convert visual coordinates to actual board coordinates if playing as WHITE
      const actualRow = playerColor === 'WHITE' ? BOARD_SIZE - 1 - row : row;
      const actualCol = playerColor === 'WHITE' ? BOARD_SIZE - 1 - col : col;

      if (gameMode === 'singleplayer' && currentPlayer !== playerColor) {
        console.log("Not your turn - waiting for AI");
        return;
      }

      const res = gameRef.current!.select(actualRow, actualCol);
      const state = gameRef.current!.get_game_state();

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

  // Update handleReset to use the current turnDuration
  const handleReset = () => {
    try {
      gameRef.current?.reset(turnDuration);
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
          const currentBoard = gameRef.current!.get_board();
          
          const isMaximizing = aiColor === currentPlayer;;
          const depth = getDifficultyDepth(difficulty);
          console.log(`Depth: ${depth}`);
          const [score, newBoard] = minimax(currentBoard, depth, isMaximizing, aiColor);
          
          if (newBoard) {
            gameRef.current!.ai_move(newBoard);
            console.log("AI moved with score:", score);
          } else {
            console.error("AI couldn't find a valid move: Surrendering!");
            const moveWinner = aiColor === 'WHITE' ? 'BLACK' : 'WHITE';
            
            if (gameRef.current) {
                gameRef.current.pause();
            }
            
            setWinner(moveWinner);
            setwinModal(true);
            
            // Update board state one last time
            fetchBoard();
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

  // Update other functions to use gameRef.current instead of global game
  const handlePause = () => {
    if (gameRef.current) {
      gameRef.current.pause();
      // Store current time state
      const currentState = gameRef.current.get_game_state();
      setTimeLeft(currentState.time_left);
      setpauseModal(true);
  }
  };

  const handleResume = () => {
    if (gameRef.current) {
      gameRef.current.resume();
      const state = gameRef.current.get_game_state();
      setTimeLeft(state.time_left); // Sync with game state
      setpauseModal(false);
    }
  };

  // Add cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Clear game instance
      if (gameRef.current) {
        gameRef.current.clear();
        gameRef.current = undefined;
      }
      // Reset states
      setTimeLeft({ WHITE: turnDuration, BLACK: turnDuration });
      setBoard([]);
      setValidMoves([]);
      setCurrentPlayer("WHITE");
      setwinModal(false);
      setpauseModal(false);
      setWinner("WHITE");
    };
  }, []);

    useEffect(() => {
      return () => {
          isMounted.current = false;
      };
  }, []);

  const handleMenuPress = async () => {
    isMounted.current = false;
    
    if (gameRef.current) {
        gameRef.current.pause();
        gameRef.current = undefined;
    }
    
    setpauseModal(false);
    await require('expo-router').router.replace('/');
  };

  const handleWinPress = async () => {
    isMounted.current = false;
    
    if (gameRef.current) {
        gameRef.current.pause();
        gameRef.current = undefined;
    }
    
    setwinModal(false);
    await require('expo-router').router.push('/');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.background}>
          <View style={[styles.iconContainer, { top: hp(2), left: wp(2) }]}>
            <Pressable onPress={handlePause}> 
              <Ionicons name="pause-circle-outline" size={hp(6)} color="black"/>
            </Pressable>      
          </View>
          <Modal isOpen={pauseModal}>
            <View>
              <View style={styles.pause}>
                <View style={styles.pauseContent}>
                    <Text style={styles.modalText}>PAUSED</Text>
                </View>
              </View>
              <View style={{
                flexDirection:'row', 
                justifyContent:'space-between', 
                gap: wp(4),
              }}>
                <Pressable
                  style={[styles.button, styles.buttonResume]}
                  onPress={handleMenuPress}
                >
                  <MaterialIcons name="home" size={24} color="black" />
                </Pressable>

                <Pressable
                  style={[styles.button, styles.buttonResume]}
                  onPress={() => {
                    handleReset();
                    handleResume();
                  }}
                >
                  <MaterialIcons name="restart-alt" size={24} color="black" />
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={handleResume}
                >
                  <Ionicons name="play-outline" size={24} color="black" />
                </Pressable>
              </View>
            </View>
          </Modal>
          <View style={[styles.userOutline, { marginTop: StatusBar.currentHeight! + hp(5), top: hp(5), left: wp(5) }]}>
            <View style={styles.user}>
              <Text style={styles.userInfo}>
                {gameMode === 'singleplayer' ? 'Cheek' : 'Player 2'}
              </Text> 
            </View>
          </View>
          <View style={[styles.userOutline, {
            marginTop: currentPlayer !== playerColor ? StatusBar.currentHeight! + hp(5) : undefined,
            top: currentPlayer !== playerColor ? hp(5) : undefined,
            right: currentPlayer !== playerColor ? wp(5) : undefined,
            marginBottom: currentPlayer === playerColor ? hp(5) : undefined,
            bottom: currentPlayer === playerColor ? hp(5) : undefined,
            left: currentPlayer === playerColor ? wp(5) : undefined,
          }]}>
            <View style={styles.timer}> 
              <Text style={styles.timerText}>
              {gameMode === 'singleplayer' && currentPlayer === aiColor ? 'Thinking...' : formatTime(timeLeft[currentPlayer] ?? 0)}
              </Text>
            </View>
          </View> 
          <Modal isOpen={winModal}>
            <View>
              <Text style={styles.modalText}>Winner is {winner}!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => 
                {
                  handleWinPress();
                }}
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
                {gameMode === 'singleplayer' ? 'You' : 'Player 1'}
              </Text>
            </View> 
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CheckersBoard;