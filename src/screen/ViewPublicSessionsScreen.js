import React, { useEffect, useState } from 'react';
import {
  View,

  TouchableOpacity,
  TouchableHighlight,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Share,
  Linking,
  Modal,
  Pressable,
} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from '../redux/map';
import { changeOwner, deleteFile, GetFiles, GetPublicFiles, getSignedUrl, makePublic, saveMetaDesc } from '../service/upload';
import { GlobalStyles } from '../style/globalStyleSheet';

const logo = require('../assets/logo.png');
const LogoName = require('../assets/logoName.png');
const Line1 = require('../assets/Line1.png');
const Line2 = require('../assets/Line2.png');
const Line3 = require('../assets/Line3.png');
const Line4 = require('../assets/Line4.png');

const ViewPublicSessionsScreen = (props) => {
  const [files, setFiles] = useState([]);
  const [editMeta, setEditMeta] = useState(false);
  const [meta, setMeta] = useState('0');
  const [selRecord, setSelRecord] = useState();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteRecordId, setDeleteRecordId] = useState();
  const [limit, setLimit] = useState('0');
  const [isPressedBack, setIsPressedBack] = useState(false)

  const onShare = async (link) => {
    try {
      const url = await getSignedUrl(props.token, link);
      url.replace('archive-outpost.fra1.digitaloceanspaces.com', 'data.sound.codes');
      const result = await Share.share({
        title: 'new recording',
        message: `${props.userName} has shared an outpost recording :` + url,
        url: url
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const downloadRecording = async (link) => {
    const url = await getSignedUrl(props.token, link);
    url.replace('archive-outpost.fra1.digitaloceanspaces.com', 'data.sound.codes');
    Linking.openURL(url);

  }
  const deleteRecording = async (recordingId) => {
    const res = await deleteFile(props.token, recordingId);
    await ListFiles();
  }

  const makePublicFile = async (link) => {
    const res = await makePublic(props.token, link);
    await ListFiles();
  }
  const changeRecordingOwner = async (recordId, ownerId) => {
    const res = await changeOwner(props.token, recordId, ownerId);
    await ListFiles();
  }
  const saveMeta = async (desc, recordingId) => {
    console.log('Here');
    const res = await saveMetaDesc(props.token, recordingId, desc).catch(err => {
      console.log(err);
    });
    console.log(res);
    setEditMeta(false);
  }
  const ListFiles = async () => {
    GetPublicFiles(props.token).then(data => {
      const d = data.sort((a, b) => a.create_date < b.create_date);
      console.log(d);
      setFiles(d);
    }).catch(err => {
      console.log(err);
    });
  };
  // const onReach_MAX_Length = (temp) => {

  //   var tempLength = temp.length.toString();

  //   if (tempLength == 12) {
  //     Alert.alert("Sorry, You Cannot Enter More Than 12 Characters...")
  //   }

  // }
  useEffect(() => {
    ListFiles();
  }, [])

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{ alignContent: 'center', }}>
          <View>
            <Image source={logo} style={GlobalStyles.Small_Logo} />
            <Image style={GlobalStyles.Small_LogoName} source={LogoName} />
          </View>
          <FlatList
            data={files}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <View style={GlobalStyles.View_Flex}>
                    <Text style={[GlobalStyles.color, GlobalStyles.Font]}>{item.create_date}</Text>
                    <Text style={[GlobalStyles.color, GlobalStyles.Font, {flex: 1, textAlign: 'right'}]}>
                      {item.user_sent == 0 ? 'solo session by '+ item.user_created_name : 'session by '+item.user_sent_name+' with '+item.user_created_name}
                    </Text>
                  </View>
                  <View>
                    <View style={GlobalStyles.View_Flex}>
                      <TouchableOpacity style={GlobalStyles.Transparent_Input_View} onPress={() => { downloadRecording(item.file_path) }}>
                        <Text style={[GlobalStyles.InputText, GlobalStyles.Font, styles.padding]}>download</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={GlobalStyles.Transparent_Input_View} onPress={() => { onShare(item.file_path) }}>
                        <Text style={[GlobalStyles.InputText, GlobalStyles.Font]}>
                          share private link
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={item.owner_id !== props.userId ? GlobalStyles.InputDisabled : GlobalStyles.Transparent_Input_View} onPress={() => { setSelRecord(item.recording_id); setEditMeta(true) }}>
                        <Text style={[GlobalStyles.InputText, GlobalStyles.Font, styles.padding, styles.padding]}>meta</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      borderRadius: 1,
                      borderWidth: 1,
                      borderColor: '#16E1FF',
                      borderStyle: 'dotted',
                      marginBottom: 20,
                      marginTop: 20,
                    }}
                  />
                </View>
              );
            }
            }
          />
          <TouchableHighlight
            style={[GlobalStyles.Button, { alignSelf: 'center' }]}
            onPress={() => props.navigation.goBack()}
            underlayColor="#2a2c2d"
            activeOpacity={1}
            onPressIn={() => {
              setIsPressedBack(true);
            }}
            onPressOut={() => {
              setIsPressedBack(false);
            }}
          >
            <Text style={isPressedBack ? GlobalStyles.ButtonPressed : GlobalStyles.ButtonText}>back</Text>
          </TouchableHighlight>
        </View>
        <Modal
          visible={editMeta}
          onRequestClose={() => {
            setEditMeta(false);
          }}
          transparent>
          <View style={GlobalStyles.Edit_Modal_Body} >
            <View style={GlobalStyles.Edit_Modal_Inner}>
              <Text style={GlobalStyles.Modal_Text}>
                Short description
              </Text>

              <TextInput
                style={GlobalStyles.TextArea}
                editable={false}
                multiline={true}
                numberOfLines={4}
                placeholder="short description"
                placeholderTextColor="#16e1ff"
                maxLength={80}
                onChangeText={val => { setMeta(val); setLimit(val.length) }}
              />
              <Pressable
                onPress={() => { saveMeta(meta, selRecord) }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'transparent'
                      : '#16E1FF',
                    color: pressed
                      ? '#16E1FF'
                      : '#2A2C2D',
                  },
                  GlobalStyles.PressableButton
                ]}>


                <Text style={GlobalStyles.ButtonText} >
                  ok
                </Text>

              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          visible={deleteConfirm}
          onRequestClose={() => {
            setDeleteConfirm(false);
            setDeleteRecordId(null);
          }}
          transparent>
          <View style={GlobalStyles.Edit_Modal_Body} >
            <View style={GlobalStyles.Edit_Modal_Inner}>
              <Text style={GlobalStyles.Modal_Text}>
                Are You Sure You Want to Delete the Recording?
              </Text>
              <Pressable
                onPress={() => {
                  deleteRecording(deleteRecordId);
                  setDeleteConfirm(false);
                  setDeleteRecordId(null);
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'transparent'
                      : '#16E1FF',
                    color: pressed
                      ? '#16E1FF'
                      : '#2A2C2D',
                  },
                  GlobalStyles.PressableButton
                ]}>
                <Text style={GlobalStyles.ButtonText} >
                  yes
                </Text>

              </Pressable>
              <Pressable
                onPress={() => {
                  setDeleteConfirm(false)
                  setDeleteRecordId(null);
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? 'transparent'
                      : '#16E1FF',
                    color: pressed
                      ? '#16E1FF'
                      : '#2A2C2D',
                  },
                  GlobalStyles.PressableButton
                ]}>


                <Text style={GlobalStyles.ButtonText} >
                  cancel
                </Text>

              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  padding: {
    paddingTop: 7
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewPublicSessionsScreen);
