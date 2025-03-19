import { useFocusEffect, useNavigation } from "@react-navigation/core";
import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import FeedPost from "../components/FeedPost";
import PostSkeleton from "../components/FeedSkeleton/PostSkeleton";
import Loader from "../components/Loader";
import { LeftArrowSVG, SlashEyeSVG } from "../components/Svgs";
import useApp from "../hooks/useApp";
import useInvitation from "../hooks/useInvitation";
import usePosts from "../hooks/usePosts";
import { isScrollEnded } from "../services/util";

const PostDetail = ({ route }) => {
    const { post, isShared } = route.params;
    const navigation = useNavigation();
    const { userData, userJoinedChannels } = useApp();
    const { getPost, getReplies, getSharedPost } = usePosts();
    const [postData, setPostData] = useState(null);
    const [originalPostData, setOriginalPostData] = useState(null);
    const [postId, setPostId] = useState(post.id);
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [replyLength, setReplyLength] = useState(0);
    const [replyLoading, setReplyLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [myChannels, setMyChannels] = useState([]);
    const { getInvitation, getInvitations } = useInvitation();
    const [isVisible, setIsVisible] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [ERTVersionUserIds, setERTVersionUserIds] = useState([]);
    const getInvitationsData = async () => {
        try {
            const data = await getInvitations();
            const ERTVersionUserList = data
                .filter((item) => item?.status === "accepted")
                .map((item) => item.invitedBy?.id);
            ERTVersionUserList.push(userData?.id);
            setERTVersionUserIds(ERTVersionUserList);
        } catch (err) {
            console.log("ERTVersionUserIds error, ", err);
        }
    };
    useEffect(() => {
        getInvitationsData();
    }, []);

    const getUserChannels = async () => {
        setMyChannels(userJoinedChannels);
    };

    useFocusEffect(
        useCallback(() => {
            const fetchChannels = async () => {
                await getUserChannels();
            };
            fetchChannels();
        }, []),
    );

    useEffect(() => {
        setPostId(post.id);
        getPostData(post.id);
    }, [post]);
    useEffect(() => {
        getReplyData(page, post.id);
    }, [page]);

    const getPostData = async (id) => {
        setLoading(true);
        let data;
        try {
            data = isShared ? await getSharedPost(id) : await getPost(id);
            if (data.message) {
                setIsVisible(false);
                setErrorMessage(data.message);
                return;
            }
        } catch (e) {
            console.log(e);
            setErrorMessage(
                e.message ?? "This post doesn't exist or has been deleted.",
            );
            setIsVisible(false);
            setLoading(false);
            return;
        }

        try {
            if (data.replyingTo) {
                const originalData = await getPost(data.replyingTo.id);
                // bursted channel check whether current user joined or not
                let isJoined = false;
                if (originalData.channel) {
                    const channel = originalData.channel;
                    isJoined = userData.joinedChannels.some(
                        (joinedChannel) => joinedChannel.id === channel.id,
                    );
                }
                // check whether current user is team member or not
                let isTeamMember = false;
                const teamJoined = await getInvitation(userData.id);
                isTeamMember = teamJoined.some(
                    (team) => team.invitedBy.id === originalData.author.id,
                );
                if (
                    isJoined ||
                    isTeamMember ||
                    originalData.author.id === userData.id
                ) {
                    setOriginalPostData(originalData);
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                "This post doesn't exist or might have been deleted.",
            );
            setIsVisible(false);
        }
        setPostData(data);
        setLoading(false);
    };

    const getReplyData = async (page, id) => {
        if (replyLength >= postData?.counts?.reply) return;
        setReplyLoading(true);
        const data = await getReplies(id, page);
        setReplyLength(data.replies.length);

        setReplies((prev) =>
            page === 1 ? data.replies : [...prev, ...data.replies],
        );

        setReplyLoading(false);
    };

    const addLocalReply = (reply) => {
        setReplies((replies) => [...replies, reply]);
    };

    const handleLoadMore = () => {
        if (!loading && postData.counts.reply > replies.length) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const onScroll = ({ nativeEvent }) => {
        const scrollEnded = isScrollEnded(nativeEvent);
        if (scrollEnded) {
            handleLoadMore();
        }
    };

    const refreshPostDetail = async () => {
        await getPostData(postId);
        setPage(1);
    };
    const ListFooterComponent = () => {
        const shouldShowLoader =
            page > 0 && replies.length < postData?.counts?.reply;

        return (
            <View style={styles.loading}>
                {shouldShowLoader ? (
                    <Loader size="small" color="skyblue" />
                ) : (
                    <View style={{ height: 100 }} />
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.wrapper}>
                    <TouchableOpacity
                        onPress={navigation.goBack}
                        style={styles.backIcon}
                        testID="post-detail-back"
                    >
                        <LeftArrowSVG />
                    </TouchableOpacity>
                    <Text style={styles.text}>Post</Text>
                </View>
            </View>

            {!isVisible && (
                <View style={styles.notPublicContainer}>
                    <View style={styles.eyeIcon}>
                        <SlashEyeSVG />
                    </View>
                    <Text style={styles.notPublicText}>{errorMessage}</Text>
                </View>
            )}

            {isVisible && (
                <FlatList
                    data={replies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <FeedPost
                            key={item.id}
                            post={item}
                            type="feedReply"
                            content={item}
                            postIndex={0}
                            userData={userData}
                            isInsideDetail
                            itemIndex={index}
                            onRefresh={refreshPostDetail}
                            myChannels={myChannels}
                            authors={[
                                originalPostData?.author?.userName,
                                postData?.author?.userName,
                                item?.author?.userName,
                            ].filter(Boolean)}
                            ERTVersionUserIds={ERTVersionUserIds}
                            ListFooterComponent={<ListFooterComponent />}
                        />
                    )}
                    ListHeaderComponent={
                        <>
                            {!loading && originalPostData && (
                                <FeedPost
                                    post={originalPostData}
                                    type="single"
                                    content={[originalPostData]}
                                    postIndex={0}
                                    userData={userData}
                                    onRefresh={refreshPostDetail}
                                    myChannels={myChannels}
                                    authors={[
                                        originalPostData?.author?.userName,
                                    ]}
                                    ERTVersionUserIds={ERTVersionUserIds}
                                />
                            )}

                            {!loading && postData && (
                                <FeedPost
                                    post={postData}
                                    type={
                                        !originalPostData
                                            ? "single"
                                            : "feedReply"
                                    }
                                    content={[postData]}
                                    postIndex={0}
                                    addLocalReply={addLocalReply}
                                    userData={userData}
                                    hasReplies={replies.length > 0}
                                    onRefresh={refreshPostDetail}
                                    myChannels={myChannels}
                                    authors={[
                                        originalPostData?.author?.userName,
                                        postData?.author?.userName,
                                    ].filter(Boolean)}
                                    ERTVersionUserIds={ERTVersionUserIds}
                                />
                            )}

                            {loading && <PostSkeleton />}
                        </>
                    }
                    ListFooterComponent={<ListFooterComponent />}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default PostDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        width: "100%",
        paddingHorizontal: 20,
        flexDirection: "row",
        marginVertical: 10,
    },
    wrapper: {
        width: "55%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backIcon: {
        width: "15%",
    },
    text: {
        color: "#141619",
        fontSize: 16,
        fontWeight: "bold",
    },
    notPublicContainer: {
        alignItems: "center",
        backgroundColor: "#E2F4E1",
        width: "90%",
        height: 240,
        borderRadius: 10,
        opacity: 0.8,
        justifyContent: "center",
        alignContent: "center",
        alignSelf: "center",
        padding: 16,
        gap: 16,
        marginVertical: 16,
    },
    notPublicText: {
        color: "#141619",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    eyeIcon: {
        height: 50,
        width: 50,
        alignItems: "center",
    },
});
