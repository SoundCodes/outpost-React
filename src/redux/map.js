import {setEmail} from './Email';
import {setUserId} from './UserId';
import { setToken } from './Token';
import { setWaveform } from './Waveform';
import { setSpectograph } from './Spectograph';
import { setActiveCall } from './ActiveCall';
import { setLocalStream } from './LocalStream';
import { setRemoteUser } from './RemoteUser';
import { setSocket } from './Socket';
import { setPeerServer } from './PeerServer';
import { setPeerId } from './PeerId';
import { setRemoteStream } from './RemoteStream';
import { setUsers } from './Users';
import { setUserName } from './UserName';
import { setRecording } from './Recording';


export const mapStateToProps = state => ({
    email: state.email,
    userId : state.userId,
    token: state.token,
    waveform: state.waveform,
    spectograph: state.spectograph,
    activeCall: state.activeCall,
    localStream: state.localStream,
    remoteUser: state.remoteUser,
    socket: state.socket,
    peerServer: state.peerServer,
    peerId: state.peerId,
    remoteStream: state.remoteStream,
    users: state.users,
    userName: state.userName,
    recording: state.recording,
});

export const mapDispatchToProps = dispatch => {
   return{
    setEmail : email => dispatch(setEmail(email)),
    setUserId : userId => dispatch(setUserId(userId)),
    setToken : token => dispatch(setToken(token)),
    setWaveform : waveform => dispatch(setWaveform(waveform)),
    setSpectograph : spectograph => dispatch(setSpectograph(spectograph)),
    setActiveCall : activeCall => dispatch(setActiveCall(activeCall)),
    setLocalStream : localStream => dispatch(setLocalStream(localStream)),
    setRemoteUser : remoteUser => dispatch(setRemoteUser(remoteUser)),
    setSocket : socket => dispatch(setSocket(socket)),
    setPeerServer : peerServer => dispatch(setPeerServer(peerServer)),
    setPeerId : peerId => dispatch(setPeerId(peerId)),
    setRemoteStream : remoteStream => dispatch(setRemoteStream(remoteStream)),
    setUsers: users => dispatch(setUsers(users)),
    setUserName: userName => dispatch(setUserName(userName)),
    setRecording: recording => dispatch(setRecording(recording))
   }
};
