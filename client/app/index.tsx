import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import styles from './styles/menu_styles';
import { useGameSettings } from './game/gameSettingsContext';

const MenuContent = () => {
  const { setGameSettings } = useGameSettings();
  const randomColor = Math.random() > 0.5 ? 'WHITE' : 'BLACK';

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('@/assets/images/logo.png')}/>
      <Text style={styles.title}>CHECKERS</Text>
      
      <Link
        href="/difficulty"
        asChild
        onPress={() => {
          console.log('Navigating to difficulty selection');
        }}
      > 
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>SINGLEPLAYER</Text>
        </Pressable>
      </Link>

      <Link 
        href="/multiplayer" 
        asChild
        onPress={() => {
          setGameSettings('multiplayer', 'WHITE');
          console.log('Starting multiplayer game');
        }}
      >
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>MULTIPLAYER</Text>
        </Pressable>
      </Link>
    </View>
  );
};

export default MenuContent;
