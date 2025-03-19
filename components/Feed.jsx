import { useNavigation, useRoute } from "@react-navigation/core";
import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    DeviceEventEmitter,
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import useApp from "../hooks/useApp";
import useChannels from "../hooks/useChannels";
import useFeeds from "../hooks/useFeeds";
import useInvitation from "../hooks/useInvitation";
import useUsers from "../hooks/useUsers";
import ChannelBar from "./ChannelBar";
import Channels from "./Channels";
import FeedPost from "./FeedPost";
import FeedSkeleton from "./FeedSkeleton";
import Loader from "./Loader";
import InviteMoreModal from "./Modal/InviteMoreModal";

const Feed = (props) => {
    const {
        content,
        refreshing,
        onRefresh,
        page,
        setPage,
        isFocused,
        setContent,
        currentChannel,
        setCurrentChannel,
        channelPage,
        setChannelPage,
        endReached,
        isOnboarded,
        isLoading,
    } = props;
    const route = useRoute();
    const navigation = useNavigation();
    const { me } = useUsers();
    const {
        userData,
        setUserData,
        userJoinedChannels,
        setUserJoinedChannels,
        totalMemory,
    } = useApp();
    const { communityFeed } = useFeeds();
    const [showChannelsScreen, setShowChannelsScreen] = useState(false);
    const [refreshBar, setRefreshBar] = useState(false);
    const flatListRef = useRef(null);
    const [feedData, setFeedData] = useState([]);
    const [isLoadingChannel, setIsLoadingChannel] = useState(false);
    const { getYourTeam, getInvitations } = useInvitation();
    const [myChannels, setMyChannels] = useState([]);
    const { getMyChannels } = useChannels();
    const [channelFeedCount, setChannelFeedCount] = useState(0);
    const [channelRefreshing, setChannelRefreshing] = useState(false);
    const inviteMoreSheetRef = useRef();
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
        const resp = await getMyChannels();
        const combinedChannels = [
            ...resp.userPrivateChannels,
            ...resp.userPublicChannels,
            ...resp.joinedPrivateChannels,
            ...resp.joinedPublicChannels,
        ];
        setMyChannels(combinedChannels);
        setUserJoinedChannels(combinedChannels);
    };
    useEffect(() => {
        const setAndGetInviteMoreSheetShown = async () => {
            try {
                let storedValue = await AsyncStorage.getItem(
                    "inviteMoreSheetShown",
                );
                if (storedValue === null) {
                    storedValue = "false";
                    await AsyncStorage.setItem(
                        "inviteMoreSheetShown",
                        storedValue,
                    );
                }
            } catch (error) {
                console.error("Error accessing AsyncStorage:", error);
            }
        };
        setAndGetInviteMoreSheetShown();
    }, []);

    useEffect(() => {
        const fetchChannels = async () => {
            await getUserChannels();
        };
        fetchChannels();
    }, [refreshBar]);

    useEffect(() => {
        if (currentChannel > 0) {
            setChannelPage(1);
        }
    }, [currentChannel]);

    const onEndReached = () => {
        if (isLoading) return;
        if (currentChannel > 0 && channelFeedCount > feedData.length) {
            setChannelPage((page) => page + 1);
            if (channelPage > 1) {
                handleChannelPagination();
            }
        } else if (currentChannel === 0) {
            setPage((page) => page + 1);
        }
    };

    const fetchUserData = useCallback(async () => {
        let user;
        try {
            user = await me();
        } catch (error) {
            console.log("Error fetching user data: ", error.message);
        }
        if (user) {
            setUserData(user);
            const isInviteMoreSheetShownAlready = await AsyncStorage.getItem(
                "inviteMoreSheetShown",
            );
            try {
                const response = await getYourTeam();
                if (
                    response.length < 3 &&
                    isOnboarded &&
                    !isInviteMoreSheetShownAlready
                ) {
                    inviteMoreSheetRef?.current?.open();
                }
            } catch (error) {
                console.log("Error fetching team data: ", error.message);
            }
        } else {
            navigation.replace("Login");
        }
    }, [userData, isOnboarded]);

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (isFocused && route?.params?.scrollToTop) {
            refreshContent();
        }
    }, [route]);

    const refreshContent = async () => {
        try {
            if (showChannelsScreen) {
                setShowChannelsScreen(false);
                setCurrentChannel(0);
            }
            // const data = await feedForYou();
            // setContent(data);
            // setFeedData(content);
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

    const fetchChannelData = async () => {
        setChannelPage(1);
        setIsLoadingChannel(true); // Start loading
        try {
            if (currentChannel > 0) {
                // console.log("Community Feed");
                const data = await communityFeed(currentChannel, 1);
                setFeedData(data.posts);
                setChannelFeedCount(data.count);
            } else {
                setFeedData(content);
                // console.log("For You Feed: ", content);
            }
            // console.log("Feed data: ", feedData);
        } catch (error) {
            console.log("Error fetching channel data: ", error.message);
        } finally {
            setIsLoadingChannel(false); // End loading
            setChannelRefreshing(false);
        }
    };
    useEffect(() => {
        fetchChannelData();
        // if (currentChannel === 0) {
        //     onRefresh();
        // }
    }, [currentChannel]);

    const handleChannelPagination = async () => {
        if (isLoadingChannel || currentChannel === 0) return;
        if (channelFeedCount <= feedData.length) return;

        try {
            const data = await communityFeed(currentChannel, channelPage);
            setFeedData((prevFeedData) => {
                return [...prevFeedData, ...data.posts];
            });
        } catch (error) {
            console.log("Error fetching channel data: ", error.message);
        }
    };

    // useEffect(() => {
    //     if (
    //         channelPage > 1 &&
    //         currentChannel > 0 &&
    //         channelFeedCount >= feedData.length
    //     ) {
    //         handleChannelPagination();
    //     }
    // }, [channelPage]);

    useEffect(() => {
        // console.log("useEffect - fetchFeedData: ", feedData);
        const fetchFeedData = async () => {
            if (currentChannel === 0) {
                setIsLoadingChannel(true);
                try {
                    // console.log("fetchFeedData - content: ", content);
                    setFeedData(content);
                } catch (error) {
                    console.log("fetchFeedData error: ", error.message);
                } finally {
                    if (feedData.length > 0) {
                        console.log("Feed data length is greater than 0");
                        setIsLoadingChannel(false);
                    } else {
                        console.log("Feed data length is 0");
                        setIsLoadingChannel(true);
                    }
                }
            }
        };

        fetchFeedData();
    }, [page]);

    useEffect(() => {
        if (feedData.length > 0) {
            setIsLoadingChannel(false);
        } else {
            // setIsLoadingChannel(true);
        }
    }, [feedData]);

    const refreshChannel = () => {
        setChannelRefreshing(true);
        setFeedData([]);
        setChannelFeedCount(0);
        setChannelPage(1);
        fetchChannelData();
    };

    const removePost = (id) => {
        setFeedData((prevFeedData) =>
            prevFeedData.filter((post) => post.id !== id),
        );
    };

    const ListFooterComponent = () => {
        const shouldShowLoader =
            (currentChannel > 0 && feedData.length < channelFeedCount) ||
            (currentChannel === 0 && !endReached);

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

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener(
            "getChannels",
            () => {
                getUserChannels();
            },
        );
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (refreshBar) {
            getMyChannels();
            setRefreshBar(false);
        }
    }, [refreshBar]);

    useEffect(() => {
        if (currentChannel === 0) {
            onRefresh();
        }
    }, [currentChannel]);

    const handelRefresh = () => {
        if (currentChannel === 0) {
            onRefresh();
        } else if (currentChannel > 0) {
            refreshChannel();
        }
        setRefreshBar(true);
    };

    const feedDataMemoized = useMemo(() => feedData, [feedData]);
    const memoizedRenderItem = useCallback(
        ({ item, index }) => (
            <FeedPost
                postIndex={index}
                post={item}
                type="feed"
                userData={userData}
                currentChannel={currentChannel}
                setCurrentChannel={setCurrentChannel}
                refreshing={refreshing}
                onRefresh={onRefresh}
                isMainFeed={true}
                myChannels={myChannels}
                removePost={removePost}
                ERTVersionUserIds={ERTVersionUserIds}
            />
        ),
        [feedData, userData, currentChannel, myChannels],
    );

    return (
        <View style={styles.container}>
            <ChannelBar
                channels={userJoinedChannels}
                setChannels={setMyChannels}
                currentChannel={currentChannel}
                setCurrentChannel={setCurrentChannel}
                showChannelScreen={showChannelsScreen}
                setShowChannelsScreen={setShowChannelsScreen}
                refreshBar={refreshBar}
            />
            {isLoadingChannel && <FeedSkeleton />}
            {!showChannelsScreen &&
                !isLoadingChannel &&
                feedData.length === 0 &&
                currentChannel !== 0 && (
                    <Text
                        style={{
                            color: "#aaa",
                            padding: 30,
                            textAlign: "center",
                        }}
                    >
                        No Post in This Channel
                    </Text>
                )}
            {!showChannelsScreen &&
                feedData.length > 0 &&
                !isLoadingChannel && (
                    <FlatList
                        removeClippedSubviews={totalMemory <= 4}
                        maxToRenderPerBatch={4}
                        initialNumToRender={8}
                        ref={flatListRef}
                        data={feedDataMemoized}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handelRefresh}
                            />
                        }
                        keyExtractor={(item) => item.id}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={page > 2 ? 0.5 : 0.25}
                        showsVerticalScrollIndicator={false}
                        renderItem={memoizedRenderItem}
                        ListFooterComponent={<ListFooterComponent />}
                    />
                )}
            {showChannelsScreen && <Channels setRefreshBar={setRefreshBar} />}
            {/* {showInviteMoreModal && ( */}
            <InviteMoreModal sheetRef={inviteMoreSheetRef} />
            {/* )} */}
        </View>
    );
};

export default memo(Feed);

const styles = StyleSheet.create({
    container: {
        paddingBottom: "15%",
    },
    loading: {
        marginBottom: Dimensions.get("screen").height * 0.08,
    },
    loadingChannelContainer: {
        marginTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});
