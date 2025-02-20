import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location'
import CustomMarker from '../../components/MapMarker'
import { GetAllLocations, GetLocationData} from '@/APIExampleFiles/API'
import { useLocalSearchParams } from 'expo-router';

/**
 * This is the map tab of the app.
 */
export default function surfLocationMap() {

  const [zoomLevel, updateZoomLevel] = useState(50);
  const mapRef = useRef(null);
  const passedLocationID = useLocalSearchParams()['locationID']

  //zoom in on the users location or a surf location if it was passed in
  useEffect(() => {
    (async () => {
        try{
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        if(location?.coords && passedLocationID == null)
        {
          const latitude = parseFloat(location.coords.latitude);
          const longitude = parseFloat(location.coords.longitude);
          // Gradually animate map to user position
          const region = {
            latitudeDelta: 0.25,
            longitudeDelta: 0.25,
            latitude,
            longitude,
          };
          mapRef.current?.animateToRegion(region, 1000);
        }
        else if(passedLocationID != null)
        {
          let location = GetLocationData(passedLocationID)
          const region = {
            latitudeDelta: 0.25,
            longitudeDelta: 0.25,
            latitude: location.latitude,
            longitude: location.longitude,
          };
          mapRef.current?.animateToRegion(region, 1000);
        }
      }
      catch{
      }
    })();
  }, []);

  /**
   * Create all the map markers for each surfing location.
   * @returns A list consisting of custom marker components. These are mapped to each location in the json file
   */
  function createMarkers()
  {
    var markers = []
      var surfSpots = GetAllLocations();
      for(var i = 0; i < surfSpots.length; i++)
      {
        if(zoomLevel < 5)
        {
          markers.push(<CustomMarker locationID={surfSpots[i].id} latitude={surfSpots[i].latitude} 
            longitude={surfSpots[i].longitude} location={surfSpots[i]}
            showFull={(zoomLevel < 1? true: false)} key={i}/>)
        }
      }
    return markers;
  }

  return (
    <View style={localStyles.container}>
      <MapView style={localStyles.map}ref={mapRef} initialRegion={{
        latitude: 40,
        longitude: 0,
        longitudeDelta: 50,
        latitudeDelta: 50,
      }}
      showsUserLocation={true}
      provider='google' googleMapId='a3bc5006ad33717e'
      showsMyLocationButton={true}
      onRegionChangeComplete={async (region) => {
        updateZoomLevel((region.latitudeDelta + region.longitudeDelta)/2)
      }}>
        {createMarkers()}
      </MapView>
      <View style={localStyles.buttonContainer}>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    position: "absolute", 
    bottom: 50
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
