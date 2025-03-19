import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import CachedImage from "./CachedImage";
import Loader from "./Loader";
import TextScrollContainer from "./TextScrollContainer";
import { imageBaseUrl, picturePrefix } from "../config/constants";

/**
 * Functional component representing a single picture item.
 * Displays an image and supports toggling to a full-screen view on press.
 * @param {object} props - Component props
 * @param {object} props.source - Information about the picture source?
 * @param {function} props.setShowFullScreenPicture - Function to control the full-screen picture display
 * @param {function} props.setFullScreenPictureUrl - Function to set the full-screen picture URL
 * @returns {JSX.Element} A component displaying a single picture with the ability to toggle to full-screen mode.
 */
const OnePicture = (props) => {
    const { source, setTouchStart, text, showText } = props;

    const imageUrl = source?.key
        ? picturePrefix + source.key
        : `${imageBaseUrl}/defaultPostImg.jpeg`;

    return (
        <Pressable
            onLongPress={() => {
                setTouchStart(true);
            }}
            onPressOut={() => {
                setTouchStart(false);
            }}
            style={styles.pressContainer}
        >
            {showText && <TextScrollContainer text={text} />}
            <CachedImage
                source={{ uri: imageUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
                isFeed
                showText={showText}
                loader={
                    <View style={styles.loadingContainer}>
                        <Loader color="skyblue" />
                    </View>
                }
            />
        </Pressable>
    );
};

export default OnePicture;

const styles = StyleSheet.create({
    thumbnail: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        width: "100%",
    },
    loadingContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
    },
    pressContainer: {
        flex: 1,
        width: "100%",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
});
