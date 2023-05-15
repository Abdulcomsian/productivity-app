import React, {useEffect, useContext, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {fonts} from '../../utills/fonts';
import Entypo from 'react-native-vector-icons/Entypo';
import Projects from './components/Projects';
import Negotiable from './components/Negotiable';
import QuickTicks from './components/QuickTicks';
import QuickTasks from './components/QuickTasks';

import Box from '../../images/ic_box.svg'
import TickBox from '../../images/ic_tickbox.svg'


import {openDatabase} from 'react-native-sqlite-storage';

import {AuthContext} from '../../utills/Context';

//database name
var db = openDatabase({name: 'UserDatabase.db'});

//createTable function will create table in db with given parameters

const createTable = (table, column1, column2, column3, column4, column5) => {
  db.transaction(txn => {
    txn.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
      [],
      (tx, res) => {
        console.log('item:', res.rows.length);
        if (res.rows.length == 0) {
          txn.executeSql(`DROP TABLE IF EXISTS ${table}`, []);
          txn.executeSql(
            `CREATE TABLE IF NOT EXISTS ${table}(task_id INTEGER PRIMARY KEY AUTOINCREMENT, ${column1} VARCHAR(20), ${column2} BOOLEAN, ${column3} BOOLEAN, ${column4} BOOLEAN,${column5} VARCHAR)`,
            [],
          );
        }
      },
    );
  });
};

const Home = ({navigation}) => {
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

  const [isProject, setIsProject] = useState(false);

  const [isNegotialable, setIsNegotiable] = useState(false);

  const [isQTicks, setIsQTicks] = useState(false);

  const [isQTasks, setIsQTasks] = useState(false);

  const {...colors} = useContext(AuthContext);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.backgroundColor}}>
      
      <View style={{marginHorizontal: 20}}>
        
        <View style={styles.mainCard}>
          <Text style={{...styles.headingColor, color: colors.headingColor}}>
            Katie’s Planner
          </Text>
          <Entypo
            onPress={() => navigation.toggleDrawer()}
            style={{fontSize: 24, color: colors.headingColor}}
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
            setIsNegotiable(false);
            setIsQTasks(false);
            setIsQTicks(false);
          }}
          isOpen={isProject}
        />
        <Negotiable
          onPress={() => {
            setIsProject(false);
            setIsNegotiable(!isNegotialable);
            setIsQTasks(false);
            setIsQTicks(false);
          }}
          isOpen={isNegotialable}
        />
        <QuickTicks
          onPress={() => {
            setIsProject(false);
            setIsNegotiable(false);
            setIsQTasks(false);
            setIsQTicks(!isQTicks);
          }}
          isOpen={isQTicks}
        />
        <QuickTasks
          onPress={() => {
            setIsProject(false);
            setIsNegotiable(false);
            setIsQTicks(false);
            setIsQTasks(!isQTasks);
          }}
          isOpen={isQTasks}
        />

      </View>
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
  headingColor: {fontSize: 20, fontFamily: fonts['Mofista']},
  subHeading: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: fonts['Mofista'],
  },
});

export default Home;
