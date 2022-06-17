// import React, { FC, ReactElement, useState } from 'react';
// import {
//   Alert,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableHighlight,
//   View,
//   StyleSheet,
//   Image,
//   Modal
// } from 'react-native';
// // import Parse from 'parse/react-native';
// import { useNavigation } from '@react-navigation/native';
// import { mapStateToProps, mapDispatchToProps } from '../redux/map';
// import { connect } from 'react-redux'
// import { ScrollView } from 'react-native-gesture-handler';
// import { ResetPassword } from '../service/auth';

// const logo = require('../assets/logo.png');
// const LogoName = require('../assets/logoName.png');

// export const ResetPasswordScreen = () => {
//   const navigation = useNavigation();
//   // Your state variable
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState(false);
//   const [isPressedPassword, setIsPressedPassword] = useState(false)
//   const doUserPasswordReset = async () => {
//     // Note that this value come from state variables linked to your text input
//     const emailValue = email;
//     return await ResetPassword(emailValue)
//       .then(() => {
//         // logIn returns the corresponding ParseUser object
//         // Alert.alert(
//         //   'Success!',
//         //   `Please check ${email} to proceed with password reset.`,
//         //  );
//         // Redirect user to your login screen
//         setMessage(true);
//         navigation.navigate('Login');
//         return true;
//       })
//       .catch((error) => {
//         // Error can be caused by lack of Internet connection
//         Alert.alert('Error!', error.message);
//         return false;
//       });
//   };

//   return (
//     <ScrollView>
//       <View style={styles.container}>
//         <Image
//           source={logo}
//           style={styles.Logo}
//         />
//         <Image
//           style={styles.LogoName}
//           source={LogoName}
//         />
//         <View >
//           {/* <Text style={styles.Text}>{'email address'}</Text> */}
//           <TextInput
//             style={styles.Input}
//             value={email}
//             placeholderTextColor="#16E1FF"
//             placeholder="email address"
//             onChangeText={(text) => setEmail(text)}
//             autoCapitalize={'none'}
//             autoCorrect={false}
//             keyboardType={'email-address'}
//           />
//           <TouchableHighlight
//             style={styles.Button}
//             onPress={() => doUserPasswordReset()}
//             onPressIn={() => {
//               setIsPressedPassword(true);
//             }}
//             onPressOut={() => {
//               setIsPressedPassword(false)
//             }}>
//             <Text
//               style={isPressedPassword ? styles.ButtonPressed : styles.ButtonText}>
//               {'reset password'}
//             </Text>
//           </TouchableHighlight>
//         </View>
//       </View>
//       <Modal
//         visible={message}
//         onRequestClose={() => {
//           setMessage(false);
//         }}
//         transparent>
//         <View style={styles.Modal_Body} >
//           <View style={styles.Modal_Inner}>
//             <Text style={styles.Modal_Text}>
//               Success!
//             </Text >
//             <Text style={styles.Modal_Text}>
//               {`Please check ${email} to proceed with password reset.`}
//             </Text>
//             <TouchableHighlight
//               style={styles.ButtonModal}
//               onPress={() => {
//                 setMessage(false);
//               }}>
//               <Text style={styles.ButtonText}>Ok</Text>
//             </TouchableHighlight>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 50,
//   },
//   Text: {
//     fontSize: 20,
//     color: '#16E1FF',
//     textAlign: 'center',
//     fontFamily: 'Jost-Light'
//   },
//   Logo: {
//     alignSelf: 'center',
//     width: 144,
//     height: 144,
//   },
//   LogoName: {
//     alignSelf: 'center',
//     marginTop: 25,
//     marginBottom: 80,
//     justifyContent: 'center',
//     alignContent: 'center',
//     alignItems: 'center',
//     width: 150,
//     height: 26
//   },
//   Input: {
//     color: '#16E1FF',
//     fontSize: 20,
//     textAlign: 'center',
//     borderWidth: 1,
//     borderColor: '#16E1FF',
//     marginTop: 50,
//     width: '80%',
//     fontFamily: 'Jost-Light',
//     alignSelf: 'center',
//     letterSpacing: 2,
//     borderRadius: 5

//   },
//   Modal_Body: {
//     backgroundColor: '#16E1FF',
//     color: '#2A2C2D',
//     textAlign: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//     marginTop: '40%',
//   },
//   Modal_Inner: {
//     width: '80%',
//     display: 'flex',
//     justifyContent: 'space-between'
//   },
//   Modal_Text: {
//     color: '#2A2C2D',
//     textAlign: 'center',
//     textAlignVertical: 'center',
//     fontFamily: 'Jost-Light',
//     fontSize: 20,
//   },
//   ButtonModal: {
//     backgroundColor: '#16e1ff',
//     padding: 10,
//     borderColor: '#2a2c2d',
//     borderWidth: 1,
//     marginTop: 20,
//     width: 150,
//     alignSelf: 'center',
//     borderRadius: 5,
//     width: '80%'
//   },
//   Button: {
//     backgroundColor: '#16e1ff',
//     padding: 10,
//     borderColor: '#16e1ff',
//     borderWidth: 1,
//     marginTop: 20,
//     width: 150,
//     alignSelf: 'center',
//     borderRadius: 5,
//     width: '80%'
//   },
//   ButtonText: {
//     color: '#2A2C2D',
//     textAlign: 'center',
//     fontSize: 20,
//     fontFamily: 'Jost',
//     letterSpacing: 2

//   },
//   ButtonPressed: {
//     color: '#16e1ff',
//     textAlign: 'center',
//     fontSize: 20,
//     fontFamily: 'Jost',
//     letterSpacing: 2
//   },
// });

// export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordScreen);

