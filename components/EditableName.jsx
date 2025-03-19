import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import theme from "../config/theme";

/**
 * EditableText component that displays text and allows editing on click.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.text - The text to display/edit.
 * @param {Function} props.setText - Function to update the text.
 * @returns {JSX.Element} An editable text component.
 */
const EditableText = (props) => {
    const { text, setText, username } = props;
    const [editing, setEditing] = useState(false);

    /**
     * Handles the click event for enabling text editing.
     */
    const handleNameClick = () => {
        setEditing(true);
    };

    /**
     * Handles saving the edited text and disabling editing mode.
     */
    const handleTextSave = () => {
        setEditing(false);
    };

    /**
     * Handles changes in the text input.
     *
     * @param {string} newText - The updated text value.
     */
    const handleTextChange = (newText) => {
        setText(newText);
    };

    return (
        <View style={styles.container}>
            {/* {editing ? (
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.username}
                            value={text}
                            onChangeText={handleTextChange}
                            onSubmitEditing={handleTextSave}
                            autoFocus
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.checkContainer}
                        onPress={handleTextSave}
                    >
                        <Text style={styles.checkmark}>✔</Text>
                    </TouchableOpacity>
                </View>
            ) : ( */}
            <View style={styles.textContainer}>
                <Text numberOfLines={2} style={styles.displayName}>
                    {text}
                </Text>
                {username && (
                    <Text style={styles.username} numberOfLines={1}>
                        @{username}
                    </Text>
                )}
                {/* <TouchableOpacity
                    onPress={handleNameClick}
                    style={styles.penContainer}
                >
                    <PenSVG />
                </TouchableOpacity> */}
            </View>
            {/* )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        flex: 1,
    },
    textContainer: {
        paddingHorizontal: 8,
        gap: 5,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
    },
    checkContainer: {
        backgroundColor: "skyblue",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    },
    checkmark: {
        fontSize: 16,
        paddingHorizontal: 5,
    },
    displayName: {
        fontSize: 30,
        fontWeight: "bold",
    },
    penContainer: {
        width: 20,
        height: 20,
    },
    username: {
        color: theme.colors.grey,
        fontSize: 16,
    },
});

export default EditableText;
