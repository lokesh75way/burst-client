import { useNavigation } from "@react-navigation/core";
import dayjs from "dayjs";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageView from "react-native-image-viewing";

import {
    avatarPrefix,
    defaultAvatar,
    picturePrefix,
} from "../../config/constants";
import {
    getApprovedReviewsCount,
    getDateText,
    getImageUrl,
} from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import usePosts from "../../hooks/usePosts";
import EmojiBar from "../EmojiBar";
import PostActions from "../FeedPost/PostActions";
import PostSkeleton from "../FeedSkeleton/PostSkeleton";
import EditPostChannelModal from "../Modal/EditPostChannelModal";
import EmojiSelectionModal from "../Modal/EmojiSelectionModal";
import PostReplyModal from "../Modal/PostReplyModal";
import QuotePostModal from "../Modal/QuotePostModal";
import Ripple from "../Ripple";
import { ThreeDotsIcon, TrashSVG } from "../Svgs";
import AuthorImage from "./AuthorImage";
import ChannelTag from "./ChannelTag";
import ImageContainer from "./ImageContainer";
import PostText from "./PostText";
import QuotePreview from "./QuotePreview";

const FeedPost = (props) => {
    const {
        post,
        type,
        postIndex,
        content,
        userData,
        addLocalReply,
        setCurrentChannel,
        hasReplies,
        refreshing,
        onRefresh,
        isMainFeed = false,
        myChannels,
        currentChannel,
        removePost,
        isChannelDetail = false,
        authors = [],
        ERTVersionUserIds = [],
    } = props;
    const {
        author,
        text,
        media = [],
        createdAt,
        betaReviews,
        id,
        quote,
        counts = {},
        replies = [],
    } = post;
    const { userName, profileImageKey, displayName } = author;
    const {
        storage,
        updatedCounts,
        setUpdatedCounts,
        postReactions,
        setPostReactions,
        globalBurstedChannels,
        setGlobalBurstedChannels,
    } = useApp();
    const userId = storage.id;

    const { reactOnPost, deletePost } = usePosts();
    const navigation = useNavigation();
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
    const [showRipple, setShowRipple] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [ownReview, setOwnReview] = useState({});
    const [replyCount, setReplyCount] = useState(counts.reply);
    const [quoteCount, setQuoteCount] = useState(counts.quote);
    const [emojiVisible, setEmojiVisible] = useState(false);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showEditPostChannelsModal, setShowEditPostChannelModal] =
        useState(false);
    const [countsNew, setCountsNew] = useState({});
    const [countsNewFallback, setCountsNewFallBack] = useState(countsNew);
    const [postId] = useState(id);
    const postRef = useRef();
    const editPostChannelSheetRef = useRef();
    const burstSpecificChannelModalSheetRef = useRef();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [burstedChannels, setBurstedChannels] = useState(
        post.burstedChannels || [],
    );
    const [showBurstToChannelModal, setShowBurstToChannelModal] =
        useState(false);

    const flattenChannels = (channels) => {
        return channels.map(({ channel, ...rest }) => ({
            ...rest,
            ...channel,
        }));
    };

    useEffect(() => {
        if (post && post.burstedChannels) { 
            const flattened = flattenChannels(post.burstedChannels);
            setBurstedChannels(flattened);
            setGlobalBurstedChannels((prev) => ({
                ...prev,
                [post.id]: flattened,
            }));
    
        }
    }, [post.burstedChannels]);

    const postTypes = {
        single: type === "single",
        reply: type === "reply",
        quote: type === "quote",
        feed: type === "feed",
        feedReply: type === "feedReply",
    };

    useEffect(() => {
        const loadTimeout = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(loadTimeout);
    }, []);

    // betaReview calculation
    const approvedReviewsCount = getApprovedReviewsCount(
        betaReviews,
        author.id,
    );

    const [userBursted, setUserBursted] = useState(false);
    const validCount = betaReviews.filter((obj) => obj.approved).length;
    const [burstCount, setBurstCount] = useState(validCount);
    const goToDetail = (type) => {
        if (postRef.current && !postRef.current.disabled) {
            postRef.current.disabled = true;
            navigation.push("PostDetailStack", {
                screen: "PostDetail",
                params: {
                    post: type === "quote" ? quote : post,
                },
            });
            setTimeout(() => {
                postRef.current.disabled = false;
            }, 500);
        }
    };

    const handleRipple = (latestCount) => {
        setShowRipple(true);
        setTimeout(() => {
            setShowRipple(false);
        }, 2000);
    };
    const burstEventEmitter = () => {
        if (currentChannel !== 0 || type === "single") {
            // DeviceEventEmitter.emit("refreshFeed");
            // setShowRipple(false);
        }
    };

    useEffect(() => {
        const countIndex = updatedCounts.findIndex((obj) => obj.postId === id);
        const counts = {
            postId: post.id,
            replyCount,
            quoteCount,
            burstCount,
            userBursted,
        };
        if (countIndex !== -1) {
            const newCounts = updatedCounts;
            newCounts[countIndex] = counts;
            setUpdatedCounts([...newCounts]);
        } else {
            setUpdatedCounts((prev) => [...prev, counts]);
        }
    }, [replyCount, quoteCount, burstCount, userBursted]);

    useEffect(() => {
        const review = betaReviews.find(
            (review) => review.reviewer?.id === parseInt(userId),
        );
        setOwnReview(review);
        // console.log("review: ", review);
        if (review) {
            setUserBursted(true);
        } else {
            setUserBursted(false);
        }
    }, [betaReviews]);

    useEffect(() => {
        if (post) {
            const initialCountsNew = {};
            const reactions = post.reactions?.reduce(function (result, item) {
                result[item.emoji] = result[item.emoji] || [];
                result[item.emoji].push(item);
                return result;
            }, {});
            initialCountsNew[postId] = {
                ...post.counts,
                reactions: reactions ?? [],
            };
            setCountsNew(initialCountsNew);
            setPostReactions((prev) => ({
                ...prev,
                ...initialCountsNew,
            }));

            setCountsNewFallBack(initialCountsNew);
        }
    }, [post]);

    useEffect(() => {
        setReplyCount(counts.reply);
        setQuoteCount(counts.quote);
        setBurstCount(approvedReviewsCount);
    }, [counts, approvedReviewsCount]);

    const uploadAddEmoji = async (emoji) => {
        const data = JSON.stringify({
            emoji,
        });
        try {
            setCountsNewFallBack(countsNew);
            addLocalReaction(id, emoji);
            try {
                await reactOnPost(id, data);
            } catch (error) {
                setCountsNew(countsNewFallback);
                setPostReactions((prev) => ({
                    ...prev,
                    ...countsNewFallback,
                }));
                console.log("Error: ", error);
            }
        } catch (error) {
            console.error(error.response);
        }
    };

    const addLocalReaction = (postId, emoji) => {
        setCountsNew((prevCountsNew) => {
            return updateReactions(prevCountsNew, postId, emoji);
        });

        setPostReactions((prevPostReactions) => {
            return updateReactions(prevPostReactions, postId, emoji);
        });
    };

    const updateReactions = (prevState, postId, emoji) => {
        const newState = { ...prevState };

        if (!newState[postId]) {
            newState[postId] = { reactions: {} };
        } else {
            newState[postId] = {
                ...newState[postId],
                reactions: { ...newState[postId].reactions },
            };
        }

        const reactionsForPost = { ...newState[postId].reactions };

        if (!reactionsForPost[emoji]) {
            reactionsForPost[emoji] = [];
        } else {
            reactionsForPost[emoji] = [...reactionsForPost[emoji]];
        }

        // Ensure the userId is treated as a string for comparison
        const hasUserReacted = reactionsForPost[emoji].some((reaction) => {
            return String(reaction.author?.id) === String(userId);
        });

        if (hasUserReacted) {
            const updatedReactions = reactionsForPost[emoji].filter(
                (reaction) =>
                    !(
                        String(reaction.author?.id) === String(userId) &&
                        reaction.emoji === emoji
                    ),
            );

            if (updatedReactions.length === 0) {
                delete reactionsForPost[emoji];
            } else {
                reactionsForPost[emoji] = updatedReactions;
            }
        } else {
            reactionsForPost[emoji].push({
                id: Date.now(), // Unique reaction ID Only for FE
                emoji,
                post: { id: postId },
                author: {
                    id: userId,
                    userName: userData.userName,
                    profileImageKey: userData.profileImageKey,
                    profileImage: userData.profileImageKey
                        ? avatarPrefix + userData.profileImageKey
                        : avatarPrefix + defaultAvatar,
                },
                createdAt: new Date().toISOString(),
            });
        }

        newState[postId] = {
            ...newState[postId],
            reactions: reactionsForPost,
        };

        return newState;
    };

    const deleteConfirmationAlert = () => {
        Alert.alert(
            "Delete Reply",
            "Do you want to delete your Reply?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deletePost(postId);
                            if (onRefresh) {
                                onRefresh();
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    },
                },
            ],
            { cancelable: true },
        );
    };

    const images = useMemo(
        () =>
            media.map((item) => ({
                uri: picturePrefix + item.key,
            })),
        [media],
    );

    const imageUrl = useMemo(
        () => getImageUrl(profileImageKey),
        [profileImageKey],
    );
    const timeString = useMemo(() => getDateText(createdAt), [createdAt]);
    const timeStamp = dayjs(createdAt);
    const hourMinString = `${timeStamp.format("HH")}:${timeStamp.format("mm")}`;
    const ertNoReply =
        (ERTVersionUserIds.includes(author.id) || author.id === userData?.id) &&
        !postTypes.reply;
    const containerStyles = [
        postTypes.single
            ? styles.feedContainer
            : postTypes.feedReply
              ? styles.replyContainer
              : styles.feedContainer,

        ertNoReply &&
            (ERTVersionUserIds.includes(author.id) ||
                author.id === userData?.id) &&
            styles.replyContainer,
        replies.length === 0 && styles.border,
        isPressed &&
            (ERTVersionUserIds.includes(author.id) ||
                author.id === userData?.id) &&
            styles.ert,
        isPressed &&
            !(
                ERTVersionUserIds.includes(author.id) ||
                author.id === userData?.id
            ) &&
            styles.public,
    ];
    const isERTReply =
        (ERTVersionUserIds.includes(author.id) || author.id === userData?.id) &&
        !postTypes.feedReply;
    const isFeedOrReply = postTypes.feed || postTypes.reply;

    const isFeedReply = isFeedOrReply || postTypes.feedReply;

    if (loading) {
        return <PostSkeleton />;
    }
    return (
        <>
            <View style={isERTReply && styles.ertContainer}>
                {(ERTVersionUserIds.includes(author.id) ||
                    author.id === userData?.id) &&
                    ertNoReply &&
                    !postTypes.feedReply && (
                        <View style={styles.ertHeader}>
                            <Text style={styles.ertText}>
                                {displayName}'s Team
                            </Text>
                        </View>
                    )}
                {postTypes.feedReply &&
                    (ERTVersionUserIds.includes(author?.id) ||
                        author?.id === userData?.id) && (
                        <View style={styles.replyHeader} />
                    )}
                <TouchableOpacity
                    ref={postRef}
                    onPress={goToDetail}
                    onPressIn={() => {
                        setIsPressed(true);
                    }}
                    onPressOut={() => {
                        setIsPressed(false);
                    }}
                    activeOpacity={1}
                    style={containerStyles}
                    disabled={postTypes.single}
                    accessible={false}
                    testID="post"
                >
                    {/* {postTypes.single && (
                        <View style={styles.infoContainer}>
                            <AuthorImage
                                size={48}
                                isERT={
                                    ERTVersionUserIds.includes(author.id) ||
                                    author.id === userData?.id
                                }
                                imageUrl={imageUrl}
                                author={author}
                            /> */}

                    {/* <View style={styles.authorInfo}>
                                <Text style={styles.userName}>{userName}</Text>
                                <Text style={styles.lightText}>
                                    {timeString}
                                </Text>
                            </View> */}
                    {/* </View>
                    )} */}
                    {(isFeedReply || postTypes.single) && (
                        <View style={styles.authorLink}>
                            {postTypes.feedReply &&
                                !(
                                    ERTVersionUserIds.includes(author.id) ||
                                    author.id === userData?.id
                                ) && <View style={styles.upperConnector} />}
                            <AuthorImage
                                size={48}
                                isERT={ertNoReply}
                                imageUrl={imageUrl}
                                author={author}
                            />
                            {(isFeedOrReply || postTypes.single) &&
                                (hasReplies || replies.length > 0) && (
                                    <View style={styles.connector} />
                                )}
                        </View>
                    )}
                    <View
                        style={[
                            styles.postContainer,
                            postTypes.feedReply &&
                                !(
                                    ERTVersionUserIds.includes(author.id) ||
                                    author.id === userData?.id
                                ) &&
                                styles.topPadding,
                        ]}
                    >
                        {showRipple && (
                            <View style={styles.rippleContainer}>
                                <Ripple number={burstCount} />
                            </View>
                        )}

                        {(isFeedReply || postTypes.single) && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <View style={styles.authorInfo}>
                                    <Text style={styles.userName}>
                                        {displayName}
                                    </Text>
                                    <Text style={styles.lightText}>
                                        @{userName}•{timeString + " ago"}
                                    </Text>
                                </View>
                                {post.author.id === parseInt(userId, 10) &&
                                    postTypes.feedReply &&
                                    isMainFeed === false && (
                                        <TouchableOpacity
                                            onPress={deleteConfirmationAlert}
                                            testID="delete-reply"
                                        >
                                            <TrashSVG />
                                        </TouchableOpacity>
                                    )}
                                {post.author.id === parseInt(userId, 10) && !postTypes.feedReply && (
                                    <TouchableOpacity
                                        style={{ marginLeft: 8 }}
                                        onPress={() => {
                                            // setShowEditPostChannelModal(true);
                                            editPostChannelSheetRef.current?.open();
                                        }}
                                        testID="edit-post-icon"
                                    >
                                        <ThreeDotsIcon />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        {/* {post.burstedChannels && ( */}
                        {!post.replyingTo && (!isFeedReply || isMainFeed) && (
                            <ChannelTag
                                key={postId}
                                postId={postId}
                                burstedChannels={globalBurstedChannels[postId]}
                                setBurstedChannels={setGlobalBurstedChannels}
                                setCurrentChannel={setCurrentChannel}
                                isSingle={postTypes.single}
                                myChannels={myChannels}
                                isChannelDetail={isChannelDetail}
                                showBurstToChannelModal={
                                    showBurstToChannelModal
                                }
                                setShowBurstToChannelModal={
                                    setShowBurstToChannelModal
                                }
                                burstSpecificChannelModalSheetRef={
                                    burstSpecificChannelModalSheetRef
                                }
                                handleRipple={handleRipple}
                                disabled={author.id === userData.id}
                                currentChannel={currentChannel}
                                removePost={removePost}
                                burstEventEmitter={burstEventEmitter}
                            />
                        )}
                        {/* // )} */}
                        {text && (
                            <PostText
                                text={text}
                                textStyles={styles.text}
                                taggedUsers={post.tagedUsers}
                            />
                        )}

                        <ImageContainer
                            media={media}
                            setSelectedImageIndex={setSelectedImageIndex}
                            setImagePreviewVisible={setImagePreviewVisible}
                        />
                        {quote && (
                            <QuotePreview
                                onPress={() => {
                                    goToDetail("quote");
                                }}
                                type="post"
                                post={quote}
                                parentERT={ERTVersionUserIds.includes(
                                    author.id,
                                )}
                            />
                        )}
                        {postTypes.single && (
                            <View style={styles.hourString}>
                                <Text style={styles.infoText}>
                                    {hourMinString}
                                </Text>
                                <View style={styles.dot} />
                                <Text style={styles.infoText}>
                                    {dayjs(createdAt).format("DD/MM/YYYY")}
                                </Text>
                            </View>
                        )}
                        <EmojiBar
                            setEmojiVisible={(visible) => {
                                setEmojiVisible(visible);
                            }}
                            emojiVisible={emojiVisible}
                            emojiData={postReactions[postId]}
                            addEmoji={(emoji) => uploadAddEmoji(emoji)}
                            currentUserId={userId}
                        />
                        <PostActions
                            id={id}
                            replyingTo={post.replyingTo}
                            type={type}
                            showRipple={showRipple}
                            handleRipple={handleRipple}
                            burstCount={burstCount}
                            setBurstCount={setBurstCount}
                            userBursted={userBursted}
                            setUserBursted={setUserBursted}
                            isERT={
                                ERTVersionUserIds.includes(author.id) ||
                                author.id === userData?.id
                            }
                            counts={counts}
                            authorId={author.id}
                            setShowQuoteModal={setShowQuoteModal}
                            setShowReplyModal={setShowReplyModal}
                            replyCount={replyCount}
                            quoteCount={quoteCount}
                            userName={userName}
                            betaReviews={betaReviews}
                            isSingle={postTypes.single}
                            onRefresh={onRefresh}
                            burstedChannels={globalBurstedChannels[postId]}
                            setBurstedChannels={setGlobalBurstedChannels}
                            showBurstToChannelModal={showBurstToChannelModal}
                            setShowBurstToChannelModal={
                                setShowBurstToChannelModal
                            }
                            burstSpecificChannelModalSheetRef={
                                burstSpecificChannelModalSheetRef
                            }
                            setReplyCount={setReplyCount}
                            currentChannel={currentChannel}
                            removePost={removePost}
                            burstEventEmitter={burstEventEmitter}
                        />
                    </View>
                </TouchableOpacity>
                {replies.length > 0 &&
                    !postTypes.feedReply &&
                    !postTypes.single && (
                        <FeedPost
                            content={replies}
                            postIndex={0}
                            post={replies[0]}
                            type="feedReply"
                            userData={userData}
                            isMainFeed={isMainFeed}
                            myChannels={myChannels}
                            setCurrentChannel={setCurrentChannel}
                            authors={[
                                userName,
                                replies[0].author?.userName,
                            ].filter(Boolean)}
                            ERTVersionUserIds={ERTVersionUserIds}
                        />
                    )}
            </View>

            {emojiVisible && (
                <EmojiSelectionModal
                    emojiVisible={emojiVisible}
                    setEmojiVisible={setEmojiVisible}
                    uploadAddEmoji={uploadAddEmoji}
                />
            )}
            {showQuoteModal && (
                <QuotePostModal
                    post={post}
                    userData={userData}
                    setQuoteCount={setQuoteCount}
                    onCancel={() => {
                        setShowQuoteModal(false);
                    }}
                    onRefresh={onRefresh}
                />
            )}
            {showReplyModal && (
                <PostReplyModal
                    post={post}
                    userData={userData}
                    userName={userName}
                    addLocalReply={addLocalReply}
                    setReplyCount={setReplyCount}
                    onCancel={() => {
                        setShowReplyModal(false);
                    }}
                    authors={authors}
                />
            )}

            <EditPostChannelModal
                setShowEditPostChannelModal={setShowEditPostChannelModal}
                burstedChannels={globalBurstedChannels[postId]}
                setBurstedChannels={setGlobalBurstedChannels}
                postId={postId}
                onRefresh={onRefresh}
                currentChannel={currentChannel}
                removePost={removePost}
                sheetRef={editPostChannelSheetRef}
            />

            <ImageView
                images={images}
                imageIndex={selectedImageIndex}
                visible={imagePreviewVisible}
                onRequestClose={() => setImagePreviewVisible(false)}
            />
        </>
    );
};

export default memo(FeedPost);

const styles = StyleSheet.create({
    singleContainer: {
        alignItems: "flex-start",
        gap: 8,
        paddingTop: 14,
        paddingHorizontal: 15,
    },
    feedContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        paddingTop: 14,
        paddingHorizontal: 15,
    },
    ertContainer: {
        backgroundColor: "#E2F4E1",
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: "#CED5DC",
    },
    postContainer: {
        width: "100%",
        flex: 1,
    },
    textContainer: {},
    imageContainer: {},
    authorInfo: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: "85%",
        gap: 2,
        flexWrap: "wrap",
    },
    userName: {
        color: "#141619",
        fontSize: 20,
        fontWeight: "bold",
    },
    userNameText: {
        color: "#687684",
        fontSize: 18,
    },
    lightText: {
        color: "#687684",
        fontSize: 16,
        marginLeft: 8,
    },
    dot: {
        width: 3,
        height: 3,
        backgroundColor: "#687684",
        borderRadius: 10,
        alignSelf: "center",
        marginHorizontal: 8,
    },
    text: {
        color: "#141619",
        fontSize: 15,
    },
    ertHeader: {
        backgroundColor: "#66C32E",
        paddingVertical: 8,
    },
    replyHeader: {
        borderLeftColor: "#CED5DC",
        borderLeftWidth: 2,
        // backgroundColor: "#66C32E",
        paddingVertical: 8,
        marginLeft: 38,
        marginBottom: 2,
        flex: 1,
    },
    replyHeaderDetail: {
        flex: 1,
        borderLeftColor: "#CED5DC",
        borderLeftWidth: 2,
        backgroundColor: "#66C32E",
        paddingVertical: 8,
        marginLeft: 0,
        marginBottom: 2,
    },
    marginPlaceholder: {
        width: 38,
        marginBottom: 2,
        backgroundColor: "#66C32E",
    },
    ertText: {
        textAlign: "center",
        fontSize: 12,
        color: "#fff",
        fontWeight: "bold",
    },
    hourString: {
        flexDirection: "row",
        marginVertical: 5,
    },
    infoText: {
        color: "#687684",
        fontSize: 13,
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    public: {
        backgroundColor: "rgba(0,0,0,0.04)",
    },
    ert: {
        backgroundColor: "#E2F4E160",
    },
    rippleContainer: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        top: "50%",
        zIndex: 100,
    },
    authorLink: {
        height: "100%",
        alignItems: "center",
    },
    connector: {
        width: 2,
        backgroundColor: "#CED5DC",
        borderRadius: 8,
        flex: 1,
        marginTop: 2,
    },
    upperConnector: {
        width: 2,
        backgroundColor: "#CED5DC",
        borderRadius: 8,
        height: 20,
    },
    replyContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        paddingHorizontal: 15,
    },
    topPadding: {
        paddingTop: 20,
    },
});
