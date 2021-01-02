import React from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';

const Home = (props) => {
  const {user} = props.route.params;

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('Your are signed out!'));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.user}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/profile.png')}
        />
        <Text style={styles.userText}>Hello, {user?.displayName}</Text>
      </View>
      <TouchableOpacity onPress={signOut}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/log-out.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => props.navigation.navigate('Calculate')}
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          position: 'absolute',
          bottom: 50,
          right: 10,
          height: 70,
          backgroundColor: '#fff',
          borderRadius: 100,
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/plus.png')}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    margin: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  user: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    paddingLeft: 15,
    fontSize: 16,
    fontWeight: '600',
  },
});
