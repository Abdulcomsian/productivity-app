import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {fonts} from '../../../utills/fonts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Box from '../../../images/ic_box.svg';
import TickBox from '../../../images/ic_tickbox.svg';
import {openDatabase} from 'react-native-sqlite-storage';
import {AuthContext} from '../../../utills/Context';

var db = openDatabase({name: 'UserDatabase.db'});

const QuickTasks = ({onPress, isOpen}) => {
  const {...colors} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState([]);

  // Get All tasks data from projects table
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM quicktasks', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFinalData(temp);
      });
    });
  }, [isLoading]);

  //setFinalData will filter and set updated data to array
  const setFinalData = dataArray => {
    const currentDate = new Date().toLocaleDateString();

    const filteredArray = dataArray.filter(obj => {
      return obj.date == currentDate || obj.task_status != 1;
    });

    setData(filteredArray);
  };

  //addProjectsItem function will insert new task to table
  const addProjectsItem = () => {
    setIsLoading(true);
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO quicktasks(task_name, task_status,task_edit_status,date) VALUES (?,?,?,?)',
        ['', false, false, ''],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        },
      );
    });
  };

  //editTaskName function will update selected task from table
  const editTaskName = (taskId, taskno) => {
    setIsLoading(true);
    var date = new Date().toLocaleString();
    const updatedArray = [...data]; // create a copy of the original array
    const taskToUpdate = updatedArray.find(task => task.task_id === taskId); // find the task with the matching task_id
    if (taskToUpdate) {
      console.log(taskToUpdate.task_name); // update the task_name property of the matching object
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE quicktasks set task_name=?, task_status=? , task_edit_status=?, date=? where task_id=?',
          [
            taskToUpdate.task_name.toString(),
            taskno == 2 ? true : false,
            true,
            date.slice(0, 10),
            taskId,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              setIsLoading(false);
            } else {
              setIsLoading(false);
              console.log('Updation Failed');
            }
          },
        );
      });
    }
  };

  //handleEditItem will update the text of selected textinput field
  const handleEditItem = (index, newText) => {
    const updatedArray = [...data]; // create a copy of the original array
    const taskToUpdate = updatedArray.find(task => task.task_id === index); // find the task with the matching task_id
    if (taskToUpdate) {
      taskToUpdate.task_name = newText; // update the task_name property of the matching object
    }
    setData(updatedArray); // update the state with the updated array
  };

  //renderItem function will check condtion and show ui design as desired
  const renderItem = ({item, index}) => (
    <>
      {item.task_edit_status ? (
        <View style={styles.viewstyle}>
          <Text
            style={{
              width: '15%',
              left: 10,
              paddingVertical: 15,
              fontFamily: fonts['Mofista'],
              fontSize: 20,
              color: colors.headingColor,
            }}>
            {item.task_id}.
          </Text>

          <Text
            style={{
              width: '70%',
              paddingVertical: 15,
              fontFamily: fonts['Mofista'],
              fontSize: 18,
              color: colors.headingColor,
            }}>
            {item.task_name}
          </Text>
          <TouchableOpacity
            style={{paddingVertical:9}}
            onPress={() => editTaskName(item.task_id, 2)}>
            {item.task_status ? (
              <TickBox style={{bottom:5}} height={30} width={30} />

            ) : (
              <Box style={{bottom:5}} height={30} width={30} />


            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cardview2}>
          <TextInput
            autoCapitalize="none"
            returnKeyType="done"
            onChangeText={newText => handleEditItem(item.task_id, newText)}
            placeholder={'Enter Projects'}
            autoCompleteType="off"
            keyboardType="default"
            value={item.task_name.toString()}
            style={{
              paddingVertical: 1,
              width: '80%',
              backgroundColor: 'transparent',
            }}
            underlineColorAndroid="transparent"
            placeholderTextColor="#000000"
          />
          <TouchableOpacity
            onPress={
              () => editTaskName(item.task_id, 1)
              //   onPress={() => onSubmitEditText(item.task_id,1)
            }>
            <Feather style={{fontSize: 22}} name={'arrow-right'} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={{...styles.cardview, backgroundColor: colors.cardColor}}>
        <TouchableOpacity onPress={onPress} style={{left:5,width: '80%', paddingVertical: 18,paddingHorizontal:5}}>
          <Text style={{...styles.headingStyle, color: colors.headingColor}}>
            {'Quick Tasks'}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            borderRadius: 50,
            height: 40,
            width: 40,
            margin: 10,
            backgroundColor: '#C9BAAF',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!isOpen ? (
            <Text>{data.length}</Text>
          ) : (
            <Ionicons
              onPress={addProjectsItem}
              style={{fontSize: 22}}
              name={'add'}
            />
          )}
        </View>
      </View>

      <View style={{maxHeight: 300, marginTop: 10, marginBottom: 10}}>
        {isOpen ? (
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 10}}
            // inverted={true}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardview: {
    backgroundColor: '#E5D8CE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    width: '98%',
  },
  headingStyle: {fontSize: 18, fontFamily: fonts['Mofista-Italic']},

  viewstyle: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: '98%',
  },
  cardview2: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    width: '98%',
  },
  container: {
    padding: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    padding: 5,
    borderRadius: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default QuickTasks;
