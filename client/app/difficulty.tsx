import { View, Text, Image, Pressable } from 'react-native';
import styles from './styles/menu_styles';
import { Difficulty, useGameSettings } from './game/gameSettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const DifficultyContent = () => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const { setGameSettings } = useGameSettings();

  const handleDifficultySelect = (difficulty: Difficulty) => {
    const randomColor = Math.random() > 0.5 ? 'WHITE' : 'BLACK';
    setGameSettings('singleplayer', randomColor, difficulty);
    console.log(`Starting singleplayer game as: ${randomColor} with difficulty: ${difficulty}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Pressable onPress={() => require('expo-router').router.push('/')}>
          <Ionicons name="arrow-back" size={hp(5)} color="black" />
        </Pressable>
      </View>
      <Image style={styles.logo} source={require('@/assets/images/logo.png')}/>
      <Text style={styles.title}>SELECT DIFFICULTY</Text>
  
      {difficulties.map((difficulty) => (
        <Pressable
          key={difficulty}
          style={styles.button}
          onPress={() => {
            handleDifficultySelect(difficulty);
            setTimeout(() => {
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