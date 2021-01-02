import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useEffect} from 'react';
import {useState} from 'react';

const Home = (props) => {
  const {user} = props.route.params;
  const [list, setList] = useState([]);

  useEffect(() => {
    firestore()
      .collection(user?.uid)
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const listData = [];
        snapshot.forEach((documentSnapshot) => {
          listData.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setList(listData);
      });
  }, []);

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
      <View style={styles.header}>
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
      </View>

      <FlatList
        data={list}
        renderItem={({item}) => (
          <View
            style={{
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text>{item.nickName}</Text>
            <Text>EMI: {item.emiAmount.toFixed(2)}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('Calculate', (initialParams = {user: user}))
        }
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
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
