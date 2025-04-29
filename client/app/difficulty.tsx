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
  const { setGameSettings, gameMode } = useGameSettings();
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>();
  const [selectedDuration, setSelectedDuration] = useState<TurnDuration | null>(null);

  const handlePlayPress = () => {
    if ((gameMode === 'singleplayer' && selectedDifficulty && selectedDuration) || 
        (gameMode === 'multiplayer' && selectedDuration)) {
      const randomColor = Math.random() > 0.5 ? 'WHITE' : 'BLACK';
      setGameSettings(
        gameMode!, 
        randomColor, 
        selectedDuration, 
        gameMode === 'singleplayer' ? selectedDifficulty : 'medium'
      );
      require('expo-router').router.replace('/board');
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
          
          {gameMode === 'singleplayer' && (
            <>
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
            </>
          )}
          
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
              styles.roundButton, 
              {backgroundColor: LIGHT_BROWN, alignItems: 'center', justifyContent: 'center'},
              (!selectedDuration || (gameMode === 'singleplayer' && !selectedDifficulty)) && styles.disabledButton
            ]}
            onPress={handlePlayPress}
            disabled={!selectedDuration || (gameMode === 'singleplayer' && !selectedDifficulty)}
          >
            <Ionicons name="play-outline" size={hp(5)} color="black"/>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default DifficultyContent;