import React from "react";
import { StyleSheet, View } from "react-native";

const Background = ({ backgroundColor }) => {
    return <View style={[styles.background, { backgroundColor }]} />;
};

export default Background;

const styles = StyleSheet.create({
    background: {
        width: 742,
        height: 742,
        borderRadius: 371,
        position: "absolute",
        bottom: "-10%",
        zIndex: -1,
    },
});
