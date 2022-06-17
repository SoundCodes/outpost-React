import React, { useEffect, useState } from 'react';
import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Text , TouchableHighlight } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import { GlobalStyles } from '../style/globalStyleSheet';
import { Alert } from 'react-native';
import {
    mediaDevices,
    MediaStream,
    MediaStreamConstraints,
} from 'react-native-webrtc';
import socketio from 'socket.io-client';
import {
    SERVER_URL,
    PEER_SERVER_HOST,
    PEER_SERVER_PORT,
    PEER_SERVER_PATH,
} from '../server';
// @ts-ignore
import Peer from 'react-native-peerjs';

const logo = require('../assets/logo.png');

const Line1 = require('../assets/Line1.png');
const Line2 = require('../assets/Line2.png');
const Line3 = require('../assets/Line3.png');
const Line4 = require('../assets/Line4.png');

const LogoName = require('../assets/logoName.png');

const InitialScreen = (props) => {
    
    const [isPressedInCreate, setIsPressedInCreate] = useState(false);
    const [isPressedInView, setIsPressedInView] = useState(false);



    return (
        <SafeAreaProvider>
            <ScrollView>
                {/* <TouchableOpacity style={GlobalStyles.Hamburger}
                    onPress={() => props.navigation.navigate('MainMenu')}
                >
                    <Image
                        source={Line1}
                        style={GlobalStyles.HamburgerImage}
                    />
                    <Image
                        source={Line2}
                        style={GlobalStyles.HamburgerImage}
                    />
                    <Image
                        source={Line3}
                        style={GlobalStyles.HamburgerImage}
                    />
                    <Image
                        source={Line4}
                        style={GlobalStyles.HamburgerImage}
                    />
                </TouchableOpacity> */}

                <View style={GlobalStyles.container}>
                    <Image source={logo} style={GlobalStyles.Logo} />

                    <Image style={GlobalStyles.LogoName} source={LogoName} />

                    <TouchableHighlight
          style={GlobalStyles.Button}
          onPress={() => props.navigation.navigate('CreateSession')}
          underlayColor="#2a2c2d"
          activeOpacity={1}
          onPressIn={() => {
            setIsPressedInCreate(true);
          }}
          onPressOut={() => {
            setIsPressedInCreate(false);
          }}
        >
          <Text style={isPressedInCreate ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText} >create session</Text>
        </TouchableHighlight>
                    <TouchableHighlight
          style={GlobalStyles.Button}
          onPress={() => props.navigation.navigate('ViewSessions')}
          underlayColor="#2a2c2d"
          activeOpacity={1}
          onPressIn={() => {
            setIsPressedInView(true);
          }}
          onPressOut={() => {
            setIsPressedInView(false);
          }}
        >
          <Text style={isPressedInView ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText} >view session</Text>
        </TouchableHighlight>

                </View>
            </ScrollView>
        </SafeAreaProvider>


    )
};

export default connect(mapStateToProps, mapDispatchToProps)(InitialScreen);