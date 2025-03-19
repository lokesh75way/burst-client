import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import theme from "../../config/theme";
const Button = ({
    label,
    bgColor,
    variant = "contained",
    outlinedColor = theme.colors.lightBlue,
    color = theme.colors.white,
    borderRadius = 10,
    endIcon = <></>,
    startIcon,
    marginTop,
    ...rest
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                { borderColor: outlinedColor },
                bgColor && { backgroundColor: bgColor },
                { borderRadius },
                marginTop && { marginTop },
            ]}
            {...rest}
        >
            {startIcon && <View style={styles.rotate}>{startIcon}</View>}
            <Text style={[styles.btnText, { color }]}>{label}</Text>
            {endIcon}
        </TouchableOpacity>
    );
};

export default Button;

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 42,
    },
    outlined: {
        borderColor: theme.colors.lightBlue,
    },
    btnText: {
        fontSize: 16,
        fontWeight: "700",
    },
    contained: {
        backgroundColor: theme.colors.lightBlue,
        borderColor: theme.colors.lightBlue,
    },
    rotate: {
        transform: [
            {
                rotate: "180deg",
            },
        ],
    },
});
