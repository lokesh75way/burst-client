import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const styles = StyleSheet.create({
    container: {
        height: "8%",
        width: "100%",
        position: "absolute",
        bottom: 0,
        zIndex: 1,
        flexDirection: "row",
        backgroundColor: "#f0f2f5",
        borderBottomWidth: 5,
        borderBottomColor: "#e8e8e8",
        borderTopWidth: 1,
        borderTopColor: "#e8e8e8",
        justifyContent: "space-between",
    },
    image: {
        height: 34,
        width: 40,
    },
    menu: {
        width: "20%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
});

/**
 * Functional component representing a navigation button to the "Post" screen.
 * Navigates to the "Post" screen upon press.
 * @returns {JSX.Element} A button triggering navigation to the "Post" screen.
 */
export default function NextTabsPost() {
    const navigation = useNavigation();

    /**
     * Handles navigation to the "Post" screen.
     * Navigates to the "Post" screen using the navigation object.
     * @returns {void}
     */
    const goNext = () => {
        navigation.navigate("Post");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={goNext} style={styles.menu}>
                <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={require("../assets/boldIcons/Next.png")}
                />
            </TouchableOpacity>
        </View>
    );
}
