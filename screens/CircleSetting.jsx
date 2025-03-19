import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Circles from "../components/Circles";
import ReturnTabs from "../components/ReturnTabs";

/**
 * Renders the CircleSetting component.
 * This component displays a title, a list of circles, and a set of tabs.
 * @returns {JSX.Element} React component for managing circle settings.
 */

const CircleSetting = () => {
    return (
        <>
            <View style={styles.titleContainer}>
                <Text>Your Circles</Text>
            </View>
            <Circles />
            <ReturnTabs />
        </>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        width: "100%",
        paddingHorizontal: "5%",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        paddingTop: "18%",
        marginBottom: 15,
    },
});

export default CircleSetting;
