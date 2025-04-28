import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import styles from './styles/menu_styles';
import { useGameSettings } from './game/gameSettingsContext';

const MenuContent = () => {
  const { clearGameSettings, setGameSettings } = useGameSettings();
  
  useEffect(() => {
    clearGameSettings(); // Clear settings when menu mounts
  }, []);

  const handleSinglePlayerPress = () => {
    setGameSettings('singleplayer', 'WHITE', 300); // Explicitly cast -1 as TurnDuration
    require('expo-router').router.push('/difficulty');
  };

  const handleMultiplayerPress = () => {
    setGameSettings('multiplayer', 'WHITE', 300); // Set multiplayer with default duration
    require('expo-router').router.push('/difficulty'); // Go directly to board for multiplayer
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default MenuContent;
