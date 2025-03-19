import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import Picker from "./Picker";
const ImageGallery = ({ images, setImages, blurred, showPicker }) => {
    const [loading, setLoading] = useState(false);
    return (
        <View style={{ height: "95%" }}>
            {showPicker && (
                <Picker
                    setLoading={setLoading}
                    images={images}
                    setImages={setImages}
                />
            )}
        </View>
    );
};

export default ImageGallery;

const styles = StyleSheet.create({
    gallery: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        flexWrap: "wrap",
        marginHorizontal: 20,
    },
    imageContainer: {
        backgroundColor: "#D9D9D9",
        width: "31%",
        height: "33%",
        marginBottom: "2%",
        justifyContent: "center",
        alignItems: "center",
    },
    media: {
        width: "100%",
        height: "100%",
    },
    actions: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        height: "15%",
    },
    action: {
        marginLeft: 18,
    },
});
