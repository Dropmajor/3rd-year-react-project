import { StyleSheet, View, Pressable } from 'react-native';
import { UniversalText } from '@/components/UniversalText';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import IconButton from '@/components/IconButton'
import { AddFavourite, CheckFavourite } from '@/components/dataManager'
import { useState, useEffect } from 'react';

/**
 * Search list item for the location search. On press opens the surf location info page
 * @param {*} label The label to show on the item
 * @param {*} country The country to show on the item e.g, UK
 * @param {*} region The region to show for the item e.g, Dorset or Bayern
 * @param {*} locationID The id of the location to show info of when pressed
 * @param {*} search The current search input
 */
export function LocationListItem({ label, country, region, locationID, search})
{
  search = search.trim()
  const [favourited, SetFavourited] = useState(false)
  useEffect(() => {
    (async () => {
      try
      {
        SetFavourited(await CheckFavourite(locationID))
      }
      catch
      {

      }
    })();
  }, [])

  /**
   * This function uses the search query to bold the part of the item name that matches the search query that the user has entered so far
   * @returns 
   */
  function GetItemLabel()
  {
    var itemLabel
    if(label.substring(0, search.length) == search)
    {
      itemLabel = 
        <UniversalText style={[localStyles.buttonLabel, {color: 'grey', textAlign: 'left'}]}>
          <UniversalText style={localStyles.buttonLabel}>{label.substring(0, search.length)}</UniversalText>{label.substring(search.length)}</UniversalText>
    }
    else
    {
      var searchValIndex = label.toLowerCase().indexOf(" " + search.toLowerCase())
      itemLabel = 
        <UniversalText style={[localStyles.buttonLabel, {color: 'grey', textAlign: 'left'}]}> 
          {label.substring(0, searchValIndex)}
            <UniversalText style={localStyles.buttonLabel}>{label.substring(searchValIndex, searchValIndex + search.length + 1)}
            </UniversalText>{label.substring(searchValIndex + search.length + 1)}</UniversalText>
    }

    return itemLabel
  }

  return(
    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#E7E7E7' : 'white' }, localStyles.button]} 
    onPress={() => router.push({pathname: '/(tabs)/surfLocationInfo', params: {locationID: locationID}})}>
      <View style={localStyles.itemContainer}>
        <View style={localStyles.labelContainer}>
          {GetItemLabel()}
          <UniversalText style={[localStyles.buttonLabel, {color: 'grey', textAlign: 'left'}]}>{country}/{region}</UniversalText>
        </View>
        <View style={localStyles.iconContainer}>
         <IconButton iconName={(favourited == false)? 'star-outline' : 'star'} onPress={() => {AddFavourite(locationID); SetFavourited(!favourited)}} size={25}/>
         <Ionicons name='chevron-forward' size={20}/>
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Component used to display region buttons e.g, Africa, asia etc
 * @param {*} label The label of the item
 * @param {*} onPress The action to carry out when pressed
 * @returns 
 */
export function RegionListItem({label, onPress})
{
  return(
    <Pressable style={({ pressed }) => [{ backgroundColor: pressed ? '#E7E7E7' : 'white', height: 50 }, localStyles.button]} 
    onPress={() => {onPress}}>
      <View style={localStyles.itemContainer}>
        <View style={localStyles.labelContainer}>
          <UniversalText style={[localStyles.buttonLabel, {textAlign: 'left'}]}>{label}</UniversalText>
        </View>
        <View style={localStyles.iconContainer}>
         <Ionicons name='chevron-forward' size={20}/>
        </View>
      </View>
    </Pressable>
  );
}

const localStyles = StyleSheet.create({
    button: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 2,
      borderColor: 'grey',
      borderBottomWidth: 1
    },
    buttonIcon: {
      paddingRight: 8,
    },
    buttonLabel: {
      color: 'black',
      fontSize: 14,
    },
    labelContainer: {
      flex: 0, flexDirection: 'column', justifyContent: 'space-between'
    },
    itemContainer : {
      flex: 1, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    },
    iconContainer: {
      flex: 0, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    }
  });
  