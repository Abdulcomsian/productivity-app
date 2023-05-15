/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {fonts} from '../../utills/fonts';
import {Colors} from '../../utills/Colors';
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  OpacitySlider,
  HueSlider,
} from 'reanimated-color-picker';
import {AuthContext} from '../../utills/Context';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});
const Settings = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [finalColor, setFinalColor] = useState('');
  const [headingName, setHeadingName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FDF4EC');
  const [cardColor, setCardColor] = useState('#E5D8CE');
  const [headingColor, setHeadingColor] = useState('#000000');
  const [mainTextColor, setMainTextColor] = useState('#fff');
  const [subTextColor, setSubTextColor] = useState('#000');

  const {...colors} = React.useContext(AuthContext);
  const {setBackgroundColorValue} = React.useContext(AuthContext);


//openModal function show modal which contain the color platte to select the color
  const openModal = () => {
    const onSelectColor = ({hex}) => {
      // do something with the selected color.
      setFinalColor(hex);
    };

    
//saveColor function save the selected color from platte for selected item
    const saveColor = () => {
      switch (headingName) {
        case 'Main Color':
          setBackgroundColor(finalColor);
          break;
        case 'Secondary Color':
          setCardColor(finalColor);
          break;
        case 'Title Color':
          setHeadingColor(finalColor);
          break;
        case 'Main Text Color':
          setMainTextColor(finalColor);
          break;
        case 'Sub Text Color':
          setSubTextColor(finalColor);
          break;

        default:
          break;
      }

      setShowModal(false);

    };

    return (

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Modal
          style={{
            backgroundColor: 'green',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
          }}
          visible={showModal}
          animationType="slide">
          <ColorPicker
            style={{width: '70%', alignSelf: 'center', marginTop: 50}}
            value="red"
            onComplete={onSelectColor}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>

          <Button title="Ok" onPress={() => saveColor()} />
        </Modal>
      </View>
    );
  };

  //CustomView function is used for custom heading that we used multiple times
  const CustomView = ({heading, backgroundColor, onPress,borderColor}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
          width: '100%',
          marginTop: 10,
          justifyContent: 'space-between',

          alignItems: 'center',
        }}>
        <Text style={{fontSize: 14,fontWeight:'600', color: colors.mainTextColor}}>
          {heading}
        </Text>
        <TouchableOpacity
          onPress={onPress}
          style={{
            width: 25,
            height: 25,
            borderWidth: 1,
            borderColor:borderColor,
            borderRadius: 7,
            backgroundColor: backgroundColor,
          }}
        />
      </View>
    );
  };

  //saveThemeValue function apply selected colortheme to all screens also save in db on button press
  const saveThemeValue = async taskId => {

    //insert color theme into color_theme database table
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE color_theme set backgroundColor=?, cardColor=?,headingColor=?,mainTextColor=?,subTextColor=?  where user_id=?',
        [
          backgroundColor,
          cardColor,
          headingColor,
          mainTextColor,
          subTextColor,
          taskId,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Colors theme updated');
          } else {
            console.log('Updation Failed');
          }
        },
      );
    });

    //setBackgroundColorValue function update colors to all screens through Context
    try {
      setBackgroundColorValue(
        backgroundColor,
        cardColor,
        headingColor,
        mainTextColor,
        subTextColor,
      );
    } catch (e) {
      console.log(e);
    }
  };

  //here are main design 
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroundColor}}>
    <ScrollView contentContainerStyle={{paddingBottom:40}}>
    <View style={{marginHorizontal: 20}}>
        <View style={styles.topHeadingView}>
          <Text
            style={{
              fontSize: 20,
              color: colors.headingColor,
              fontFamily: fonts['Mofista-Italic'],
            }}>
            Settings
          </Text>
          <Entypo
            onPress={() => navigation.toggleDrawer()}
            style={{fontSize: 22, color: colors.headingColor}}
            name={'menu'}
          />
        </View>

    <View style={{borderRadius:5,backgroundColor:colors.cardColor,paddingHorizontal:10}}>

    <Text
            style={{
              fontSize: 24,
              marginTop:15,
              color: colors.headingColor,
              fontFamily: fonts['Mofista-Italic'],
            }}>
            colours
          </Text>

        <CustomView
        borderColor={'transparent'}
          onPress={() => {
            setHeadingName('Main Color');
            setShowModal(true);
          }}
          heading={'Main Color'}
          backgroundColor={colors.backgroundColor}
        />
        <CustomView
        borderColor={'#ffffff'}
          onPress={() => {
            setHeadingName('Secondary Color');
            setShowModal(true);
          }}
          heading={'Secondary Color'}
          backgroundColor={colors.cardColor}
        />
        <CustomView
        borderColor={'transparent'}
          onPress={() => {
            setHeadingName('Title Color');
            setShowModal(true);
          }}
          heading={'Title Color'}
          backgroundColor={colors.headingColor}
        />
        <CustomView
        borderColor={'transparent'}
          onPress={() => {
            setHeadingName('Main Text Color');
            setShowModal(true);
          }}
          heading={'Main Text Color'}
          backgroundColor={colors.mainTextColor}
        />
        <CustomView
        borderColor={'transparent'}
          onPress={() => {
            setHeadingName('Sub Text Color');
            setShowModal(true);
          }}
          heading={'Sub Text Color'}
          backgroundColor={colors.subTextColor}
        />

        <TouchableOpacity
          style={{...styles.buttonStyle, backgroundColor: colors.backgroundColor}}
          activeOpacity={0.5}
          onPress={() => saveThemeValue(1)}>
          <Text style={{...styles.buttonTextStyle, color: colors.headingColor}}>
            Save Changes
          </Text>
        </TouchableOpacity>
    </View>

        <Text style={{left: 15,marginTop:15,fontSize:20,fontFamily:fonts['Mofista'], color: colors.headingColor}}>
          live preview
        </Text>

        <View style={{...styles.previewCard,borderColor:colors.subTextColor, backgroundColor: backgroundColor}}>
          <View
            style={{
              width: '100%',
              paddingVertical: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 24,
                color: headingColor,
                fontFamily: fonts['Mofista-Italic'],
              }}>
              Settings
            </Text>

            <Entypo
              onPress={() => navigation.toggleDrawer()}
              style={{fontSize: 24, color: headingColor}}
              name={'menu'}
            />
          </View>

          <Text style={{color: headingColor,fontSize:14,fontFamily:fonts['Mofista']}}>Profile</Text>

          <View style={{...styles.cardview, backgroundColor: cardColor}}>
            <Text
              style={{
                fontSize: 18,
                left: 15,
                color: mainTextColor,
                fontFamily: fonts['Mofista-Italic'],
              }}>
              {'Projects'}
            </Text>
          </View>
        </View>

      

        {openModal()}
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
    borderWidth:1,
    borderColor:'red',
    borderStyle:'dotted',
    marginTop: 15,
    //elevation: 1,
    height: 150,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
  },
});

export default Settings;
