import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Dimensions,
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
import {SwipeListView} from 'react-native-swipe-list-view';
import { Colors } from '../../../utills/Colors';

var db = openDatabase({name: 'UserDatabase.db'});

const Projects = ({onPress, isOpen}) => {
  const {...colors} = useContext(AuthContext);
  const {...fonts} = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const {width: screenWidth} = useWindowDimensions();
  const [data, setData] = useState([]);

  // Get All task data from projects table
  useEffect(() => {
    const currentDate = new Date().toLocaleDateString(); // get current date in string format
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM projects', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
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
        'INSERT INTO projects(task_name, task_status,task_edit_status,date) VALUES (?,?,?,?)',
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
  const editTaskName = (taskId, taskno, task_status,task_date) => {
    setIsLoading(true);
    var date = new Date().toLocaleString();
    const updatedArray = [...data]; // create a copy of the original array
    const taskToUpdate = updatedArray.find(task => task.task_id === taskId); // find the task with the matching task_id
    if (taskToUpdate) {
      console.log(taskToUpdate.task_name); // update the task_name property of the matching object
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE projects set task_name=?, task_status=? , task_edit_status=?, date=? where task_id=?',
          [
            taskToUpdate.task_name.toString(),
            taskno == 2 ? !task_status : false,
            true,
            taskno == 2 ? task_date : date.slice(0, 10),
            taskId,
          ],
          (tx, results) => {
            console.log('Results.....done', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Updation .....');
              // onChangeStatus(task_id)
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
            fontFamily:fonts.regularFont,
            fontSize: 22,
            color: colors.headingColor,
          }}>
          {item.task_id}.
        </Text>

        <Text
          style={{
            width: '70%',
            paddingVertical: 15,
            fontFamily: fonts.regularFont,
            fontSize: 22,
            color: colors.headingColor,
          }}>
          {item.task_name}
        </Text>
        <TouchableOpacity
          style={{paddingVertical: 9}}
          onPress={() => editTaskName(item.task_id, 2, item.task_status,item.date)}>
          {item.task_status ? (
            <TickBox style={{bottom: 5}} height={30} width={30} />
          ) : (
            <Box style={{bottom: 5}} height={30} width={30} />
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
            fontFamily:fonts.regularFont,
            backgroundColor: 'transparent',
          }}
          underlineColorAndroid="transparent"
          placeholderTextColor="#000000"
        />
        <TouchableOpacity
          onPress={
            () => editTaskName(item.task_id, 1, item.task_status,item.date)
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
        <TouchableOpacity
          onPress={onPress}
          style={{
            left: 5,
            width: '80%',
            paddingVertical: 5,
            justifyContent:'center',
            paddingHorizontal: 5,
          }}>
          <Text style={{...styles.headingStyle,fontFamily:fonts.boldFont, color: colors.headingColor}}>
            {'Projects'}
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
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                fontFamily: fonts.boldFont,
              }}>
              {data.length}
            </Text>
          ) : (
            <Ionicons
              onPress={addProjectsItem}
              style={{fontSize: 30,fontFamily:fonts.boldFont, alignSelf: 'center'}}
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
  headingStyle: {fontSize: 22, fontFamily: fonts['Mofista-Italic']},

  viewstyle: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingTop: 10,
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
    rowFront: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  rowBack: {
    height: 60
  },
  backBtn: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    justifyContent: 'center',
  },
  backRightBtn: {},
  backRightBtnLeft: {
    right: 60,
    backgroundColor: Colors.blue,
  },
  backRightBtnRight: {
    right: 0,
    backgroundColor: Colors.red,
  },
  backBtnInner: {
    alignItems: 'center',
  },
  backBtnText: {
    color: 'red',
    marginTop: 2,
  },
});

export default Projects;

// import { useState } from 'react';

// import {
//   // ...
//   Text,
//   View,
//   TouchableWithoutFeedback,
//   useWindowDimensions,
//   SafeAreaView,
//   StyleSheet
// } from 'react-native';
// import { Colors } from '../../../utills/Colors';
// import { SwipeListView } from 'react-native-swipe-list-view';
// // ...

// const renderItem = (rowData, rowMap) => <VisibleItem rowData={rowData} rowMap={rowMap} />;

// const renderHiddenItem = (rowData, rowMap) => <HiddenItemWithActions rowMap={rowMap} />;
// const VisibleItem = props => {
//   const {rowData} = props;

//   return (
//     <View
//       style={[
//         styles.rowFront,
//         {height: 60}
//       ]}>
//       <Text>{rowData.item.text}</Text>
//     </View>
//   );
// };

// const HiddenItemWithActions = props => {
//   const {rightActionActivated, swipeAnimatedValue, rowData} = props;

//   return (
//     <View style={styles.rowBack}>
//       <TouchableWithoutFeedback onPress={() => console.log('delete row')}>
//         <View
//           style={[
//             styles.backBtn,
//             styles.backRightBtn,
//             styles.backRightBtnRight,
//             {
//               width: 60,
//             },
//           ]}>
//           <View style={styles.backBtnInner}>
//             <Text style={styles.backBtnText}>Delete</Text>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </View>
//   );
// };

// const Projects = () => {
//   // ...
//   const {width: screenWidth} = useWindowDimensions();

//   const [list, setList] = useState(
//     [...new Array(20)].map((_, i) => ({
//       key: `${i}`,
//       text: `This is list item ${i}`,
//     })),
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <SwipeListView
//         data={list}
//         renderItem={renderItem}
//         renderHiddenItem={renderHiddenItem}
//         disableRightSwipe
//         rightOpenValue={-120}
//         stopRightSwipe={-201}
//         rightActivationValue={-200}
//         rightActionValue={-screenWidth}
//         swipeToOpenPercent={10}
//         swipeToClosePercent={10}
//         useNativeDriver={false}
//       />
//     </SafeAreaView>
//   );
// };

// export default Projects;

// const styles = StyleSheet.create({
//   // ...
//   rowFront: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: Colors.white,
//     borderBottomColor: Colors.grey,
//     borderBottomWidth: 1,
//   },
//   rowBack: {
//     height: 60
//   },
//   backBtn: {
//     position: 'absolute',
//     bottom: 0,
//     top: 0,
//     justifyContent: 'center',
//   },
//   backRightBtn: {},
//   backRightBtnLeft: {
//     right: 60,
//     backgroundColor: Colors.blue,
//   },
//   backRightBtnRight: {
//     right: 0,
//     backgroundColor: Colors.red,
//   },
//   backBtnInner: {
//     alignItems: 'center',
//   },
//   backBtnText: {
//     color: 'blue',
//     marginTop: 2,
//   },
// });

