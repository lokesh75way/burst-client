import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    avatarPrefix,
    defaultAvatar,
    imageBaseUrl,
    notificationCode,
    notificationNumber,
    picturePrefix,
    reviewThreshold,
} from "../../config/constants";
import { NotificationTypes } from "../../config/data";
import useApp from "../../hooks/useApp";
import useAsyncStorage from "../../hooks/useAsyncStorage";
import useNotifications from "../../hooks/useNotifications";
import usePosts from "../../hooks/usePosts";
import useUsers from "../../hooks/useUsers";
import CachedImage from "../CachedImage";
import EmojiBar from "../EmojiBar";
import EmojiSelector from "../EmojiSelector";
import FullScreenPicture from "../FullScreenPicture";
import ImageLoader from "../ImageLoader";
import Info from "../Info";
import PostActions from "../PostActions";
import Ripple from "../Ripple";
import ScrollCard from "../ScrollCard/ScrollCard";
import { ArrowRightSVG } from "../Svgs";

const PostCard = ({
    type,
    height,
    post,
    isERT,
    content,
    userId,
    loadedPages,
    notificationType,
    currentPostId,
    currentPosterId,
    currentPageIndex = 0,
    postIndex,
    refreshContent,
    setCurrentPostId = () => {},
}) => {
    const { reviewPost, reactOnPost, getPost } = usePosts();
    const { storage, setActiveRoute } = useApp();
    const { me } = useUsers();
    const { id } = useAsyncStorage();
    const { sendNotification } = useNotifications();
    const navigation = useNavigation();
    const [fullScreenPictureUrl, setFullScreenPictureUrl] = useState("");
    const [showFullScreenPicture, setShowFullScreenPicture] = useState(false);
    const [item, setItem] = useState(type === "singlePost" ? null : post);
    const [bursted, setBursted] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [showRipple, setShowRipple] = useState(false);
    const [emojiVisible, setEmojiVisible] = useState(false);
    const [isScrollCardVisible, setIsScrollCardVisible] = useState(false);
    const [touchStart, setTouchStart] = useState(false);
    const [isGreen, setIsGreen] = useState(type === "feed" ? isERT : false);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [enableScroll, setEnableScroll] = useState(false);
    useEffect(() => {
        if (type === "singlePost") {
            getPostData();
        }
    }, [type]);

    useEffect(() => {
        if (type === "singlePost" && item) {
            setIsGreen(item.isERT);
            setBursted(item.userBursted);
        } else if (type === "feed" && post) {
            setBursted(post?.betaReviews[0]?.approved);
        }
    }, [item, post]);

    /**
     * Get full user data for single post screen.
     * @type {object}
     */
    const getPostData = async () => {
        const data = await getPost(currentPostId);
        setBursted(data.userBursted);
        setItem(data);
    };
    /**
     * Handles burst action on double click.
     */
    // const doubleClickBurst = () => {
    //     alert("This is awesome \n Double tap succeed");

    //     handleRipple();
    //     if (!userBursted[currentPostId]) {
    //         reviewForBackend();
    //     }
    // };

    /**
     * State storing the counts for each content item.
     * @type {object}
     */
    const [countsNew, setCountsNew] = useState({});
    const [countsNewFallback, setCountsNewFallBack] = useState(countsNew);

    useEffect(() => {
        if (item) {
            setCommentCount(item?.counts?.comments);
            const initialCountsNew = {};
            if (type === "singlePost") {
                initialCountsNew[item.id] = {
                    ...item.counts,
                };
            } else {
                const reactions = content[postIndex].reactions?.reduce(
                    function (result, item) {
                        result[item.emoji] = result[item.emoji] || [];
                        result[item.emoji].push(item);
                        return result;
                    },
                    {},
                );

                content.forEach((item) => {
                    initialCountsNew[item.id] = {
                        ...item.counts,
                        reactions: reactions ?? [],
                    };
                });
            }
            setCountsNew(initialCountsNew);
            setCountsNewFallBack(countsNew);
        }
    }, [content, item]);

    /**
     * Increases the comment count for a specific post in countsNew state.
     *
     * @param {string} id - The identifier of the post.
     */
    const addCommentNumber = (id) => {
        setCountsNew((prevCountsNew) => ({
            ...prevCountsNew,
            [id]: {
                comments: prevCountsNew[id].comments + 1,
                bursts: prevCountsNew[id].bursts,
                reactions: prevCountsNew[id].reactions,
            },
        }));
    };

    /**
     * Sets the showRipple state to true for a certain duration.
     */
    const handleRipple = () => {
        setShowRipple(true);
        setTimeout(() => {
            setShowRipple(false);
        }, 2000);
    };

    /**
     * Sends a burst action to the backend.
     */
    const reviewForBackend = async (id) => {
        try {
            const data = await reviewPost(id);
            // sentNotification();
        } catch (error) {
            console.error("error: " + error); // 处理错误
            console.error(error.response); // 处理错误
        }
    };

    /**
     * Sends a burst notification to the post owner.
     *
     * @param {string} currentPostId - The ID of the current post.
     * @param {string} currentPosterId - The ID of the user who posted the current post.
     * @param {Function} storage - Function to access storage.
     * @param {Function} setUserNameAndAvatar - Function to set user's name and avatar.
     * @param {Array<object>} content - Array containing post content.
     * @param {number} currentPageIndex - Index of the current page/post.
     * @param {Function} sendNotification - Function to send notifications.
     * @param {string} notificationNumber - Notification number.
     * @param {string} notificationCode - Notification code.
     * @returns {Promise<void>} - Sends a notification to the post owner if the current user is not the post owner.
     */
    const sentNotification = async () => {
        const myId = storage.id;
        const myDisplayName = setUserNameAndAvatar();
        const isoTimestamp = new Date().toISOString();

        const picture = content[currentPageIndex].media
            ? content[currentPageIndex].media[0]
            : null;
        const postText = content[currentPageIndex].text
            ? content[currentPageIndex].text
            : null;
        const pushData = JSON.stringify({
            postId: currentPostId,
            commentator: myId,
            burst: 1,
            comment: 0,
            timestamp: isoTimestamp,
            commentText: "",
            userDisplayName: myDisplayName,
            postPicture: picture,
            postText,
        });
        if (String(myId) !== String(currentPosterId)) {
            sendNotification({
                subID: String(currentPosterId),
                appId: notificationNumber,
                appToken: notificationCode,
                title: myDisplayName + " bursted your post",
                message: "Check in Burst",
                pushData,
            });
        }
    };

    /**
     * Fetches and sets the user's name and avatar.
     * @returns {string} The user's display name.
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
     * Performs a burst action.
     */
    const review = async (itemId) => {
        handleRipple();
        if (type == "feed" && post.author.id != id) {
            if (reviewThreshold - post.approvedReviewCount == 1) {
                setIsGreen(false);
            } else if (
                bursted &&
                post.approvedReviewCount - reviewThreshold == 0
            ) {
                setIsGreen(true);
            }
        }
        reviewForBackend(itemId);
    };

    /**
     * Adds an emoji to a post.
     *
     * @param {string} emoji - The emoji to be added.
     * @param {Function} uploadAddEmoji - Function to upload and add an emoji to a post.
     */
    const AddEmoji = (emoji, postId) => {
        setCountsNewFallBack(countsNew);
        updateEmojiData(emoji, postId);
        uploadAddEmoji(emoji, postId);
    };

    /**
     * Uploads and adds an emoji to a post.
     *
     * @param {string} emoji - The emoji to be added.
     * @param {string} currentPostId - The ID of the current post.
     * @param {Function} reactOnPost - Function to react to a post.
     * @param {Function} updateEmojiData - Function to update emoji data.
     */
    const uploadAddEmoji = async (emoji, postId) => {
        const data = JSON.stringify({
            emoji,
        });

        try {
            try {
                await reactOnPost(currentPostId ?? postId, data);
            } catch (error) {
                setCountsNew(countsNewFallback);
                console.log("Error: ", error);
            }
        } catch (error) {
            console.error(error.response); // 处理错误
        }
    };
    const addLocalReaction = (reactions, postId) => {
        setCountsNew((prevCountsNew) => ({
            ...prevCountsNew,
            [postId ?? currentPostId]: {
                comments: prevCountsNew[postId ?? currentPostId]?.comments,
                bursts: prevCountsNew[postId ?? currentPostId]?.bursts,
                reactions,
            },
        }));
    };

    /**
     * Updates the emoji data for a specific post.
     *
     * @param {string} emoji - The emoji to update.
     */
    const updateEmojiData = (emoji, postId) => {
        const emojiData = countsNew[postId ?? currentPostId]
            ? countsNew[postId ?? currentPostId].reactions
            : [];

        const existingEmoji = emojiData[emoji] && emojiData[emoji].length > 0;

        if (existingEmoji) {
            const alreadyReacted = emojiData[emoji].some(
                (em) => em.author.id == userId,
            );

            if (alreadyReacted) {
                const data = { ...emojiData };
                const newEmojis = data[emoji].filter(
                    (em) => em.author.id !== userId,
                );
                let newReactions;
                if (newEmojis.length == 0) {
                    delete data[emoji];
                    newReactions = data;
                } else {
                    newReactions = {
                        ...data,
                        [emoji]: newEmojis,
                    };
                }
                addLocalReaction(newReactions, postId);
            } else {
                addLocalReaction(
                    {
                        ...emojiData,
                        [emoji]: [
                            ...emojiData[emoji],
                            {
                                emoji,
                                post: { id: postId ?? currentPostId },
                                author: { id: userId },
                                createdAt: new Date().toISOString(),
                            },
                        ],
                    },
                    postId,
                );
            }
        } else {
            addLocalReaction(
                {
                    [emoji]: [
                        {
                            emoji,
                            post: { id: postId ?? currentPostId },
                            author: { id: userId },
                            createdAt: new Date().toISOString(),
                        },
                    ],
                    ...emojiData,
                },
                postId,
            );
        }
    };

    const formatDate = (createdAt) => {
        const [_, m, d, y] = new Date(createdAt).toDateString().split(" ");
        return `${d} ${m} ${y}`;
    };

    const getProfileImage = (item) => {
        const imageKey = item?.author?.profileImageKey;
        return avatarPrefix + (imageKey ? imageKey : defaultAvatar);
    };

    const goToUserProfile = () => {
        const { userName, id, profileImageKey } = item.author;
        let avatar = defaultAvatar;
        if (profileImageKey) {
            avatar = profileImageKey;
        }
        if (id.toString() === storage.id) {
            setActiveRoute("Profile");
            navigation.navigate("Profile");
        } else {
            navigation.navigate("UserPage", {
                userName,
                avatar,
                userId: id,
            });
        }
    };

    const imageUrl = item?.media[0]?.key
        ? picturePrefix + item?.media[0]?.key
        : `${imageBaseUrl}/defaultPostImg.jpeg`;
    const toggleFullScreen = (url) => {
        setFullScreenPictureUrl(url);
        setShowFullScreenPicture(true);
    };

    useEffect(() => {
        if (
            notificationType === NotificationTypes.COMMENT ||
            notificationType === NotificationTypes.REPLY
        ) {
            setIsScrollCardVisible(true);
        }
    }, [notificationType]);

    const viewHeightHandler = (e) => {
        const { height } = e.nativeEvent.layout;
        if (height > scrollHeight) {
            setEnableScroll(true);
        } else {
            setEnableScroll(false);
        }
    };
    const authorProfile = getProfileImage(item);
    const isDefault = authorProfile == avatarPrefix + defaultAvatar;

    return (
        <>
            <View style={[type === "feed" && styles.boundaryCover, { height }]}>
                <View style={[styles.boundary, { height: "100%" }]}>
                    {item && (
                        <View
                            style={[
                                styles.viewContainer,
                                isGreen && {
                                    backgroundColor: "#E2F4E1",
                                },
                            ]}
                        >
                            <View
                                style={[
                                    styles.imageCover,
                                    isGreen && {
                                        backgroundColor: "#C1E4BF70",
                                    },
                                ]}
                            >
                                <View style={styles.center}>
                                    {type === "singlePost" && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                navigation.goBack();
                                            }}
                                            style={styles.backButton}
                                        >
                                            <ArrowRightSVG color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                    <Info
                                        postId={item.id}
                                        avatar={item.author.profileImageKey}
                                        author={item.author}
                                        // title={item.title}
                                        text={item.text}
                                        showText={
                                            item.text.length > 0 && !touchStart
                                        }
                                        picture={item.media}
                                        createdAt={item.createdAt}
                                        navigation={navigation}
                                        setTouchStart={setTouchStart}
                                        toggleFullScreen={toggleFullScreen}
                                    />

                                    <View>
                                        <View style={styles.footer}>
                                            <View style={styles.emojiSection}>
                                                <EmojiBar
                                                    isSinglePost={
                                                        type === "singlePost"
                                                    }
                                                    setEmojiVisible={(
                                                        visible,
                                                    ) => {
                                                        setEmojiVisible(
                                                            visible,
                                                        );
                                                        setCurrentPostId(
                                                            item.id,
                                                        );
                                                    }}
                                                    emojiVisible={emojiVisible}
                                                    emojiData={
                                                        countsNew[item.id]
                                                    }
                                                    addEmoji={(emoji) =>
                                                        AddEmoji(emoji, item.id)
                                                    }
                                                    currentUserId={userId}
                                                />
                                            </View>
                                        </View>
                                        <ScrollCard
                                            isScrollCardVisible={
                                                isScrollCardVisible
                                            }
                                            setIsScrollCardVisible={
                                                setIsScrollCardVisible
                                            }
                                            commentCount={commentCount}
                                            setCommentCount={setCommentCount}
                                            currentPostId={item.id}
                                            currentPosterId={currentPosterId}
                                            addCommentNumber={addCommentNumber}
                                            picture={
                                                item.media
                                                    ? item.media[0]
                                                    : null
                                            }
                                            postText={
                                                item.text ? item.text : null
                                            }
                                            postId={item?.id ?? post.id}
                                        />
                                    </View>
                                </View>

                                <View style={styles.bottomContainer}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={goToUserProfile}
                                        style={styles.user}
                                    >
                                        {isDefault ? (
                                            <Image
                                                height={48}
                                                width={48}
                                                source={{
                                                    uri: authorProfile,
                                                }}
                                                style={[
                                                    styles.profileImage,
                                                    isGreen && styles.ertCircle,
                                                ]}
                                            />
                                        ) : (
                                            <CachedImage
                                                height={48}
                                                width={48}
                                                source={{
                                                    uri: authorProfile,
                                                }}
                                                style={[
                                                    styles.profileImage,
                                                    isGreen && styles.ertCircle,
                                                ]}
                                                loader={
                                                    <ImageLoader
                                                        width={48}
                                                        height={48}
                                                    />
                                                }
                                            />
                                        )}

                                        <View>
                                            <Text style={styles.userName}>
                                                {item.author.displayName}
                                            </Text>
                                            <Text style={styles.postTime}>
                                                {formatDate(item.createdAt)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <PostActions
                                        counts={item?.counts}
                                        commentCount={commentCount}
                                        userBursted={bursted}
                                        currentPostId={item.id}
                                        navigation={navigation}
                                        review={() => review(item.id)}
                                        setIsScrollCardVisible={
                                            setIsScrollCardVisible
                                        }
                                        loadedSuccessfully={
                                            type === "singlePost"
                                                ? true
                                                : loadedPages[item.id]
                                        }
                                    />
                                </View>
                            </View>
                            {showRipple && <Ripple number={item.burstCount} />}
                        </View>
                    )}
                </View>
            </View>

            <Modal visible={emojiVisible} animationType="slide" transparent>
                <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
                    <View style={styles.emojiModal}>
                        <EmojiSelector
                            showHistory={false}
                            onEmojiSelected={(emoji) => AddEmoji(emoji)}
                            columns={10}
                            setEmojiVisible={setEmojiVisible}
                            emojiVisible={emojiVisible}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {showFullScreenPicture && (
                <FullScreenPicture
                    fullScreenPictureUrl={fullScreenPictureUrl}
                    setShowFullScreenPicture={setShowFullScreenPicture}
                />
            )}
        </>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
    profileImage: {
        width: 48,
        height: 48,
        borderRadius: 100,
    },
    gradient: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        height: "100%",
        width: "100%",
        pointerEvents: "none",
    },
    imageCover: {
        width: "100%",
        height: "100%",
        borderRadius: 20,
    },
    footer: {
        position: "absolute",
        width: "100%",
        flexDirection: "column",
        gap: 16,
        height: "100%",
    },
    footerContent: {
        flex: 1,
    },
    emojiSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        gap: 16,
        position: "absolute",
        bottom: 15,
        left: 0,
        right: 0,
    },
    center: {
        flex: 1,
        height: "100%",
        width: "100%",
        borderRadius: 20,
    },
    user: {
        borderRadius: 20,
        height: 78,
        paddingTop: 14,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    userName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#0F4564",
        // fontFamily: 'Montserrat'
    },
    postTime: {
        fontSize: 12,
        fontWeight: "400",
        color: "#0F4564",
        // fontFamily: 'SF Pro'
    },
    viewContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: "#EEEEEE",
        padding: 12,
    },
    boundary: {
        paddingHorizontal: 13,
        paddingVertical: 13,
        backgroundColor: "white",
    },
    boundaryCover: {
        paddingBottom: "2.6%",
    },
    backButton: {
        backgroundColor: "#23232340",
        width: 40,
        height: 30,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 6,
        left: 10,
        zIndex: 1000,
        transform: [{ rotate: "180deg" }],
    },
    ertCircle: {
        borderWidth: 2,
        borderColor: "#66C32E",
    },
    bottomContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    emojiModal: {
        position: "absolute",
        height: "40%",
        bottom: "0%",
        zIndex: 2,
        backgroundColor: "#F5F5F5",
    },
});
