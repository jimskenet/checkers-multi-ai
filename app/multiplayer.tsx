import { View, Text, StyleSheet, Image, Pressable, SafeAreaView } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const multiplayer = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeContainer}>
        <View style = {styles.container}>
          <Text style = {styles.subtitle}>Available Players: </Text>

        <Link href="/board" style={{ marginHorizontal: 'auto' }} asChild>
          <Pressable style={styles.button}>
            <View style={styles.buttonRow}>
              <Text style={styles.buttonText}>Name: Test Phone</Text> 
              <Ionicons name="radio-button-on" size={wp(7)} color="green" />
            </View>
            <Text style={styles.buttonText}>Mac Address: B0-14-72-2F-EA-3C</Text>
          </Pressable>
        </Link>
    
        <Link href="/board" style={{ marginHorizontal: 'auto' }} asChild>
          <Pressable style={styles.button}>
            <View style={styles.buttonRow}>
              <Text style={styles.buttonText}>Name: John Doe</Text> 
              <Ionicons name="radio-button-on" size={wp(7)} color="green" />
            </View>
            <Text style={styles.buttonText}>Mac Address: 62-53-CB-9F-A1-A8</Text>
          </Pressable>
        </Link>
    
        <Link href="/board" style={{ marginHorizontal: 'auto' }} asChild>
          <Pressable style={styles.button}>
            <View style={styles.buttonRow}>
              <Text style={styles.buttonText}>Name: John Constantine</Text> 
              <Ionicons name="radio-button-on" size={wp(7)} color="green" />
            </View>
            <Text style={styles.buttonText}>Mac Address: DF-DF-CF-84-EC-63</Text>
          </Pressable>
        </Link>
    
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default multiplayer

const styles = StyleSheet.create({
  safeContainer:{
    flex:1
  },
  container: {
    flex: 1,
    backgroundColor: "#F7D78F",
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
  subtitle:{
    color: '#33333',
    margin: wp(5),
    fontSize: 22,
    fontWeight: 'bold',
    // fontFamily: 'Baloo',
    textAlign: 'left',
  },
  button:{
    height: hp(9),
    width: wp(80),
    backgroundColor: 'rgba(0,0,0,0.75)',
    marginBottom: hp(1)
  },
  buttonText:{
    color: 'white',
    fontSize: hp(2.5),
    textAlign: 'left',
    padding: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonRow: {
    flexDirection: 'row',           
    justifyContent: 'space-between', 
    alignItems: 'center',           
    width: wp(78)
  }
})