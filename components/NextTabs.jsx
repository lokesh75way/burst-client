import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#f0f2f5",
        borderBottomWidth: 5,
        borderBottomColor: "#e8e8e8",
        borderTopWidth: 1,
        borderTopColor: "#e8e8e8",
        justifyContent: "flex-end",
    },
    image: {
        height: 34,
        width: 40,
    },
});

/**
 * Functional component representing a navigation button to the next screen.
 * Navigates to the "Home" screen upon press.
 * @returns {JSX.Element} A button triggering navigation to the "Home" screen.
 */
export default function NextTabs() {
    const navigation = useNavigation();

    /**
     * Handles navigation to the "Home" screen.
     * Navigates to the "Home" screen using the navigation object.
     * @returns {void}
     */
    const goNext = () => {
        const params = { screen: "Home" };
        navigation.navigate("MainTabs", params);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={goNext}>
                <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={require("../assets/boldIcons/Next.png")}
                />
            </TouchableOpacity>
        </View>
    );
}
