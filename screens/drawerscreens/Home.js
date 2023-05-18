import React, {useEffect, useContext, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fonts} from '../../utills/fonts';
import Entypo from 'react-native-vector-icons/Entypo';
import Projects from './components/Projects';
import Negotiable from './components/Negotiable';
import QuickTicks from './components/QuickTicks';
import QuickTasks from './components/QuickTasks';
import AsyncStorage from '@react-native-community/async-storage';

import Box from '../../images/ic_box.svg'
import TickBox from '../../images/ic_tickbox.svg'


import {openDatabase} from 'react-native-sqlite-storage';

import {AuthContext} from '../../utills/Context';

//database name
var db = openDatabase({name: 'UserDatabase.db'});

//createTable function will create table in db with given parameters

const createTable = (table, column1, column2, column3, column4) => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
      [],
      (tx, res) => {
        console.log('item:', res.rows.length);
        if (res.rows.length == 0) {
          txn.executeSql(`DROP TABLE IF EXISTS ${table}`, []);
          txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${table}(task_id INTEGER PRIMARY KEY AUTOINCREMENT, ${column1} VARCHAR(20), ${column2} BOOLEAN, ${column3} BOOLEAN, ${column4} BOOLEAN)`,
            [],
          );
        }
      },
    );
  });
};

const Home = ({navigation}) => {

  const [userName,setUserNmae] =useState('')


  const [isProject, setIsProject] = useState(false);

  const [isNegotialable, setIsNegotiable] = useState(false);

  const [isQTicks, setIsQTicks] = useState(false);

  const [isQTasks, setIsQTasks] = useState(false);

  const {...colors} = useContext(AuthContext);
  const {isLoading} = React.useContext(AuthContext);


  useEffect(()=>{
getUserInfo()
  },[isLoading])

  const getUserInfo = async () =>{
   const abcdata = await AsyncStorage.getItem('user_id').then(res=>{
    console.log("abcdataabcdataabcdataabcdatares",res)
    fetchData(res)

   });
   
  }

  const fetchData = async (accessToken) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${accessToken}`);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch("https://iopollo.accrualdev.com/api/getLoggedInUser", requestOptions);
      const result = await response.text();

     const results = JSON.parse(result)
    //  console.log("resultresultresultresult",results.status)

      if(results.status=='Success')
      {
        console.log("datadatadata",)
        setUserNmae(results.data.name)
      } else {
        setUserNmae('FPP')

      }
    } catch (error) {
      console.log('error', error);
    }
  };
  //in Useeffect createTable funtion will call and pass the paramerts along table name to create table in db
  useEffect(() => {
    createTable(
      'projects',
      'task_name',
      'task_status',
      'task_edit_status',
      'date',
    );
    createTable(
      'negotiables',
      'task_name',
      'task_status',
      'task_edit_status',
      'date',
    );
    createTable(
      'quicktick',
      'task_name',
      'task_status',
      'task_edit_status',
      'date',
    );
    createTable(
      'quicktasks',
      'task_name',
      'task_status',
      'task_edit_status',
      'date',
    );
  }, []);



  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroundColor}}>
      <ScrollView
      contentContainerStyle={{paddingBottom:80}}
      style={{}}>
      <View style={{marginHorizontal: 20}}>
        
        <View style={styles.mainCard}>
          <Text style={{...styles.headingColor, color: colors.headingColor}}>
            {!userName ? 'Katie’s Planner' : userName}
          </Text>
          <Entypo
            onPress={() => navigation.toggleDrawer()}
            style={{fontSize: 40, color: colors.headingColor}}
            name={'menu'}
          />
        </View>

        <Text style={{...styles.subHeading, color: colors.headingColor}}>
          Today
        </Text>

        {/* below are the custom components */}

        <Projects
          onPress={() => {
            setIsProject(!isProject);
          }}
          isOpen={isProject}
        />
        <Negotiable
          onPress={() => {
            setIsNegotiable(!isNegotialable);
          }}
          isOpen={isNegotialable}
        />
        <QuickTicks
          onPress={() => {
            setIsQTicks(!isQTicks);
          }}
          isOpen={isQTicks}
        />
        <QuickTasks
          onPress={() => {
            setIsQTasks(!isQTasks);
          }}
          isOpen={isQTasks}
        />

      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    width: '100%',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headingColor: {fontSize: 40, fontFamily: fonts['Mofista']},
  subHeading: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: fonts['Mofista'],
  },
});

export default Home;
