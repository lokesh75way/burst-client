import { StyleSheet, Text, TouchableOpacity } from "react-native";

const EmojiButton = (props) => {
    const { count, text, isMe, ...rest } = props;

    const emojiStyle = () => (isMe ? styles.currentUser : styles.otherUser);
    const countStyle = () =>
        isMe ? styles.currentUserCount : styles.otherUserCount;

    return (
        <TouchableOpacity {...rest} style={[styles.emoji, emojiStyle()]}>
            <Text style={styles.emojiText}>{text}</Text>
            {count > 1 && (
                <Text style={[styles.count, countStyle()]}>{count}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    emoji: {
        flex: 1,
        minWidth: 40,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        gap: 5,
        marginRight: 8,
    },
    otherUser: {
        backgroundColor: "#E7E7E7",
        borderWidth: 2,
        borderColor: "#E7E7E7",
    },
    currentUser: {
        backgroundColor: "rgba(0,125,194,0.12)",
        borderWidth: 2,
        borderColor: "#007DC2",
    },
    emojiText: {
        fontSize: 20,
        paddingTop: 0,
    },
    count: {
        fontSize: 16,
        fontWeight: "600",
        marginRight: 4,
    },
    currentUserCount: {
        color: "#007DC2",
    },
    otherUserCount: {
        color: "#646464",
    },
});

export default EmojiButton;
