import { View, FlatList, StyleSheet } from 'react-native';
import { UniversalText } from '@/components/UniversalText';
import LocationDisplay from '@/components/locationDisplay';
import { router } from 'expo-router';
import IconButton from '@/components/IconButton'
import { useEffect, useState } from 'react';
import { LoadFavourites } from '@/components/dataManager'
import styles from '../../assets/styles';

/**
 * The initial homescreen of the app
 */
export default function HomeScreen() {
  const [favouritedLocations, setFavouritedLocations] = useState(null)
  
  useEffect(() => {
    (async () => {
      setFavouritedLocations(await LoadFavourites())
    })();
  }, [])

  /**
   * Creates the dates shown at the top of the favourites list
   * @returns an array containing the dates
   */
  function GetDates()
  {
    var dates = []
    for(var i = 0; i < 5; i++)
    {
      var date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(
        <View key={i} style={{width: '20%'}}>
          <UniversalText type='small' style={{color: 'grey'}}>{date.toLocaleDateString('en-US', {weekday: 'short'})}</UniversalText>
          <UniversalText type='smallBold'>{date.getDate()}</UniversalText>
        </View>
      )
    }
    return dates
  }

  return (
    <View style={styles.parentContainer}>
      <View style={styles.headingContainer}>
        <UniversalText type='title' style={styles.title} >Home</UniversalText>
        <IconButton iconName='search' onPress={() => router.push('/(tabs)/locationSearch')}/>
      </View>
      <View style={styles.contentContainer}>
        <UniversalText type='subtitle' style={{marginLeft: 10}}>Favourites</UniversalText>
        <View style={localStyles.datesHeaderContainer}>
          {GetDates()}
        </View>
        <View style={{flex: 1}}>
          <FlatList data={favouritedLocations} contentContainerStyle={{width: '100%'}}
          keyExtractor={item => item}
          renderItem={({item}) => 
            <LocationDisplay locationID={item}/>}
          ListFooterComponent={
            <View style={localStyles.listFooter}>
              <View style={{alignItems: 'center', paddingBottom: 20}}>
                <UniversalText type='defaultBold'>Looks a little empty in here</UniversalText>
                <UniversalText type='small' style={{color: 'grey'}}>Try adding some more favourites</UniversalText>
              </View>
              <IconButton iconName={"add-circle-outline"} onPress={()=> router.push('/(tabs)/locationSearch')} size={40}></IconButton>
            </View>}
          />
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  listFooter: {
    alignSelf: 'center', 
    height: 250, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#F0F1F0', 
    width: '95%', 
    borderRadius: 20
  },
  datesHeaderContainer: {
    flex : 0, 
    width: '95%', 
    alignSelf: 'center', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 5
  }
});