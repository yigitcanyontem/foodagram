import {StyleSheet} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";

const shared_styles = StyleSheet.create({
    page_notch_margin: {
    },
    text: {
        color: 'black',
        fontFamily: 'Poppins, sans-serif',
    },
    container: {
        backgroundColor: '#EEEEEE',
        paddingHorizontal: 2,
        paddingBottom: 50,
    },
    headerWrapper: {
        backgroundColor: 'transparent'
    },
    body_container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        paddingBottom: 100,
    }
});

export default shared_styles;
