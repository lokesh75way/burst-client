import React from "react";
import { StyleSheet, View } from "react-native";

const BottomDots = ({ currentIndex }) => {
    return (
        <View style={styles.dotsContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index === currentIndex && styles.activeDot,
                    ]}
                />
            ))}
        </View>
    );
};

export default BottomDots;

const styles = StyleSheet.create({
    dotsContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginVertical: 10,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#B7B7B7",
    },
    activeDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#0091E2",
    },
});
