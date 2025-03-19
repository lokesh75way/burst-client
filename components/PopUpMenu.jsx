import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
const PopUpMenu = ({ menuList }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.menu, { opacity: fadeAnim }]}>
            {menuList.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    style={[
                        styles.menuItem,
                        index < menuList.length - 1 && styles.border,
                    ]}
                >
                    <Text style={[styles.text, index == 1 && styles.red]}>
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </Animated.View>
    );
};

export default PopUpMenu;

const styles = StyleSheet.create({
    menu: {
        backgroundColor: "#fff",
        zIndex: 100,
        borderRadius: 8,
        width: 180,
        paddingVertical: 5,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginRight: 5,
        elevation: 10,
    },
    menuItem: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        width: "100%",
    },
    text: {
        fontSize: 16,
    },
    border: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
    },
    red: {
        color: "red",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
        backgroundColor: "transparent",
    },
    barContainer: {
        position: "absolute",
        top: 20,
        right: 0,
        alignItems: "flex-end",
        gap: 5,
    },
});
