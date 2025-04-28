import { Platform, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const DARK_BROWN = "#8B4513";
export const LIGHT_BROWN = "#DEB887";

const styles = StyleSheet.create({
    safeContainer:{
      flex:1
    },
    container: {
      flex: 1,
      flexDirection: 'column', 
      backgroundColor: "#F7D78F",
      justifyContent: "center", 
      alignItems: "center", 
    },
    footer: {
      width: wp(100),
      height: 60, 
      backgroundColor: "rgba(0,0,0,0.75)",
      justifyContent: "center",
      alignItems: "center",
      position:'absolute',
      bottom:0
    },
    logo:{
      width: wp(40),
      height: hp(40),
      resizeMode: 'contain',
      justifyContent: 'center',
    },
    title:{
      color: '#33333',
      fontSize: hp(4),
      fontWeight: 'bold',
      fontFamily: 'Baloo',
      textAlign: 'center',
      // alignItems: 'center',
      marginTop: hp(-8),
    },
    link:{
      color: 'white',
      fontSize: 42,
      fontWeight: 'bold',
      textAlign: 'center',
      textDecorationLine: 'underline',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 4,
    },
    button:{
      height: hp(5.5),
      width: wp(31),
      backgroundColor: 'rgba(0,0,0,0.75)',
      padding: 3,
      alignContent: 'center',
      justifyContent: 'center',
    },
    buttonText:{
      color: 'white',
      fontSize: hp(3.5),
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 4,
    },
    durationText:{
      color: 'white',
      fontSize: hp(3),
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 4,
    },
    choices:{
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginBottom: hp(15)
    },
    iconContainer: {
        position: 'absolute',
        zIndex: 1,
        top: Platform.OS === 'ios' ? hp(2) : hp(2) + (StatusBar.currentHeight || 0),
        left: wp(2),
      },
      selectedButton: {
        opacity: 0.7,
        borderWidth: 2,
        borderColor: DARK_BROWN,
      },
      disabledButton: {
        opacity: 0.5,
        backgroundColor: LIGHT_BROWN,
      },
  })

  export default styles;