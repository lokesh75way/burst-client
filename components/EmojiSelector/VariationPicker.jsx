import { Modal, StyleSheet, View } from "react-native";

import Emojis from "./Emojis";

/**
 * Component for picking emoji variations.
 * @param {object} props - The properties passed to the VariationPicker component.
 * @param {object} props.emoji - The emoji object for which variations are displayed.
 * @param {Function} props.onEmojiSelected - The function triggered on selecting an emoji.
 * @param {object} props.rest - Other additional props for the Modal component.
 * @returns {JSX.Element} A Modal component for selecting emoji variations.
 */

const VariationPicker = (props) => {
    const { emoji, onEmojiSelected, ...rest } = props;

    return (
        <Modal
            animationType="fade"
            transparent
            style={{
                flex: 1,
            }}
            {...rest}
        >
            <View style={styles.container}>
                {emoji ? (
                    <Emojis emoji={emoji} onEmojiSelected={onEmojiSelected} />
                ) : (
                    "..."
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default VariationPicker;
