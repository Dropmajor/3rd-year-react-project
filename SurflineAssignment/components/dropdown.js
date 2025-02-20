import { View } from "react-native";
import Picker from 'react-native-picker-select';
import { UniversalText } from '@/components/UniversalText';
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * Dropdown element.
 * @param {options} A list that contains the options for the dropdown
 * @param {selectedValue} The selected value in options
 * @param {onChange} The function to carry out when the dropdowns value is changed  
 * @returns 
 */
export default function Dropdown({ options, selectedValue, onChange })
{
    var label = options[0].label
    for(var i = 0; i < options.length; i++)
    {
        if(options[i].value == selectedValue)
        {
            label = options[i].label
            break
        }
    }

    return(
        <Picker
            placeholder={{}}
            items={options}
            onValueChange={onChange}
            value={selectedValue}
            fixAndroidTouchableBug={true}//needed as true as only the text will be touchable when set false which is far too little space
        >
            <View style={{height: 30, flexDirection: 'row', justifyContent: 'flex-end',  // Align children vertically to the center
            alignItems: 'center'}}>
                <UniversalText>{label}</UniversalText>    
                <Ionicons name="caret-down" style={{marginLeft: 5, marginTop: 5, color: 'grey'}} size={14}></Ionicons>
            </View>
        </Picker>
    )
}