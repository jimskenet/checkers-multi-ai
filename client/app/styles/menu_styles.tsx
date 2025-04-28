import { Platform, StatusBar, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    safeContainer:{
      flex:1
    },
    container: {
      flex: 1,
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
      fontSize: hp(5),
      fontWeight: 'bold',
      fontFamily: 'Baloo',
      textAlign: 'center',
      // alignItems: 'center',
      marginTop: hp(-8),
      marginBottom: hp(10),
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
      height: 60,
      width: wp(75),
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.75)',
      padding: 6,
      margin: 10
    },
    buttonText:{
      color: 'white',
      fontSize: hp(4),
      fontWeight: 'bold',
      textAlign: 'center',
      padding: 4,
    },
    iconContainer: {
        position: 'absolute',
        zIndex: 1,
        top: Platform.OS === 'ios' ? hp(2) : hp(2) + (StatusBar.currentHeight || 0),
        left: wp(2),
      },
  })

  export default styles;