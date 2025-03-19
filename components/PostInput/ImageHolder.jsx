import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

import { CrossSVG } from "../Svgs";

const ImageHolder = ({ images, removeImage, extraStyles }) => {
    return (
        <ScrollView style={[styles.gallery, extraStyles]}>
            <View style={styles.imageContainer}>
                {images.slice(0, 9).map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image
                            source={{ uri: image.uri }}
                            style={styles.media}
                        />
                        <TouchableOpacity
                            onPress={() => {
                                removeImage(image);
                            }}
                            style={styles.cross}
                        >
                            <CrossSVG width={20} height={20} fill="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default ImageHolder;

const styles = StyleSheet.create({
    gallery: {
        width: "95%",
        padding: 5,
        alignSelf: "center",
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        // justifyContent: "space-between",
        height: 100,
        gap: 10,
    },
    imageWrapper: {
        width: "30%",
        marginBottom: 10,
        position: "relative",
    },
    cross: {
        position: "absolute",
        backgroundColor: "#268EC8",
        borderRadius: 20,
        top: -5,
        right: -5,
        borderWidth: 2,
        borderColor: "#fff",
    },
    media: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
});
