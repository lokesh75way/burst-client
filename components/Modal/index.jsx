import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import theme from "../../config/theme";
import AuthorImage from "../FeedPost/AuthorImage";

const ConfirmationModal = ({
    visible,
    onClose,
    onPress,
    source,
    message,
    label,
}) => {
    return (
        <Modal visible={visible} animationType="fade" transparent>
            <TouchableWithoutFeedback onPress={onClose} accessible={false}>
                <View style={styles.modal}>
                    <View style={styles.wrapper}>
                        <TouchableWithoutFeedback accessible={false}>
                            <View style={styles.modalInner}>
                                <View style={styles.textContainer}>
                                    <AuthorImage imageUrl={source} size={60} />
                                    <Text style={styles.labelText}>
                                        {label}
                                    </Text>
                                    {message}
                                </View>

                                <TouchableOpacity
                                    style={[styles.removeBtn, styles.line]}
                                    onPress={onPress}
                                >
                                    <Text style={styles.removeText}>
                                        Remove
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "#18181863",
    },
    wrapper: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: 20,
    },
    modalInner: {
        backgroundColor: theme.colors.white,
        width: "95%",
        borderRadius: 10,
        gap: 15,
        paddingTop: 20,
    },
    cancelBtn: {
        backgroundColor: theme.colors.white,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "95%",
        paddingVertical: 15,
        marginTop: 10,
    },
    removeBtn: {
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 10,
    },
    cancelText: {
        color: "#000",
        fontSize: 20,
        fontWeight: "600",
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    labelText: {
        fontSize: 20,
        color: "#202020",
        fontWeight: "600",
        textAlign: "center",
    },
    removeText: {
        fontSize: 20,
        color: "#E75F55",
        fontWeight: "500",
    },
    line: {
        borderTopWidth: 1,
        borderTopColor: "#20202050",
        width: "100%",
    },
    textContainer: {
        paddingHorizontal: 20,
        alignItems: "center",
        gap: 15,
    },
});
