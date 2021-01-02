import React, {useState, useEffect} from 'react';

import {GoogleSignin} from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AnimatedLoader from 'react-native-animated-loader';

import Login from './screens/Login';
import {StyleSheet, Text} from 'react-native';
import Home from './screens/Home';
import Calculate from './screens/Calculate';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '1022129927824-6rtjphtf29itrlhbcqrvakouo71dids5.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return subscriber;
  }, []);

  return loading ? (
    <AnimatedLoader
      visible={loading}
      overlayColor="rgba(255,255,255,0.75)"
      source={require('./assets/loader.json')}
      animationStyle={styles.lottie}
      speed={1}
    />
  ) : (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={Home}
              initialParams={{user: user}}
            />
            <Stack.Screen
              name="Calculate"
              component={Calculate}
              initialParams={{user: user}}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});

export default App;
