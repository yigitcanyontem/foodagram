import {Dimensions, StyleSheet} from "react-native";
import {getStatusBarHeight} from "react-native-status-bar-height";

const shared_styles = StyleSheet.create({
    page_notch_margin: {},
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
        paddingBottom: 50,
    },
    profilePic: {
        width: 100,
        height: 100,
    },
    profilePicContainer: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "#8E8E8E",
        overflow: "hidden",
        width: 100,
        height: 100
    },
    row: {
        display: 'flex',
        flexDirection: 'row'
    },
    column: {
        display: 'flex',
        flexDirection: 'column'
    },
    transparent_button: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#8E8E8E',
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1
    },
    button_text: {
        color: '#000',
        fontSize: 14,
        fontFamily: 'Poppins',
        fontWeight: 'medium',
    },
    bottom_border_separator: {
        borderBottomWidth: 0.4,
        borderBottomColor: '#8E8E8E',
    },
    paddingH_20: {
        paddingHorizontal: 20
    },
    post_image: {
        aspectRatio: 1,
        objectFit: 'cover',
        borderColor: '#8E8E8E',
        borderWidth: 0.5,
        width: Dimensions.get('window').width / 3 - 2,
        height: Dimensions.get('window').width / 3 - 2,
    },
    posts_container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        flexWrap: 'wrap'
    },
    recipes_container: {
        display: 'flex',
        flexDirection: 'column'
    },
    recipe_container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        borderBottomWidth: 0.4,
        borderBottomColor: '#8E8E8E',
        flexBasis: '100%',
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    recipe_image: {
        width: 60,
        height: 60,
        borderRadius: 5
    },
    logout_button: {
        backgroundColor: '#fac6c6',
        borderWidth: 1,
        borderColor: '#FF3B30',
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flex: 1
    }

});

export default shared_styles;
