import { StyleSheet, Text, View } from 'react-native';

export default function Winner() {
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'WHITE',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
