/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  useColorScheme,
  Button,
  View,
  TextInput,
  Alert,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {fonts} from '../../utills/fonts';
import {Colors} from '../../utills/Colors';
import AsyncStorage from '@react-native-community/async-storage';

import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';
import {AuthContext} from '../../utills/Context';

import {openDatabase} from 'react-native-sqlite-storage';
import Loader from '../../components/Loader';

var db = openDatabase({name: 'UserDatabase.db'});
const Profile = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const {...colors} = useContext(AuthContext);
  const {...fonts} = useContext(AuthContext);

  const {setIsLoading} = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPass, setUserPass] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState();

  const [userConfirmPass, setUseConfirmPass] = useState('');

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const abcdata = await AsyncStorage.getItem('user_id').then(res => {
      setToken(res);
      fetchData(res);
    });
  };

  const fetchData = async accessToken => {
    try {
      const myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${accessToken}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      const response = await fetch(
        'https://iopollo.accrualdev.com/api/getLoggedInUser',
        requestOptions,
      );
      const result = await response.text();

      const results = JSON.parse(result);
      //  console.log("resultresultresultresult",results.status)

      if (results.status == 'Success') {
        console.log('datadatadata', results);
        setUserName(results.data.name);
        setUserEmail(results.data.email);
        // setUserPass()
        // setUseConfirmPass()
      } else {
        setUserName('FPP');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleSubmitButton = () => {
    if (!userName) {
      alert('Please fill Name');
      return;
    }
    if (!userPass) {
      alert('Please fill Password');
      return;
    }
    if (!userConfirmPass) {
      alert('Please fill Confirm Password');
      return;
    } 

    if(userPass!=userConfirmPass) {
      alert('Password must be same');
      return;
    }

    //Show Loader
    setLoading(true);
    setIsLoading(true)

    var myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${token}`);

    const url = `https://iopollo.accrualdev.com/api/userUpdateProfile?name=${encodeURIComponent(
      userName,
    )}&email=${encodeURIComponent(userEmail)}&password=${encodeURIComponent(
      userPass,
    )}&confirm_password=${encodeURIComponent(userConfirmPass)}`;

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(url, requestOptions)
      .then(response => response.text())
      .then(res => {
        const result = JSON.parse(res);
      
        if (result.status === 'Success') {
          setLoading(false);
          setIsLoading(false)
          Alert.alert(
            'Profile Info Updated',
            [
              {
                text: 'Dismiss',
              },
            ],
            {cancelable: false},
          );
        } else {
          setLoading(false);
          setIsLoading(false)
          Alert.alert(
            'The password must be at least 8 characters.',
            [
              {
                text: 'Dismiss',
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch(error => console.log('error', error));
  };

  //here are main design
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroundColor}}>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <View style={{marginHorizontal: 20}}>
          <Loader loading={loading} />
          <View style={styles.topHeadingView}>
            <Text
              style={{
                fontSize: 22,
                color: colors.headingColor,
                fontFamily: fonts.boldFont,
              }}>
              Edit Profile
            </Text>
            <Entypo
              onPress={() => navigation.toggleDrawer()}
              style={{fontSize: 30, color: colors.headingColor}}
              name={'menu'}
            />
          </View>

          <View
            style={{
              borderRadius: 5,
              paddingHorizontal: 2,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 50,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  width: '34%',
                  color: '#000',
                  fontFamily: fonts.regularFont,
                }}>
                Name :
              </Text>

              <TextInput
                autoCapitalize="none"
                returnKeyType="done"
                placeholder={'User Name'}
                onChangeText={newText => setUserName(newText)}
                autoCompleteType="off"
                keyboardType="default"
                value={userName}
                style={{
                  textAlign: 'left',
                  fontSize: 18,
                  borderRadius: 10,
                  borderWidth: 1,
                  paddingVertical: 5,
                  fontFamily:fonts.regularFont,
                  borderColor: '#000',
                  paddingLeft: 10,
                  color: '#000',
                  width: '62%',
                }}
                underlineColorAndroid="transparent"
                placeholderTextColor="#000000"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  width: '34%',
                  color: '#000',
                  fontFamily: fonts.regularFont,
                }}>
                Password :
              </Text>

              <TextInput
                autoCapitalize="none"
                returnKeyType="done"
                onChangeText={newText => setUserPass(newText)}
                placeholder={'Enter Password'}
                autoCompleteType="off"
                keyboardType="default"
                value={userPass}
                style={{
                  textAlign: 'left',
                  fontSize: 18,
                  borderRadius: 10,
                  borderWidth: 1,
                  paddingVertical: 5,
                  fontFamily:fonts.regularFont,
                  borderColor: '#000',
                  paddingLeft: 10,
                  color: '#000',
                  width: '62%',
                }}
                underlineColorAndroid="transparent"
                placeholderTextColor="#000000"
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 22,
                  width: '34%',
                  color: '#000',
                  fontFamily: fonts.regularFont,
                }}>
                Confirm :
              </Text>

              <TextInput
                autoCapitalize="none"
                returnKeyType="done"
                onChangeText={newText => setUseConfirmPass(newText)}
                placeholder={'Confirm Password'}
                autoCompleteType="off"
                keyboardType="default"
                value={userConfirmPass}
                style={{
                  textAlign: 'left',
                  fontSize: 18,
                  borderRadius: 10,
                  fontFamily:fonts.regularFont,
                  borderWidth: 1,
                  paddingVertical: 5,
                  borderColor: '#000',
                  paddingLeft: 10,
                  color: '#000',
                  width: '62%',
                }}
                underlineColorAndroid="transparent"
                placeholderTextColor="#000000"
              />
            </View>
          </View>

          <TouchableOpacity
            style={{...styles.buttonStyle, backgroundColor: '#E5D8CE'}}
            activeOpacity={0.5}
            onPress={() => handleSubmitButton()}>
            <Text
              style={{...styles.buttonTextStyle,fontFamily:fonts.boldFont, color: colors.headingColor}}>
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topHeadingView: {
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: Colors.primary_dark,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 40,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 1,
    textAlign: 'center',
    fontSize: 16,
  },
  cardview: {
    marginTop: 10,
    backgroundColor: '#E5D8CE',
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderRadius: 5,
    width: '100%',
  },
  previewCard: {
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'dotted',
    marginTop: 15,
    //elevation: 1,
    height: 150,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
  },
});

export default Profile;
