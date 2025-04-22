import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const BOARD_SIZE = 8;
export const LIGHT_BROWN = "#DEB887";
export const DARK_BROWN = "#8B4513";
export const BLACK = "#222222";
export const WHITE = "#F0EAD6";
const GREEN_HIGHLIGHT = "rgba(0, 255, 0, 0.5)";

const boardSize = wp(90); // Board takes 90% of screen width
const cellSize = boardSize / BOARD_SIZE; // Each cell is 1/8th of the board

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
      width: cellSize * 0.8,
      height: cellSize * 0.8,
      borderRadius: (cellSize * 0.8) / 2,
      resizeMode:'center'
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

export default styles;
