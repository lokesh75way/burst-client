import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CustomSwitch = ({ selectedSwitch, switchContent, setSelectedSwitch }) => {
    return (
        <View style={styles.customSwitch}>
            {switchContent.map((obj) => (
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedSwitch === obj.id && styles.activeBorder,
                    ]}
                    onPress={() => {
                        setSelectedSwitch(obj.id);
                    }}
                    key={obj.id}
                >
                    <Text
                        style={[
                            styles.text,
                            selectedSwitch === obj.id
                                ? styles.activeText
                                : styles.inactiveText,
                        ]}
                    >
                        {obj.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default CustomSwitch;

const styles = StyleSheet.create({
    customSwitch: {
        borderBottomWidth: 1,
        borderBottomColor: "#00000030",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginTop: 10,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: "#fff",
    },
    activeBorder: {
        borderBottomWidth: 2,
        borderBottomColor: "#000",
    },
    text: {
        fontWeight: "bold",
        fontSize: 18,
    },
    activeText: {
        color: "#000",
    },
    inactiveText: {
        color: "#818181",
    },
});
