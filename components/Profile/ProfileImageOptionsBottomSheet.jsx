import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import theme from "../../config/theme";

const ProfileImageOptionsBottomSheet = ({
    sheetRef,
    onPickImage,
    onCaptureImage,
    onRemoveImage,
    showRemoveImage,
}) => {
    return (
        <RBSheet
            ref={sheetRef}
            height={showRemoveImage ? 200 : 150}
            draggable
            openDuration={400}
            customStyles={{ container: styles.modalContainer }}
        >
            <View style={styles.optionContainer}>
                <TouchableOpacity style={styles.option} onPress={onPickImage}>
                    <Ionicons
                        name="images"
                        size={22}
                        color={theme.colors.lightBlue}
                    />
                    <Text style={styles.optionText}>Choose from Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.option}
                    onPress={onCaptureImage}
                >
                    <Ionicons
                        name="camera"
                        size={22}
                        color={theme.colors.lightBlue}
                    />
                    <Text style={styles.optionText}>Capture from Camera</Text>
                </TouchableOpacity>

                {showRemoveImage && (
                    <TouchableOpacity
                        style={styles.option}
                        onPress={onRemoveImage}
                    >
                        <Ionicons name="trash" size={22} color="red" />
                        <Text style={[styles.optionText, { color: "red" }]}>
                            Remove Profile Image
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    optionContainer: {
        gap: 10,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    optionText: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: "500",
    },
});

export default ProfileImageOptionsBottomSheet;
