import { View, Text, StyleSheet, Image, Pressable, SafeAreaView } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
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

export default app

const styles = StyleSheet.create({
  safeContainer:{
    flex:1
  },
  container: {
    flex: 1,
    backgroundColor: "#F7D78F",
    justifyContent: "center", 
    alignItems: "center", 
  },
  footer: {
    width: wp(100),
    height: 60, 
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    position:'absolute',
    bottom:0
  },
  logo:{
    width: wp(40),
    height: hp(40),
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  title:{
    color: '#33333',
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Baloo',
    textAlign: 'center',
    marginTop: hp(-8),
    marginBottom: hp(10),
  },
  link:{
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'underline',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 4,
  },
  button:{
    height: 60,
    width: wp(75),
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 6,
    margin: 10
  },
  buttonText:{
    color: 'white',
    fontSize: hp(4),
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
  },
})