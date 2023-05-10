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
  Platform,
  Alert,
} from 'react-native';
import {Colors} from '../../utills/Colors';
import {fonts} from '../../utills/fonts';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-community/async-storage';

const Login = ({navigation}) => {

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const passwordInputRef = createRef();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
  //handleSubmitPress function call login api and check user have or not 

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);

    var formdata = new FormData();
formdata.append("email", userEmail.toLowerCase());
formdata.append("password",userPassword);

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("https://iopollo.accrualdev.com/api/login", requestOptions)
  .then(response => response.text())
  .then((responseJson) => {
    //Hide Loader
    setLoading(false);
  

    var result =JSON.parse(responseJson)


    // If server response message same as Data Matched
    if (result.status === 'Success') {
      AsyncStorage.setItem('user_id', result.data.token);
      navigation.replace('DrawerNavigationRoutes');
    } else {
      setErrortext(result.msg);
      Alert.alert(
        'Login Failed',
        'Please check your email id or password',
        [
          {
            text: 'Dismiss',
          
          },
        ],
        {cancelable: false},
      );
      console.log('Please check your email id or password');
    }
  })
  .catch(error => console.log('error', error));

  
  };


  
   
  
  return (
    <SafeAreaView style={{flex:1}}>
     
      <StatusBar backgroundColor={'#E5D8CE'}  barStyle={"dark-content"}/>

    <View style={{flex: 1, backgroundColor: Colors.primary}}>
      
       <ImageBackground
          source={require('../../images/ic_background.png')}
          resizeMethod="scale"
          resizeMode="cover"
          style={{height:300,}}/>
      {/* <Loader loading={loading} /> */}
      <Loader loading={loading} />
<KeyboardAvoidingView behavior='height' keyboardVerticalOffset={keyboardVerticalOffset}>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
        marginTop:40,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
       
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                underlineColorAndroid="#f000"
                placeholder="Enter Email"
                placeholderTextColor={Colors.black}
                keyboardType="email-address"
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
                placeholder="Enter Password"
                placeholderTextColor={Colors.black}
                ref={passwordInputRef}
                returnKeyType="next"
                secureTextEntry={true}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity style={{
                  justifyContent: 'center',
                  alignItems:'flex-end',
                  paddingVertical:10,
                  width:'80%',
                  alignSelf: 'center',
                  // borderBottomWidth: 1,
                }}
                  onPress={() => navigation.navigate('ForgotPassword')} >
                  <Text style={styles.TextStyle}>Forgot Password?</Text>
                </TouchableOpacity>
              
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>{errortext}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>Log In</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 1, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
    
                <Text style={{ fontSize: 16, color: Colors.black ,fontFamily: fonts['Mofista-Italic'],}}>Don’t have an account? <Text onPress={()=>navigation.navigate('RegisterScreen')} style={{ ...styles.SLButton,fontFamily: fonts['Mofista-Italic'], }}>Sign Up</Text></Text>

              </View>
         
       
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  
    </SafeAreaView>
  );
};
export default Login;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  TextStyle: {

    fontFamily: fonts['Mofista-Italic'],
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
    fontFamily: fonts['Mofista-Italic'],

    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: Colors.black,
    paddingLeft: 15,
    paddingRight: 15,
    fontFamily: fonts['Mofista-Italic'],

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
