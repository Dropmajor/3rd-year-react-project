import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * This class is the backend data manager, it contains all the functions responsible for loading and saving data.
 * This isnt a component, this file is located in this folder because I cant think of where else in the folder structure to place it
 */

/**
 * Set the value of a key in storage
 * @param {*} settingKey The key of the setting in storage to set
 * @param {*} settingValue The value of the setting
 */
export async function SetSettingValue(settingKey, settingValue)
{
    try {
      await AsyncStorage.setItem(settingKey, settingValue);
    } catch (e) {
      // saving error
    }
}

/**
 * Load a value from async storage
 * @param {*} settingKey The key of the setting to load
 * @returns The value of the loaded setting.
 */
export async function LoadSettingValue(settingKey)
{
    var settingValue = null
    try {
      const value = await AsyncStorage.getItem(settingKey);
      if (value !== null) {
        settingValue = value
      }
    } catch (e) {
      // error reading value
    }
    return settingValue
}

/**
 * Check if the user has favourited a location
 * @param {*} locationID The ID of the location to check 
 * @returns 
 */
export async function CheckFavourite(locationID)
{
    var favourited = false
    var favouritesList = await LoadFavourites();
    if(favouritesList.includes(locationID))
    {
        favourited = true
    }
    return favourited
}

/**
 * Load all favourites
 * @returns an array containing the IDs of all favourited locations
 */
export async function LoadFavourites()
{
    var favouritesList

    try {
        const jsonValue = await AsyncStorage.getItem('favourites');
        favouritesList = jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        // error reading value
    }

    return favouritesList
}

/**
 * Save a list of locations to storage as favourites
 * @param {*} favouritesList The list of favourited locations to save
 */
export async function SaveFavourites(favouritesList)
{
    try {
      const jsonValue = JSON.stringify(favouritesList);
      await AsyncStorage.setItem('favourites', jsonValue);
    } catch (e) {
      // saving error
    }
}

/**
 * Add a location id as a favourite
 * @param {*} locationID The location to favourite
 */
export async function AddFavourite(locationID)
{
    var favouritesList = await LoadFavourites();
    if(!favouritesList.includes(locationID))
    {
        favouritesList.push(locationID)
    }
    else
    {
        favouritesList.splice(favouritesList.indexOf(locationID), 1)
    }
    SaveFavourites(favouritesList);
}