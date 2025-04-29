import { View, Text, Image, Pressable, ImageBackground } from 'react-native';
import styles from './styles/menu_styles';
import { useGameSettings } from './game/gameSettingsContext';

const MenuContent = () => {
  const {setGameSettings } = useGameSettings();
  
  const handleSinglePlayerPress = () => {
    setGameSettings('singleplayer', 'WHITE', undefined);
    require('expo-router').router.push('/difficulty');
  };

  const handleMultiplayerPress = () => {
    setGameSettings('multiplayer', 'WHITE', 300); // Set multiplayer with default duration
    require('expo-router').router.push('/difficulty'); // Go directly to board for multiplayer
  };

  return (
    <ImageBackground
        source={require('@/assets/images/checker-bg.jpg')}
        style={styles.container}>
        <View style={styles.overlay} />
        <Image style={styles.logo} source={require('@/assets/images/logo.png')}/>
        <Text style={styles.title}>CHECKERS</Text>
      
        <Pressable 
          style={styles.button} 
          onPress={handleSinglePlayerPress}>
          <Text style={styles.buttonText}>SINGLEPLAYER</Text>
        </Pressable>

        <Pressable 
          style={styles.button} 
          onPress={handleMultiplayerPress}>
          <Text style={styles.buttonText}>MULTIPLAYER</Text>
        </Pressable>
    </ImageBackground>
  );
};

export default MenuContent;
