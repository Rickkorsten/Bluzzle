import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-ionicons'

import HomeScreen from './screens/HomeScreen/HomeScreen'
import ChatsScreen from './screens/ChatsScreen/ChatsScreen'

export default createBottomTabNavigator({
  Home: { screen: HomeScreen,
   navigationOptions:{
     tabBarLabel: 'Home',
     tabBarIcon: ({tintColor}) => (
      <Icon ios="ios-home" android="md-home" size={24} />
     )
   }},
  Chats: { screen: ChatsScreen,
    navigationOptions:{
      tabBarLabel: 'Chat',
      tabBarIcon: ({tintColor}) => (
       <Icon ios="ios-chatboxes" android="ios-chatboxes" size={24} />
      )
    }}
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    justifyContent:'center'
  }
});

