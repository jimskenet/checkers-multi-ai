import { View, Text, Image, Pressable, SafeAreaView } from 'react-native';
import styles, { DARK_BROWN, LIGHT_BROWN } from './styles/difficulty_styles';
import { Difficulty, TurnDuration, useGameSettings } from './game/gameSettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';

const DifficultyContent = () => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const turnDurations: TurnDuration[] = [180, 300, 600];
  const { setGameSettings } = useGameSettings();
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<TurnDuration | null>(null);

  const handlePlayPress = () => {
    if (selectedDifficulty && selectedDuration) {
      const randomColor = Math.random() > 0.5 ? 'WHITE' : 'BLACK';
      setGameSettings('singleplayer', randomColor, selectedDuration, selectedDifficulty);
      console.log(`Starting game as: ${randomColor}, difficulty: ${selectedDifficulty}, duration: ${selectedDuration}`);
      require('expo-router').router.push('/board');
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Pressable onPress={() => require('expo-router').router.push('/')}>
              <Ionicons name="arrow-back" size={hp(5)} color="black" />
            </Pressable>
          </View>
          <Image style={styles.logo} source={require('@/assets/images/logo.png')}/>
          
          <Text style={[styles.title, {marginTop: hp(1)}]}>SELECT DIFFICULTY</Text>
          <View style={[styles.choices, {marginBottom: hp(15)}]}>
            {difficulties.map((difficulty) => (
              <Pressable
                key={difficulty}
                style={[
                  styles.button,
                  selectedDifficulty === difficulty && styles.selectedButton
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={styles.buttonText}>{difficulty.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
          
          <Text style={styles.title}>SELECT TURN DURATION</Text>
          <View style={styles.choices}>
            {turnDurations.map((duration) => (
              <Pressable
                key={duration}
                style={[
                  styles.button,
                  selectedDuration === duration && styles.selectedButton
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text style={styles.durationText}>{`${duration/60} MIN`}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[
              styles.button, 
              {backgroundColor: LIGHT_BROWN},
              (!selectedDifficulty || !selectedDuration) && styles.disabledButton
            ]}
            onPress={handlePlayPress}
            disabled={!selectedDifficulty || !selectedDuration}
          >
            <Text style={styles.title}>PLAY</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DifficultyContent;