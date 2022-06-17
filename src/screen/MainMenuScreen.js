import React , {useState} from 'react';
import { 
    ScrollView, 
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight, 
    StyleSheet,
    Text } from 'react-native';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import { GlobalStyles } from '../style/globalStyleSheet';

const logo = require('../assets/logo.png');

const Line1 = require('../assets/Line1.png');
const Line2 = require('../assets/Line2.png');
const Line3 = require('../assets/Line3.png');
const Line4 = require('../assets/Line4.png');

const LogoName = require('../assets/logoName.png');

const MainMenuScreen = (props) => {

    const [isPressedInSpectogram, setIsPressedInSpectogram] = useState(false);
    const [isPressedInWaveform , setIsPressedInWaveform] = useState(false);
    const [isPressedInRecording , setIsPressedInRecording] = useState(false);
    const [isPressedInLogout, setIsPressedInLogout] = useState(false)


    return (
        <ScrollView>
            <TouchableOpacity style={GlobalStyles.Hamburger}
            onPress={() => props.navigation.goBack()}
            >
               <Text style={GlobalStyles.Cross}>
                   X
               </Text>
            </TouchableOpacity>
            
            <View style={GlobalStyles.container}>
                <Image source={logo} style={GlobalStyles.Logo} />

                <Image style={GlobalStyles.LogoName} source={LogoName} />

                <TouchableHighlight style={GlobalStyles.Button} onPress={() => props.setSpectograph(!props.spectograph)} 
                 underlayColor="#2a2c2d"
                 activeOpacity={1}
                 onPressIn={() => {
                   setIsPressedInWaveform(true);
                 }}
                 onPressOut={() => {
                   setIsPressedInWaveform(false);
                 }}>
                    <Text style={isPressedInWaveform ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>{ props.spectograph ? 'disable spectogram' : 'enable spectogram'}</Text>
                </TouchableHighlight>

                <TouchableHighlight style={GlobalStyles.Button}  onPress={() => props.setWaveform(!props.waveform)}
                 underlayColor="#2a2c2d"
                 activeOpacity={1}
                 onPressIn={() => {
                   setIsPressedInSpectogram(true);
                 }}
                 onPressOut={() => {
                   setIsPressedInSpectogram(false);
                 }}>
                    <Text style={isPressedInSpectogram ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>{ props.waveform ? 'disable waveform' : 'enable waveform'}</Text>
                </TouchableHighlight>

                <TouchableHighlight style={GlobalStyles.Button} onPress={() => props.navigation.navigate('ViewSessions')}
                 underlayColor="#2a2c2d"
                 activeOpacity={1}
                 onPressIn={() => {
                   setIsPressedInRecording(true);
                 }}
                 onPressOut={() => {
                   setIsPressedInRecording(false);
                 }}>
                    <Text style={isPressedInRecording ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>view public recordings</Text>
                </TouchableHighlight>

                <TouchableHighlight style={GlobalStyles.Button} onPress={() => {
                    props.setToken(null);
                    props.navigation.navigate('Login');
                }}
                underlayColor="#2a2c2d"
                activeOpacity={1}
                onPressIn={() => {
                  setIsPressedInLogout(true);
                }}
                onPressOut={() => {
                  setIsPressedInLogout(false);
                }}>
                    <Text style={isPressedInLogout ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>logout</Text>
                </TouchableHighlight>
            </View>
        </ScrollView>
    )};
    

export default connect(mapStateToProps, mapDispatchToProps)(MainMenuScreen);