import React, { useEffect, useRef, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import AcceptInviteScreen from './AcceptInviteScreen';
import CallKeepScreen from './CallKeepScreen';
import CallScreen from './CallScreen';
import CreateSessionScreen from './CreateSessionScreen';
import InitialScreen from './InitialScreen';
import InviteScreen from './InviteScreen';
import SoloSessionScreen from './SoloSessionScreen';
import ViewSessionsScreen from './ViewSessionsScreen';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import { GetFriends, UploadFile } from '../service/upload';
import AudioRecord from 'react-native-audio-record';
import Geolocation from '@react-native-community/geolocation';
import { Buffer } from 'buffer';
import { Alert, DeviceEventEmitter, Image, Linking, Modal, Platform, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import IncomingCall from 'react-native-incoming-call';
import { GlobalStyles } from '../style/globalStyleSheet';
import { getCallData, getIceServers, getOffer, makeCall, sendCallData } from '../service/auth';
import ViewPublicSessionsScreen from './ViewPublicSessionsScreen';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import Permissions from 'react-native-permissions';
import { StackActions } from 'react-navigation';
import { PERMISSIONS } from 'react-native-permissions';
const RNFS = require('react-native-fs');
import RNSoundLevel from 'react-native-sound-level';
import Loudness from 'react-native-loudness';
import {AudioRecorder, AudioUtils} from 'react-native-audio';


const Stack = createStackNavigator();

const STUN_SERVER = 'stun:stun.sound.codes:3478';
//const STUN_SERVER = 'turn:turn.sound.codes:5349';
//const STUN_SERVER = 'stun:stun.l.google.com:19302';
const SOCKET_URL = 'wss://call.sound.codes';

const Line1 = require('../assets/Line1.png');
const Line2 = require('../assets/Line2.png');
const Line3 = require('../assets/Line3.png');
const Line4 = require('../assets/Line4.png');

const getNewUuid = () => uuidv4();

BackgroundTimer.start();
RNCallKeep.setup({
    ios: {
        appName: 'Outpost',
    },
    android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access to make calls through the app.',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'phone_account_icon',
        selfManaged: true,

        //additionalPermissions: [PermissionsAndroid.PERMISSIONS.example],
        // Required to get audio in background when using Android 11
        foregroundService: {
            channelId: 'com.soundcodes.outpost',
            channelName: 'Foreground service for my app',
            notificationTitle: 'My app is running on background',
            notificationIcon: 'Path to the resource icon of the notification',
        },
    }
});

const HomeScreen = (props) => {
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState();
    const [buffer, setBuffer] = useState([]);
    const [lat, setLat] = useState();
    const [long, setLong] = useState();
    const [showRecording, setShowRecording] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isPressedHome, setIsPressedHome] = useState(false);
    const [isPressedInSpectogram, setIsPressedInSpectogram] = useState(false);
    const [isPressedInWaveform, setIsPressedInWaveform] = useState(false);
    const [isPressedInRecording, setIsPressedInRecording] = useState(false);
    const [isPressedInLogout, setIsPressedInLogout] = useState(false);
    const [isPressedInvite, setIsPressedInvite] = useState(false);
    const [isPressedAccept, setIsPressedAccept] = useState(false);
    const [candidatesReceived, setCandidateReceived] = useState([]);
    const [iceServers, setIceServers] = useState({ iceServers: [] });
    // const [iceServers, setIceServers] = useState(
    //     {
    //         iceServers: [
    //             {
    //                 username: "1652408850:prj_4aql8FPAKwdDOWv41bBdVc",
    //                 credential: "7QoFghDgtaluVrmfUJAunoxdQU8=",
    //                 urls: "turn:globalturn.subspace.com:3478?transport=udp"
    //             },
    //             {
    //                 username: "1652408850:prj_4aql8FPAKwdDOWv41bBdVc",
    //                 credential: "7QoFghDgtaluVrmfUJAunoxdQU8=",
    //                 urls: "turn:globalturn.subspace.com:3478?transport=tcp"
    //             },
    //             {
    //                 username: "1652408850:prj_4aql8FPAKwdDOWv41bBdVc",
    //                 credential: "7QoFghDgtaluVrmfUJAunoxdQU8=",
    //                 urls: "turns:globalturn.subspace.com:5349?transport=udp"
    //             },
    //             {
    //                 username: "1652408850:prj_4aql8FPAKwdDOWv41bBdVc",
    //                 credential: "7QoFghDgtaluVrmfUJAunoxdQU8=",
    //                 urls: "turns:globalturn.subspace.com:5349?transport=tcp"
    //             },
    //             {
    //                 username: "1652408850:prj_4aql8FPAKwdDOWv41bBdVc",
    //                 credential: "7QoFghDgtaluVrmfUJAunoxdQU8=",
    //                 urls: "turns:globalturn.subspace.com:443?transport=tcp"
    //             }]
    //     });

    const connectedUser = useRef();
    const offerRef = useRef();
    const callId = useRef();
    // const socket = useRef(new WebSocket(SOCKET_URL));
    const peerServer = useRef(new RTCPeerConnection({
        bundlePolicy: 'max-compat',
        ...iceServers
    }));

    const getUserName = (id) => {
        if (props.users == null) {
            return '';
        }
        const user = props.users.find(u => u.friend_id == id);
        return user ? user.friend_name : '';
    }

    const startRecording = () => {
        console.log('start record');
        AudioRecord.start();
        Loudness.start();
    };

    const stopRecording = async () => {
        console.log('stop record');
        RNSoundLevel.stop()
        if (connectedUser.current) {
            sendCallData(connectedUser.current, '', 'Recording Stopped', props.userName + ' is stopped the recording', props.token);
        }
        let audio = await AudioRecord.stop();
        console.log(audio);
        setUploading(true);
        const granted = await Permissions.request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        );
        if (granted === Permissions.RESULTS.GRANTED) {
            RNFS.moveFile(audio, RNFS.DownloadDirectoryPath + '/' + fileName).then(res => {
                console.log('Done');
            }).catch(err => {
                console.log(err);
            })
        } else {
            console.log("Permission Denied");
        }
        await UploadFile(audio, fileName, connectedUser.current, props.token, lat, long).catch(err => {
            console.log('Error in upload ' + err);
        });
        setUploading(false);
        initRecorder();
        Loudness.stop();
    };

    /* Call Feature */
    const initLocalVideo = () => {
        console.log('setting loc');
        mediaDevices
            .getUserMedia({
                audio: true,
                video: true
            })
            .then((stream) => {
                console.log(`got stream`);
                // Got stream!
                props.setLocalStream(stream);

                // setup stream listening
                peerServer.current.addStream(stream);
            })
            .catch((error) => {
                console.error(error);
                // Log error
            });
    };

    const initRecorder = () => {
        const date = new Date();
        const file = date.getDate().toString() + getMonthName(date.getMonth()) + date.getFullYear().toString() + '-'  + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
        const options = {
            sampleRate: 48000,
            channels: 2,
            bitsPerSample: 16,
            wavFile: file + '.wav'
        };
        setFileName(file + '.wav');

        AudioRecord.init(options);
    }

    const registerPeerEvents = () => {
        peerServer.current.onaddstream = (event) => {
            console.log('On Add Remote Stream');
            console.log(event.stream);
            props.setRemoteStream(event.stream);
        };

        // Setup ice handling
        peerServer.current.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('Sending Candidate partner is ', connectedUser.current);
                sendCallData(connectedUser.current, event.candidate, 'Candidate', 'Call Connection Received from ' + props.userName, props.token);
                // send({
                //     type: 'candidate',
                //     sender: props.userId,
                //     receiver: connectedUser.current,
                //     candidate: event.candidate,
                // });
            }
        };
        peerServer.current.oniceconnectionstatechange = () => {
            console.log('ICE state: ', peerServer.current.iceConnectionState);
            if (peerServer.current.iceConnectionState == 'disconnected' || peerServer.current.iceConnectionState == 'failed') {
                leaveCall();
            }
        };

        peerServer.current.onicecandidateerror = (err) => {
            console.log('Error in Ice');
            console.log(err);
        };

        peerServer.current.onsignalingstatechange = () => {
            console.log(`Signaling state change: ${peerServer.current.signalingState}`);
        };
    };

    const send = (message) => {
        console.log('Message Sent', message.sender, message.receiver, message.type);
        // socket.current.send(JSON.stringify(message));
    };

    const sendCall = (receiverId) => {
        connectedUser.current = receiverId;
        peerServer.current.createOffer({ mandatory: { OfferToReceiveVideo: true, OfferToReceiveAudio: true, }, }).then((offer) => {
            peerServer.current.setLocalDescription(offer).then(() => {
                // console.log('Sending Offer');
                // send({
                //     type: 'offer',
                //     sender: props.userId,
                //     receiver: connectedUser.current,
                //     offer: offer,
                // });
                console.log('Offer Sent');
                console.log(offer);
                sendCallData(connectedUser.current, offer, 'Incoming Call', props.userName + ' is calling you', props.token);
                //makeCall(connectedUser.current, offer, props.token);
                props.navigation.navigate('Call', { callee: getUserName(connectedUser.current), sender: true, showRecording: showRecording });
            });
        });
    };

    //when somebody sends us an offer
    const handleOffer = async (offer, sender) => {
        console.log("Offer Received");
        displayIncomingCall(sender);
        connectedUser.current = sender;
        offerRef.current = { sender, offer };
    };

    const acceptCall = async () => {
        const name = offerRef.current.sender;
        const offer = offerRef.current.offer;
        console.log('Accepting CALL', name);
        peerServer.current
            .setRemoteDescription(offer)
            .then(function () {
                connectedUser.current = name;
                return peerServer.current.createAnswer();
            })
            .then(function (answer) {
                peerServer.current.setLocalDescription(answer);
                console.log('Sending Answer');
                sendCallData(connectedUser.current, answer, 'Answer', props.userName + ' answered your call', props.token);
                // send({
                //     type: 'answer',
                //     sender: props.userId,
                //     receiver: connectedUser.current,
                //     answer: answer,
                // });
                props.setActiveCall(true);
                props.navigation.navigate('Call', { callee: getUserName(connectedUser.current) });
            })
            .then(function () {
                // Send the answer to the remote peer using the signaling server
            })
            .catch((err) => {
                console.log('Error acessing camera', err);
            });
    };

    //when we got an answer from a remote user
    const handleAnswer = (answer) => {
        peerServer.current.setRemoteDescription(new RTCSessionDescription(answer)).catch(err => {
            console.log('Error Occurred' + err);
        });
        props.setActiveCall(true);
    };

    //when we got an ice candidate from a remote user
    const handleCandidate = (candidate) => {
        console.log('Updating Candidate');
        if (peerServer.current.remoteDescription) {
            console.log(candidate);
            console.log('remote description to success');
            peerServer.current.addIceCandidate(new RTCIceCandidate(candidate)).then(() => {
                console.log('Ice Added');
            }).catch(err => {
                console.log('Error Occurred in candidate' + err);
            });
        } else {
            console.log(candidate);
            console.log('No Remote Description so try again');
            BackgroundTimer.setTimeout(() => {
                handleCandidate(candidate);
            }, 2000);
        }
    };

    const handleLeave = () => {
        RNCallKeep.endCall(callId.current);
        offerRef.current = null;
        connectedUser.current = null;
        props.setRemoteStream(null);
        props.setLocalStream(null);
        peerServer.current.onicecandidate = null;
        peerServer.current.ontrack = null;
        props.setActiveCall(false);
        resetPeer();
        stopRecording();
        //props.navigation.replace('CreateSession');
        props.navigation.reset({
            index: 0,
            routes: [{ name: 'Initial' }],
        });
    };

    const leaveCall = () => {
        sendCallData(connectedUser.current, '', 'Call Disconnected', props.userName + ' disconnected the call', props.token);
        // send({
        //     sender: props.userId,
        //     receiver: connectedUser.current,
        //     type: 'leave',
        // });
        offerRef.current = null;
        connectedUser.current = null;
        props.setRemoteStream(null);
        props.setLocalStream(null);
        peerServer.current.onicecandidate = null;
        peerServer.current.ontrack = null;
        peerServer.current.close();
        props.setActiveCall(false);
        resetPeer();
        stopRecording();
        //props.navigation.replace('CreateSession');
        props.navigation.reset({
            index: 0,
            routes: [{ name: 'Initial' }],
        });
    };

    const resetPeer = async () => {
        const res = await getIceServers(props.token).catch(err => {
            console.log('Error fetxhing ice');
            console.log(err);
        });
        const ic = JSON.parse(res);
        if (!ic) {
            return;
        }
        const newIce = [];
        ic.forEach((is, i) => {
            newIce.push({ username: is.username, credential: is.credential, urls: is.urls });
        });
        console.log(newIce);
        peerServer.current = new RTCPeerConnection({
            bundlePolicy: 'max-compat',
            iceServers: newIce
        });
        initLocalVideo();
        registerPeerEvents();
    };
    /* Call Feature */

    /* Call Keep */

    const displayIncomingCall = (number) => {
        const callUUID = getNewUuid();
        callId.current = callUUID;
        connectedUser.current = number;

        console.log(`[displayIncomingCall] ${callUUID}, number: ${number}`);
        if (Platform.OS === 'android') {
            // RNCallKeep.displayIncomingCall(callUUID, number, number, 'generic', true);
            IncomingCall.display(
                callUUID, // Call UUID v4
                getUserName(number), // Username
                'https://sound.codes/wp-content/uploads/2016/11/logo.png', // Avatar URL
                'Incoming Call', // Info text
                20000 // Timeout for end call after 20s
            );
            // RNCallKeep.displayIncomingCall(callUUID, number.toString(), getUserName(number), 'generic', true);
        } else {
            RNCallKeep.displayIncomingCall(callUUID, number, number, 'generic', true);
        }
    };

    const showIncomingCallUi = ({ callUUID }) => {
        console.log('Showing UI');
    }


    const endCall = ({ callUUID }) => {
        const handle = connectedUser.current; // calls[callUUID];
        console.log(`[endCall] ${callUUID}, number: ${handle}`);
        leaveCall();
    };

    const answerCall = ({ callUUID }) => {
        const number = connectedUser.current; // calls[callUUID];
        console.log(`[answerCall] ${callUUID}, number: ${number}`);
        RNCallKeep.endAllCalls();
        IncomingCall.backToForeground();
        //RNCallKeep.startCall(callUUID, number.toString(), getUserName(number));
        //RNCallKeep.backToForeground();
        acceptCall();

        // BackgroundTimer.setTimeout(() => {
        //     console.log(`[setCurrentCallActiveInsideAnswer] ${callUUID}, number: ${number}`);
        //     RNCallKeep.setCurrentCallActive(callUUID);
        // }, 1000);
    };

    /* Call Keep - End */

    getMonthName = (index) => {
        const month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];
        return month[index]
    };

    useEffect(() => {
        const setIce = async () => {
            const res = await getIceServers(props.token).catch(err => {
                console.log('Error fetxhing ice');
                console.log(err);
            });
            const ic = JSON.parse(res);
            if (!ic) {
                return;
            }
            const newIce = [];
            ic.forEach((is, i) => {
                newIce.push({ username: is.username, credential: is.credential, urls: is.urls });
            });
            console.log(newIce);
            setIceServers({ iceServers: newIce });
            peerServer.current = new RTCPeerConnection({
                bundlePolicy: 'max-compat',
                iceServers: newIce,
            });
            console.log('Server set');
            initLocalVideo();

            getListofFriends();
            // getOneTimeLocation();

            registerPeerEvents();
        }

        setIce();
        props.setRemoteStream(null);
        props.setLocalStream(null);

        if (!props.token) {
            //props.navigation.replace('Login');
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }

        const handleDynamicLink = link => {
            console.log(link);

            // Handle dynamic link inside your own application
            if (link.url.search('https://outpost.sound.codes') !== -1) {
                const tmp = link.url.split('https://outpost.sound.codes/')[1].split('/');
                if (tmp[0] == 'invite') {
                    props.navigation.navigate('AcceptInvite', { code: tmp[1] });
                }
            }
        };
        const getListofFriends = () => {
            GetFriends(props.token).then(res => {
                props.setUsers(res);
            }).catch(err => {
                console.log(err);
            })
        }

        // const getOneTimeLocation = async () => {
        //     Geolocation.getCurrentPosition(
        //         //Will give you the current location
        //         (position) => {
        //             console.log('Here');
        //             //getting the Longitude from the location json
        //             const currentLongitude =
        //                 JSON.stringify(position.coords.longitude);

        //             //getting the Latitude from the location json
        //             const currentLatitude =
        //                 JSON.stringify(position.coords.latitude);

        //             console.log(currentLatitude, currentLongitude);
        //             setLat(currentLatitude);
        //             setLong(currentLongitude);
        //         },
        //         (error) => {
        //             console.log('Err');
        //             console.log(error);
        //         },
        //         {
        //             enableHighAccuracy: false,
        //             timeout: 30000,
        //             maximumAge: 1000
        //         },
        //     );
        // }

        const dynLinks = dynamicLinks().onLink(handleDynamicLink);

        const fcmMessaging = messaging().onMessage(async remoteMessage => {
            console.log('Foreground');
            const data = JSON.parse(remoteMessage.data.data);
            const payload = JSON.parse(JSON.stringify(data.payload));
            if (data.title == "Incoming Call") {
                console.log('Here');
                const offerData = await getCallData(payload.data, props.token);
                console.log('Offer Received');
                handleOffer(JSON.parse(offerData), payload.user_id);
            }
            if (data.title == 'Answer') {
                const answerData = await getCallData(payload.data, props.token);
                console.log('Answer Received');
                console.log(JSON.parse(answerData));
                handleAnswer(JSON.parse(answerData));
            }
            if (data.title == 'Candidate') {
                const candidateData = await getCallData(payload.data, props.token);
                console.log('Candidate Received ' + JSON.parse(candidateData));
                handleCandidate(JSON.parse(candidateData));
            }
            if (data.title == 'Call Disconnected') {
                // const candidateData = await getCallData(payload.data, props.token);
                console.log('Call Disconnect Request Received');
                handleLeave();
            }
            if (data.title == 'Recording Started') {
                console.log('Recording has Started');
                props.setRecording(true);
            }
            if (data.title == 'Recording Stopped') {
                console.log('Recording is Stopped');
                props.setRecording(false);
            }

        });
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Background');
            const data = JSON.parse(remoteMessage.data.data);
            const payload = JSON.parse(JSON.stringify(data.payload));
            console.log(data);
            if (data.title == 'Incoming Call') {
                PushNotification.localNotification({
                    /* Android Only Properties */
                    channelId: "outpost", // (required) channelId, if the channel doesn't exist, notification will not trigger.
                    ticker: "Notification", // (optional)
                    largeIcon: "ic_launcher", // (optional) default: "ic_launcher". Use "" for no large icon.
                    largeIconUrl: "https://sound.codes/wp-content/uploads/2016/11/logo.png", // (optional) default: undefined
                    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
                    bigPictureUrl: "https://sound.codes/wp-content/uploads/2016/11/logo.png", // (optional) default: undefined
                    bigLargeIcon: "ic_launcher", // (optional) default: undefined
                    bigLargeIconUrl: "https://sound.codes/wp-content/uploads/2016/11/logo.png", // (optional) default: undefined
                    vibrate: true, // (optional) default: true
                    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
                    priority: "high", // (optional) set notification priority, default: high
                    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

                    /* iOS and Android properties */
                    id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
                    title: data.title, // (optional)
                    message: data.message, // (required)
                    picture: "https://sound.codes/wp-content/uploads/2016/11/logo.png", // (optional) Display an picture with the notification, alias of `bigPictureUrl` for Android. default: undefined
                    userInfo: payload
                });
            }
            if (data.title == 'Answer') {
                const answerData = await getCallData(payload.data, props.token);
                console.log('Answer Received');
                handleAnswer(JSON.parse(answerData));
            }
            if (data.title == 'Candidate') {
                const candidateData = await getCallData(payload.data, props.token);
                console.log('Candidate Received');
                handleCandidate(JSON.parse(candidateData));
            }
            if (data.title == 'Call Disconnected') {
                // const candidateData = await getCallData(payload.data, props.token);
                console.log('Call Disconnect Request Received');
                handleLeave();
            }
        });

        messaging().onNotificationOpenedApp(async remoteMessage => {
            console.log('Notification Opened');
            const data = JSON.parse(remoteMessage.data.data);
            const payload = JSON.parse(JSON.stringify(data.payload));
            if (data.title == 'Incoming Call') {
                console.log('Here');
                const offerData = await getCallData(payload.data, props.token);
                console.log('Offer Received');
                handleOffer(JSON.parse(offerData), payload.user_id);
            }
            if (data.title == 'Answer') {
                const answerData = await getCallData(payload.data, props.token);
                console.log('Answer Received');
                handleAnswer(JSON.parse(answerData));
            }
            if (data.title == 'Candidate') {
                const candidateData = await getCallData(payload.data, props.token);
                console.log('Candidate Received');
                handleCandidate(JSON.parse(candidateData));
            }
            if (data.title == 'Call Disconnected') {
                // const candidateData = await getCallData(payload.data, props.token);
                console.log('Call Disconnect Request Received');
                handleLeave();
            }
        });

        PushNotification.configure({
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },

            onNotification: async function (notification) {
                console.log("[onNotification] :", notification);
                const offerData = await getCallData(notification.data.data, props.token);
                console.log('Offer Received');
                handleOffer(JSON.parse(offerData), notification.data.user_id);
                // notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            onAction: function (notification) {
                console.log("[onAction]", notification.action);
                console.log("[onAction]:", notification);
            },

            onRegistrationError: function (err) {
                console.error(err.message, err);
            },

            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            popInitialNotification: true,

            requestPermissions: true,
        });

        /* Recording */
        initRecorder();

        AudioRecord.on('data', data => {
            const chunk = Buffer.from(data, 'base64');
            buffer.push(chunk);
            setBuffer(buffer);
            // do something with audio chunk
        });

        RNCallKeep.addEventListener('answerCall', answerCall);
        RNCallKeep.addEventListener('endCall', endCall);
        const end = DeviceEventEmitter.addListener('endCall', endCall);
        const ans = DeviceEventEmitter.addListener('answerCall', answerCall);

        return () => {
            dynLinks();
            fcmMessaging();
            RNCallKeep.removeEventListener('answerCall', answerCall);
            RNCallKeep.removeEventListener('endCall', endCall);
            ans.remove();
            end.remove();
        }
    }, []);

    return (
        <SafeAreaProvider style={{ position: 'relative', paddingTop: 10 }}>
            {(<TouchableOpacity style={[GlobalStyles.Hamburger, { position: 'absolute', zIndex: 1000, top: 10, left: 10, display: showMenu ? 'none' : 'flex' }]}
                onPress={() => setShowMenu(true)}
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
            </TouchableOpacity>)}
            <Stack.Navigator
                hideNavBar={true}
                initialRouteName="Initial"
                screenOptions={{ headerShown: false }}
                options={{
                    gestureEnabled: false,
                }}
            >
                <Stack.Screen name="Initial" component={InitialScreen} />
                <Stack.Screen name="SoloSession" component={SoloSessionScreen} initialParams={{ startRecording: startRecording, stopRecording: stopRecording }} />
                <Stack.Screen name="ViewSessions" component={ViewSessionsScreen} />
                <Stack.Screen name="ViewPublicSessions" component={ViewPublicSessionsScreen} />
                <Stack.Screen name="CreateSession" component={CreateSessionScreen} initialParams={{ call: (id) => { sendCall(id) }, leave: () => { handleLeave() } }} />
                <Stack.Screen name="Invite" component={InviteScreen} />
                <Stack.Screen name="AcceptInvite" component={AcceptInviteScreen} />
                {/* <Stack.Screen name="CallKeepScreen" component={CallKeepScreen} /> */}
                <Stack.Screen name="Call" component={CallScreen} initialParams={{ leave: () => { leaveCall(); }, startRecording: startRecording, stopRecording: stopRecording }} />
            </Stack.Navigator>
            <Modal style={GlobalStyles.MainMenuModel}
                visible={showMenu}
                onRequestClose={() => {
                    setShowMenu(false);
                }}
                transparent>
                <View style={GlobalStyles.MainMenuPopup} >
                    <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => { setShowMenu(false) }}><Text style={{ color: '#16E1FF', fontSize: 30, paddingLeft: 10, textAlign: 'left', width: '100%' }}>X</Text></TouchableOpacity>
                    <Text style={{ color: '#16E1FF', fontSize: 16, }}>{`hello, ${props.userName}`}</Text>
                    {/* <TouchableHighlight style={GlobalStyles.Button} onPress={() => props.setSpectograph(!props.spectograph)}
                        underlayColor="#2a2c2d"
                        activeOpacity={1}
                        onPressIn={() => {
                            setIsPressedInWaveform(true);
                        }}
                        onPressOut={() => {
                            setIsPressedInWaveform(false);
                        }}>
                        <Text style={isPressedInWaveform ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>{props.spectograph ? 'disable spectogram' : 'enable spectogram'}</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={GlobalStyles.Button} onPress={() => props.setWaveform(!props.waveform)}
                        underlayColor="#2a2c2d"
                        activeOpacity={1}
                        onPressIn={() => {
                            setIsPressedInSpectogram(true);
                        }}
                        onPressOut={() => {
                            setIsPressedInSpectogram(false);
                        }}>
                        <Text style={isPressedInSpectogram ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>{props.waveform ? 'disable waveform' : 'enable waveform'}</Text>
                    </TouchableHighlight> */}

                    <TouchableHighlight style={GlobalStyles.Button} onPress={() => { setShowMenu(false); props.navigation.navigate('Initial') }}
                        underlayColor="#2a2c2d"
                        activeOpacity={1}
                        onPressIn={() => {
                            setIsPressedHome(true);
                        }}
                        onPressOut={() => {
                            setIsPressedHome(false);
                        }}>
                        <Text style={isPressedInRecording ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>home</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={GlobalStyles.Button} onPress={() => { setShowMenu(false); props.navigation.navigate('ViewPublicSessions') }}
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

                    <TouchableHighlight
                        style={GlobalStyles.Button}
                        onPress={() => { setShowMenu(false); props.navigation.navigate('Invite') }}
                        underlayColor="#2a2c2d"
                        activeOpacity={1}
                        onPressIn={() => {
                            setIsPressedInvite(true);
                        }}
                        onPressOut={() => {
                            setIsPressedInvite(false);
                        }}
                    >
                        <Text style={isPressedInvite ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>invite</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={GlobalStyles.Button} onPress={() => { setShowMenu(false); props.navigation.navigate('AcceptInvite') }}
                        underlayColor="#2a2c2d"
                        activeOpacity={1}
                        onPressIn={() => {
                            setIsPressedAccept(true);
                        }}
                        onPressOut={() => {
                            setIsPressedAccept(false);
                        }}>
                        <Text style={isPressedAccept ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>accept invite</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={GlobalStyles.Button} onPress={() => {
                        setShowMenu(false);
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
            </Modal>
            {uploading && <View style={{ backgroundColor: "#16e1ff", position: 'absolute', bottom: 0, width: "100%" }}><Text style={{ color: '#2A2C2D', textAlign: 'center' }}>Uploading audio</Text></View>}
        </SafeAreaProvider>


    )
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);