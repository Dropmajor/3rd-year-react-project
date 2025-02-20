import { Pressable} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

/**
 * A button that uses an ionicon as its symbol
 * @param {*} onPress The action todo when pressed
 * @param {*} iconName The name of the ionicons to use
 * @param {*} size the size of the Icon and button
 * @param {*} style The style to use for the button
 * @returns 
 */
export default function IconButton({onPress, iconName, size = 28, style})
{
    return(
        <Pressable onPress={onPress} 
        style={({ pressed }) => [{ backgroundColor: pressed ? '#f3f3f3' : 'transparent', borderRadius: 15,
        width: {size}, height: {size}, alignContent: 'center', justifyContent: 'center'}]} hitSlop={size + 5}>
            <Ionicons size={size} name={iconName} style={style}/>
        </Pressable>
    )
}
