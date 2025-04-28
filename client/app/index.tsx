import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import styles from './styles/menu_styles';
import { useGameSettings } from './game/gameSettingsContext';

const MenuContent = () => {
  const { setGameSettings } = useGameSettings();

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('@/assets/images/logo.png')}/>
      <Text style={styles.title}>CHECKERS</Text>
      
        <Pressable 
          style={styles.button} 
          onPress={() => require('expo-router').router.push('/difficulty')}>
          <Text style={styles.buttonText}>SINGLEPLAYER</Text>
        </Pressable>

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
