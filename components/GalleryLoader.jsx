import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import theme from "../config/theme";

const GalleryLoader = ({ label, images, setImages }) => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="skyblue" />
                <Text style={styles.uploadText}>{label ?? "Uploading..."}</Text>
            </View>
        </View>
    );
};

export default GalleryLoader;
const styles = StyleSheet.create({
    loadingContainer: {
        height: "30%",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    uploadText: {
        fontSize: 16,
        color: theme.colors.primary,
    },
    galleryContainer: {
        height: "40%",
        position: "absolute",
        bottom: 0,
    },
});
