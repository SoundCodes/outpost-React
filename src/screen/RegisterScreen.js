import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View,
  ScrollView,
  Linking,
  Alert,
  Modal,
  TouchableHighlight
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { RegisterUser } from '../service/auth';
import { mapStateToProps, mapDispatchToProps } from '../redux/map';

import { connect } from 'react-redux';
import CheckBox from 'react-native-check-box'
import { GlobalStyles } from '../style/globalStyleSheet';
import PasswordInputText from 'react-native-hide-show-password-input';
const logo = require('../assets/logo.png');

const LogoName = require('../assets/logoName.png');
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const width_proportion = '80%';

class RegisterScreen extends Component {
  constructor(props) {
    super();
  }
  submit() {
    if (reg.test(this.state.email) !== true){
      this.setState({ incorrectEmail: true });
      return;
  }
    if (this.state.password !== this.state.retypepassword) {
      this.setState({ passwordMismatch: true });
      return;
    }
    if (this.state.name == '' || this.state.email == '' || this.state.password == '') {
      this.setState({ blankPassword: true });
      return;
    }
    let collection = new FormData();
    collection.append('user_login', this.state.name);
    collection.append('display_name', this.state.name);
    collection.append('first_name', this.state.name.split(' ')[0]);
    collection.append('last_name', this.state.name.split(' ')[1] ? this.state.name.split(' ')[1] : '');
    collection.append('email', this.state.email);
    collection.append('password', this.state.password);

    console.log(collection);
    return RegisterUser(collection, this.state.email, this.state.password)
      .then((det) => {
        console.log(det);
        this.props.setToken(det.token);
        this.props.setUserName(det.name);
        this.setState({ success: true });
      }).catch(err => {
        console.error(err);

        this.setState({ error: true, message: err.data ? err.data.message : 'some error occured' });
      });
  }

  goToHome = () => {
    this.props.navigation.replace('Home');
  }

  updateVale(text, flied) {
    if (flied == 'name') {
      this.setState({
        name: text,
      });
    } else if (flied == 'email') {
      this.setState({
        email: text,
      });
    } else if (flied == 'password') {
      this.setState({
        password: text,
      });
    }
    else if (flied == 'retypepassword') {
      this.setState({
        retypepassword: text,
      });
    }
  }

  state = {
    isChecked: false,
    name: '',
    email: '',
    password: '',
    retypepassword: '',
    success: false,
    isPressedIn: false,
    passwordMismatch: false,
    blankPassword: false,
    passwordVisible: true,
    incorrectEmail: false,
    error: false,
    message: '',
  }

  render() {
    return (
      <ScrollView>
        <View style={GlobalStyles.container}>
          <Image source={logo} style={GlobalStyles.Logo} />
          <Image style={GlobalStyles.LogoName} source={LogoName} />
          <TextInput
            style={GlobalStyles.Input}
            placeholderTextColor="#16e1ff"
            placeholder="this will be your user name"
            value={this.state.name}
            onChangeText={text => this.updateVale(text, 'name')}
            autoCapitalize='none'
            autoCorrect={false}
            autoCompleteType='email'
            theme={{ colors: { text: '#16e1ff', primary: '#16e1ff', underlineColor: 'transparent'  } }}
          />
          <TextInput
            style={GlobalStyles.Input}
            placeholder="email address "
            placeholderTextColor="#16e1ff"
            value={this.state.email}
            onChangeText={text => this.updateVale(text, 'email')}
            textContentType='emailAddress'
            keyboardType='email-address'
            autoCapitalize='none'
            autoCorrect={false}
            autoCompleteType='email'
            theme={{ colors: { text: '#16e1ff', primary: '#16e1ff', underlineColor: 'transparent'  } }}
          />
          <TextInput
            secureTextEntry={this.state.passwordVisible}
            style={GlobalStyles.Input}
            placeholder="good secure password "
            value={this.state.password}
            placeholderTextColor="#16e1ff"
            onChangeText={text => this.updateVale(text, 'password')}
            autoCapitalize='none'
            autoCorrect={false}
            theme={{ colors: { text: '#16e1ff', primary: '#16e1ff', underlineColor: 'transparent'  } }}
            right={<TextInput.Icon name={this.state.passwordVisible ? "eye" : "eye-off"} color={'#16e1ff'} onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })} />}
          />
          <TextInput
            secureTextEntry={this.state.passwordVisible}
            style={GlobalStyles.Input}
            placeholderTextColor="#16e1ff"
            value={this.state.retypepassword}
            placeholder="retype your secure password"
            onChangeText={text => this.updateVale(text, 'retypepassword')}
            autoCapitalize='none'
            autoCorrect={false}
            theme={{ colors: { text: '#16e1ff', primary: '#16e1ff', underlineColor: 'transparent'  } }}
            right={<TextInput.Icon name={this.state.passwordVisible ? "eye" : "eye-off"} color={'#16e1ff'} onPress={() => this.setState({ passwordVisible: !this.state.passwordVisible })} />}
          />
          <View style={[GlobalStyles.Terms, GlobalStyles.Flex]}>
            {/* <Text style={[GlobalStyles.Close, GlobalStyles.Text]}>X</Text> */}
            <CheckBox
              onClick={() => {
                this.setState({
                  isChecked: !this.state.isChecked
                })
              }}
              isChecked={this.state.isChecked}
              onTintColor={'#16e1ff'}
              tintColors={'#16e1ff'}
              checkBoxColor={'#16e1ff'}
            />
            <Text style={[GlobalStyles.color, GlobalStyles.Check_box_text]}>
              yes, I agree to the{' '}
              <Text style={GlobalStyles.Link} onPress={() => Linking.openURL('https://sound.codes/privacy-policy/')}> privacy policy </Text> and{' '}
              <Text style={GlobalStyles.Link} onPress={() => Linking.openURL('https://sound.codes/terms-of-service/')}>
                terms
              </Text>
            </Text>
          </View>

          <TouchableHighlight
            disabled={!this.state.isChecked}
            style={GlobalStyles.Transparent_Button} onPress={() => this.submit()}
            underlayColor="#16e1ff"
            activeOpacity={1}
            onPressIn={() => {
              this.setState({ isPressedIn: true })
            }}
            onPressOut={() => {
              this.setState({ isPressedIn: false })
            }}
          >
            <Text style={this.state.isPressedIn ? GlobalStyles.Transparent_ButtonPressed : GlobalStyles.Transparent_ButtonText}>register </Text>
          </TouchableHighlight>
        </View>
        <Modal style={GlobalStyles.Modal}
          visible={this.state.success}
          onRequestClose={() => {
            this.setState({ success: false });
          }}
          transparent>
          <View style={GlobalStyles.Modal_Body} >
            <View style={GlobalStyles.Modal_Inner_Column}>
              <Text style={GlobalStyles.Modal_Text}>
                you have registered successfully.
              </Text>
              <TouchableOpacity onPress={() => this.goToHome()}>
                <Text style={GlobalStyles.Modal_Button_Inner}> ok </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal style={GlobalStyles.Modal}
          visible={this.state.passwordMismatch}
          onRequestClose={() => {
            this.setState({ passwordMismatch: false });
          }}
          transparent>
          <View style={GlobalStyles.Modal_Body} >
            <View style={GlobalStyles.Modal_Inner_Column}>
              <Text style={GlobalStyles.Modal_Text}>
                your both password does not match.
              </Text>
              <TouchableOpacity onPress={() => this.setState({ passwordMismatch: false, password: '', retypepassword: '' })}>
                <Text style={GlobalStyles.Modal_Button_Inner}> ok </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal style={GlobalStyles.Modal}
          visible={this.state.blankPassword}
          onRequestClose={() => {
            this.setState({ blankPassword: false });
          }}
          transparent>
          <View style={GlobalStyles.Modal_Body} >
            <View style={GlobalStyles.Modal_Inner_Column}>
              <Text style={GlobalStyles.Modal_Text}>
                username, email and password cannot be empty
              </Text>
              <TouchableOpacity onPress={() => this.setState({ blankPassword: false})}>
                <Text style={GlobalStyles.Modal_Button_Inner}> ok </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal style={GlobalStyles.Modal}
          visible={this.state.incorrectEmail}
          onRequestClose={() => {
            this.setState({ incorrectEmail: false });
          }}
          transparent>
          <View style={GlobalStyles.Modal_Body} >
            <View style={GlobalStyles.Modal_Inner_Column}>
              <Text style={GlobalStyles.Modal_Text}>
                email id is not valid
              </Text>
              <TouchableOpacity onPress={() => this.setState({ incorrectEmail: false})}>
                <Text style={GlobalStyles.Modal_Button_Inner}> ok </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal style={GlobalStyles.Modal}
          visible={this.state.error}
          onRequestClose={() => {
            this.setState({ error: false });
          }}
          transparent>
          <View style={GlobalStyles.Modal_Body} >
            <View style={GlobalStyles.Modal_Inner_Column}>
              <Text style={GlobalStyles.Modal_Text}>
                {this.state.message}
              </Text>
              <TouchableOpacity onPress={() => this.setState({ error: false})}>
                <Text style={GlobalStyles.Modal_Button_Inner}> ok </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
