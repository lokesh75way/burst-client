import { useIsFocused } from "@react-navigation/core";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
    DeviceEventEmitter,
    Linking,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

import DeviceInfo from "react-native-device-info";
import Feed from "../components/Feed";
import FeedSkeleton from "../components/FeedSkeleton";
import TapToGo from "../components/TapToGo";
import theme from "../config/theme";
import useApp from "../hooks/useApp";
import useFeeds from "../hooks/useFeeds";
import useLogs from "../hooks/useLogs";
import useNotifications from "../hooks/useNotifications";
import useUsers from "../hooks/useUsers";

/**
 * Renders the Home component.
 * This component displays the main content of the application.
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object.
 * @returns {JSX.Element} React component for the home screen.
 */
const Home = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [content, setContent] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [channelPage, setChannelPage] = useState(1);
    const [initialLoad, setInitialLoad] = useState(false);
    const [pageLastTime, setPageLastTime] = useState(0);
    const [tapStep, setTapStep] = useState(0);
    const { feedForYou } = useFeeds();
    const { logUIRenderTime } = useLogs();
    const isFocused = useIsFocused();
    const { initializeNotifications } = useNotifications();
    const {
        storage,
        setUnreadNotificationCount,
        reload,
        setReload,
        setTotalMemory,
    } = useApp();
    const [isOnboarded, setIsOnboarded] = useState(true);
    const [currentChannel, setCurrentChannel] = useState(0);
    const [endReached, setEndReached] = useState(false);
    const { getUnreadNotificationCount } = useUsers();
    const [feedLength, setFeedLength] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    /**
     * Fetches data for the content.
     * @async
     * @function fetchData
     * @returns {void}
     */
    const fetchData = useCallback(async () => {
        if (isLoading || endReached || currentChannel !== 0) return;
        if (content.length >= feedLength) {
            setEndReached(true);
            return;
        }
        try {
            setIsLoading(true);
            const resp = await feedForYou(page);
            const responseTime = Date.now();
            const data = resp.posts;
            setFeedLength(resp.count);
            if (data.length === 0) {
                setPage((page) => page + 1);
                setEndReached(true);
            }
            const isInitial = page === 1;
            if (data) {
                setContent((content) => {
                    // Combine current content with new data and filter unique values by 'id'
                    const combinedContent = isInitial
                        ? data
                        : [...content, ...data];

                    return combinedContent;
                });
                const contentSetTime = Date.now();
                await logUIRenderTime(
                    resp.logLatencyId,
                    contentSetTime - responseTime,
                );
            }
        } catch (error) {
            console.log(error);
        } finally {
            setInitialLoad(false);
            setRefreshing(false);
            setIsLoading(false);
            if (page < 2) {
                setPage((page) => page + 1);
            }
        }
    }, [page, isLoading, endReached, feedLength]);

    const handleDeepLink = (event) => {
        const url = event.url;
        if (url.includes("/post/")) {
            const postId = url.split("/post/")[1];
            if (postId) {
                navigation.push("PostDetailStack", {
                    screen: "PostDetail",
                    params: {
                        post: { id: postId },
                        isShared: true,
                    },
                });
            }
        }
    };

    useEffect(() => {
        const refreshListener = DeviceEventEmitter.addListener(
            "refreshFeed",
            onRefresh,
        );
        return () => {
            refreshListener.remove();
        };
    }, []);

    useEffect(() => {
        // Listener for app opens via deep links
        Linking.addEventListener("url", handleDeepLink);

        // Handle app open directly from a deep link
        Linking.getInitialURL().then((url) => {
            if (url && url.includes("/post/")) {
                const postId = url.split("/post/")[1];
                if (postId) {
                    navigation.push("PostDetailStack", {
                        screen: "PostDetail",
                        params: {
                            post: { id: postId },
                            isShared: true,
                        },
                    });
                }
            }
        });

        return () => {
            Linking.removeAllListeners("url");
        };
    }, []);

    // Define a function that fetches data and memoize it
    const fetchAndSetData = () => {
        if (page !== 1) {
            setPage(1);
        } else {
            fetchData();
        }
    };

    useEffect(() => {
        if (isFocused) {
            // fetchAndSetData();
        }
    }, [isFocused]);

    useEffect(() => {
        fetchData();
    }, [page]);

    useEffect(() => {
        initializeNotifications();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            console.log("Route params: ", route.params);
            if (route.params?.reloadFeed || reload) {
                console.log("Reloading feed...: ", route.params.reloadFeed);
                onRefresh();
                setReload(false);
                navigation.setParams({ reloadFeed: false });
            }
        });
        return unsubscribe;
    }, [navigation, route.params]);

    useEffect(() => {
        async function checkTotalMemory() {
            try {
                const totalMemoryBytes = await DeviceInfo.getTotalMemory();
                const totalMemoryGB = totalMemoryBytes / (1024 * 1024 * 1024);
                setTotalMemory(totalMemoryGB);
            } catch (error) {
                console.error("Error fetching memory info:", error);
            }
        }

        checkTotalMemory();
    }, []);

    useEffect(() => {
        if (route.params?.refreshFeed) {
            onRefresh();
        }
        navigation.setParams({ refreshFeed: false });
    }, [route.params?.refreshFeed]);

    const fetchNotificationNumber = async () => {
        try {
            if (storage.id) {
                const data = await getUnreadNotificationCount();
                setUnreadNotificationCount(data.unreadNotificationCount);
            }
        } catch (error) {
            console.log("Error: in home", error);
        }
    };

    const onRefresh = async () => {
        try {
            setPage(1);
            setRefreshing(true);
            // setContent([]);
            // setcommunityData([]);
            setChannelPage(1);
            setEndReached(false);
            setIsLoading(false);
            // const data = await feedForYou(1);
            // if (data) {
            //     setContent(data);
            // }
            await fetchNotificationNumber();
        } catch (error) {
            console.log("Error refreshing feed: ", error);
        } finally {
            setInitialLoad(false);
        }
    };

    useEffect(() => {
        setIsOnboarded(storage.isOnboarded !== "false");
    }, [storage]);
    // TODO: here for test only
    const showTap = isOnboarded === false && tapStep < 3 && !initialLoad;
    // const showTap = true;
    return (
        <>
            <StatusBar
                // translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />

            <SafeAreaView style={styles.wrapper}>
                {showTap && (
                    <TapToGo
                        tapStep={tapStep}
                        setTapStep={setTapStep}
                        loadFeed={() => {
                            setInitialLoad(true);
                            onRefresh();
                        }}
                    />
                )}

                <View styles={styles.container}>
                    {initialLoad && <FeedSkeleton />}
                    {!initialLoad && (
                        <Feed
                            content={content}
                            setContent={setContent}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            page={page}
                            setPage={setPage}
                            isFocused={isFocused}
                            currentChannel={currentChannel}
                            setCurrentChannel={setCurrentChannel}
                            endReached={endReached}
                            channelPage={channelPage}
                            setChannelPage={setChannelPage}
                            isOnboarded={isOnboarded}
                            setEndReached={setEndReached}
                            isLoading={isLoading}
                        />
                    )}
                    {!initialLoad && content.length === 0 && (
                        <Text style={styles.noPost}>
                            No visible posts available.
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
};
const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: "#fff" },
    container: {
        flex: 1,
        width: "100%",
    },
    noPost: {
        fontSize: 16,
        fontWeight: "500",
        color: theme.colors.grey,
        marginVertical: 20,
        textAlign: "center",
    },
});
export default Home;
