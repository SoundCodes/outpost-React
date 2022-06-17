import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import Loudness from 'react-native-loudness';
import { Animated, Dimensions, Text, View } from 'react-native';
import AudioRecord from 'react-native-audio-record';

const MeterComponent = (props) => {
    const [size, setSize] = useState(0);
    const [loudness, setLoudness] = useState(-160);
    useEffect(() => {
        AudioRecord.on('data', data => {
            Loudness.getLoudness((loud) => {
                if (loud == 1) {
                    loud = -160;
                }
                setLoudness(loud);
                setSize((loud + 160) * (Dimensions.get('window').height * 0.6 / 160))
            });
        });
    }, []);
    return <View style={{ position: 'absolute', display: 'flex', justifyContent:'space-between', flexDirection: 'column', height: Dimensions.get('window').height * 0.7, bottom: 0, right: 0 }}>
            <View style={{ backgroundColor: "#16E1FF", width: 50}}>
                <Text style={{ width: '100%', textAlign: 'right' }}>{Math.round(loudness)}</Text>
            </View>
            <View style={{ flex: 1, alignSelf: 'flex-end'}}>
                <Animated.View style={{ width: 10, backgroundColor: "#16E1FF", height: size, marginTop: 'auto'}}>

                </Animated.View>
            </View>

    </View>;
}

export default connect(mapStateToProps, mapDispatchToProps)(MeterComponent);