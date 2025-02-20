import surfLocations from '@/APIExampleFiles/SurfSpots.json'
import WeatherExample from '@/APIExampleFiles/SurfConditions.json'
import TidesExample from '@/APIExampleFiles/SurfConditions.json'

export function GetAllLocations()
{
    return surfLocations.surfing_spots
}

/**
 * Retrieve the json entry in surfspots that matches an ID
 * @param {*} locationID 
 * @returns A json entry
 */
export function GetLocationData(locationID)
{
    var locationEntry
    for(var i = 0; i < surfLocations.surfing_spots.length && locationEntry == null; i++)
    {
        if(surfLocations.surfing_spots[i].id == locationID)
            locationEntry = surfLocations.surfing_spots[i]
    }
    return locationEntry
}

/**
 * 
 * Note: This function only gets results where one of the words in the name starts with the search term
 * The reason for this is it is unlikely someone searches for Bournemouth by typing in mouth.
 * This helps declog the search results.
 * @param {*} search_term 
 * @returns 
 */
export function SearchForLocation(search_term)
{
    //
    search_term = search_term.trim().toLowerCase()
    var matchingLocationEntries = []
    for(var i = 0; i < surfLocations.surfing_spots.length && matchingLocationEntries.length < 10; i++)
    {
        var words = surfLocations.surfing_spots[i].name.toLowerCase().split(" ")
        var matched = false
        for(var j = 0; j < words.length && !matched; j++)
        {
            if(words[j].substring(0, search_term.length) == search_term)
            {
                matchingLocationEntries.push(surfLocations.surfing_spots[i])
                matched = true
            }
        }
    }
    return matchingLocationEntries
}

/**
 * Call stormglass
 * @param {*} locationID 
 * @returns 
 */
export async function GetLocationSurfingConditions(locationID)
{
    var location = GetLocationData(locationID)
    console.log("Making Stormglass API Call")
    const params =
    `swellHeight,swellDirection,swellPeriod,secondarySwellHeight,secondarySwellDirection,secondarySwellPeriod`+
    `,waveHeight,precipitation,windSpeed,windDirection,pressure,airTemperature,cloudCover`
    const response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${location.latitude}&lng=${location.longitude}
      &params=${params}`, {
      headers: {
        'Authorization': 'YOUR API KEY'
      }
    })

    if(response.ok)
    {
        const data = await response.json();
        console.log("Number of requests made today: " + data.meta.requestCount)

        if(data.meta.requestCount > 10)
        {
            console.log("Stormglass calls exceeded daily limit, switching to test data")
            data = WeatherExample
        }

        return data
    }
}

/**
 * Example seperate call for the heights, would just call the function above but that would instantly use up the request limit
 */
export async function GetSurfHeights()
{
    return WeatherExample
}

/**
 * Get the sunrise, sunset, first light and last light at a location
 * @param {*} locationID 
 * @returns 
 */
export async function GetLocationSunriseTimes(locationID)
{
    var location = GetLocationData(locationID)
    var date = new Date()

    var initialDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    date.setDate(date.getDate() + 10)
    var endDate     = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()

    const response = await fetch(`https://api.sunrisesunset.io/json?lat=${location.latitude}&lng=${location.longitude}
        &date_start=${initialDate}&date_end=${endDate}&time_format=24`)

    if(response.ok)
    {
        const data = await response.json();
        return data
    }
}
