import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      },
      modalView: {
        backgroundColor: '#F6E8B1',
        borderRadius: 20,
        padding: hp(3),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        height: hp(20),
        width: wp(80),
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },

  })

  export default styles;