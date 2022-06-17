import React, { Component } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import { Buffer } from 'buffer';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import { connect } from 'react-redux';
import { UploadFile } from '../service/upload';
import Geolocation from '@react-native-community/geolocation';
import * as RNFS from 'react-native-fs';
import { ActivityIndicator } from 'react-native-paper';
import { GlobalStyles } from '../style/globalStyleSheet';
import MeterComponent from '../components/MeterComponent';
import Waveform from '../components/Waveform';
import Spectogram from '../components/Spectogram';

export class SoloSessionScreen extends Component {
    sound = null;
    state = {
        recordingStart: false,
        recordingDone: false,
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { recordingStart, recordingDone } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    {
                        !recordingStart && !recordingDone ? <TouchableOpacity style={GlobalStyles.Button} onPress={() => { this.props.route.params.startRecording(); this.setState({ recordingStart: true }) }}>
                            <Text style={GlobalStyles.ButtonText}>{'start recording'}</Text>
                        </TouchableOpacity> : null
                    }
                    {
                        recordingStart ? <TouchableOpacity style={[GlobalStyles.Button, GlobalStyles.redButton]} onPress={() => { this.props.route.params.stopRecording(); this.setState({ recordingDone: true, recordingStart: false }) }}>
                            <Text style={GlobalStyles.ButtonText}>{'stop recording'}</Text>
                        </TouchableOpacity> : null
                    }
                    {
                        recordingDone ? <TouchableOpacity style={[GlobalStyles.Button, GlobalStyles.paddingButton]} onPress={() => { this.props.navigation.goBack() }}>
                            <Text style={GlobalStyles.ButtonText}>{'back'}</Text>
                        </TouchableOpacity> : null
                    }

                </View>
                {/* <View style={{ height: 100 }}>
                    <Waveform/>
                </View>
                <View style={{ height: 100 }}>
                    <Spectogram/>
                </View> */}
                <MeterComponent></MeterComponent>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    row: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 30,
        alignItems: 'center'
    },
    paddingButton: {
        width: '80%',
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(SoloSessionScreen);