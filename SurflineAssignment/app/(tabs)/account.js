import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import { UniversalText } from '@/components/UniversalText';
import { LoadSettingValue, SetSettingValue } from '@/components/dataManager'
import { useState, useEffect } from 'react';
import styles from '../../assets/styles';
import Dropdown from '../../components/dropdown';
import Ionicons from '@expo/vector-icons/Ionicons';

/**
 * The account page
 * @returns 
 */
export default function Account()
{
  //#region App setting values
  const appColourModes = [
    {label: 'Light Mode', value: 'light'},
    {label: 'Dark Mode', value: 'dark'}
  ]

  const speedUnits = [
    {label: 'Kilometres per hour', value: 'kph'},
    {label: 'Miles per Hour', value: 'mph'},
    {label: 'Knots', value: 'kts'}
  ]

  const measurementUnits = [
    {label: 'Metres (m)', value: 'm'},
    {label: 'Feet (ft)', value: 'ft'}
  ]

  const temperatureUnits = [
    {label: 'Celsius (°C)', value: 'c'},
    {label: 'Farenheit (°F)', value: 'f'}
  ]

  const [appColourMode,   SetColourMode]      = useState(appColourModes[0].value)
  const [windSpeedUnit,   SetWindSpeedUnit]   = useState(speedUnits[0].value)
  const [swellHeightUnit, SetSwellHeightUnit] = useState(measurementUnits[0].value)
  const [surfHeightUnit,  SetSurfHeightUnit]  = useState(measurementUnits[0].value)
  const [tideHeightUnit,  SetTideHeightUnit]  = useState(measurementUnits[0].value)
  const [temperatureUnit, SetTemperatureUnit] = useState(temperatureUnits[0].value)

  useEffect(() => {
    (async () => {
      var windSpeedUnit = await LoadSettingValue("wind_speed_unit")
      if(windSpeedUnit != null)
        SetWindSpeedUnit(windSpeedUnit)

      var swellHeightUnit = await LoadSettingValue("swell_height_unit")
      if(swellHeightUnit != null)
        SetSwellHeightUnit(swellHeightUnit)

      var surfHeightUnit = await LoadSettingValue("surf_height_unit")
      if(surfHeightUnit != null)
        SetSurfHeightUnit(surfHeightUnit)

      var tideHeightUnit = await LoadSettingValue("tide_height_unit")
      if(tideHeightUnit != null)
        SetTideHeightUnit(tideHeightUnit)

      var temperatureUnit = await LoadSettingValue("temperature_unit")
      if(temperatureUnit != null)
        SetTemperatureUnit(temperatureUnit)
    })();
  }, []);
  //#endregion

  function UpdateUserSetting(setting, newValue)
  {
    SetSettingValue(setting, newValue);
  }
  
  return(
    <View style={styles.parentContainer}>
      <View style={styles.headingContainer}>
          <UniversalText type='title' style={styles.title}>Account</UniversalText>
      </View>
      <View style={[styles.contentContainer, {margin: 10}]}>
      <ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 70, height: 70}}>
            <Ionicons name='person-circle' size={70} style={{position: 'absolute'}} color={'grey'}/>
          </View>
          <View>
            <UniversalText type='defaultBold'>ExampleUser@Yahoo.com</UniversalText>
            <UniversalText>Free member</UniversalText>
          </View>
        </View>
        
        <Pressable style={[styles.blackButton, {height: 40, marginVertical: 10, width: '40%',}]}>
          <UniversalText style={{color: 'white', fontWeight: '500'}}>Start Free Trail</UniversalText>
        </Pressable>
        <UniversalText type='subtitle' style={localStyles.optionsCategory}>App Settings</UniversalText>
          <View style={localStyles.optionView}>
            <UniversalText type="default" style={localStyles.optionText}>App Colour</UniversalText>
            <Dropdown options={appColourModes} 
            selectedValue={appColourMode}  
            onChange={(value) => {UpdateUserSetting("app_colour_mode", value); SetColourMode(value)}}/>
          </View>
          <UniversalText type="default">Offline Data Settings</UniversalText>
          <UniversalText type='subtitle' style={localStyles.optionsCategory}>Unit Settings</UniversalText>
          <View style={localStyles.optionView}>
            <UniversalText type="default" style={localStyles.optionText}>Wind Speed</UniversalText>
            <Dropdown options={speedUnits} 
            selectedValue={windSpeedUnit} 
            onChange={(value) => {UpdateUserSetting("wind_speed_unit", value); SetWindSpeedUnit(value)}}/>
          </View>
          <View style={localStyles.optionView}>
            <UniversalText type="default" style={localStyles.optionText}>Swell Height</UniversalText>
            <Dropdown options={measurementUnits} 
            selectedValue={swellHeightUnit} 
            onChange={(value) => {UpdateUserSetting("swell_height_unit", value), SetSwellHeightUnit(value)}}/>
          </View>
          <View style={localStyles.optionView}>
            <UniversalText type="default" style={localStyles.optionText}>Surf Height</UniversalText>
            <Dropdown options={measurementUnits} 
            selectedValue={surfHeightUnit} 
            onChange={(value) => {UpdateUserSetting("surf_height_unit", value); SetSurfHeightUnit(value)}}/>
          </View>
          <View style={localStyles.optionView}>
            <UniversalText type="default" style={localStyles.optionText}>Tide Height</UniversalText>
            <Dropdown options={measurementUnits} 
            selectedValue={tideHeightUnit} 
            onChange={(value) => {UpdateUserSetting("tide_height_unit", value); SetTideHeightUnit(value)}}/>
          </View>
          <View style={localStyles.optionView}>
            <UniversalText type="default" style={localStyles.optionText}>Temperature</UniversalText>
            <Dropdown options={temperatureUnits} 
            selectedValue={temperatureUnit} 
            onChange={(value) => {UpdateUserSetting("temperature_unit", value); SetTemperatureUnit(value)}}/>
          </View>

          <UniversalText type='subtitle' style={localStyles.optionsCategory}>Customer Support</UniversalText>
          <UniversalText style={{marginBottom: 10}}>Help & Support</UniversalText>
          <UniversalText style={{marginBottom: 10}}>Privacy Policy</UniversalText>
          <UniversalText style={{marginBottom: 10}}>Terms of Use</UniversalText>
          <UniversalText style={{marginBottom: 10}}>Restore Google Play Subscription</UniversalText>
          <UniversalText style={{marginBottom: 10}}>Manage Data Consent</UniversalText>
          <UniversalText style={{marginBottom: 10}}>Data Sources</UniversalText>

          <Pressable style={{backgroundColor : '#fdeced', borderRadius: 10, height: 50, alignSelf: 'center', width: '90%',
            justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 30
          }}>
            <UniversalText style={{color: '#d20011', fontWeight: '500', marginRight: 10 }}>Sign Out</UniversalText>
            <Ionicons name='log-out-outline' style={{color: '#d20011'}} size={25}></Ionicons>
          </Pressable>
          </ScrollView>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  optionText : {
    alignSelf: 'center',
    width: 150
  },
  optionView : {
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 10
  },
  optionsCategory: {
    marginTop : 10,
    borderTopWidth : 0.5,
    borderColor : 'grey'
  }
})