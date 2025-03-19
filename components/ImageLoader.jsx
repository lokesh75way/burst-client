import React from "react";
import { StyleSheet, View } from "react-native";

import Loader from "./Loader";

const ImageLoader = (props) => {
    return (
        <View style={[styles.loadingContainer, props]}>
            <Loader size="small" color="skyblue" />
        </View>
    );
};

export default ImageLoader;

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
});
