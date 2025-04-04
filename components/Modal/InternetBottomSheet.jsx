import { MaterialIcons } from "@expo/vector-icons"; // Use Expo's vector icons
import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements/dist/buttons/Button";
import RBSheet from "react-native-raw-bottom-sheet";

import theme from "../../config/theme";

const InternetBottomSheet = ({ isVisible, onClose }) => {
    const bottomSheetRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            bottomSheetRef.current.open();
        } else {
            bottomSheetRef.current.close();
        }
    }, [isVisible]);

    return (
        <RBSheet
            ref={bottomSheetRef}
            height={300}
            draggable
            customStyles={{
                container: styles.bottomSheetContainer,
            }}
            onClose={onClose}
        >
            <View style={styles.contentContainer}>
                <MaterialIcons
                    name="wifi-off"
                    size={50}
                    color={theme.colors.lightBlue}
                />
                <Text style={styles.title}>No Internet Connection</Text>
                <Text style={styles.message}>
                    Please check your internet connection and try again.
                </Text>
                <Button
                    title="Close"
                    buttonStyle={styles.closeButton}
                    titleStyle={styles.closeButtonText}
                    onPress={() => {
                        onClose();
                    }}
                />
            </View>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    bottomSheetContainer: {
        zIndex: 2,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: "center",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },

    contentContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
        color: "#333333",
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
        color: "#666666",
    },
    closeButton: {
        backgroundColor: theme.colors.lightBlue,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 16,
        marginTop: 10,
        width: Dimensions.get("window").width * 0.85,
    },
    closeButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default InternetBottomSheet;
