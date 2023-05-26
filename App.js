import 'react-native-gesture-handler';

import React, {useState, useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {StatusBar,LogBox, SafeAreaView} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

// Import Screens
import DrawerNavigatorRoutes from './navigation/DrawerNavigatorRoutes';
import SplashScreen from './screens/SplashScreen';
import Signup from './screens/authscreens/Signup';
import Login from './screens/authscreens/Login';
import {AuthContext} from './utills/Context';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
//Database name
var db = openDatabase({name: 'UserDatabase.db'});

const Stack = createStackNavigator();

// Auth function for Login and Sign up Screen Navigation
const Auth = () => {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={Signup}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

function App() {
  const [colors, setColors] = useState();
  const [fonts, setFonts] = useState();

  const [isLoading,setIsLoading] =useState(false)

  //below useEffect will get color theme from db
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM color_theme', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        updateColor(temp);
      });
    });
  }, []);

   //below useEffect will get fonts  from db
   useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM fonts_table', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        updateFonts(temp);
      });
    });
  }, []);

  var context1InitialState = {};
  var fontsInitialState = {};


  //updateColor function will update color theme to all screens through Context

  const updateColor = arrColor => {
    if (arrColor.length) {
      context1InitialState = {
        backgroundColor: arrColor[0].backgroundColor,
        cardColor: arrColor[0].cardColor,
        headingColor: arrColor[0].headingColor,
        mainTextColor: arrColor[0].mainTextColor,
        subTextColor: arrColor[0].subTextColor,
      };
      setColors(context1InitialState);
    } else {
      // if user first time it will insert color theme into color_theme table in db also update app color theme
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO color_theme(backgroundColor,cardColor,headingColor,mainTextColor,subTextColor) VALUES (?,?,?,?,?)',
          ['#FDF4EC', '#E5D8CE', '#424242', '#424242', '#3F3935'],
          (tx, results) => {
            console.log('Results11111111', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Data inserted');
            }
          },
        );
      });

      context1InitialState = {
        backgroundColor: '#FDF4EC',
        cardColor: '#E5D8CE',
        headingColor: '#424242',
        mainTextColor: '#424242',
        subTextColor: '#3F3935',
      };

      setColors(context1InitialState);
    }
  };

   //updateFonts function will update fonts to all screens through Context

   const updateFonts = arrFonts => {
    if (arrFonts.length) {
      fontsInitialState = {
        boldFont: arrFonts[0].boldFont,
        regularFont: arrFonts[0].regularFont,
      };
      setFonts(fontsInitialState);
    } else {
      // if user first time it will insert color theme into color_theme table in db also update app color theme
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO fonts_table(boldFont,regularFont) VALUES (?,?)',
          ["Mofista","Mofista"],
          (tx, results) => {
            console.log('Results11111111', results.rowsAffected);
            if (results.rowsAffected > 0) {
              console.log('Fonts .......Data inserted');
            }
          },
        );
      });

      fontsInitialState = {
        boldFont: arrFonts[0].boldFont,
        regularFont: arrFonts[0].regularFont,
      };
      setFonts(fontsInitialState);
    }
  };

  //setBackgroundColorValue function update colors to all screens through Context
  function setBackgroundColorValue(
    backgroundColor,
    cardColor,
    headingColor,
    mainTextColor,
    subTextColor,
  ) {
    setColors({
      backgroundColor,
      cardColor,
      headingColor,
      mainTextColor,
      subTextColor,
    });
  }

  const contextColorSetters = {
    setBackgroundColorValue,
  };


   //setBackgroundColorValue function update colors to all screens through Context
   function setFontsValue(
    boldFont,
    regularFont,
  ) {
    setFonts({
      boldFont,
    regularFont,
    });
  }

  const contextFontsSetters = {
    setFontsValue,
  };

  return (
   <>
     <StatusBar barStyle="dark-content" backgroundColor="red" />
      <AuthContext.Provider value={{...colors, ...contextColorSetters,...fonts,...contextFontsSetters,isLoading,setIsLoading}}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            {/* SplashScreen which will come once for 5 Seconds */}
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              // Hiding header for Splash Screen
              options={{headerShown: false}}
            />
            {/* Auth Navigator: Include Login and Signup */}
            <Stack.Screen
              name="Auth"
              component={Auth}
              options={{headerShown: false}}
            />
            {/* Navigation Drawer as a landing page */}
            <Stack.Screen
              name="DrawerNavigationRoutes"
              component={DrawerNavigatorRoutes}
              // Hiding header for Navigation Drawer
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
      </>
  );
}

export default App;
