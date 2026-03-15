import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // CHANGED to Ionicons

import Login from '../screens/Login';
import Home from '../screens/Home';
import Courses from '../screens/Courses';
import CourseDetail from '../screens/CourseDetail';
import Profile from '../screens/Profile';
import Enrollments from '../screens/Enrollments';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Courses') {
          iconName = focused ? 'book' : 'book-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4f46e5',
      tabBarInactiveTintColor: 'gray',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={Home} 
      options={{
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen 
      name="Courses" 
      component={Courses}
      options={{
        tabBarLabel: 'Courses',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={Profile}
      options={{
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="CourseDetail" component={CourseDetail} />
      <Stack.Screen name="Enrollments" component={Enrollments} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
