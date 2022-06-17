// import React, { useEffect, useRef, useState } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { connect } from 'react-redux';
// import { mapDispatchToProps, mapStateToProps } from '../redux/map';
// import AcceptInviteScreen from './AcceptInviteScreen';
// import CallKeepScreen from './CallKeepScreen';
// import CallScreen from './CallScreen';
// import CreateSessionScreen from './CreateSessionScreen';
// import InitialScreen from './InitialScreen';
// import InviteScreen from './InviteScreen';
// import SoloSessionScreen from './SoloSessionScreen';
// import ViewSessionsScreen from './ViewSessionsScreen';
// import dynamicLinks from '@react-native-firebase/dynamic-links';
// import messaging from '@react-native-firebase/messaging';
// import { GetFriends, UploadFile } from '../service/upload';
// import AudioRecord from 'react-native-audio-record';
// import Geolocation from '@react-native-community/geolocation';
// import { Buffer } from 'buffer';
// import { Alert, DeviceEventEmitter, Image, Modal, Platform, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
// import { mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
// import 'react-native-get-random-values';
// import { v4 as uuidv4 } from 'uuid';
// import RNCallKeep from 'react-native-callkeep';
// import BackgroundTimer from 'react-native-background-timer';
// import IncomingCall from 'react-native-incoming-call';
// import { GlobalStyles } from '../style/globalStyleSheet';
// import { getOffer, makeCall } from '../service/auth';
// import invokeApp from 'react-native-invoke-app';
// import {Linking} from 'react-native';
// import LaunchApplication from 'react-native-bring-foreground';

// const Stack = createStackNavigator();

// const STUN_SERVER = 'stun:stun.sound.codes:5349';
// const SOCKET_URL = 'wss://call.sound.codes';

// const Line1 = require('../assets/Line1.png');
// const Line2 = require('../assets/Line2.png');
// const Line3 = require('../assets/Line3.png');
// const Line4 = require('../assets/Line4.png');

// const getNewUuid = () => uuidv4();

// BackgroundTimer.start();
// RNCallKeep.setup({
//     ios: {
//         appName: 'Outpost',
//     },
//     android: {
//         alertTitle: 'Permissions required',
//         alertDescription: 'This application needs to access to make calls through the app.',
//         cancelButton: 'Cancel',
//         okButton: 'ok',
//         imageName: 'phone_account_icon',
//         selfManaged: true,

//         //additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
//         // Required to get audio in background when using Android 11
//         foregroundService: {
//             channelId: 'com.outpost',
//             channelName: 'Foreground service for my app',
//             notificationTitle: 'My app is running on background',
//             notificationIcon: 'Path to the resource icon of the notification',
//         },
//     }
// });

// const HomeScreen = (props) => {
//     const [uploading, setUploading] = useState(false);
//     const [fileName, setFileName] = useState();
//     const [buffer, setBuffer] = useState([]);
//     const [lat, setLat] = useState();
//     const [long, setLong] = useState();
//     const [lStream, setLStream] = useState();
//     const [rStream, setRStream] = useState();
//     const [showRecording, setShowRecording] = useState(false);
//     const [showMenu, setShowMenu] = useState(false);
//     const [isPressedInSpectogram, setIsPressedInSpectogram] = useState(false);
//     const [isPressedInWaveform, setIsPressedInWaveform] = useState(false);
//     const [isPressedInRecording, setIsPressedInRecording] = useState(false);
//     const [isPressedInLogout, setIsPressedInLogout] = useState(false)

//     const connectedUser = useRef();
//     const offerRef = useRef();
//     const callId = useRef();
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

//     useEffect(() => {
//         props.setLocalStream(lStream);
//         props.setRemoteStream(rStream);
//         props.setRemoteUser('Something');
//     }, [lStream, rStream]);

//     const getUserName = (id) => {
//         if (props.users == null) {
//             return '';
//         }
//         const user = props.users.find(u => u.friend_id == id);
//         return user ? user.friend_name : '';
//     }

//     const startRecording = () => {
//         console.log('start record');
//         AudioRecord.start();
//     };

//     const stopRecording = async () => {
//         console.log('stop record');
//         let audio = await AudioRecord.stop();
//         setUploading(true);
//         await UploadFile(audio, fileName, connectedUser.current, props.token, lat, long).catch(err => {
//             console.log(err);
//         });
//         setUploading(false);
//     };

//     /* Call Feature */
//     const initLocalVideo = () => {
//         console.log('setting loc')
//         mediaDevices
//             .getUserMedia({
//                 audio: true,
//                 video: {
//                     mandatory: {
//                         minWidth: 1800, // Provide your own width, height and frame rate here
//                         minHeight: 900,
//                         minFrameRate: 30,
//                     },
//                     facingMode: 'user',
//                     // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
//                 },
//             })
//             .then((stream) => {
//                 console.log(`got stream`);
//                 console.log(stream);
//                 // Got stream!
//                 setLStream(stream);

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
//             setRStream(event.stream);
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
//         connectedUser.current = receiverId;
//         peerServer.current.createOffer().then((offer) => {
//             peerServer.current.setLocalDescription(offer).then(() => {
//                 // console.log('Sending Offer');
//                 // send({
//                 //     type: 'offer',
//                 //     sender: props.userId,
//                 //     receiver: connectedUser.current,
//                 //     offer: offer,
//                 // });
//                 makeCall(connectedUser.current, offer, props.token);
//                 props.navigation.navigate('Call', { callee: getUserName(connectedUser.current), sender: true, showRecording: showRecording });
//             });
//         });
//     };

//     //when somebody sends us an offer
//     const handleOffer = async (offer, sender) => {
//         displayIncomingCall(sender);
//         connectedUser.current = sender;
//         offerRef.current = { sender, offer };
//     };

//     const acceptCall = async () => {
//         console.log(offerRef.current);
//         const name = offerRef.current.sender;
//         const offer = offerRef.current.offer;
//         console.log('Accepting CALL', name);
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
//                 props.navigation.navigate('Call', {callee: getUserName(connectedUser.current)});
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
//         peerServer.current.setRemoteDescription(new RTCSessionDescription(answer)).catch(err => {
//             console.log('Error Occurred' + err);
//         });
//         props.setActiveCall(true);
//     };

//     //when we got an ice candidate from a remote user
//     const handleCandidate = (candidate) => {
//         if(peerServer.current.localDescription) {
//             peerServer.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(err => {
//                 console.log('Error Occurred in candidate' + err);
//             });
//         }
//     };

//     const handleLeave = () => {
//         RNCallKeep.endCall(callId.current);
//         offerRef.current = null;
//         connectedUser.current = null;
//         props.setRemoteStream(null);
//         props.setLocalStream(null);
//         peerServer.current.onicecandidate = null;
//         peerServer.current.ontrack = null;
//         props.setActiveCall(false);
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
//         offerRef.current = null;
//         connectedUser.current = null;
//         props.setRemoteStream(null);
//         props.setLocalStream(null);
//         peerServer.current.onicecandidate = null;
//         peerServer.current.ontrack = null;
//         peerServer.current.close();
//         props.setActiveCall(false);
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
//     /* Call Feature */

//     /* Call Keep */

//     const displayIncomingCall = (number) => {
//         const callUUID = getNewUuid();
//         console.log(callUUID);
//         callId.current = callUUID;
//         connectedUser.current = number;

//         console.log(`[displayIncomingCall] ${callUUID}, number: ${number}`);
//         if (Platform.OS === 'android') {
//             IncomingCall.display(
//                 callUUID, // Call UUID v4
//                 getUserName(number), // Username
//                 'https://sound.codes/wp-content/uploads/2016/11/logo.png', // Avatar URL
//                 'Incomming Call', // Info text
//                 20000 // Timeout for end call after 20s
//             );
//             // RNCallKeep.displayIncomingCall(callUUID, number.toString(), getUserName(number), 'generic', true);
//         } else {
//             RNCallKeep.displayIncomingCall(callUUID, number, number, 'generic', true);
//         }
//     };

//     const showIncomingCallUi = ({ callUUID }) => {
//         console.log('Showing UI');
//     }


//     const endCall = ({ callUUID }) => {
//         const handle = connectedUser.current; // calls[callUUID];
//         console.log(`[endCall] ${callUUID}, number: ${handle}`);
//         leaveCall();
//     };

//     const answerCall = ({ callUUID }) => {
//         const number = connectedUser.current; // calls[callUUID];
//         console.log(`[answerCall] ${callUUID}, number: ${number}`);
//         RNCallKeep.endAllCalls();
//         //RNCallKeep.startCall(callUUID, number.toString(), getUserName(number));
//         //RNCallKeep.backToForeground();
//         acceptCall();

//         // BackgroundTimer.setTimeout(() => {
//         //     console.log(`[setCurrentCallActiveInsideAnswer] ${callUUID}, number: ${number}`);
//         //     RNCallKeep.setCurrentCallActive(callUUID);
//         // }, 1000);
//     };

//     /* Call Keep - End */

//     useEffect(() => {
//         if (props.token) {
//             props.navigation.replace('Home');
//         }
//     }, []);

//     useEffect(() => {
//         console.log('called');
//         const handleDynamicLink = link => {
//             console.log(link);

//             // Handle dynamic link inside your own application
//             if (link.url.search('https://outpost.sound.codes/invite') !== -1) {
//                 const tmp = link.url.split('https://outpost.sound.codes/')[1].split('/');
//                 if (tmp[0] == 'invite') {
//                     props.navigation.navigate('AcceptInvite', { code: tmp[1] });
//                 }
//             }
//         };
//         const getListofFriends = () => {
//             GetFriends(props.token).then(res => {
//                 console.log(res);
//                 props.setUsers(res);
//             }).catch(err => {
//                 console.log(err);
//             })
//         }

//         // const getOneTimeLocation = async () => {
//         //     Geolocation.getCurrentPosition(
//         //         //Will give you the current location
//         //         (position) => {
//         //             console.log('Here');
//         //             //getting the Longitude from the location json
//         //             const currentLongitude =
//         //                 JSON.stringify(position.coords.longitude);

//         //             //getting the Latitude from the location json
//         //             const currentLatitude =
//         //                 JSON.stringify(position.coords.latitude);

//         //             console.log(currentLatitude, currentLongitude);
//         //             setLat(currentLatitude);
//         //             setLong(currentLongitude);
//         //         },
//         //         (error) => {
//         //             console.log('Err');
//         //             console.log(error);
//         //         },
//         //         {
//         //             enableHighAccuracy: false,
//         //             timeout: 30000,
//         //             maximumAge: 1000
//         //         },
//         //     );
//         // }

//         const dynLinks = dynamicLinks().onLink(handleDynamicLink);

//         const fcmMessaging = messaging().onMessage(async remoteMessage => {
//             // const data = remoteMessage.data;
//             console.log('Foreground');
//             const data = JSON.parse(remoteMessage.data.data);
//             const payload = JSON.parse(JSON.stringify(data.payload));
//             const offerData = await getOffer(payload.offer, props.token);
//             handleOffer(JSON.parse(offerData), payload.user_id);
//         });
//         messaging().setBackgroundMessageHandler(async remoteMessage => {
//             Linking.openURL("outpost://");
//             console.log('Background');
//             const data = JSON.parse(remoteMessage.data.data);
//             const payload = JSON.parse(JSON.stringify(data.payload));
//             const offerData = await getOffer(payload.offer, props.token);
//             handleOffer(JSON.parse(offerData), payload.user_id);
//         });

//         messaging().onNotificationOpenedApp(async remoteMessage => {
//             const data = JSON.parse(remoteMessage.data.data);
//             const payload = JSON.parse(JSON.stringify(data.payload));
//             const offerData = await getOffer(payload.offer, props.token);
//             handleOffer(JSON.parse(offerData), payload.user_id);
//         });

//         initLocalVideo();

//         getListofFriends();
//         // getOneTimeLocation();

//         socket.current.onopen = (ev) => {
//             console.log('Connected to the signaling server');
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

//         registerPeerEvents();

//         /* Recording */
//         const date = new Date();
//         const file = date.getDate().toString() + date.getMonth().toString() + date.getFullYear().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getMinutes().toString();
//         const options = {
//             sampleRate: 48000,
//             channels: 2,
//             bitsPerSample: 16,
//             wavFile: file + '.wav'
//         };
//         setFileName(file + '.wav');

//         AudioRecord.init(options);

//         AudioRecord.on('data', data => {
//             const chunk = Buffer.from(data, 'base64');
//             buffer.push(chunk);
//             setBuffer(buffer);
//             // do something with audio chunk
//         });

//         RNCallKeep.addEventListener('answerCall', answerCall);
//         RNCallKeep.addEventListener('endCall', endCall);
//         const end = DeviceEventEmitter.addListener('endCall', endCall);
//         const ans = DeviceEventEmitter.addListener('answerCall', answerCall);

//         return () => {
//             dynLinks();
//             fcmMessaging();
//             RNCallKeep.removeEventListener('answerCall', answerCall);
//             RNCallKeep.removeEventListener('endCall', endCall);
//             ans.remove();
//             end.remove();
//         }
//     },[]);

//     return (
//         <SafeAreaProvider>
//             {(<TouchableOpacity style={[GlobalStyles.Hamburger, {display: showMenu ? 'none' : 'flex'}]}
//                 onPress={() => setShowMenu(true)}
//             >
//                 <Image
//                     source={Line1}
//                     style={GlobalStyles.HamburgerImage}
//                 />
//                 <Image
//                     source={Line2}
//                     style={GlobalStyles.HamburgerImage}
//                 />
//                 <Image
//                     source={Line3}
//                     style={GlobalStyles.HamburgerImage}
//                 />
//                 <Image
//                     source={Line4}
//                     style={GlobalStyles.HamburgerImage}
//                 />
//             </TouchableOpacity>)}
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
//                 {/* <Stack.Screen name="CallKeepScreen" component={CallKeepScreen} /> */}
//                 <Stack.Screen name="Call" component={CallScreen} initialParams={{ leave: () => { leaveCall(); }, startRecording: startRecording, stopRecording: stopRecording }} />
//             </Stack.Navigator>
//             <Modal style={GlobalStyles.MainMenuModel}
//                 visible={showMenu}
//                 onRequestClose={() => {
//                     setShowMenu(false);
//                 }}
//                 transparent>
//                 <View style={GlobalStyles.MainMenuPopup} >
//                     <TouchableOpacity style={{alignSelf: 'flex-start'}} onPress={() => {setShowMenu(false)}}><Text style={{color: '#16E1FF', fontSize: 30, paddingLeft: 10, textAlign: 'left', width: '100%'}}>X</Text></TouchableOpacity>
//                     <Text style={{ color: '#16E1FF', fontSize: 16, }}>{`hello, ${props.userName}`}</Text>
//                     {/* <TouchableHighlight style={GlobalStyles.Button} onPress={() => props.setSpectograph(!props.spectograph)}
//                         underlayColor="#2a2c2d"
//                         activeOpacity={1}
//                         onPressIn={() => {
//                             setIsPressedInWaveform(true);
//                         }}
//                         onPressOut={() => {
//                             setIsPressedInWaveform(false);
//                         }}>
//                         <Text style={isPressedInWaveform ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>{props.spectograph ? 'disable spectogram' : 'enable spectogram'}</Text>
//                     </TouchableHighlight>

//                     <TouchableHighlight style={GlobalStyles.Button} onPress={() => props.setWaveform(!props.waveform)}
//                         underlayColor="#2a2c2d"
//                         activeOpacity={1}
//                         onPressIn={() => {
//                             setIsPressedInSpectogram(true);
//                         }}
//                         onPressOut={() => {
//                             setIsPressedInSpectogram(false);
//                         }}>
//                         <Text style={isPressedInSpectogram ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>{props.waveform ? 'disable waveform' : 'enable waveform'}</Text>
//                     </TouchableHighlight> */}

//                     <TouchableHighlight style={GlobalStyles.Button} onPress={() => {setShowMenu(false);props.navigation.navigate('ViewSessions')}}
//                         underlayColor="#2a2c2d"
//                         activeOpacity={1}
//                         onPressIn={() => {
//                             setIsPressedInRecording(true);
//                         }}
//                         onPressOut={() => {
//                             setIsPressedInRecording(false);
//                         }}>
//                         <Text style={isPressedInRecording ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>view public recordings</Text>
//                     </TouchableHighlight>

//                     <TouchableHighlight style={GlobalStyles.Button} onPress={() => {
//                         setShowMenu(false);
//                         props.setToken(null);
//                         props.navigation.navigate('Login');
//                     }}
//                         underlayColor="#2a2c2d"
//                         activeOpacity={1}
//                         onPressIn={() => {
//                             setIsPressedInLogout(true);
//                         }}
//                         onPressOut={() => {
//                             setIsPressedInLogout(false);
//                         }}>
//                         <Text style={isPressedInLogout ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>logout</Text>
//                     </TouchableHighlight>
//                 </View>
//             </Modal>
//             {uploading && <View style={{ backgroundColor: "#16e1ff", position: 'absolute', bottom: 0, width: "100%" }}><Text style={{ color: '#2A2C2D', textAlign: 'center' }}>Uploading audio</Text></View>}
//         </SafeAreaProvider>


//     )
// };

// export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);