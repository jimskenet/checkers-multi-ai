  import { View, Text, Image, Pressable, SafeAreaView } from 'react-native'
  import React from 'react'
  import { Link } from 'expo-router'
  import styles from './styles/menu_styles';
  import { SafeAreaProvider } from 'react-native-safe-area-context';

  const app = () => {
    return (
      <SafeAreaProvider>    
        <SafeAreaView style={styles.safeContainer}>
          <View style = {styles.container}>
            <Image style = {styles.logo} source={require('@/assets/images/logo.png')}/>
            <Text style = {styles.title}>CHECKERS</Text>
            
            <Link href="/board" style = {{marginHorizontal: 'auto'}} 
            asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>SINGLEPLAYER</Text>
              </Pressable>
            </Link>

            <Link href="/multiplayer" style = {{marginHorizontal: 'auto'}} 
            asChild>
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>MULTIPLAYER</Text>
              </Pressable>
            </Link>

          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    )
  }

  export default app;