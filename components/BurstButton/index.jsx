import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import theme from "../../config/theme";
const BurstButton = ({
    type,
    label,
    endLabel,
    bgColor,
    checkIsAuthor,
    variant = "contained",
    outlinedColor = theme.colors.lightBlue,
    color = theme.colors.white,
    borderRadius = 10,
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
            disabled={checkIsAuthor}
            {...rest}
            testID="burst-sheet-channel-item"
        >
            <Text style={[styles.btnText, { color }]} numberOfLines={1}>
                Burst to{" "}
                {type === "private" && (
                    <>
                        <FontAwesome5 name="lock" size={14} color={color} />{" "}
                    </>
                )}
                {label}
            </Text>
            <Text style={[styles.btnText, { color }]}>{endLabel}</Text>
        </TouchableOpacity>
    );
};

export default BurstButton;

const styles = StyleSheet.create({
    button: {
        borderWidth: 2,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: 42,
        paddingHorizontal: 20,
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
