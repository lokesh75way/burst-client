import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import CommentCard from "./CommentCard";
import { notificationCode, notificationNumber } from "../../config/constants";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import useNotifications from "../../hooks/useNotifications";
import usePosts from "../../hooks/usePosts";
import useUsers from "../../hooks/useUsers";
import { isScrollEnded } from "../../services/util";
import CommentInputBox from "../CommentInput";
import Loader from "../Loader";

const ScrollCard = (props) => {
    const {
        currentPostId,
        currentPosterId,
        isScrollCardVisible,
        setIsScrollCardVisible,
        commentCount,
        setCommentCount,
        addCommentNumber,
        picture,
        postText,
        postId,
    } = props;
    const [dataList, setDataList] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [userId, setUserId] = useState("");
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const animationValue = useRef(new Animated.Value(0)).current;
    const { getComments, addComment, addCommentReply, deleteComment } =
        usePosts();
    const { me } = useUsers();
    const { sendNotification } = useNotifications();
    const { storage } = useApp();
    const [user, setUser] = useState();
    const rbSheetRef = useRef();
    const [isKeyboard, setIsKeyboard] = useState(false);
    const sheetHeight = (Dimensions.get("screen").height * 57) / 100;
    const myId = storage.id;
    const [isReplying, setIsReplying] = useState(false);
    const [clickedComment, setClickedComment] = useState(null);

    const fetchUserData = async () => {
        const user = await me();
        if (user) {
            setUser(user);
            setUserId(user.id);
        }
    };

    useEffect(() => {
        if (isScrollCardVisible) {
            rbSheetRef.current.open();
            getComment(1);
        } else {
            rbSheetRef.current.close();
            setPage(1);
        }
    }, [isScrollCardVisible]);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", () => setIsKeyboard(true));
        Keyboard.addListener("keyboardDidHide", () => setIsKeyboard(false));
    }, []);

    /**
     * Fetches comments for the current post.
     * @memberof CommentComponent
     * @function getComment
     * @returns {Promise<void>} A promise resolving when comments are fetched and state is updated.
     */
    const getComment = async (page = 1) => {
        try {
            setIsLoading(true);
            const { counts, comments } = await getComments(
                JSON.stringify(currentPostId),
                page,
            );

            setCommentCount(counts);
            const sortedComments = comments.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            );
            setDataList((prevData) => [...prevData, ...(sortedComments ?? [])]);
            setIsLoading(false);
        } catch (error) {
            // 处理网络请求异常
            console.log("Error: ", error);
            setIsLoading(false);
        }
    };

    const handleGetComments = async (pageNo = 1) => {
        try {
            setIsLoading(true);
            const { counts, comments } = await getComments(
                JSON.stringify(currentPostId),
                pageNo,
            );
            const uniqueComments = [...dataList, ...comments].filter(
                (value, index, self) =>
                    self.findIndex((v) => v.id === value.id) === index,
            );
            const sortedComments = uniqueComments.sort(
                (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            );
            setDataList(sortedComments ?? []);
            setCommentCount(counts ?? 0);
            setIsLoading(false);
        } catch (error) {
            console.log("Error: ", error);
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (dataList.length < commentCount) {
            setPage(page + 1);
            getComment(page + 1);
        }
    };

    /**
     * Handles sending a comment for the current post.
     * @memberof CommentComponent
     * @function handleSendComment
     * @param {string} commentText - The text of the comment to be sent.
     * @returns {Promise<void>} A promise resolving after the comment is added and state is updated.
     */
    const handleSendComment = async (commentText) => {
        try {
            setCommentLoading(true);
            const data = JSON.stringify({
                text: commentText,
            });
            const commentData = await addComment(
                JSON.stringify(currentPostId),
                data,
            );
            commentData["author"]["displayName"] = user.displayName;
            commentData["author"]["profileImageKey"] = user.profileImageKey;
            commentData["replies"] = [];
            setCommentCount((prev) => prev + 1);
            setDataList((prevlist) => [...prevlist, commentData]);
            addCommentNumber(currentPostId);
            sentNotification(commentText);
            setCommentLoading(false);
        } catch (error) {
            console.error(error); // 处理错误
            console.error(error.response); // 处理错误
        }
    };

    const handleSendReply = async (commentText) => {
        try {
            setCommentLoading(true);
            const data = JSON.stringify({
                text: commentText,
            });
            const reply = await addCommentReply(
                clickedComment.id,
                postId,
                data,
            );
            const commentIndex = dataList.findIndex(
                (comment) => comment.id == clickedComment.id,
            );
            const comment = dataList[commentIndex];
            reply["author"]["displayName"] = user.displayName;
            reply["author"]["profileImageKey"] = user.profileImageKey;
            reply["author"]["replies"] = [];
            reply["author"]["likes"] = [];
            reply["id"] = reply.id;
            const newReplies = [...comment.replies, reply];
            const newComment = {
                ...comment,
                replies: newReplies,
            };
            setDataList((prev) => [
                ...getNewComments(prev, commentIndex, newComment),
            ]);
            setIsReplying(false);
            setCommentLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const getNewComments = (comments, commentIndex, newComment) => {
        const list = comments;
        list.splice(commentIndex, 1, newComment);
        return list;
    };

    const handleReplyDelete = async (item) => {
        const { id } = item;

        const commentIndex = dataList.findIndex(
            (comment) => comment.id == clickedComment.id,
        );
        const newReplies = dataList[commentIndex].replies.filter(
            (reply) => reply.id !== id,
        );
        const newComment = { ...dataList[commentIndex], replies: newReplies };
        setDataList((prev) => [
            ...getNewComments(prev, commentIndex, newComment),
        ]);
        await deleteComment(id);
    };

    /**
     * Retrieves the current user's display name and avatar.
     * @memberof CommentComponent
     * @function setUserNameAndAvatar
     * @returns {Promise<string>} A promise resolving with the user's display name.
     */
    const setUserNameAndAvatar = async () => {
        try {
            const data = await me();
            return data.displayName;
        } catch (error) {
            // 处理网络请求异常
            console.log("Error: ", error);
        }
    };

    /**
     * Sends a notification to the post's owner upon receiving a comment.
     * @memberof CommentComponent
     * @function sentNotification
     * @param {string} commentText - The text of the comment sent.
     * @returns {void}
     */
    const sentNotification = async (commentText) => {
        const myDisplayName = await setUserNameAndAvatar();
        const isoTimestamp = new Date().toISOString();
        const pushData = JSON.stringify({
            postId: currentPostId,
            commentator: myId,
            burst: 0,
            comment: 1,
            timestamp: isoTimestamp,
            commentText,
            userDisplayName: myDisplayName,
            postPicture: picture,
            postText,
        });
        if (String(myId) !== String(currentPosterId)) {
            sendNotification({
                subID: String(currentPosterId),
                appId: notificationNumber,
                appToken: notificationCode,
                title: myDisplayName + " commented your post",
                message: "Check in Burst",
                pushData,
            });
        }
    };

    // Function to handle animation when isScrollCardVisible changes
    React.useEffect(() => {
        if (isScrollCardVisible) {
            Animated.spring(animationValue, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(animationValue, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
        }
    }, [isScrollCardVisible]);

    // Calculate the interpolated translateY value for animation
    const translateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0], // Adjust the value based on the height of your content
    });

    // Close the comment section bottom sheet
    const closeSheet = () => {
        setIsScrollCardVisible(false);
        setClickedComment(null);
        setIsReplying(false);
        setDataList([]);
    };

    const onCommentDelete = async (item) => {
        await deleteComment(item.id);
        setCommentCount((prevcount) => prevcount - 1);
        setDataList((prevList) => prevList.filter((obj) => obj.id !== item.id));
    };

    const onScroll = ({ nativeEvent }) => {
        if (isScrollEnded(nativeEvent)) {
            handleLoadMore();
        }
    };

    const rbSheetStyles = {
        wrapper: { backgroundColor: "transparent" },
        draggableIcon: { backgroundColor: "#D9D9D9", width: 95 },
        container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
        },
    };

    return (
        <KeyboardAvoidingView>
            <RBSheet
                height={sheetHeight}
                ref={rbSheetRef}
                dragFromTopOnly
                closeOnDragDown
                closeOnPressBack
                closeOnPressMask
                onClose={closeSheet}
                customStyles={rbSheetStyles}
            >
                <View style={styles.commentBox}>
                    <View style={styles.titleBox}>
                        <Text style={styles.commentTitle}>Comments</Text>
                        {commentCount > 0 && (
                            <View style={styles.commentContainer}>
                                <Text style={styles.commentCount}>
                                    {commentCount}
                                </Text>
                            </View>
                        )}
                    </View>
                    {isLoading && (
                        // If loading is true, show a loading symbol.
                        <View style={styles.commentBox}>
                            <Loader />
                        </View>
                    )}
                    {!isLoading && dataList.length > 0 && (
                        // If the data is fetched, render the ScrollCard content.
                        <ScrollView
                            vertical
                            showsVerticalScrollIndicator={false}
                            style={{ marginBottom: 20 }}
                            onScroll={onScroll}
                            scrollEventThrottle={0}
                        >
                            {dataList.map((item, index) => (
                                <CommentCard
                                    item={item}
                                    key={`${item.id}${index}`}
                                    userId={userId}
                                    setIsReplying={setIsReplying}
                                    clickedComment={clickedComment}
                                    setClickedComment={setClickedComment}
                                    onCommentDelete={onCommentDelete}
                                    onReplyDelete={handleReplyDelete}
                                    postId={postId}
                                />
                            ))}
                        </ScrollView>
                    )}
                    {dataList.length === 0 && !isLoading && (
                        <View style={[styles.emptyList, { flex: 1 }]}>
                            <Text style={styles.noCommentsTitle}>
                                No Comments Yet
                            </Text>
                        </View>
                    )}
                    <CommentInputBox
                        commentInput={commentInput}
                        setCommentInput={setCommentInput}
                        onSendComment={handleSendComment}
                        onSendReply={handleSendReply}
                        user={user}
                        commentLoading={commentLoading}
                        clickedComment={clickedComment}
                        setClickedComment={setClickedComment}
                        isReplying={isReplying}
                        setIsReplying={setIsReplying}
                    />
                </View>
            </RBSheet>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    commentBox: {
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 16,
        paddingLeft: 21,
        paddingRight: 23,
    },
    titleBox: {
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    commentTitle: {
        fontSize: 13,
        fontWeight: "700",
        textAlign: "center",
    },
    commentCount: {
        color: "white",
        fontWeight: "700",
        fontSize: 12,
    },
    end: {
        backgroundColor: "#F5F5F5",
        padding: 16,
        justifyContent: "center",
        alignContent: "center",
        height: "100%",
    },
    noCommentsTitle: {
        fontSize: 16,
        fontWeight: "400",
    },
    emptyList: {
        justifyContent: "center",
        alignItems: "center",
    },
    commentContainer: {
        backgroundColor: theme.colors.lightBlue,
        paddingHorizontal: 14,
        paddingVertical: 2,
        borderRadius: 10,
    },
});

export default ScrollCard;
