import React, {FC, ReactElement, useState} from 'react';
import {
  Alert, 
  Text, 
  TextInput, 
  TouchableOpacity,
  TouchableHighlight,
  View, 
  StyleSheet,
  Image} from 'react-native';
// import Parse from 'parse/react-native';
import {useNavigation} from '@react-navigation/native';
import {mapStateToProps,mapDispatchToProps} from '../redux/map';
import {connect} from 'react-redux'
import { ScrollView} from 'react-native-gesture-handler';
import { ResetPassword } from '../service/auth';
import { GlobalStyles } from '../style/globalStyleSheet';

const logo = require('../assets/logo.png');

const LogoName = require('../assets/logoName.png');


export const ForgetScreen = (props) => {
  // Your state variable
  const [email, setEmail] = useState('');
  const [isPressedIn, setIsPressedIn] = useState(false);

  const doUserPasswordReset = async () => {
    // Note that this value come from state variables linked to your text input
    const emailValue = email;
    return await ResetPassword(emailValue)
      .then(res => {
        // logIn returns the corresponding ParseUser object
        if (res.success) {
          Alert.alert(
            'Success!',
            `Please check ${email} to proceed with password reset.`,
          );
          // Redirect user to your login screen
          props.navigation.navigate('Login');
          return true;
        } else {
          Alert.alert('Error!', res.message);
          return false;
        }
        
      })
      .catch((error) => {
        // Error can be caused by lack of Internet connection
        Alert.alert('Error!', error.message);
        return false;
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
     
        {/* <Text style={GlobalStyles.Text}>{'email address'}</Text> */}
          <TextInput
          style={GlobalStyles.Input}
          placeholder="email address"
          value={email}
          placeholderTextColor="#16e1ff"
          onChangeText={(text) => setEmail(text)}
          textContentType='emailAddress'
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          autoCompleteType='email'
        />
     
        <TouchableHighlight 
        style={GlobalStyles.Button} 
        onPress={() => doUserPasswordReset()}
        underlayColor="#2a2c2d"
        onPressIn = {() => {
          setIsPressedIn(true);
        }}
        onPressOut = { () => {
          setIsPressedIn(false)
        }}
        > 
            <Text style={isPressedIn ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>login</Text>
        </TouchableHighlight>
      </View>
   
   </ScrollView>
  );
};



export default  connect(mapStateToProps, mapDispatchToProps)(ForgetScreen);

