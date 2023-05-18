// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  Keyboard,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Colors} from '../../utills/Colors';
import {fonts} from '../../utills/fonts';
import Loader from '../../components/Loader';

//import Loader from './Components/Loader';

const Signup = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 40;

  const emailInputRef = createRef();
  const confirmPasswordInputRef = createRef();
  const passwordInputRef = createRef();

  //handleSubmitButton function will register user if all information are accurate

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    if (!confirmPassword) {
      alert('Please fill Confirm Password');
      return;
    }

    //Show Loader
    setLoading(true);

    var formdata = new FormData();
    formdata.append('name', userName);
    formdata.append('email', userEmail.toLowerCase());
    formdata.append('password', userPassword);
    formdata.append('password_confirmation', confirmPassword);

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    fetch('https://iopollo.accrualdev.com/api/register', requestOptions)
      .then(response => response.text())
      .then(responseJson => {
        setLoading(false);
        console.log(responseJson);
        var result = JSON.parse(responseJson);
        // If server response message same as Data Matched
        if (result.status === 'Success') {
          setIsRegistraionSuccess(true);
          Alert.alert(
            'Congratulations',
            'Registration Successful',
            [
              {
                text: 'Login Now',
                onPress: () => {
                  navigation.navigate('LoginScreen');
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Registration Failed',
            'Please provide accurate information',
            [
              {
                text: 'Dismiss',
              },
            ],
            {cancelable: false},
          );

          setErrortext(result.msg);
        }
      })
      .catch(error => console.log('error', error));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        animated={true}
        backgroundColor={'#E5D8CE'}
        barStyle={'dark-content'}
      />

      <View style={{flex: 1, backgroundColor: Colors.primary}}>
        <ImageBackground
          source={require('../../images/ic_background.png')}
          resizeMethod="scale"
          resizeMode="cover"
          style={{height: 300}}
        />
        {/* <Loader loading={loading} /> */}
        <Loader loading={loading} />
        <KeyboardAvoidingView
          behavior="height"
          keyboardVerticalOffset={keyboardVerticalOffset}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              marginTop: 40,
              justifyContent: 'center',
              alignContent: 'center',
            }}>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserName => setUserName(UserName)}
                underlineColorAndroid="#f000"
                placeholder="Name"
                placeholderTextColor={Colors.black}
                keyboardType="default"
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailInputRef.current && emailInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                underlineColorAndroid="#f000"
                placeholder="Email"
                placeholderTextColor={Colors.black}
                keyboardType="email-address"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current && passwordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                underlineColorAndroid="#f000"
                placeholder="Password"
                placeholderTextColor={Colors.black}
                ref={passwordInputRef}
                returnKeyType="next"
                secureTextEntry={true}
                onSubmitEditing={() =>
                  confirmPasswordInputRef.current &&
                  confirmPasswordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setConfirmPassword(UserPassword)}
                underlineColorAndroid="#f000"
                placeholder="Confirm Password"
                placeholderTextColor={Colors.black}
                ref={confirmPasswordInputRef}
                returnKeyType="next"
                secureTextEntry={true}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            </View>

            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => handleSubmitButton()}>
              <Text style={styles.buttonTextStyle}>Sign Up</Text>
            </TouchableOpacity>
            <View
              style={{
                marginTop: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
              }}>
              <Text style={{fontSize: 16, color: Colors.black}}>
                Already have an account?{' '}
                <Text
                  onPress={() => navigation.navigate('LoginScreen')}
                  style={{...styles.SLButton}}>
                  Sign In
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
export default Signup;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 15,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  TextStyle: {
    fontFamily: fonts['Mofista'],
    fontSize: 14,
    color: Colors.black,
    alignSelf: 'flex-end',
    //marginVertical:10
  },
  buttonStyle: {
    backgroundColor: Colors.primary_dark,
    height: 40,
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: Colors.black,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.black,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});
