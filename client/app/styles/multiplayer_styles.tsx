import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DARK_BROWN, LIGHT_BROWN } from './difficulty_styles';

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F6E8B1",
  },
  container: {
    flex: 1,
    padding: wp(5),
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: 'bold',
    marginBottom: hp(4),
  },
  peerButton: {
    width: wp(80),
    padding: wp(4),
    backgroundColor: LIGHT_BROWN,
    borderRadius: wp(2),
    marginVertical: hp(1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hostButton: {
    position: 'absolute',
    bottom: hp(5),
    width: wp(80),
    padding: wp(4),
    backgroundColor: DARK_BROWN,
    borderRadius: wp(2),
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2.5),
    fontWeight: 'bold',
  },
});

export default styles;