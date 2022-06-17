// import React, { useEffect, useRef, useState } from 'react';
// import { ScrollView, View, Image, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { connect } from 'react-redux';
// import { mapDispatchToProps, mapStateToProps } from '../redux/map';
// import { Alert } from 'react-native';
// import {
//     mediaDevices,
//     MediaStream,
//     MediaStreamConstraints,
//     RTCIceCandidate,
//     RTCPeerConnection,
//     RTCSessionDescription,
// } from 'react-native-webrtc';
// import socketio from 'socket.io-client';
// import {
//     SERVER_URL,
//     PEER_SERVER_HOST,
//     PEER_SERVER_PORT,
//     PEER_SERVER_PATH,
// } from '../server';
// // @ts-ignore
// import Peer from 'react-native-peerjs';
// import InitialScreen from './InitialScreen';
// import { createStackNavigator } from '@react-navigation/stack';
// import SoloSessionScreen from './SoloSessionScreen';
// import ViewSessionsScreen from './ViewSessionsScreen';
// import CreateSessionScreen from './CreateSessionScreen';
// import InviteScreen from './InviteScreen';
// import AcceptInviteScreen from './AcceptInviteScreen';
// import CallScreen from './CallScreen';
// import { Button } from 'react-native-elements';
// import Modal from 'react-native-modal';
// import RNCallKeep from 'react-native-callkeep';
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';
// import AudioRecord from 'react-native-audio-record';
// import Geolocation from '@react-native-community/geolocation';
// import Permissions from 'react-native-permissions';
// import Sound from 'react-native-sound';
// import { GetFriends, UploadFile } from '../service/upload';
// import { Buffer } from 'buffer';
// import { addListener, startUpload } from 'react-native-background-upload';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
// import messaging from '@react-native-firebase/messaging';
// import InCallManager from 'react-native-incall-manager';
// import CallKeepScreen from './CallKeepScreen';
// import BackgroundTimer from 'react-native-background-timer';
// import DeviceInfo from 'react-native-device-info';

// const logo = require('../assets/logo.png');

// const Line1 = require('../assets/Line1.png');
// const Line2 = require('../assets/Line2.png');
// const Line3 = require('../assets/Line3.png');
// const Line4 = require('../assets/Line4.png');

// const LogoName = require('../assets/logoName.png');
// const Stack = createStackNavigator();

// const STUN_SERVER = 'stun:stun.sound.codes:5349';
// const SOCKET_URL = 'ws://159.65.118.116:8080';

// BackgroundTimer.start();

// RNCallKeep.setup({
//     ios: {
//       appName: 'Outpost',
//     },
//     android: {
//       alertTitle: 'Permissions required',
//       alertDescription: 'This application needs to access your phone accounts',
//       cancelButton: 'Cancel',
//       okButton: 'ok',
//       imageName: 'phone_account_icon',
//       selfManaged: false,
      
//       //additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
//       // Required to get audio in background when using Android 11
//       foregroundService: {
//         channelId: 'com.outpost',
//         channelName: 'Foreground service for my app',
//         notificationTitle: 'My app is running on background',
//         notificationIcon: 'Path to the resource icon of the notification',
//       }, 
//     }
//   });

// const getNewUuid = () => uuidv4();

// const format = uuid => uuid.split('-')[0];

// const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

// const HomeScreen = (props) => {
//     const [lat, setLat] = useState('');
//     const [long, setLong] = useState('');
//     const [uploading, setUploading] = useState(false);
//     const [fileName, setFileName] = useState('');
//     const [buffer, setBuffer] = useState([]);
//     const [audioFile, setAudioFile] = useState('');
//     const [recording, setRecording] = useState(false);
//     const [callPartner, setCallPartner] = useState(null);
//     const [logText, setLog] = useState('');
//     const [heldCalls, setHeldCalls] = useState({}); // callKeep uuid: held
//     const [mutedCalls, setMutedCalls] = useState({}); // callKeep uuid: muted

//     const connectedUser = useRef(null);
//     const offerRef = useRef(null);
//     const calls = useRef({});
//     const callId = useRef(null);

//     const socket = useRef(new WebSocket(SOCKET_URL));
//     const peerServer = useRef(new RTCPeerConnection({
//         iceServers: [
//             {
//                 url: STUN_SERVER,
//                 credential: 'gKR>xhxY3~,ZBRUP',
//                 username: 'outpost'
//             },
//         ],
//     }));

//     let sound = null;

//     const [socketActive, setsocketActive] = useState(false);
//     const [callActive, setCallActive] = useState(false);
//     const [incomingCall, setIncomingCall] = useState(false);
//     const [otherId, setOtherId] = useState('');
//     const [callToUsername, setCallToUsername] = useState('');

//     const [calling, setCalling] = useState(false);

//     const [loaded, setLoaded] = useState(false);
//     const [paused, setPaused] = useState(true);

//     const [loading, setLoading] = useState(false);

//     const getListofFriends = () => {
//         GetFriends(props.token).then(res => {
//             props.setUsers(res);
//         }).catch(err => {
//             console.log(err);
//         })
//     }

//     const getUserName = (id) => {
//         if (props.users == null) {
//             return '';
//         }
//         const user = props.users.find(u => u.friend_id == id);
//         return user ? user.friend_name : '';
//     }

//     const initLocalVideo = () => {
//         console.log('setting loc')
//         mediaDevices
//             .getUserMedia({
//                 audio: true,
//                 video: {
//                     mandatory: {
//                         minWidth: 100, // Provide your own width, height and frame rate here
//                         minHeight: 120,
//                         minFrameRate: 30,
//                     },
//                     facingMode: 'user',
//                     // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//                 },
//             })
//             .then((stream) => {
//                 console.log('got stream');
//                 // Got stream!
//                 console.log(stream);
//                 props.setLocalStream(stream);

//                 // setup stream listening
//                 peerServer.current.addStream(stream);
//             })
//             .catch((error) => {
//                 console.error(error);
//                 // Log error
//             });
//     };
//     const registerPeerEvents = () => {
//         peerServer.current.onaddstream = (event) => {
//             console.log('On Add Remote Stream');
//             props.setRemoteStream(event.stream);
//         };

//         // Setup ice handling
//         peerServer.current.onicecandidate = (event) => {
//             if (event.candidate) {
//                 console.log('Sending Candidate partner is ', connectedUser.current);
//                 send({
//                     type: 'candidate',
//                     sender: props.userId,
//                     receiver: connectedUser.current,
//                     candidate: event.candidate,
//                 });
//             }
//         };
//     };

//     const send = (message) => {
//         console.log('Message Sent', message.sender, message.receiver, message.type);
//         socket.current.send(JSON.stringify(message));
//     };

//     const sendCall = (receiverId) => {
//         setCalling(true);
//         //const otherUser = receiverId;
//         // setCallPartner(receiverId);
//         // const callUUID = getNewUuid();
//         // callId.current = callUUID;
//         connectedUser.current = receiverId;
//         // console.log('Calling to '+receiverId);
//         // create an offer
//         peerServer.current.createOffer().then((offer) => {
//             peerServer.current.setLocalDescription(offer).then(() => {
//                 // console.log('Sending Offer');
//                 send({
//                     type: 'offer',
//                     sender: props.userId,
//                     receiver: connectedUser.current,
//                     offer: offer,
//                 });
//                 props.navigation.navigate('Call', {sender: true});
//                 // console.log('Starting call with call id ', callUUID);
//                 // RNCallKeep.startCall(callUUID, connectedUser.current.toString(), getUserName(connectedUser.current));
//                 // // RNCallKeep.backToForeground();

//                 // BackgroundTimer.setTimeout(() => {
//                 //     log(`[setCurrentCallActive] ${format(callUUID)}, number: ${connectedUser.current}`);
//                 //     RNCallKeep.setCurrentCallActive(callUUID);
//                 // }, 1000);

//             });
//         });
//     };

//     //when somebody sends us an offer
//     const handleOffer = async (offer, sender) => {
//         // console.log('starting ringtone');
//         displayIncomingCall(sender);
//         // console.log(sender + ' is calling you.');
//         connectedUser.current = sender;
//         offerRef.current = { sender, offer };
//         setIncomingCall(true);
//         // acceptCall();
//         if (callActive) acceptCall();
//     };

//     const acceptCall = async () => {
//         console.log(offerRef.current);
//         const name = offerRef.current.sender;
//         const offer = offerRef.current.offer;
//         setIncomingCall(false);
//         setCallActive(true);
//         console.log('Accepting CALL', name, offer);
//         peerServer.current
//             .setRemoteDescription(offer)
//             .then(function () {
//                 connectedUser.current = name;
//                 return peerServer.current.createAnswer();
//             })
//             .then(function (answer) {
//                 peerServer.current.setLocalDescription(answer);
//                 send({
//                     type: 'answer',
//                     sender: props.userId,
//                     receiver: connectedUser.current,
//                     answer: answer,
//                 });
//                 props.navigation.navigate('Call');
//             })
//             .then(function () {
//                 // Send the answer to the remote peer using the signaling server
//             })
//             .catch((err) => {
//                 console.log('Error acessing camera', err);
//             });
//     };

//     //when we got an answer from a remote user
//     const handleAnswer = (answer) => {
//         setCalling(false);
//         setCallActive(true);
//         peerServer.current.setRemoteDescription(new RTCSessionDescription(answer)).catch(err => {
//             console.log('Error Occurred');
//         });
//         // startRecording();
//         // props.navigation.navigate('Call');
//     };

//     //when we got an ice candidate from a remote user
//     const handleCandidate = (candidate) => {
//         setCalling(false);
//         // console.log('Candidate ----------------->', candidate);
//         peerServer.current.addIceCandidate(new RTCIceCandidate(candidate));
//     };

//     const handleLeave = () => {
//         RNCallKeep.endCall(callId.current);
//         setCalling(false);
//         setIncomingCall(false);
//         setCallActive(false);
//         setCallPartner(null);
//         offerRef.current = null;
//         //connectedUser.current = null;
//         props.setRemoteStream(null);
//         props.setLocalStream(null);
//         peerServer.current.onicecandidate = null;
//         peerServer.current.ontrack = null;
//         resetPeer();
//         initLocalVideo();
//         stopRecording();
//         props.navigation.replace('CreateSession');
//     };

//     const leaveCall = () => {
//         send({
//             sender: props.userId,
//             receiver: connectedUser.current,
//             type: 'leave',
//         });

//         setCalling(false);
//         setIncomingCall(false);
//         setCallActive(false);
//         setCallPartner(null);
//         offerRef.current = null;
//         //connectedUser.current = null;
//         props.setRemoteStream(null);
//         props.setLocalStream(null);
//         peerServer.current.onicecandidate = null;
//         peerServer.current.ontrack = null;
//         resetPeer();
//         initLocalVideo();
//         stopRecording();
//         props.navigation.replace('CreateSession');
//     };

//     const resetPeer = () => {
//         peerServer.current = new RTCPeerConnection({
//             iceServers: [
//                 {
//                     url: STUN_SERVER,
//                     credential: 'gKR>xhxY3~,ZBRUP',
//                     username: 'outpost'
//                 },
//             ],
//         });

//         registerPeerEvents();
//     };

//     useEffect(() => {
//         socket.current.onopen = (ev) => {
//             console.log('Connected to the signaling server');
//             setsocketActive(true);
//         };
//         //when we got a message from a signaling server
//         socket.current.onmessage = (msg) => {
//             const data = JSON.parse(msg.data);
//             console.log('Message Received', data.sender, data.receiver, props.userId, data.type);
//             switch (data.type) {
//                 case 'login':
//                     console.log('Login');
//                     break;
//                 //when somebody wants to call us
//                 case 'offer':
//                     if (props.userId == data.receiver) {
//                         handleOffer(data.offer, data.sender);
//                     }
//                     console.log('Offer');
//                     break;
//                 case 'answer':
//                     if (props.userId == data.receiver) {
//                         handleAnswer(data.answer);
//                     }
//                     console.log('Answer');
//                     break;
//                 //when a remote peer sends an ice candidate to us
//                 case 'candidate':
//                     if (props.userId == data.receiver) {
//                         handleCandidate(data.candidate);
//                     }
//                     console.log('Candidate');
//                     break;
//                 case 'leave':
//                     if (props.userId == data.receiver) {
//                         handleLeave();
//                     }
//                     console.log('Leave');
//                     break;
//                 default:
//                     break;
//             }
//         };
//         socket.current.onerror = function (err) {
//             console.log('Got error', err);
//         };
//         initLocalVideo();
//         registerPeerEvents();
//     }, []);




//     /**
//      * 
//      */



//     const log = (text) => {
//         console.info(text);
//         setLog(logText + "\n" + text);
//     };

//     const addCall = (callUUID, number) => {
//         setHeldCalls({ ...heldCalls, [callUUID]: false });
//         calls.current[callUUID] = number;
//         console.log('Added Call', calls);
//         // setCalls({ ...calls, [callUUID]: number });
//     };

//     const removeCall = (callUUID) => {
//         const { [callUUID]: _, ...updated } = calls;
//         const { [callUUID]: __, ...updatedHeldCalls } = heldCalls;
//         calls.current[callUUID] = null;
//         console.log('Removed call', calls);
//         // setCalls(updated);
//         // setCalls(updatedHeldCalls);
//     };

//     const setCallHeld = (callUUID, held) => {
//         setHeldCalls({ ...heldCalls, [callUUID]: held });
//     };

//     const setCallMuted = (callUUID, muted) => {
//         setMutedCalls({ ...mutedCalls, [callUUID]: muted });
//     };

//     const displayIncomingCall = (number) => {
//         const callUUID = getNewUuid();
//         callId.current = callUUID;
//         connectedUser.current = number;
//         // (callUUID, number);

//         log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);
//         if (Platform.OS === 'android') {
//             RNCallKeep.displayIncomingCall(callUUID, number.toString(), getUserName(number), 'generic', true);
//         } else {
//             RNCallKeep.displayIncomingCall(callUUID, number, number, 'generic', true);
//         }
//     };

//     const answerCall = ({ callUUID }) => {
//         const number = connectedUser.current; // calls[callUUID];
//         log(`[answerCall] ${format(callUUID)}, number: ${number}`);

//         // RNCallKeep.startCall(callUUID, number.toString(), getUserName(number));
//         RNCallKeep.backToForeground();
//         acceptCall();

//         // BackgroundTimer.setTimeout(() => {
//         //     log(`[setCurrentCallActiveInsideAnswer] ${format(callUUID)}, number: ${number}`);
//         //     RNCallKeep.setCurrentCallActive(callUUID);
//         // }, 1000);
//     };

//     const didPerformDTMFAction = ({ callUUID, digits }) => {
//         const number = connectedUser.current; // calls[callUUID];
//         log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
//     };

//     const didReceiveStartCallAction = ({ handle, callUUID, name }) => {
//         console.log('Call UUID '+callUUID+' handle '+handle);
//         // if (!handle) {
//         //     // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
//         //     return;
//         // }
//         // const callUUID = callId.current == null ? getNewUuid() : callId.current;
//         // callId.current = callUUID;
//         // // (callUUID, handle);

//         // log(`[didReceiveStartCallActionCheck] ${callUUID}, number: ${handle} user: ${props.userId}`);

//         // RNCallKeep.startCall(callUUID, handle, getUserName(handle));

//         // BackgroundTimer.setTimeout(() => {
//         //     log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
//         //     RNCallKeep.setCurrentCallActive(callUUID);
//         // }, 1000);
//     };

//     const didPerformSetMutedCallAction = ({ muted, callUUID }) => {
//         const number = connectedUser.current; // calls[callUUID];
//         log(`[didPerformSetMutedCallAction] ${format(callUUID)}, number: ${number} (${muted})`);

//         setCallMuted(callUUID, muted);
//     };

//     const didToggleHoldCallAction = ({ hold, callUUID }) => {
//         const number = connectedUser.current; // calls[callUUID];
//         log(`[didToggleHoldCallAction] ${format(callUUID)}, number: ${number} (${hold})`);

//         setCallHeld(callUUID, hold);
//     };

//     const endCall = ({ callUUID }) => {
//         const handle = connectedUser.current; // calls[callUUID];
//         log(`[endCall] ${format(callUUID)}, number: ${handle}`);
//         leaveCall();
//         // removeCall(callUUID);
//     };

//     // Recording
//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'ios') {
//             getOneTimeLocation();
//         } else {
//             try {
//                 const w = await Permissions.request(Permissions.PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
//                 const r = await Permissions.request(Permissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//                 const granted = await Permissions.request(
//                     Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
//                     {
//                         title: 'Location Access Required',
//                         message: 'This App needs to Access your location',
//                     },
//                 ).catch(err => {
//                     console.log(err);
//                 });
//                 console.log(granted);
//                 if (granted === Permissions.RESULTS.GRANTED) {
//                     //To Check, If Permission is granted
//                     getOneTimeLocation();
//                 } else {
//                     console.log('Location Permission Denied');
//                 }
//             } catch (err) {
//                 console.warn(err);
//             }
//         }
//     }

//     const getOneTimeLocation = async () => {
//         Geolocation.getCurrentPosition(
//             //Will give you the current location
//             (position) => {
//                 console.log('Here');
//                 //getting the Longitude from the location json
//                 const currentLongitude =
//                     JSON.stringify(position.coords.longitude);

//                 //getting the Latitude from the location json
//                 const currentLatitude =
//                     JSON.stringify(position.coords.latitude);

//                 console.log(currentLatitude, currentLongitude);
//                 setLat(currentLatitude);
//                 setLong(currentLongitude);
//             },
//             (error) => {
//                 console.log('Err');
//                 console.log(error);
//             },
//             {
//                 enableHighAccuracy: false,
//                 timeout: 30000,
//                 maximumAge: 1000
//             },
//         );
//     }

//     const checkPermission = async () => {
//         const p = await Permissions.check(Platform.OS == 'android' ? Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO : Permissions.PERMISSIONS.IOS.MICROPHONE);
//         console.log('permission check', p);
//         if (p === 'authorized') return;
//         return requestPermission();
//     };

//     const requestPermission = async () => {
//         const p = await Permissions.request(Platform.OS == 'android' ? Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO : Permissions.PERMISSIONS.IOS.MICROPHONE);
//         console.log('permission request', p);
//     };

//     const startRecording = () => {
//         console.log('start record');
//         setAudioFile('');
//         setRecording(true);
//         setLoaded(false);
//         AudioRecord.start();
//     };

//     const stopRecording = async () => {
//         setLoading(true);
//         // if (!recording) return;
//         console.log('stop record');
//         let audio = await AudioRecord.stop();
//         setUploading(true);
//         await UploadFile(audio, fileName, otherId, props.token, lat, long).catch(err => {
//             console.log(err);
//         });
//         setAudioFile(audio);
//         setRecording(false);
//         setLoading(false);
//         setUploading(false);
//     };

//     const load = () => {
//         return new Promise((resolve, reject) => {
//             console.log(audioFile);
//             if (!audioFile) {
//                 return reject('file path is empty');
//             }

//             sound = new Sound(audioFile, '', error => {
//                 if (error) {
//                     console.log('failed to load the file', error);
//                     return reject(error);
//                 }
//                 setLoaded(true);
//                 return resolve();
//             });
//         });
//     };

//     const play = async () => {
//         if (!loaded) {
//             try {
//                 await load();
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         setPaused(false);
//         Sound.setCategory('Playback');

//         sound.play(success => {
//             if (success) {
//                 console.log('successfully finished playing');
//             } else {
//                 console.log('playback failed due to audio decoding errors');
//             }
//             setPaused(true);
//         });
//     };

//     const pause = () => {
//         sound.pause();
//         setPaused(true);
//     };

//     const uploadAudio = (file, filename, userSent, token, lat, long) => {
//         const collection = new FormData();
//         collection.append('user_sent', userSent);
//         collection.append('latitude', lat);
//         collection.append('longitude', long);
//         const options = {
//             url: 'https://outpost.sound.codes/outpost-app/backend/api/login_controller/upload_file',
//             path: file,
//             method: 'POST',
//             type: 'multipart',
//             field: 'audio_file',
//             parameters: collection,
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'Accept': 'application/json',
//                 'Authorization': token,
//                 'Authkey': 'sc-outpost-react@2022'
//             }
//         }

//         startUpload(options).then((uploadId) => {
//             console.log('Upload started')
//             addListener('progress', uploadId, (data) => {
//                 console.log(`Progress: ${data.progress}%`)
//             })
//             addListener('error', uploadId, (data) => {
//                 console.log(`Error: ${data.error}%`)
//             })
//             addListener('cancelled', uploadId, (data) => {
//                 console.log(`Cancelled!`)
//             })
//             addListener('completed', uploadId, (data) => {
//                 // data includes responseCode: number, responseBody: Object, responseHeaders: Lower cased http headers
//                 console.log('Completed!')
//             })
//         }).catch((err) => {
//             console.log('Upload error!', err)
//         })
//     }

//     const handleDynamicLink = link => {
//         console.log(link);

//         // Handle dynamic link inside your own application
//         if (link.url.search('https://outpost.sound.codes') !== -1) {
//             const tmp = link.url.split('https://outpost.sound.codes/')[1].split('/');
//             if (tmp[0] == 'invite') {
//                 props.navigation.navigate('AcceptInvite', { code: tmp[1] });
//             }
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = messaging().onMessage(async remoteMessage => {
//             Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//         });

//         return unsubscribe;
//     }, []);

//     useEffect(() => {
//         // messaging().onNotificationOpenedApp(remoteMessage => {
//         //     console.log(
//         //         'Notification caused app to open from background state:',
//         //         remoteMessage.notification,
//         //     );
//         //     navigation.navigate(remoteMessage.data.type);
//         // });

//         // // Check whether an initial notification is available
//         // messaging()
//         //     .getInitialNotification()
//         //     .then(remoteMessage => {
//         //         if (remoteMessage) {
//         //             console.log(
//         //                 'Notification caused app to open from quit state:',
//         //                 remoteMessage.notification,
//         //             );
//         //             setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
//         //         }
//         //         setLoading(false);
//         //     });
//         const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
//         return unsubscribe;
//     }, []);

//     useEffect(() => {
//         getListofFriends();
//         RNCallKeep.addEventListener('answerCall', answerCall);
//         RNCallKeep.addEventListener('didPerformDTMFAction', didPerformDTMFAction);
//         RNCallKeep.addEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
//         RNCallKeep.addEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
//         RNCallKeep.addEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
//         RNCallKeep.addEventListener('endCall', endCall);

//         requestLocationPermission();
//         checkPermission();
//         const date = new Date();
//         const fileName = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getMinutes().toString();
//         console.log(fileName);
//         const RandomNumber = Math.floor(Math.random() * 10000000000) + 1;
//         const options = {
//             sampleRate: 48000,
//             channels: 2,
//             bitsPerSample: 16,
//             wavFile: fileName + '.wav'
//         };
//         setFileName(fileName + '.wav');

//         AudioRecord.init(options);

//         AudioRecord.on('data', data => {
//             const chunk = Buffer.from(data, 'base64');
//             buffer.push(chunk);
//             setBuffer(buffer);
//             // do something with audio chunk
//         });

//         return () => {
//             RNCallKeep.removeEventListener('answerCall', answerCall);
//             RNCallKeep.removeEventListener('didPerformDTMFAction', didPerformDTMFAction);
//             RNCallKeep.removeEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
//             RNCallKeep.removeEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
//             RNCallKeep.removeEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
//             RNCallKeep.removeEventListener('endCall', endCall);
//         }
//     }, []);

//     return (
//         <SafeAreaProvider>
//             <Stack.Navigator
//                 hideNavBar={true}
//                 initialRouteName="Initial"
//                 screenOptions={{ headerShown: false }}
//                 options={{
//                     gestureEnabled: false,
//                 }}
//             >
//                 <Stack.Screen name="Initial" component={InitialScreen} />
//                 <Stack.Screen name="SoloSession" component={SoloSessionScreen} initialParams={{ startRecording: startRecording, stopRecording: stopRecording }} />
//                 <Stack.Screen name="ViewSessions" component={ViewSessionsScreen} />
//                 <Stack.Screen name="CreateSession" component={CreateSessionScreen} initialParams={{ call: (id) => { sendCall(id) }, leave: () => { handleLeave() } }} />
//                 <Stack.Screen name="Invite" component={InviteScreen} />
//                 <Stack.Screen name="AcceptInvite" component={AcceptInviteScreen} />
//                 <Stack.Screen name="CallKeepScreen" component={CallKeepScreen} />
//                 <Stack.Screen name="Call" component={CallScreen} initialParams={{ leave: () => { console.log('Came to leave', callId.current); callId.current != null ? RNCallKeep.endCall(callId.current) : leaveCall(); }, startRecording: () => { startRecording() }, stopRecording: stopRecording }} />
//             </Stack.Navigator>
//             {uploading && <View style={{ backgroundColor: "#16e1ff", position: 'absolute', bottom: 0, width: "100%" }}><Text style={{ color: '#2A2C2D', textAlign: 'center' }}>Uploading audio</Text></View>}
//             {/* <Modal isVisible={incomingCall && !callActive}>
//                 <View
//                     style={{
//                         backgroundColor: 'white',
//                         padding: 22,
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         borderRadius: 4,
//                         borderColor: 'rgb(22, 225, 255)',
//                     }}>
//                     <Text>{otherId + ' is calling you'}</Text>
//                     <Button title="accept call" onPress={acceptCall}>accept call</Button>
//                     <Button title="reject call" onPress={handleLeave}>
//                         reject call
//                     </Button>
//                 </View>
//             </Modal> */}
//         </SafeAreaProvider>


//     )
// };

// export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);