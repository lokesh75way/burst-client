import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * A component to select visibility options with different circles representing the options.
 * @param {object} props - Component props.
 * @param {function} props.onSelect - Callback function triggered when an option is selected.
 * @returns {JSX.Element} VisibilitySelector component.
 */
const VisibilitySelector = (props) => {
    const { onSelect } = props;
    const [selectedIdx, setSelectedIdx] = useState(3);

    /**
     * Handles the press event on a circle.
     * @param {number} index - The index of the circle.
     */
    const handleCirclePress = (index) => {
        setSelectedIdx(index);
        onSelect(index + 1);
    };

    const circleSizes = [20, 25, 30, 35]; // change the circle size
    const labels = ["1x", "10x", "100x", "1000x"];

    return (
        <View style={styles.container}>
            {circleSizes.map((size, index) => (
                <View key={index} style={styles.circleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.circle,
                            {
                                width: size,
                                height: size,
                            },
                            selectedIdx === index ? styles.selected : null,
                        ]}
                        onPress={() => handleCirclePress(index)}
                    />
                    <Text style={styles.label}>{labels[index]}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        width: "100%",
    },
    circleContainer: {
        alignItems: "center",
    },
    circle: {
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "skyblue",
    },
    selected: {
        backgroundColor: "skyblue",
    },
    label: {
        marginTop: 5,
    },
});

export default VisibilitySelector;
