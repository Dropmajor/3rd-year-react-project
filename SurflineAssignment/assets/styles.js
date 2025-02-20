import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
    parentContainer: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: '#fff',
  
    },
    headingContainer: {
      backgroundColor: '#fff',
      padding: 10,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '10%',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      elevation: 5,
    },
    contentContainer: {
      flex: 19,
      padding: 0
    },
    blackButton: {
      backgroundColor : 'black', 
      borderRadius: 20,
      justifyContent: 'center', 
      alignItems: 'center'
    }
    });  