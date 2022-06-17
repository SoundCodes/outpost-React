import React, { useEffect, useRef } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screen/LoginScreen';
import HomeScreen from '../screen/HomeScreen';
import SoloSessionScreen from '../screen/SoloSessionScreen';
import ViewSessionsScreen from '../screen/ViewSessionsScreen';
import MainMenuScreen from '../screen/MainMenuScreen';
import RegisterScreen from '../screen/RegisterScreen';
import InviteScreen from '../screen/InviteScreen';
import AcceptInviteScreen from '../screen/AcceptInviteScreen';
import CreateSessionScreen from '../screen/CreateSessionScreen';
import CallScreen from '../screen/CallScreen';
import ResetPassword from '../screen/ResetPasswordScreen';
import ForgetScreen from '../screen/ForgetScreen';
import messaging from '@react-native-firebase/messaging';
import IncomingCall from 'react-native-incoming-call';

const Stack = createStackNavigator();


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#16E1FF',
    background: '#2a2c2d',
    FontFace: 'Jost'
  },
};
const StackContainer = (props) => {
  const navigationRef = useRef();
  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Forget" component={ForgetScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackContainer;
