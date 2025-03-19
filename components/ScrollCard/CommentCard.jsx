import { useState } from "react";
import {
    Alert,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import DeleteIcon from "../../assets/icons/Delete.png";
import { avatarPrefix, defaultAvatar } from "../../config/constants";
import theme from "../../config/theme";
import { getDateText } from "../../helpers/commonFunction";
import usePosts from "../../hooks/usePosts";
import { FilledHeartIcon, HeartIcon } from "../Svgs/HeartIcon";

const CommentCard = (props) => {
    const {
        item,
        userId,
        onCommentDelete,
        onReplyDelete,
        clickedComment,
        setClickedComment,
        setIsReplying,
        postId,
        canReply = true,
    } = props;
    const { addCommentLike } = usePosts();
    const hasLiked = item.likes?.length ? item.likes.length : false;
    const [isLiked, setIsLiked] = useState(hasLiked);
    const [likeCount, setLikeCount] = useState(item.likes?.length);
    const [isViewMore, setIsViewMore] = useState(false);
    const replyCount = item?.replies?.length || 0;

    // Assuming profileImageKey is a URL
    const getUserImage = (profileImageKey) => {
        const userImage = profileImageKey
            ? avatarPrefix + profileImageKey
            : avatarPrefix + defaultAvatar;
        return userImage;
    };

    const handleCommentLike = async () => {
        try {
            await addCommentLike(postId, item.id);
            if (isLiked) {
                setLikeCount((prev) => prev - 1);
            } else {
                setLikeCount((prev) => prev + 1);
            }
            setIsLiked((prev) => !prev);
        } catch (err) {
            console.log("error:-", err);
        }
    };

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = item.text.split(urlRegex);

    const handleDeleteModal = () => {
        Alert.alert(
            "Comment Delete",
            "Are you sure, you want to delete your comment ?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel"),
                },
                {
                    text: "Delete",
                    onPress: () => onCommentDelete(item),
                },
            ],
        );
    };

    return (
        <View style={styles.comment}>
            <View style={styles.commentCard}>
                <View style={styles.commentRow}>
                    <Image
                        source={{
                            uri: getUserImage(item.author.profileImageKey),
                        }}
                        style={styles.userImage}
                    />
                    <View style={styles.commentInfo}>
                        <View style={styles.commentInfoRow}>
                            <View style={styles.header}>
                                <View style={styles.commentUser}>
                                    <View style={styles.userText}>
                                        <Text style={styles.userName}>
                                            {item.author.displayName}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.commentGray,
                                                styles.textStyle,
                                            ]}
                                        >
                                            {getDateText(item.createdAt)}
                                        </Text>
                                    </View>

                                    <View style={styles.reactions}>
                                        <View style={styles.likeContainer}>
                                            {likeCount > 0 && (
                                                <Text style={styles.likeCount}>
                                                    {likeCount}
                                                </Text>
                                            )}
                                            <TouchableOpacity
                                                onPress={handleCommentLike}
                                                style={styles.heartIcon}
                                            >
                                                {isLiked ? (
                                                    <FilledHeartIcon
                                                        width={15}
                                                        height={15}
                                                    />
                                                ) : (
                                                    <HeartIcon
                                                        width={15}
                                                        height={15}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        {item.author.id === userId && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    handleDeleteModal();
                                                }}
                                                style={styles.deleteIcon}
                                            >
                                                <Image
                                                    style={styles.delete}
                                                    source={DeleteIcon}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                                <Text style={styles.textStyle}>
                                    {parts.map((part, index) => {
                                        if (!part.match(urlRegex)) {
                                            return (
                                                <Text
                                                    key={index}
                                                    style={styles.textContent}
                                                >
                                                    {part.trim()}{" "}
                                                </Text>
                                            );
                                        }
                                        return (
                                            <Text
                                                key={index}
                                                onPress={() => {
                                                    Linking.openURL(part);
                                                }}
                                                style={styles.hyperLink}
                                            >
                                                {part}{" "}
                                            </Text>
                                        );
                                    })}
                                </Text>
                            </View>
                        </View>
                        {canReply && (
                            <TouchableOpacity
                                onPress={() => {
                                    setClickedComment(item);
                                    setIsReplying(true);
                                }}
                                style={styles.reply}
                            >
                                <Text style={styles.replyText}>Reply</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            <View style={styles.actionContainer}>
                {replyCount > 0 && isViewMore && (
                    <View style={styles.replyContainer}>
                        {item.replies.map((reply, index) => (
                            <CommentCard
                                {...props}
                                onCommentDelete={onReplyDelete}
                                key={index}
                                item={reply}
                                canReply={false}
                            />
                        ))}
                    </View>
                )}
                {replyCount > 0 && (
                    <TouchableOpacity
                        onPress={() => {
                            setIsViewMore((prev) => !prev);
                            setClickedComment(isViewMore ? null : item);
                        }}
                    >
                        {isViewMore ? (
                            <Text style={styles.moreText}>
                                ----- Hide replies
                            </Text>
                        ) : (
                            <Text style={styles.moreText}>
                                ----- View {replyCount} more replies{" "}
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default CommentCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent background
    },
    delete: {
        height: 16,
        width: 16,
    },
    scrollBar: {
        width: "100%",
        height: "70%", // Bottom 2/3 height
        backgroundColor: "transparent",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    userImage: {
        width: 30,
        height: 30,
        borderRadius: 20,
    },
    commentInfo: {
        marginLeft: 11,
        flex: 1,
    },
    commentInfoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    header: { width: "100%" },
    commentUser: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        justifyContent: "space-between",
    },
    userText: {
        flexDirection: "row",
        gap: 5,
    },
    userName: {
        fontSize: 11,
        fontWeight: "700",
        // fontFamily: 'Raleway'
    },
    commentGray: {
        color: "#A1A0A0",
    },
    textStyle: {
        fontSize: 11,
        fontWeight: "400",
        letterSpacing: -0.22,
    },
    replyText: {
        color: theme.colors.lightBlue,
        fontSize: 12,
    },
    moreText: {
        color: "#A1A0A0",
        fontSize: 12,
        fontWeight: "600",
    },
    reactions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    likeContainer: {
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
    },
    likeCount: {
        fontSize: 12,
        lineHeight: 12,
    },
    scrollView: {
        width: "100%",
        bottom: 0,
        backgroundColor: "pink",
    },
    bottomCover: {
        height: "20%", // Added to cover the bottom 20% of the screen
        width: "100%",
        backgroundColor: "#F5F5F5", // Adjust the color as needed
    },
    commentBox: {
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 36,
        paddingLeft: 21,
        paddingRight: 23,
    },
    titleBox: {
        flexDirection: "row",
        gap: 2,
        justifyContent: "center",
        marginBottom: 30,
    },
    commentTitle: {
        fontSize: 13,
        fontWeight: "700",
        // fontFamily: 'Raleway',
        textAlign: "center",
    },
    commentCount: {
        color: "#A1A0A0",
        fontWeight: "500",
        // fontFamily: 'Raleway',
    },
    comment: {
        paddingVertical: 16,
        alignItems: "flex-end",
    },
    actionContainer: {
        width: "90%",
        marginTop: 5,
    },
    replyContainer: {
        gap: 5,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 8,
        paddingVertical: 10,
    },
    commentCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    commentRow: {
        flexDirection: "row",
        alignItems: "start",
        flex: 1,
    },
    end: {
        backgroundColor: "#F5F5F5",
        padding: 16,
        justifyContent: "center",
        alignContent: "center",
    },
    heartIcon: {
        padding: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    deleteIcon: {
        padding: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    reply: {
        marginTop: 7,
        width: 50,
        // alignSelf: "flex-start",
    },
    hyperLink: {
        color: theme.colors.lightBlue,
        fontWeight: "normal",
        textDecorationLine: "underline",
    },
});
