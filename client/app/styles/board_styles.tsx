import { StyleSheet, Platform, StatusBar } from 'react-native';
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
  safeContainer: {
    flex: 1,
    marginTop: hp(1.5),
    backgroundColor: "#F6E8B1", // Match background color
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: hp(100),
    width: wp(100),
  },
  boardContainer: {
    position: 'relative',
    width: wp(90), // Board container width adjusted to 90% of the screen width
    height: wp(90), // Set height based on screen width to keep square aspect ratio
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardOutline: { 
    backgroundColor: "#6C360F",
    padding: 6,
    borderRadius: 10, 
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
    resizeMode: 'center',
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
    justifyContent: "space-evenly",
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
  modalText: {
    marginBottom: hp(1),
    textAlign: 'center',
    fontSize: hp(4),
    fontWeight: 'bold',
    color: DARK_BROWN,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    minWidth: wp(20),
  },
  buttonClose: {
    backgroundColor: LIGHT_BROWN,
    alignItems: 'center',
  },
  buttonResume: {
    backgroundColor: DARK_BROWN,
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: hp(2.3)
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    top: Platform.OS === 'ios' ? hp(2) : hp(2) + (StatusBar.currentHeight || 0),
    left: wp(2),
  },
  pause: { 
    backgroundColor: DARK_BROWN,
    borderRadius: wp(3),
    padding: wp(1),
    height: hp(8),
    width: wp(50),
    marginBottom: hp(2),
    alignSelf: 'center',
    justifyContent: 'center',
  },
  pauseContent: {
    backgroundColor: '#F6E8B1',
    borderRadius: wp(2),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: wp(1),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F7D78F',
    opacity: 0.5,
  },
});

export default styles;
