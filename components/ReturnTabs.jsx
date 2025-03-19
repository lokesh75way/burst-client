import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

/**
 * A component displaying a button to navigate back.
 * @returns {JSX.Element} - A React element representing the return button.
 */
export default function ReturnTabs() {
    const navigation = useNavigation();
    /**
     * Handles the navigation to go back.
     * @returns {void}
     */
    const goBack = () => {
        navigation.goBack();
    };
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
            borderBottomColor: " #e8e8e8",
            borderTopWidth: 1,
            borderTopColor: "#e8e8e8",
            justifyContent: "space-between",
        },
        menu: {
            width: "20%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        icon: {
            height: 34,
            width: 40,
        },
    });
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.menu} onPress={goBack}>
                <Image
                    style={styles.icon}
                    resizeMode="contain"
                    source={require("../assets/boldIcons/Back.png")}
                />
            </TouchableOpacity>
        </View>
    );
}
