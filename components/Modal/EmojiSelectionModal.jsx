import React from "react";
import {
    KeyboardAvoidingView,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import EmojiSelector from "../EmojiSelector";

const EmojiSelectionModal = ({
    setEmojiVisible,
    uploadAddEmoji,
    emojiVisible,
}) => {
    return (
        <Modal visible={emojiVisible} animationType="slide" transparent>
            <TouchableWithoutFeedback
                onPress={() => {
                    setEmojiVisible(false);
                }}
                accessible={false}
            >
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <View style={styles.emojiModal}>
                        <EmojiSelector
                            showHistory={false}
                            onEmojiSelected={uploadAddEmoji}
                            columns={10}
                            setEmojiVisible={setEmojiVisible}
                            emojiVisible={emojiVisible}
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EmojiSelectionModal;
const styles = StyleSheet.create({
    emojiModal: {
        position: "absolute",
        height: "40%",
        bottom: "0%",
        zIndex: 2,
        backgroundColor: "#F5F5F5",
    },
});
