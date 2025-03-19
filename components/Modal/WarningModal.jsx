import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import warningImage from "../../assets/warning.png";
import theme from "../../config/theme";

const WarningModal = ({ onClose, onPress, userName, sheetRef }) => {
    return (
        <RBSheet
            ref={sheetRef}
            height={250}
            openDuration={300}
            customStyles={{
                container: styles.sheetContainer,
            }}
            closeOnPressMask={true}
            draggable
            dragOnContent
        >
            <View style={styles.modalInner}>
                <View style={styles.textContainer}>
                    <Image source={warningImage} style={styles.image} />
                    <Text style={styles.labelText}>
                        Warning: non-public post
                    </Text>
                </View>
                <Text style={styles.content}>
                    This post is only visible to {userName}'s team, so it won't
                    be visible to others if quoted. Do you still want to proceed
                    with quoting it?
                </Text>
                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={[styles.btn, styles.quoteBtn]}
                        onPress={() => {
                            sheetRef.current?.close();
                            onPress();
                        }}
                    >
                        <Text style={styles.text}>Quote it</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btn, styles.cancelBtn]}
                        onPress={onClose}
                    >
                        <Text style={styles.text}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </RBSheet>
    );
};

export default WarningModal;

const styles = StyleSheet.create({
    sheetContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        backgroundColor: theme.colors.white,
    },
    modalInner: {
        gap: 15,
        paddingTop: 20,
    },
    btn: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: 42,
    },
    labelText: {
        fontSize: 15,
        color: "#141619",
        fontWeight: "700",
    },
    textContainer: {
        marginHorizontal: 40,
        alignItems: "center",
        gap: 15,
        flexDirection: "row",
    },
    btnContainer: {
        flexDirection: "row",
        width: "100%",
    },
    quoteBtn: {
        backgroundColor: "#CED5DC",
    },
    cancelBtn: {
        backgroundColor: "#189AE2",
    },
    text: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    content: {
        marginHorizontal: 40,
        fontSize: 15,
        marginVertical: 15,
    },
});
