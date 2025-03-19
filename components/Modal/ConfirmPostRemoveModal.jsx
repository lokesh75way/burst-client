import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import theme from "../../config/theme";

const ConfirmPostRemoveModal = ({
    visible,
    channelData,
    onClose,
    onConfirm,
    sheetRef,
}) => {
    return (
        <RBSheet
            ref={sheetRef}
            height={250}
            openDuration={350}
            closeDuration={350}
            customStyles={{ container: styles.modalContainer }}
        >
            {/* <View style={styles.modalContainer}> */}
            <Text style={styles.confirmMessageText}>
                Are you sure you want to remove your post from
            </Text>
            <Text style={[styles.confirmMessageText, styles.channelName]}>
                {channelData.tag}
            </Text>
            <View style={styles.confirmButtonContainer}>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={onConfirm}
                >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            {/* </View> */}
        </RBSheet>
        // </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
        alignItems: "center",
        // justifyContent: "center",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    channelName: {
        color: theme.colors.lightBlue,
        marginBottom: 30,
    },
    confirmMessageText: {
        fontSize: 26,
        textAlign: "center",
        fontWeight: "600",
    },
    confirmButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    confirmButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        alignItems: "center",
    },
    cancelButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: theme.colors.lightBlue,
        borderRadius: 10,
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    confirmButtonText: {
        color: theme.colors.lightBlue,
        fontSize: 18,
    },
});

export default ConfirmPostRemoveModal;
