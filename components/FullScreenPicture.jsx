import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";

import CachedImage from "./CachedImage";
import Loader from "./Loader";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

/**
 * Component to display a full-screen picture.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.fullScreenPictureUrl - URL of the full-screen picture to display.
 * @param {function} props.setShowFullScreenPicture - Function to set the visibility of the full-screen picture.
 * @returns {JSX.Element} A full-screen image component.
 */
const FullScreenPicture = (props) => {
    const { fullScreenPictureUrl, setShowFullScreenPicture } = props;

    /**
     * Toggles the full-screen picture visibility.
     */
    const toggleFullScreen = () => {
        setShowFullScreenPicture(false);
    };

    return (
        <Pressable
            style={styles.fullScreenContainer}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            onPress={toggleFullScreen}
        >
            <CachedImage
                source={{ uri: fullScreenPictureUrl }}
                style={styles.fullScreenImage}
                resizeMode="contain"
                loader={
                    <View style={styles.loadingPlaceholder}>
                        <Loader color="white" />
                    </View>
                }
            />
        </Pressable>
    );
};
const styles = StyleSheet.create({
    loadingPlaceholder: {
        position: "absolute",
        right: 0,
        left: 0,
        height: "100%",
        zIndex: 10,
        backgroundColor: "black",
    },
    fullScreenContainer: {
        position: "absolute",
        width: screenWidth,
        height: screenHeight,
        left: screenWidth / 2,
        top: screenHeight / 2,
        marginLeft: -screenWidth / 2,
        marginTop: -screenHeight / 2,
        zIndex: 2,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
    },
    fullScreenImage: {
        position: "absolute",
        width: screenWidth - 20,
        height: screenHeight / 2,
        // left: screenWidth / 2,
        // top: screenHeight / 2,
        // marginLeft: -screenWidth / 2,
        // marginTop: -screenHeight / 2,
        zIndex: 3,
    },
});
export default FullScreenPicture;
