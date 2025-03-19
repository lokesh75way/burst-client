import React from "react";
import { Image, StyleSheet, View } from "react-native";

const StackedImages = ({ images }) => {
    const limitedImages = images.length > 3 ? images.slice(0, 3) : images;
    return (
        <View style={{ flexDirection: "row" }}>
            {limitedImages
                .map((item, index) => (
                    <View
                        key={index}
                        style={[styles.container, { marginLeft: 20 * index }]}
                    >
                        <Image
                            source={{ uri: item }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                ))
                .reverse()}
        </View>
    );
};

export default StackedImages;

const styles = StyleSheet.create({
    container: {
        height: 32,
        width: 32,
        position: "absolute",
    },
    image: {
        width: 32,
        height: 32,
        borderRadius: 15,
        borderWidth: 2,
        backgroundColor: "#eee",
        borderColor: "#fff",
    },
});
