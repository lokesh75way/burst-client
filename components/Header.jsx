import React from "react";
import { StyleSheet, Text, View } from "react-native";

/**
 * Header component displaying the title for the app.
 *
 * @returns {JSX.Element} The header component with the app title.
 */
const Header = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.menu}>BURST</Text>
            <View style={styles.separator} />
            <Text style={[styles.menu, styles.menuBold]}>FOR YOU</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        top: 22,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        zIndex: 1,
    },
    separator: {
        width: 1,
        height: 13,
        backgroundColor: "#d8d8d8",
        opacity: 0.6,
    },
    menu: {
        color: "black",
        letterSpacing: 0.8,
        marginHorizontal: 12,
        marginVertical: 11,
        opacity: 0.8,
        fontSize: 15,
    },
    menuBold: {
        fontWeight: "normal",
        opacity: 1,
        fontSize: 16,
    },
});

export default Header;
