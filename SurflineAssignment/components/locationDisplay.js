import { View, StyleSheet, Pressable } from "react-native"
import { UniversalText } from "@/components/UniversalText";
import { router } from 'expo-router';
import { GetLocationData, GetSurfHeights } from '@/APIExampleFiles/API';
import { useEffect, useState } from "react";
import { LoadSettingValue } from '@/components/dataManager'

/**
 * The display for a favourited location
 * @param {number} arg A number to do something to.
 */
export default function LocationDisplay({locationID})
{
  const [surfHeights, SetSurfHeights] = useState(null)
  const [surfHeightUnit,  SetSurfHeightUnit]  = useState("m")

  useEffect(() => {
    (async () => {
      SetSurfHeights(await GetSurfHeights(locationID))
      var surfHeightUnit = await LoadSettingValue("surf_height_unit")
      if(surfHeightUnit != null)
        SetSurfHeightUnit(surfHeightUnit)
    })();
  }, [])

  function CreateSurfHeights()
  {
    var heights = []
    //start at 12 as it is midday
    for(var i = 12; i < 5 * 24; i+= 24)
    {
      var surfHeight = "--"

      if(surfHeights != null)
      {
        surfHeight = surfHeights.hours[i].waveHeight[Object.keys(surfHeights.hours[i].waveHeight)[0]]
        if(surfHeightUnit == "ft")
          surfHeight = parseFloat(surfHeight) / 0.3048
        surfHeight = parseFloat(surfHeight).toFixed(2)//round to 2 decimal points
        surfHeight += surfHeightUnit
      }

      heights.push(<View style={localStyles.swellRangeContainer} key={i}>
                    <UniversalText type="smallBold">{surfHeight}</UniversalText>
                    <View style={localStyles.condition}/>
                  </View>)
    }
    return heights
  }
  
  var location = GetLocationData(locationID)
  return(
    <Pressable style={({pressed}) => [{backgroundColor : pressed ? '#f3f3f3' : 'white'}, localStyles.display]} 
    onPress={() => router.push({pathname: '/(tabs)/surfLocationInfo', params: {locationID: locationID}})}>
      <UniversalText type='subtitle' style={{paddingLeft: 5}}>{location.name}</UniversalText>
      <View style={localStyles.heightsContainer}>
        {CreateSurfHeights()}
      </View>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
  condition: {
    backgroundColor: '#E2E3E4', 
    borderRadius: 15,
    width: '90%',
    height: 7
  },
  heightsContainer: {
    flex : 0, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 5
  },
  display : {
    height: 100, 
    borderRadius: 20, 
    margin: 0, 
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    justifyContent: 'space-between',
    elevation: 5,
    marginBottom: 10, 
    width: '95%', 
    alignSelf: 'center'
  },
  swellRangeContainer: {
    width: 65,
    alignItems: 'center',
    width: '20%'
  }
  });
  