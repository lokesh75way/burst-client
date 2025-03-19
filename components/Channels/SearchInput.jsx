import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

import { CloseSVG, SearchGrey } from "../Svgs";

const SearchInput = ({
    searchText,
    onSearchChange,
    placeholder = "Search...",
    showCross = true,
    onClear,
    containerStyle = {},
    inputStyle = {},
}) => {
    return (
        <View style={[styles.inputContainer, containerStyle]}>
            <SearchGrey />
            <TextInput
                placeholder={placeholder}
                value={searchText}
                onChangeText={onSearchChange}
                style={[styles.inputSearchText, inputStyle]}
            />
            {showCross && searchText && searchText.length > 0 && (
                <TouchableOpacity onPress={onClear}>
                    <CloseSVG />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: "#E9E9E9",
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    inputSearchText: {
        fontSize: 16,
        textAlign: "left",
        paddingHorizontal: 10,
        color: "#000",
        flex: 1,
    },
});

export default SearchInput;
