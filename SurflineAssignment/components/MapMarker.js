import { StyleSheet, View } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { UniversalText } from './UniversalText';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { CheckFavourite } from './dataManager';
import styles from '@/assets/styles';

/**
 * A custom map markerr
 * @param {*} location A json entry containing the location data 
 */
export default function MapMarker({location}){
  const [favourited, setFavourited] = useState(false)

  useEffect(() => {
    (async () => {
      setFavourited(await CheckFavourite(location.id))
    })();
  }, [])

  return(
    <Marker anchor={{ x: 0.4, y: 0 }}
        coordinate={{latitude: location.latitude, longitude: location.longitude}} 
        onCalloutPress={() => router.push({pathname: '/(tabs)/surfLocationInfo', params: {locationID: location.id}})}>
        {(favourited == true)? 
        <View style={{flex: 1}}>
          <Ionicons name='add-circle' size={35} style={{position: 'absolute'}} color={'white'}/>
          <View style={{position: 'absolute', width: 35, height: 35, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name='star' size={25}  color={'orange'}/>
          </View>
        </View> : 
        <View style={{flex: 1}}>
        <FontAwesome5 name='map-marker' size={35} style={{position: 'absolute'}} color={'black'}/>
        </View>}
        <Callout style={{width:150, flex: -1, position: 'absolute'}} tooltip={true}>
          <View style={{width: '100%', backgroundColor: 'white', borderRadius: 15, padding: 5, borderColor: 'black', borderWidth: 2}}>
            <UniversalText type='defaultBold'>{location.name}</UniversalText>
            <View style={[styles.blackButton, {height: 30, alignSelf: 'center', width: '90%'}]}>
                <UniversalText style={{color: 'white', fontWeight: '500'}}>View Info</UniversalText>
            </View>
          </View>
        </Callout>
    </Marker>
  ); 
} 