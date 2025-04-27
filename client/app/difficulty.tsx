import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import styles from './styles/menu_styles';
import { Difficulty, useGameSettings } from './game/gameSettingsContext';

const DifficultyContent = () => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const { setGameSettings } = useGameSettings();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    const randomColor = Math.random() > 0.5 ? 'WHITE' : 'BLACK';
    
    // Update the game settings first
    setGameSettings('singleplayer', randomColor, difficulty);
    console.log(`Starting singleplayer game as: ${randomColor} with difficulty: ${difficulty}`);
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('@/assets/images/logo.png')}/>
      <Text style={styles.title}>SELECT DIFFICULTY</Text>
  
      {difficulties.map((difficulty) => (
        <Pressable
          key={difficulty}
          style={styles.button}
          onPress={() => {
            // First update settings
            handleDifficultySelect(difficulty);
            // Then navigate using a small delay to allow state to update
            setTimeout(() => {
              // Use direct navigation if available in your Expo version
              // For older versions, you might need to use other navigation methods
              require('expo-router').router.push('/board');
            }, 10);
          }}
        >
          <Text style={styles.buttonText}>{difficulty.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default DifficultyContent;