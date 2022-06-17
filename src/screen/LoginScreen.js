import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  AlertButton,
  Pressable,
  TouchableHighlight,
  Modal
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { LoginUser } from '../service/auth';
import { mapStateToProps, mapDispatchToProps } from '../redux/map';
import messaging  from '@react-native-firebase/messaging';
import { GlobalStyles } from '../style/globalStyleSheet';

const logo = require('../assets/logo.png');
const LogoName = require('../assets/logoName.png');

const LoginScreen = (props) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [isPressedInLogin, setIsPressedInLogin] = useState(false);
  const [isPressedRegister, setIsPressedRegister] = useState(false);
  const [fcmtoken, setFcmtoken] = useState();
  const [passwordVisible, setPasswordVisible] = useState(true);

  useEffect(() => {
    messaging().getToken().then(tok => {
      setFcmtoken(tok);
    })
  }, []);
  const LoginButton = () => {
    console.log(username);
    LoginUser(username, password, fcmtoken).then(userDet => {
      console.log(userDet);
      console.log(props);
      props.setToken(userDet.token);
      props.setEmail(userDet.email);
      props.setUserName(userDet.name);
      console.log(userDet.id);
      props.setUserId(userDet.id);
      props.navigation.replace('Home');
    }).catch(err => {
      setShowWarning(true);
    });
  };
  return (
    <ScrollView>
      <Image />
      <View
        style={GlobalStyles.container}>
        <Image
          source={logo}
          style={GlobalStyles.Logo}
        />

        <Image
          style={GlobalStyles.LogoName}
          source={LogoName}
        />

        <TextInput
          style={GlobalStyles.Input}
          placeholder="email"
          placeholderTextColor="#16e1ff"
          value={username}
          onChangeText={val => { setUsername(val) }}
          textContentType='emailAddress'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          autoCompleteType='email'
          theme={{ colors: { text: '#16e1ff', primary: '#16e1ff', underlineColor: 'transparent' } }}
        />
        <TextInput
          style={GlobalStyles.Input}
          secureTextEntry={passwordVisible}
          placeholder="password"
          value={password}
          placeholderTextColor="#16e1ff"
          onChangeText={val => { setPassword(val) }}
          autoCapitalize='none'
          autoCorrect={false}
          theme={{ colors: { text: '#16e1ff', primary: '#16e1ff', underlineColor: 'transparent'  } }}
          right={<TextInput.Icon name={passwordVisible ? "eye" : "eye-off"} color={'#16e1ff'} onPress={() => setPasswordVisible(!passwordVisible)} />}
        />
        <TouchableHighlight
          style={GlobalStyles.Button}
          onPress={() => LoginButton()}
          underlayColor="#2a2c2d"
          activeOpacity={1}
          onPressIn={() => {
            setIsPressedInLogin(true);
          }}
          onPressOut={() => {
            setIsPressedInLogin(false);
          }}
        >
          <Text style={isPressedInLogin ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>login</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={GlobalStyles.Button}
          onPress={() => props.navigation.navigate('Register')}
          underlayColor="#2a2c2d"
          activeOpacity={1}
          onPressIn={() => {
            setIsPressedRegister(true);
          }}
          onPressOut={() => {
            setIsPressedRegister(false);
          }}
        >
          <Text style={isPressedRegister ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText} >register</Text>
        </TouchableHighlight>

      </View>
      <Modal style={GlobalStyles.Modal}
        visible={showWarning}
        onRequestClose={() => {
          setShowWarning(false);
        }}
        transparent>
        <View style={GlobalStyles.Modal_Body} >
          <View style={GlobalStyles.Modal_Inner}>
            <Text onPress={() => setShowWarning(false)}
              style={GlobalStyles.Modal_Cross}>
              X
            </Text>
            <Text style={GlobalStyles.Modal_Text}>
              sorry; the password is incorrect
              did you <Text
                onPress={() => props.navigation.navigate('Forget')}
                style={GlobalStyles.Modal_Underline}
              >
                forgot your password?
              </Text>
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

