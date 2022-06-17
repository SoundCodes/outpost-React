/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import invokeApp from 'react-native-invoke-app';
import IncomingCall from 'react-native-incoming-call';

const notificationActionHandler = async (data) => {
    // Your background task
    console.log('Came in Background');
    console.log(data);
    invokeApp();
    IncomingCall.display(
        'callUUID', // Call UUID v4
        'Outpost', // Username
        'https://avatars3.githubusercontent.com/u/16166195', // Avatar URL
        'Incomming Call', // Info text
        20000 // Timeout for end call after 20s
    );
}

AppRegistry.registerHeadlessTask(
    'ReactNativeFirebaseMessagingHeadlessTask', () => notificationActionHandler,
);
AppRegistry.registerComponent(appName, () => App);
