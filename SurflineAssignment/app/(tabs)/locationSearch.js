import { Pressable, StyleSheet, TextInput, View, useWindowDimensions} from 'react-native';
import { UniversalText } from '@/components/UniversalText';
import { SearchForLocation } from '../../APIExampleFiles/API'
import { useState, useRef } from 'react';
import {LocationListItem, RegionListItem} from '@/components/locationItem'
import { router } from 'expo-router';
import IconButton from '@/components/IconButton'
import styles from '../../assets/styles';

/**
 * The search tab of the app
 */
export default function LocationSearch()
{
    const [search_term, SetTyped] = useState(null);
    const [searchedLocations, setMatchingLocations] = useState(null);
    const inputRef = useRef(null);
    //this is used to stop the screen from moving when the keyboard is opened
    const windowHeight = useWindowDimensions().height;

    /**
     * Check the length of the search text and perform a search if it isn't empty
     * @param {*} search_text The search query 
     */
    function CheckSearch(search_text)
    {
        if(search_text.length > 0)
        {
            SetTyped(search_text)
            GetMatchingLocations(search_text)
        }
        else{
            SetTyped(null)
        }
    }

    /**
     * Retrieve all the entries that have their name match the users search
     * @param {*} search The search term
     */
    function GetMatchingLocations(search)
    {
        var locations = []
        var matchingLocationEntries = SearchForLocation(search);
        if(matchingLocationEntries.length > 0)
        {
            for(var i = 0; i < matchingLocationEntries.length; i++)
            {
                 locations.push(<LocationListItem search={search} label={matchingLocationEntries[i].name} key={i}
                    country={matchingLocationEntries[i].country} region={matchingLocationEntries[i].region}
                    locationID = {matchingLocationEntries[i].id}/>)
            }
        }
        else{
            locations.push(<UniversalText key={0}>No matching results found</UniversalText>)
        }   
        setMatchingLocations(locations)
    }

    /**
     * Clear the search field
     */
    function ClearSearchField()
    {
        if(inputRef.current)
        {
            inputRef.current.clear()
            SetTyped(null)
        }
    }

    return(
        <View style={[styles.parentContainer, {minHeight: Math.round(windowHeight) }]}>
            <View style={styles.headingContainer}>
                <IconButton iconName='arrow-back' onPress={() => router.back()}/>
                <View style={{width: '90%', flexDirection: 'row'}}>
                    <TextInput type='search' style={localStyles.input} onChangeText={(e) => CheckSearch(e)}
                    ref={inputRef} placeholder='Search for a spot'/>
                    {(search_term != null && search_term.length > 0) ?   
                    <IconButton iconName='close-circle-outline' onPress={() => ClearSearchField()}/> : []}
                </View>
            </View>
            <View style={styles.contentContainer}>
                {(search_term != null && search_term.length > 0) ? (searchedLocations) :
                (<View style={{margin: 10}}>
                    <View style={{height: '25%'}}>
                        <UniversalText type="subtitle">Recent Searches</UniversalText>
                        <UniversalText>No Recent Searches</UniversalText>
                    </View>
                    <View>
                        <UniversalText type="subtitle">Nearby Locations</UniversalText>
                        <View style={localStyles.enableLocationContainer}>
                            <UniversalText type="defaultBold">Location services are turned off</UniversalText>
                            <UniversalText style={{textAlign: 'center'}}>In order to get nearby spot recommendations please activate location services through your settings.</UniversalText>
                            <Pressable style={[styles.blackButton, {height: 40, alignSelf: 'center', width: '80%',}]}>
                                <UniversalText style={{color: 'white', fontWeight: '500'}}>Enable Location Services</UniversalText>
                            </Pressable>
                        </View>
                    </View>
                </View>
                )}
                {(search_term != null && search_term.length > 0) ? [] :
                (<View style={{position: 'absolute', bottom: 0, width: '100%'}}>
                    <View>
                        <UniversalText style={{margin: 10}} type="subtitle">Find a Spot</UniversalText>
                        <RegionListItem label="Africa"></RegionListItem>
                        <RegionListItem label="Asia"></RegionListItem>
                        <RegionListItem label="Europe"></RegionListItem>
                        <RegionListItem label="North America"></RegionListItem>
                        <RegionListItem label="Oceania"></RegionListItem>
                        <RegionListItem label="South America"></RegionListItem>
                    </View>
                </View>)
                }
            </View>
      </View>
    );
}

const localStyles = StyleSheet.create({
      input: {
        backgroundColor: '#E7E7E7',
        height: 45,
        width: '100%',
        marginRight: -40
      },
      enableLocationContainer:
      {
        width: '100%', 
        elevation: 5, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 5,
        shadowColor: "#000", 
        backgroundColor: '#fff', 
        height: 200, 
        borderRadius: 10
      }
  });