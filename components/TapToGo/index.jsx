import React from "react";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";

import useApp from "../../hooks/useApp";
import useUsers from "../../hooks/useUsers";
import MessageBox from "./MessageBox";

const TapToGo = ({ tapStep, setTapStep, loadFeed }) => {
    const { onboardUser } = useUsers();
    const { storage, inviter } = useApp();
    const userString = inviter
        ? `${inviter.invitedTo?.userName}'s`
        : "inviter's";
    const next = async () => {
        if (tapStep == 1) {
            await onboardUser(true);
            await storage.setIsOnboarded(String(true));
            loadFeed();
        }
        setTapStep((prev) => prev + 1);
    };
    return (
        <Modal animationType="none" transparent visible={tapStep < 2}>
            <TouchableOpacity
                activeOpacity={1}
                onPress={next}
                style={styles.centeredView}
            >
                {tapStep == 0 && <MessageBox box={tapStep} />}
                {tapStep == 1 && <MessageBox box={tapStep} />}
            </TouchableOpacity>
        </Modal>
    );
};

export default TapToGo;

const styles = StyleSheet.create({
    centeredView: {
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "rgba(58, 58, 58, 0.64)",
    },
});
