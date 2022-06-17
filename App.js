import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StackContainer from './src/navigation/StackContainer';
import TokenReducer from './src/redux/TokenReducer';
import thunk from 'redux-thunk';
import EmailReducer from './src/redux/EmailReducer';
import UserIdReducer from './src/redux/UserIdReducer';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import SpectographReducer from './src/redux/SpectographReducer';
import WaveformReducer from './src/redux/WaveformReducer';
import ActiveCallReducer from './src/redux/ActiveCallReducer';
import LocalStreamReducer from './src/redux/LocalStreamReducer';
import RemoteUserReducer from './src/redux/RemoteUserReducer';
import SocketReducer from './src/redux/SocketReducer';
import PeerServerReducer from './src/redux/PeerServerReducer';
import PeerIdReducer from './src/redux/PeerIdReducer';
import RemoteStreamReducer from './src/redux/RemoteStreamReducer';
import UsersReducer from './src/redux/UsersReducer';
import 'react-native-gesture-handler';
import RNCallKeep from 'react-native-callkeep';
import Permissions from 'react-native-permissions';
import { DeviceEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { LogBox } from 'react-native';
import IncomingCall from 'react-native-incoming-call';
import UserNameReducer from './src/redux/UserNameReducer';
import PushNotification, { Importance } from 'react-native-push-notification';
import RecordingReducer from './src/redux/RecordingReducer';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();

const persistConfig = {
   key: 'root',
   storage: AsyncStorage,
   whitelist: ['token', 'email', 'userId', 'waveform', 'spectograph', 'activeCall', 'localStream', 'remoteUser', 'socket', 'peerServer', 'peerId', 'remoteStream', 'users', 'userName', 'recording'],
   blacklist: [],
};

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         // queryFn: defaultQueryFn
      },
   },
});


// RNCallKeep.setup(options).then(accepted => { });

class App extends React.Component {
   store = createStore(
      persistReducer(
         persistConfig,
         combineReducers({
            token: TokenReducer,
            email: EmailReducer,
            userId: UserIdReducer,
            spectograph: SpectographReducer,
            waveform: WaveformReducer,
            activeCall: ActiveCallReducer,
            localStream: LocalStreamReducer,
            remoteUser: RemoteUserReducer,
            socket: SocketReducer,
            peerServer: PeerServerReducer,
            peerId: PeerIdReducer,
            remoteStream: RemoteStreamReducer,
            users: UsersReducer,
            userName: UserNameReducer,
            recording: RecordingReducer
         }),
      ),
      applyMiddleware(thunk),
   );
   persistor = persistStore(this.store);
   async requestUserPermission() {
      const msgPermission = await messaging().requestPermission().catch(err => {
         console.log(err);
      });;
      await Permissions.request(
         Platform.OS == 'android' ? Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : Permissions.PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
         {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
         },
      ).catch(err => {
         console.log(err);
      });
      await Permissions.request(
         Platform.OS == 'android' ? Permissions.PERMISSIONS.ANDROID.RECORD_AUDIO : Permissions.PERMISSIONS.IOS.MICROPHONE
      ).catch(err => {
         console.log(err);
      });

      if(msgPermission) {
         PushNotification.channelExists('outpost', (exists) => {
            if (!exists) {
              PushNotification.createChannel(
                {
                  channelId: "outpost", // (required)
                  channelName: "Outpost Channel", // (required)
                  channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
                  playSound: true, // (optional) default: true
                  soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
                  importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                  vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    
                },
                (created) => console.info(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
              );
            } else {
              console.info('Channel Exist');
            }
          })
      }
   }
   componentDidMount() {
      this.requestUserPermission();
   }

   render() {
      return (
         <QueryClientProvider client={queryClient}>
            <Provider store={this.store}>
               <PersistGate persistor={this.persistor}>
                  <SafeAreaProvider>
                     <StackContainer />
                     {/* <DrawerContainer/> */}
                  </SafeAreaProvider>
               </PersistGate>
            </Provider>
         </QueryClientProvider>
      );
   }
}

export default App;