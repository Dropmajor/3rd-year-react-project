import { View, StyleSheet, Pressable, Dimensions} from 'react-native';
import { UniversalText } from '@/components/UniversalText';

/**
 * This component is used to change the selected date on the location info page
 * @param {*} date       The date to display 
 * @param {*} surfHeight the height text to display
 * @param {*} onPress    What action to carry out when the component is pressed
 * @param {*} selected   Boolean containing if this is the date currently selected
 */
export function DateDisplay({date, surfHeight, onPress, selected})
{
    //divide by 3.2 so that just over 3 of the display items appear in the scroll view. This clues in the user that they can scroll
    const displayWidth = Dimensions.get('window').width / 3.2;
    return(
            <Pressable onPress={onPress} 
            style={({ pressed }) =>  [{width: displayWidth, backgroundColor: pressed ? '#D6D6D6' : selected ? '#f3f3f3' : 'white',}, 
                localStyles.container]}>
                <View style={localStyles.textContainer}>
                    <UniversalText type='smallBold' style={{color: 'grey'}}>{date}</UniversalText>
                    <UniversalText type='subtitle'>{surfHeight}</UniversalText>
                </View>
            </Pressable>
    );
}

const localStyles = StyleSheet.create({
    container : {
        margin : 5,
        height : '90%',
        borderColor: '#E2E3E4', 
        borderWidth: 2,
        borderRadius: 5,
        padding: 5,
    },
    textContainer : {
        flex: 1, 
        flexDirection: 'column', 
        alignItems: 'center'
    }
});  