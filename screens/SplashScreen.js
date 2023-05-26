import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {fonts} from '../utills/fonts';
import {Colors} from '../utills/Colors';
import AsyncStorage from '@react-native-community/async-storage';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

const SplashScreen = ({navigation}) => {
  const [animating, setAnimating] = useState(true);

  //query inside useaeffect will create color_theme table in db

  useEffect(() => {
    //color theme table
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='color_theme'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS color_theme', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS color_theme(user_id INTEGER PRIMARY KEY AUTOINCREMENT, backgroundColor VARCHAR(20), cardColor VARCHAR(20), headingColor VARCHAR(20),mainTextColor VARCHAR(20),subTextColor VARCHAR(20))',
              [],
            );
          }
        },
      );
    });

    // fonts table
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='fonts_table'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS fonts_table', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS fonts_table(font_id INTEGER PRIMARY KEY AUTOINCREMENT, boldFont VARCHAR(20), regularFont VARCHAR(20))',
              [],
            );
          }
        },
      );
    });

  }, []);

  //below useEffect   //Check if user_id is set or not
  //If not then send for Authentication
  //else send to Home Screen
  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);

      AsyncStorage.getItem('user_id').then(value =>
        navigation.replace(value === null ? 'Auth' : 'DrawerNavigationRoutes'),
      );
    }, 5000);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        animated={true}
        backgroundColor={'#E5D8CE'}
        barStyle={'dark-content'}
      />

      <View style={{flex: 1, padding: 16, backgroundColor: Colors.primary}}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 25,
              fontFamily: fonts['Mofista'],
              textAlign: 'center',
            }}>
            Welcome To Planner App
          </Text>
          <ActivityIndicator
            animating={animating}
            color="#000000"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#307ecc',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
