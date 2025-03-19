import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import Loader from "./Loader";
import CrossSVG from "../components/Svgs/CrossSVG";
import theme from "../config/theme";
import { getImageUrl } from "../helpers/commonFunction";
/**
 * A component to input and send comments.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onSendComment - Function to handle sending comments.
 * @param {string} props.commentInput - The current input text for the comment.
 * @param {Function} props.setCommentInput - Function to set the comment input text.
 * @returns {JSX.Element} JSX Element for the comment input box.
 */
const CommentInputBox = (props) => {
    const {
        onSendComment,
        onSendReply,
        commentInput = "",
        setCommentInput,
        user,
        clickedComment,
        setClickedComment,
        isReplying,
        setIsReplying,
        commentLoading,
    } = props;
    const profileImage = getImageUrl(user?.profileImageKey);

    /**
     * Handles sending the comment using the provided function.
     */
    const handleSendComment = () => {
        if (clickedComment && isReplying) {
            onSendReply(commentInput);
        } else {
            onSendComment(commentInput);
        }
        setCommentInput("");
    };
    const showButton = commentInput.length > 0 || commentLoading;

    return (
        <View
            style={[
                styles.commentContainer,
                clickedComment && isReplying && styles.preview,
            ]}
        >
            {clickedComment && isReplying && (
                <View style={styles.previewContainer}>
                    <Text numberOfLines={1} style={styles.replyText}>
                        Replying to:{" "}
                        <Text style={styles.replyContent} ellipsizeMode="tail">
                            {clickedComment.text}
                        </Text>
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setClickedComment(null);
                            setIsReplying(false);
                        }}
                        style={styles.crossIcon}
                    >
                        <CrossSVG width={20} height={20} />
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.inputContainer}>
                <Image
                    style={styles.profileImage}
                    source={{ uri: profileImage }}
                />
                <View style={styles.commentBox}>
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment"
                        value={commentInput}
                        onChangeText={setCommentInput}
                    />
                    {showButton && (
                        <TouchableOpacity
                            style={styles.sendButton}
                            onPress={handleSendComment}
                            disabled={commentLoading}
                        >
                            {commentLoading ? (
                                <Loader size="small" color="#fff" />
                            ) : (
                                <Text style={styles.sendButtonText}>Send</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileImage: {
        height: 35,
        width: 35,
        borderRadius: 100,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        gap: 17,
    },
    commentBox: {
        height: 38,
        borderRadius: 20,
        paddingLeft: 16,
        paddingRight: 4,
        flex: 1,
        borderWidth: 1.5,
        borderColor: "#D9D9D9",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5,
    },
    commentInput: {
        flex: 1,
        height: "100%",
    },
    sendButton: {
        backgroundColor: theme.colors.lightBlue,
        borderRadius: 12,
        paddingHorizontal: 12,
        justifyContent: "center",
        marginVertical: 4,
        width: 60,
        alignItems: "center",
    },
    sendButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: 14,
    },
    previewContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    commentContainer: {
        padding: 8,
    },
    preview: {
        backgroundColor: "#cccccc30",
        borderRadius: 8,
    },
    replyText: {
        color: "#000",
        fontWeight: "600",
        paddingBottom: 10,
        width: "90%",
    },
    replyContent: {
        color: "#000",
        fontWeight: "500",
        fontSize: 12,
    },
    crossIcon: {
        paddingBottom: 10,
    },
});

export default CommentInputBox;
