import { View, ScrollView, Pressable } from 'react-native';
import { UniversalText } from '@/components/UniversalText';
import { DateDisplay } from '../../components/dateDisplayItem';
import IconButton from '@/components/IconButton';
import { router, useLocalSearchParams } from 'expo-router';
import { GetLocationData, GetLocationSurfingConditions, GetLocationSunriseTimes } from '@/APIExampleFiles/API';
import { AddFavourite, CheckFavourite } from '@/components/dataManager';
import { useEffect, useState } from 'react';
import styles from '../../assets/styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapView, { Marker } from 'react-native-maps';
import SurfConditionsDisplay from '../../components/surfConditionDisplay';
import { LoadSettingValue } from '@/components/dataManager'

/**
 * This screen contains all the information for individual surfing locations
 * e.g., windspeed, weather, etc., for bournemouth beach 
 * @param 
 */
export default function SurfLocation() {
  const [selectedDate, SetDate] = useState(new Date())
  const [isFavourited, SetFavourited] = useState(false)

  const [surfConditionsDetails, SetSurfConditionsDetails] = useState(null)
  const [sunTimes, SetSunTimes] = useState(null)
  const [surfHeightUnit,  SetSurfHeightUnit]  = useState("m")
  
  const [selectedTab, SetSelectedTab] = useState(0)

  var location = GetLocationData(useLocalSearchParams()['locationID'])
  
  //Fetch and cache all the API data
  useEffect(() => {
    (async () => {
      SetFavourited(await CheckFavourite(location.id))
      SetSurfConditionsDetails(await GetLocationSurfingConditions(location.id))
      SetSunTimes(await GetLocationSunriseTimes(location.id))
      var surfHeightUnit = await LoadSettingValue("surf_height_unit")
      if(surfHeightUnit != null)
        SetSurfHeightUnit(surfHeightUnit)
    })();
  }, [])

  /**
   * Create 10 date display components with the dates
   * @returns A list containing a collection of all the displays for the dates ay
   */
  function CreateDateDisplays()
  {
    var dates = []
    for(var i = 0; i < 10; i++)
    {
      var date = ""
      var currentDate = new Date();
      if(i == 0)
      {
        date = "Today"
      }
      else
      {
        currentDate.setDate(currentDate.getDate() + i);
        date = currentDate.toLocaleDateString('en-US', {weekday: 'short'})
      }

      var surf = "--"
      if(surfConditionsDetails != null)
      {
        surf = surfConditionsDetails.hours[i * 24 + 12].waveHeight[Object.keys(surfConditionsDetails.hours[i * 24 + 12].waveHeight)[0]]
                + surfHeightUnit;
      }
      //clone current date for the onpress event
      const dateForPressEvent = new Date(currentDate);
      var selected = false
      if(dateForPressEvent.getDate() == selectedDate.getDate())
        selected = true

      dates.push(
        <DateDisplay
          date={date + " " + currentDate.getDate() + "." + (currentDate.getMonth() + 1)}
          onPress={() => SetDate(dateForPressEvent)}
          surfHeight={surf}
          key={i}
          selected = {selected}
        />
      );
    }
    return dates
  }

  /**
   * Fetches all the surf data from the selected date and creates a surf display component
   * @returns The initialised surf display
   */
  function CreateSurfDisplay()
  {
    var data = []
    if(surfConditionsDetails != null)
    {
      var currentDate = new Date()
      var utc1 = Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      var utc2 = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const MillisecsInDay = 1000 * 60 * 60 * 24
      var dayDifference = Math.floor((utc1 - utc2 ) / MillisecsInDay)

      for(var i = dayDifference * 24; i < dayDifference * 24 + 24; i += 3)
      {
        data.push(surfConditionsDetails.hours[i])
      }
    }
    return <SurfConditionsDisplay data={data} callback={UpdateSelectedTab}/>
  }


  function UpdateSelectedTab(index)
  {
    SetSelectedTab(index)
  }

  /**
   * Creates the left hand column of the conditions display that contains times in 3 hour intervals
   * @returns the time column
   */
  function CreateTimeColumn()
  {
    var times = []
    var time = 0
    for(var i = 0; i < 8; i++)
    {
      times.push(
        <View key={i} style={{flex: 1,
          height: 70,
          marginBottom : 0,
          flexDirection: 'row',
          borderColor: '#E2E3E4',
          borderBottomWidth: 1,}}>
          <View style={{width: '5%', justifyContent: 'center'}} key={i}>
            <UniversalText type="smallBold" numberOfLines={1} style={{transform: [{ rotate: '-90deg' }], 
            width: 40, marginLeft : -12,textAlign: 'center',}}>{(time < 10? '0': '') + time + ':00'}</UniversalText>
          </View>
        </View>)
      time += 3
    }
    return times
  }

  /**
   * Create the UI element for sunrise and sunset for the date that has been selected
   * @returns A UI element containing: first light, surnrise, sunset and last light
   */
  function CreateSunTimes()
  {
    var sunrise = "--"
    var sunset = "--"
    var firstLight = "--"
    var lastLight = "--"

    if(sunTimes != null)
    {
      var dateFound = false
      var dateToFind = selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-" + selectedDate.getDate()
      for(var i = 0; i < sunTimes.results.length && !dateFound; i++)
      {
        if(sunTimes.results[i].date == dateToFind)
        {
          dateFound = true
          sunrise    = sunTimes.results[i].sunrise.substring(0, 5)
          sunset     = sunTimes.results[i].sunset.substring(0, 5)
          firstLight = sunTimes.results[i].first_light.substring(0, 5)
          lastLight  = sunTimes.results[i].last_light.substring(0, 5)
        }
      }
    }

    return (<View style={{flexDirection:'row', justifyContent: 'space-between', margin: 5}} key={0}>
      <View style={{flexDirection: 'row'}}>
        <View style={{alignItems: 'center'}}> 
          <Ionicons name='arrow-up' size={20}/>
          <Ionicons name='sunny-outline' size={28}/>
        </View>
        <View>
          <UniversalText>Sunrise: {sunrise}</UniversalText>
          <UniversalText>First Light: {firstLight}</UniversalText>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={{alignItems: 'center'}}>
          <Ionicons name='arrow-down' size={20}/>
          <Ionicons name='sunny-outline' size={28}/>
        </View>
          <View>
            <UniversalText>Sunset: {sunset}</UniversalText>
            <UniversalText>Last Light: {lastLight}</UniversalText>
          </View>
      </View>
    </View>)
  }

  
  return(
      <View style={styles.parentContainer}>
          <View style={styles.headingContainer}>
              <IconButton iconName='arrow-back' onPress={() => router.back()}/>
              <UniversalText type='title' style={styles.title}>{location.name}</UniversalText>
              <IconButton iconName={isFavourited == true ? 'star' : 'star-outline'}  size={30}
              style={isFavourited == true ? {color: 'orange'} : {color : 'black'}}
              onPress={() => {SetFavourited(!isFavourited), AddFavourite(location.id); }}/>
          </View>
          <View style={styles.contentContainer}>
            <View style={{height: '25%'}}>
              <UniversalText type='subtitle' style={{margin: 10}}>10 Day Forecast</UniversalText>
              <ScrollView horizontal={true} persistentScrollbar={true}>
                {CreateDateDisplays()}
              </ScrollView>
            </View>
            <View style={{borderColor: '#E2E3E4', borderTopWidth: 2, marginTop: 10, width: '100%', flex: 1}}>
              <View style={{ elevation: 5 }}>
                <UniversalText type='subtitle' style={{marginTop: 5, marginLeft: 5}}>{selectedDate.toLocaleDateString('en-US', {weekday: 'long'})} {selectedDate.getDate()}.{selectedDate.getMonth() + 1}</UniversalText>
              </View>
              <ScrollView>
                <View style={{flex: 1, flexDirection: 'row', height: 500}}>
                  <View style={{flexDirection: 'column'}}>
                    <View style={{height: 35, borderColor: '#E2E3E4',
                        borderWidth: 1,}}/>
                    {CreateTimeColumn()}
                  </View>
                  {CreateSurfDisplay()}
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Ionicons name={selectedTab == 0 ? 'radio-button-on' : 'radio-button-off'} size={20}/>
                  <Ionicons name={selectedTab == 1 ? 'radio-button-on' : 'radio-button-off'} size={20}/>
                  <Ionicons name={selectedTab == 2 ? 'radio-button-on' : 'radio-button-off'} size={20}/>
                </View>
                <View>
                  {CreateSunTimes()}
                  </View>
                <View>
                  <MapView liteMode style={{height : 250, width: '95%', alignSelf: 'center', marginVertical: 10}}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta : 0.25,
                    longitudeDelta: 0.25
                  }}
                  provider='google' googleMapId='a3bc5006ad33717e'
                  >
                    <Marker coordinate={{latitude: location.latitude, longitude: location.longitude}}/>
                  </MapView>
                  <Pressable style={{backgroundColor : 'black', borderRadius: 20, height: 50, alignSelf: 'center', width: '90%',
                    justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 15}}
                    onPress={() => router.push({pathname: '/(tabs)/explore', params: {locationID: location.id}})}>
                    <UniversalText style={{color: 'white', fontWeight: '500'}}>View Location on Map</UniversalText>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
      </View>
  );
}