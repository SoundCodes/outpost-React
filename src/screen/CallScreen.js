import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, TouchableHighlight, Image, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';

import InCallManager from 'react-native-incall-manager';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import { leaveGroup } from 'react-native-webrtc-simple/WebRtcSimple/peer';
import WebView from 'react-native-webview';
import { GlobalStyles } from '../style/globalStyleSheet';
import { white } from 'react-native-paper/lib/typescript/styles/colors';
// import {acc} from 'react-native-reanimated';

import { DeviceEventEmitter } from 'react-native';
import MeterComponent from '../components/MeterComponent';

export function CallScreen(props) {
  /**
   * Calling Stuff Ends
   */
  const [isPressedEnd, setIsPressedEnd] = useState(false);
  const [isPressedEndRec, setIsPressedEndRec] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const endCall = () => {
    props.route.params.leave();
  };

  const startRecording = () => {
    setRecording(true);
    props.route.params.startRecording();
  }
  const stopRecording = () => {
    setRecorded(true);
    props.route.params.stopRecording();
  }

  const recordingIcon = require('../assets/rec.png');

  useEffect(() => {
    InCallManager.setSpeakerphoneOn(true);
    if (props.route.params.sender) {
      console.log('I am Calling');
      InCallManager.start({ media: 'video', ringback: '_DEFAULT_' });
    } else {
      InCallManager.start({ media: 'video' });
    }
    return InCallManager.stop();
  }, [])
  useEffect(() => {
    console.log(props.remoteStream);
    if (props.remoteStream !== null && props.remoteStream !== undefined) {
      console.log('My call is returned');
      InCallManager.stopRingback();
    }
  }, [props.remoteStream]);

  useEffect(() => {
    console.log('Recording', props.recording);
  }, [props.recording])
  return (
    <View style={GlobalStyles.root}>
      <Image
        source={recordingIcon}
        style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, zIndex: 90, elevation: Platform.OS == 'android' ? 99 : 0}}
      />
      {(props.localStream == null || props.localStream == undefined) ? (<Text style={{ color: 'white' }}>error connecting video camera</Text>) : (
        <RTCView
          key={'local'}
          zOrder={2}
          objectFit={"cover"} mirror={true}
          streamURL={props.localStream ? props.localStream.toURL() : ''}
          style={{ position: 'absolute', top: 10, right: 10, width: 100, height: 120, zIndex: 1, elevation: Platform.OS == 'android' ? 1 : 0 }}
        />
      )}
      
      {(props.remoteStream == null || props.remoteStream == undefined) ? (

        <Text style={{ backgroundColor: '#16E1FF', padding: 10, marginTop: '50%', width: '100%', textAlign: 'center', textAlignVertical: 'center' }}>{`waiting for ${props.route.params.callee} to join...`}</Text>
      )

        : (
          <RTCView
            key={'remote'}
            zOrder={-1}
            objectFit={"cover"} mirror={true}
            streamURL={props.remoteStream == null || props.remoteStream == undefined ? '' : props.remoteStream.toURL()}
            style={[GlobalStyles.remoteVideo]}
          />
        )}
      <View style={{ position: 'absolute', bottom: 0, width: '100%', paddingBottom: 10, display: 'flex', alignItems: 'center', zIndex: 0 }}>
        <TouchableHighlight style={GlobalStyles.Button} onPress={() => endCall()}
          underlayColor="#2a2c2d"
          activeOpacity={1}
          onPressIn={() => {
            setIsPressedEnd(true);
          }}
          onPressOut={() => {
            setIsPressedEnd(false);
          }}
        >
          <Text style={isPressedEnd ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>end call</Text>
        </TouchableHighlight>
        {
          props.activeCall && !recorded && (
            <TouchableHighlight style={[GlobalStyles.Button, recording ? GlobalStyles.redButton : null]} onPress={() => {
              if (!recording) {
                startRecording()
              } else {
                stopRecording();
              }
            }}
              underlayColor="#2a2c2d"
              activeOpacity={1}
              onPressIn={() => {
                setIsPressedEndRec(true);
              }}
              onPressOut={() => {
                setIsPressedEndRec(false);
              }}
            >
              <Text style={isPressedEndRec ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>{!recording ? 'start recording' : 'stop recording'}</Text>
            </TouchableHighlight>
          )
        }
      </View>
      <MeterComponent></MeterComponent>
      {/* <View style={{ position: 'relative', alignSelf: 'flex-end', height: '100%', width: '100%', backgroundColor: '#2a2c2d' }}>
        <View style={{ position: 'absolute', ZIndex: 100, top: 10, right: 10, width: 100, height: 120, backgroundColor: '#2a2c2d' }}>
          {(props.localStream == null || props.localStream == undefined) ? (<Text style={{ color: 'white' }}>error connecting video camera</Text>) : (
            <RTCView
              key={'local'}
              zOrder={0}
              objectFit={"cover"} mirror={true}
              streamURL={props.localStream ? props.localStream.toURL() : ''}
              style={[GlobalStyles.localVideo]}
            />
          )}
        </View>
        {(props.remoteStream == null || props.remoteStream == undefined) ? (

          <Text style={{ backgroundColor: '#16E1FF', padding: 10, marginTop: '50%', width: '100%', textAlign: 'center', textAlignVertical: 'center' }}>{`waiting for ${props.route.params.callee} to join...`}</Text>
        )

          : (
            <RTCView
              key={'remote'}
              zOrder={-1}
              objectFit={"cover"} mirror={true}
              streamURL={props.remoteStream == null || props.remoteStream == undefined ? '' : props.remoteStream.toURL()}
              style={[GlobalStyles.remoteVideo]}
            />
          )}

        

      </View> */}
      {/* <View style={GlobalStyles.videoContainer}>
        <View style={[GlobalStyles.videos, GlobalStyles.localVideos]}>
          {(props.localStream == null || props.localStream == undefined) ? (<Text style={{color: 'white'}}>Error Connecting Video Camera</Text>) : (
            <RTCView
              zOrder={2000} objectFit={"cover"} mirror={true}
              streamURL={props.localStream ? props.localStream.toURL() : ''}
              style={GlobalStyles.localVideo}
            />
          )}
        </View>
        <View style={[GlobalStyles.videos, GlobalStyles.remoteVideos]}>
          {(props.remoteStream == null || props.remoteStream == undefined) ? (<Text>Waiting for Connection</Text>) : (
            <RTCView
              streamURL={props.remoteStream == null || props.remoteStream == undefined ? '' : props.remoteStream.toURL()}
              style={GlobalStyles.remoteVideo}
            />
          )}
        </View>
      </View> */}
      {/* <WebView
        userAgent={'Mozilla/5.0 (Linux; An33qdroid 10; Android SDK built for x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.185 Mobile Safari/537.36'} //Set your useragent (Browser) **Very Important
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        bounces={true}
        source={{
          uri: "https://outpost.sound.codes/spectograph/", //URL of your redirect site
        }}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}

      /> */}
    </View>

  );
}


export default connect(mapStateToProps, mapDispatchToProps)(CallScreen);