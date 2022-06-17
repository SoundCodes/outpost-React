import React, { useEffect, useState } from 'react';
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableHighlight,
  Modal
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import { acceptFriendRequest } from '../service/upload';
import { GlobalStyles } from '../style/globalStyleSheet';

const logo = require('../assets/logo.png');
const LogoName = require('../assets/logoName.png');
const secondUser = require('../assets/user-two.png');
const Line1 = require('../assets/Line1.png');
const Line2 = require('../assets/Line2.png');
const Line3 = require('../assets/Line3.png');
const Line4 = require('../assets/Line4.png');

const AcceptInviteScreen = (props) => {
  const [code, setCode] = useState();
  const [isPressedIn, setIsPressedIn] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState();

  useEffect(() => {
    console.log(props?.route?.params?.code);
    setCode(props?.route?.params?.code || '');
  }, []);

  const acceptRequest = () => {
    acceptFriendRequest(props.token, code).then(res => {
      props.navigation.navigate('CreateSession');
      setMessage(res.msg ? res.msg : 'friend request accepted');
      setShowPopup(true);
      // Snackbar.show({text: 'Friend Request Accepted', duration: Snackbar.LENGTH_SHORT})
    }).catch(err => {
      console.log(err);
      setMessage(err.msg ? err.msg : 'some error occurred');
      setShowPopup(true);
      // Snackbar.show({text: 'Some Error Occurred', duration: Snackbar.LENGTH_SHORT})
    });
    
  }
  return (
    <ScrollView>
        <View>
          <Image source={logo} style={GlobalStyles.Small_Logo} />
          <Image style={GlobalStyles.Small_LogoName} source={LogoName} />
        </View>
        <View style={GlobalStyles.Invite}>
          <Text style={GlobalStyles.Text}>
            enter the invite code
          </Text>
          <TextInput
            style={GlobalStyles.Transparent_Input}
            placeholder='invite code'
            placeholderTextColor='#16E1FF'
            value={code}
            onChangeText={(val) => setCode(val)}
            autoCapitalize='none'
            autoCorrect={false}
          />
        </View>

        <TouchableHighlight 
        style={[GlobalStyles.ButtonEnter, GlobalStyles.Button]} 
        onPress={() => acceptRequest()}
        underlayColor="#2a2c2d"
          activeOpacity={1}
          onPressIn={() => {
            setIsPressedIn(true);
          }}
          onPressOut={() =>{
            setIsPressedIn(false);
          }}
        >
          <Text style={isPressedIn ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>enter</Text>
        </TouchableHighlight>
        <Modal style={GlobalStyles.Modal}
        visible={showPopup}
        onRequestClose={() => {
          setShowPopup(false);
          props.navigation.goBack();
        }}
        transparent>
        <View style={GlobalStyles.Modal_Body} >
          <View style={GlobalStyles.Modal_Inner_Column}>
            <Text style={GlobalStyles.Modal_Text}>
              {message}
            </Text>
            <TouchableOpacity onPress={() => {
              setShowPopup(false);
              props.navigation.goBack();
            }}>
              <Text style={GlobalStyles.Modal_Button_Inner}> ok </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};



export default connect(mapStateToProps, mapDispatchToProps)(AcceptInviteScreen);
