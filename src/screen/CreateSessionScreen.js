import React, { useEffect, useState } from 'react';
import {
    View,
    Image,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    FlatList
} from 'react-native';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import { GetFriends } from '../service/upload';
import { CallController } from './CallController';
import { GlobalStyles } from '../style/globalStyleSheet';

const logo = require('../assets/logo.png');
const LogoName = require('../assets/logoName.png');
const Line1 = require('../assets/Line1.png');
const Line2 = require('../assets/Line2.png');
const Line3 = require('../assets/Line3.png');
const Line4 = require('../assets/Line4.png');

const CreateSessionScreen = (props) => {
    const [data, setData] = useState([]);
    const [callee, SetCallee] = useState('');
    const [isPressedName, setIsPressedName] = useState(false);
    const [isPressedSolo, setIsPressedSolo] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const getListofFriends = () => {
        console.log('Here');
        GetFriends(props.token).then(res => {
            props.setUsers(res);
            setRefresh(false);
        }).catch(err => {
            console.log(err);
            setRefresh(false);
        })
    }
    const makeCall = (id) => {
        const user = props.users?.find(u => u.id == id);
        props.route.params.call(id);
    };
    useEffect(() => {
        // getListofFriends();
    }, []);
    return (
        <View style={{padding: 10, alignItems:'center', display:'flex', flexDirection: 'column', flexWrap: 'nowrap', height: '100%'}}>
            <View>
                <Image source={logo} style={GlobalStyles.Small_Logo} />
                <Image style={GlobalStyles.Small_LogoName} source={LogoName} />
            </View>
            <FlatList
                    style={{ paddingBottom: 10, height: '40%', width: '80%' }}
                    refreshing={refresh}
                    onRefresh={() => { setRefresh(true); getListofFriends() }}
                    data={props.users}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <View style={[GlobalStyles.List, GlobalStyles.Flex]}>
                            <View style={{width: 48, height: 48, backgroundColor: "#16E1FF", borderRadius: 25}}>
                                <Text style={{color: '#2a2c2d', fontSize: 20, width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center'}}>{item.friend_name[0].toLowerCase()}</Text>
                            </View>
                            <TouchableHighlight
                                style={GlobalStyles.NameButton}
                                onPress={() => makeCall(item.friend_id)}
                                underlayColor="#2a2c2d"
                                activeOpacity={1}
                                onPressIn={() => {
                                    setIsPressedName(item.friend_id);
                                }}
                                onPressOut={() => {
                                    setIsPressedName(null);
                                }}
                            >
                                <Text
                                    style={isPressedName == item.friend_id ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}
                                >
                                    {item.friend_name}</Text>
                            </TouchableHighlight>
                        </View>
                    )}
                />

                <TouchableHighlight
                    style={GlobalStyles.Button}
                    onPress={() => { props.navigation.navigate('SoloSession') }}
                    underlayColor="#2a2c2d"
                    activeOpacity={1}
                    onPressIn={() => {
                        setIsPressedSolo(true);
                    }}
                    onPressOut={() => {
                        setIsPressedSolo(false);
                    }}
                >
                    <Text
                        style={isPressedSolo ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>
                        solo session</Text>
                </TouchableHighlight>
        </View>
    );
};



export default connect(mapStateToProps, mapDispatchToProps)(CreateSessionScreen);
