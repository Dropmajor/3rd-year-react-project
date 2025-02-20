import { View, StyleSheet } from "react-native";
import { UniversalText } from '@/components/UniversalText';
import Ionicons from '@expo/vector-icons/Ionicons';
import PagerView from 'react-native-pager-view';
import { useEffect, useState } from 'react';
import { LoadSettingValue } from '@/components/dataManager'

/**
 * This element is used to 
 * @param {*} data the conditions data set to display
 * @param {*} callback function to call when a new tab is selected
 * @returns 
 */
export default function SurfConditionsDisplay({data, callback})
{
  const [windSpeedUnit,   SetWindSpeedUnit]   = useState("kts")
  const [swellHeightUnit, SetSwellHeightUnit] = useState("m")
  const [surfHeightUnit,  SetSurfHeightUnit]  = useState("m")
  const [temperatureUnit, SetTemperatureUnit] = useState("c")

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
    }, [])

  function ConvertSurfUnit(value)
  {
      var convertedValue = value
      
      if(surfHeightUnit == "ft")
      {
          convertedValue *= 0.3048
      }

      return parseFloat(convertedValue).toFixed(2)
  }

  function ConvertSwellUnit(value)
  {
      var convertedValue = value
      
      if(swellHeightUnit == "ft")
      {
          convertedValue /= 0.3048
      }

      return parseFloat(convertedValue).toFixed(2)
  }
  
  function ConvertTemperatureUnit(value)
  {
      var convertedValue = value

      if(temperatureUnit == "f")
      {
          convertedValue = convertedValue * 1.8 + 32
      }

      return parseFloat(convertedValue).toFixed(1)
  }

  function ConvertWindSpeedUnit(value)
  {
      //default windspeed is in mps
      var convertedValue = value * 3.6

      if(windSpeedUnit == "kts")
      {
          convertedValue *= 0.5399565
      }
      else if(windSpeedUnit == "mph")
      {
          convertedValue *= 0.6213712
      }

      return parseFloat(convertedValue).toFixed(0)
  }

  //#region page creation functions
  //The following three functions create each page in the pagination from the data that was passed in
  function CreateFirstPageConditionDisplays()
  {
    var conditions = []
    for(var i = 0; i < data.length; i++)
    {
        var surf = ConvertSurfUnit(data[i].waveHeight[Object.keys(data[i].waveHeight)[0]])
        var swellPeriod = ConvertSwellUnit(parseFloat(data[i].swellPeriod[Object.keys(data[i].swellPeriod)[0]]).toFixed(1))
        var swellDirection = parseFloat(data[i].swellDirection[Object.keys(data[i].swellDirection)[0]]).toFixed(0)
        var windDirection = parseFloat(data[i].windDirection[Object.keys(data[i].windDirection)[0]]).toFixed(0)
        var windSpeed = ConvertWindSpeedUnit(parseFloat(data[i].windSpeed[Object.keys(data[i].windSpeed)[0]]))

        conditions.push(
        <View style={localStyles.conditionContainer} key={i}>
            <View style={localStyles.conditionsDataColumn}>
                <UniversalText type="defaultBold">{surf}{surfHeightUnit}</UniversalText>
            </View>
            <View style={localStyles.conditionsDataColumn}>
                <UniversalText style={{width: 45}} type="defaultBold">{swellPeriod}s</UniversalText>
                <View style={localStyles.dataContainer}>
                    <Ionicons size={25} style={[localStyles.arrowIcon, {transform: [{rotate: (swellDirection + 'deg')}],}]} 
                      name='arrow-up' />
                    <UniversalText type="small" style={{color: 'grey'}}>{swellDirection}°</UniversalText>
                </View>
            </View>
            <View style={localStyles.conditionsDataColumn}>
                <UniversalText style={{width: 75}} type="defaultBold">{windSpeed}{windSpeedUnit}</UniversalText>
                <View style={[localStyles.dataContainer, , localStyles.groupDataContainer, {backgroundColor: '#E2E3E4', borderRadius: 10,}]}>
                    <Ionicons size={25} style={[localStyles.arrowIcon, { 
                    transform: [{rotate: windDirection + 'deg'}]
                    ,}]} name='arrow-up' />
                    <UniversalText>{GetCompassUnit(windDirection)}</UniversalText>
                </View>
            </View>
        </View>
        )
    }

    return conditions
  }

  function CreateSecondPageConditionDisplays()
  {
    var conditions = []
    for(var i = 0; i < data.length; i++)
    {
        var primarySwellHeight      = ConvertSwellUnit(parseFloat(data[i].waveHeight[Object.keys(data[i].waveHeight)[0]]).toFixed(1))
        var primarySwellPeriod      = parseFloat(data[i].swellPeriod[Object.keys(data[i].swellPeriod)[0]]).toFixed(1)
        var primarySwellDirection   = parseFloat(data[i].swellDirection[Object.keys(data[i].swellDirection)[0]]).toFixed(0)
        var secondarySwellHeight    = ConvertSwellUnit(parseFloat(data[i].secondarySwellHeight[Object.keys(data[i].secondarySwellHeight)[0]]).toFixed(1))
        var secondarySwellPeriod    = parseFloat(data[i].secondarySwellPeriod[Object.keys(data[i].secondarySwellPeriod)[0]]).toFixed(1)
        var secondarySwellDirection = parseFloat(data[i].secondarySwellDirection[Object.keys(data[i].secondarySwellDirection)[0]]).toFixed(0)
        conditions.push(
        <View style={localStyles.conditionContainer} key={i}>
            <View style={[localStyles.conditionsDataColumn, {width: '50%', justifyContent: 'space-evenly'}]}>
                <UniversalText type="defaultBold">{primarySwellHeight}{swellHeightUnit}</UniversalText>
                <UniversalText type="defaultBold">{primarySwellPeriod}s</UniversalText>
                <View style={[localStyles.dataContainer, localStyles.groupDataContainer, {alignContent: 'center', }]}>
                    <Ionicons size={25} style={[localStyles.arrowIcon, {transform: [{rotate: (primarySwellDirection + 'deg')}],}]} 
                      name='arrow-up' />
                    <UniversalText type="small" style={{color: 'grey'}}>{primarySwellDirection}°</UniversalText>
                </View>
            </View>
            <View style={[localStyles.conditionsDataColumn, {width: '50%', justifyContent: 'space-evenly'}]}>
                <UniversalText type="defaultBold">{secondarySwellHeight}</UniversalText>
                <UniversalText type="defaultBold">{secondarySwellPeriod}s</UniversalText>
                <View style={[localStyles.dataContainer, localStyles.groupDataContainer, {alignContent: 'center', }]}>
                    <Ionicons size={25} style={[localStyles.arrowIcon, {transform: [{rotate: (secondarySwellDirection + 'deg')}],}]} 
                      name='arrow-up' />
                    <UniversalText type="small" style={{color: 'grey'}}>{secondarySwellDirection}°</UniversalText>
                </View>
            </View>
        </View>)
    }

    return conditions
  }

  function CreateThirdPageConditionDisplays()
  { 
    var conditions = []

    for(var i = 0; i < data.length; i++)
    {
        var cloudCover = parseFloat(data[i].waveHeight[Object.keys(data[i].waveHeight)[0]])
          var temperature =ConvertTemperatureUnit(parseFloat(data[i].swellPeriod[Object.keys(data[i].swellPeriod)[0]]).toFixed(1))
          var airPressure = ConvertSwellUnit(parseFloat(data[i].swellDirection[Object.keys(data[i].swellDirection)[0]]).toFixed(0))
          var precipitation = data[i].precipitation[Object.keys(data[i].precipitation)[0]]
        var weatherSymbol

        if(cloudCover > 0.75)
        weatherSymbol = <Ionicons name="cloud" size={24} color="grey"/>
        else if(cloudCover > 0.30)
        weatherSymbol = <Ionicons name="partly-sunny" size={24} color="grey"/>
        else
        weatherSymbol = <Ionicons name="sunny" size={24} color="orange"/>

        conditions.push(<View style={localStyles.conditionContainer} key={i}>
            <View style={localStyles.conditionsDataColumn}>
              {weatherSymbol}
              <UniversalText style={{width: 55}} type="defaultBold">{temperature}°{temperatureUnit}</UniversalText>
            </View>
            <View style={localStyles.conditionsDataColumn}>
              <UniversalText type="defaultBold">{airPressure}mpa</UniversalText>
            </View>
            <View style={localStyles.conditionsDataColumn}>
              <UniversalText style={{width: 75}} type="defaultBold">{precipitation}mm</UniversalText>
            </View>
        </View>)
    }

    return conditions
  }
  //#endregion

  /**
   * Fetch a string value to represent a bearing in degrees
   * @param {*} heading The bearing in degrees
   * @returns A string value containing the string representation of the bearing
   */
  function GetCompassUnit(heading)
  {
    var unit = ""

    if(heading == "--")
        unit = "--"
    else if(heading < 30 || heading > 330)
      unit = "N"
    else if(heading <= 210 && heading >= 150)
      unit= "S"
    else if(heading > 210)
    {
      if(heading < 240)
        unit = "SW"
      else if (heading >= 240 && heading < 300)
        unit = "W"
      else 
        unit = "NW"
    }
    else
    {
      if(heading > 120)
        unit = "SE"
      else if (heading <= 120 && heading > 60)
        unit = "E"
      else 
        unit = "NE"
    }
    return unit
  }

  /**
   * Call the passed in callback so that the ui element for the tab index can be updated
   * @param {*} tabNumber The new selected tab index
   */
  function TabChange(tabNumber)
  {
    callback(tabNumber)
  }

    return (
    <PagerView style={{height: 500, flex: 1}} initialPage={0} onPageSelected={(e) => TabChange(e.nativeEvent.position)}>
        <View key="1">
            <View style={localStyles.tableHeader}>
                <UniversalText style={localStyles.conditionsHeader}>Surf ({surfHeightUnit})</UniversalText>
                <UniversalText style={localStyles.conditionsHeader}>Swell</UniversalText>
                <UniversalText style={localStyles.conditionsHeader}>Wind ({windSpeedUnit})</UniversalText>
            </View>
            {CreateFirstPageConditionDisplays()}
        </View>
        <View key="2">
            <View style={localStyles.tableHeader}>
                <UniversalText style={[localStyles.conditionsHeader, {width: '50%'}]}>Primary Swell</UniversalText>
                <UniversalText style={[localStyles.conditionsHeader, {width: '50%'}]}>Secondary Swell</UniversalText>
            </View>
            {CreateSecondPageConditionDisplays()}
        </View>
        <View key="3">
            <View style={localStyles.tableHeader}>
                <UniversalText style={localStyles.conditionsHeader}>Weather</UniversalText>
                <UniversalText style={localStyles.conditionsHeader}>Pressure</UniversalText>
                <UniversalText style={localStyles.conditionsHeader}>Precipitation</UniversalText>
            </View>
            {CreateThirdPageConditionDisplays()}
        </View>
    </PagerView>)
}

const localStyles = StyleSheet.create({
    conditionContainer : {
        flex: 1,
        height: 70,
        marginBottom : 0,
        flexDirection: 'row',
        borderColor: '#E2E3E4',
        borderBottomWidth: 1,
    },
    column : {
        borderLeftWidth: 1,
        borderColor: '#E2E3E4',
        width: '32%',
        height: '90%',
        justifyContent : 'center',
        alignItems : 'center',
        alignSelf: 'center',
        flexDirection: 'row'
    },
    conditionsDataColumn: {
        borderLeftWidth: 1,
        borderColor: '#E2E3E4',
        width: '32%',
        height: '90%',
        justifyContent : 'center',
        alignItems : 'center',
        alignSelf: 'center',
        flexDirection: 'row'
    },
    conditionsHeader: {
        width: '32%',
        borderLeftWidth: 1,
        borderColor: '#E2E3E4',
        textAlign : 'center',
        height: '90%'
    },
    tableHeader: {
        flex: 0, 
        flexDirection : 'row', 
        borderColor: '#E2E3E4',
        borderWidth: 1, height: 35,
    },
    arrowIcon : {
      width: 25, 
      height: 25, 
      alignSelf: 'center', 
    },
    dataContainer : {
      flexDirection: 
      'column', margin: 5
    },
    groupDataContainer : {
      width: 40, 
      justifyContent: 'center', 
      alignItems: 'center'
    }
});  