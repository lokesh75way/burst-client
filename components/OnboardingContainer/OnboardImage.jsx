import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

import Background from "./Background";
const screenWidth = Dimensions.get("screen").width;

const OnboardImage = ({
    source,
    showText,
    addStyles,
    imageId,
    backgroundColor,
}) => {
    return (
        <View style={styles.imageContainer}>
            <Text style={styles.grayHeaderText}>
                {showText ? "Other users" : ""}
            </Text>
            <Image
                style={imageId === 1 ? styles.image : styles.image2}
                source={source}
                resizeMode="contain"
            />
            <Background backgroundColor={backgroundColor} />
        </View>
    );
};

export default OnboardImage;

const styles = StyleSheet.create({
    imageContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    singleImageContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: screenWidth,
        height: screenWidth,
    },
    image: {
        width: 300,
        height: "90%",
        marginTop: 130,
    },
    image2: {
        width: 300,
        height: "90%",
        marginTop: 20,
    },
    headerText: {
        color: "#58B2E3",
        fontSize: 20,
        fontWeight: "bold",
    },
    grayHeaderText: {
        color: "#858585",
        fontSize: 24,
        fontWeight: "bold",
    },
});
