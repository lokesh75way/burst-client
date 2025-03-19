import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import OnboardImage from "./OnboardImage";

const OnboardContainer = (props) => {
    const {
        mainText,
        infoText,
        showStarIcon,
        onboardStep,
        setOnboardStep,
        imageId = 1,
        ...rest
    } = props;

    return (
        <View style={styles.container}>
            <View style={styles.animContainer}>
                <OnboardImage {...rest} imageId={imageId} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.mainText}>{mainText}</Text>
                <Text style={styles.infoText}>{infoText}</Text>
            </View>
        </View>
    );
};

export default OnboardContainer;

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("screen").width,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    animContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        height: "50%",
    },
    textContainer: {
        height: "30%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 50,
        width: "100%",
        marginBottom: 60,
    },
    mainContainer: {
        width: "100%",
    },
    mainText: {
        color: "#189AE2",
        fontSize: 26,
        textAlign: "center",
        fontWeight: "bold",
    },
    infoText: {
        color: "#46464E",
        fontSize: 20,
        textAlign: "center",
        marginTop: 10,
    },
});
