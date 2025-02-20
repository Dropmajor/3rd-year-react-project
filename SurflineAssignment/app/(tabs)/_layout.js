import { Tabs } from 'expo-router';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * 
 * @returns 
 */
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'black'}} backBehavior="history">
      <Tabs.Screen name="index"
        options={{
          unmountOnBlur: true,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={28} style={[{ marginBottom: -3 }, color={color}]}/>
          ),
        }}
      />
      <Tabs.Screen name="explore"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={28} style={[{ marginBottom: -3 }, color={color}]}/>
             
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={28} style={[{ marginBottom: -3 }, color={color}]}/>
          ),
        }}
      />
      <Tabs.Screen
        name="locationSearch"
        options={{
          unmountOnBlur: true,
          href: null,
          headerShown: false,
          tabBarStyle: { display: 'none'}
        }}
      />
      <Tabs.Screen
        name="surfLocationInfo"
        options={{
          unmountOnBlur: true,
          href: null,
          headerShown: false,
          tabBarStyle: { display: 'none'}
        }}
      />
    </Tabs>
  );
}
