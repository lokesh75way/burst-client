import { useRoute } from "@react-navigation/core";
import React, { useEffect, useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PostCard from "../components/PostCard";
import useFeeds from "../hooks/useFeeds";
import usePosts from "../hooks/usePosts";
import useUsers from "../hooks/useUsers";
const Hero = (props) => {
    const {
        setPageLastTime,
        content,
        setContent,
        setPage,
        refreshing,
        onRefresh,
        isFocused,
    } = props;

    const [currentPostId, setCurrentPostId] = useState(null);
    const [currentPosterId, setCurrentPosterId] = useState(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [userId, setUserId] = useState("");
    const { getPost } = usePosts();
    const { feedForYou } = useFeeds();
    const { me } = useUsers();

    const inset = useSafeAreaInsets();
    const screenHeight = Dimensions.get("screen").height;
    const height = screenHeight - inset.bottom - (screenHeight * 12) / 100;

    const fetchUserData = async () => {
        const user = await me();
        if (user) {
            setUserId(user.id);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const clearEmoji = () => {
        // setNewSelectedEmojis({});
    };

    /**
     * Clears the selected emoji and closes the full-screen picture view.
     */
    // const clear = () => {
    //     clearEmoji();
    //     setShowFullScreenPicture(false);
    // };

    /**
     * Updates countsNew state with new counts for a specific post.
     *
     * @param {string} id - The identifier of the post.
     * @param {object} newCounts - The new counts data for the post.
     */
    // const updateCountsNew = (id, newCounts) => {
    //     setCountsNew((prevCountsNew) => ({
    //         ...prevCountsNew,
    //         [id]: newCounts,
    //     }));
    // };

    /**
     * Updates the userBursted state for a specific post.
     *
     * @param {string} id - The identifier of the post.
     * @param {boolean} newUserBursted - The new user bursted status.
     */
    // const updateUserBursted = (id, newUserBursted) => {
    //     setUserBursted((prevUserBursted) => ({
    //         ...prevUserBursted,
    //         [id]: newUserBursted,
    //     }));
    // };

    /**
     * Updates loadedPages state for a specific post.
     *
     * @param {string} id - The identifier of the post.
     * @param {any} newValue - The new value to set for the loaded page.
     */
    const updateLoadedPages = (id, newValue) => {
        setLoadedPages((prevLoadedPages) => ({
            ...prevLoadedPages,
            [id]: newValue,
        }));
    };

    /**
     * Handles the event when a page is selected within a viewpager.
     *
     * @param {Event} e - The event object containing the selected page's information.
     */
    const onPageSelected = async (e) => {
        // setSelected(e.nativeEvent.position);
        setPageLastTime(e.nativeEvent.position);
        // clear(); // initial states
        const postId = content[e.nativeEvent.position].id;
        const posterId = content[e.nativeEvent.position].author.id;
        setCurrentPostId(postId);
        setCurrentPosterId(posterId);

        const newPageIndex = e.nativeEvent.position;

        // set last page unloaded
        if (content[newPageIndex - 1]) {
            updateLoadedPages(content[newPageIndex - 1].id, false);
        }
        // 预加载当前页后的三页数据
        // Preloads data for the current page and the subsequent three pages

        const pagesToPreload = [
            newPageIndex,
            newPageIndex + 1,
            newPageIndex + 2,
            newPageIndex + 3,
            newPageIndex + 4,
            newPageIndex + 5,
            newPageIndex - 1,
        ];
        setCurrentPageIndex(newPageIndex);
        // Preloads data for the specified pages

        // 预加载页面数据
        await Promise.all(
            pagesToPreload.map((pageIndex) => preloadPageData(pageIndex)),
        );
    };

    /**
     * Manages the state of loaded pages within the content, initially setting all pages as unloaded.
     */
    const [loadedPages, setLoadedPages] = useState(() => {
        const initialLoaded = {};
        content.forEach((item) => {
            initialLoaded[item.id] = false;
        });
        return initialLoaded;
    });

    /**
     * Fetches and preloads data for a specific page index if it's not already loaded.
     *
     * @param {number} pageIndex - The index of the page to preload data for.
     */
    const preloadPageData = async (pageIndex) => {
        if (pageIndex >= 0 && pageIndex < content.length) {
            const postId = content[pageIndex].id;
            // 检查页面是否已加载
            if (!loadedPages[postId]) {
                try {
                    const response = await getPost(postId);
                    // updateCountsNew(response.id, response.counts);
                    // updateUserBursted(response.id, response.userBursted);
                    // 标记页面为已加载
                    updateLoadedPages(postId, true);
                } catch (error) {
                    // 处理网络请求异常
                    console.log("Error: ", error.response);
                }
            }
        }
    };

    /**
     * Refreshes the content by fetching new data.
     */
    const refreshContent = async () => {
        try {
            const data = await feedForYou();
            setContent(data);
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };
    // Check if there's a route param to scroll to the top
    const route = useRoute();

    useEffect(() => {
        if (isFocused && route?.params?.scrollToTop) {
            refreshContent();
        }
    }, [isFocused, route]);

    /**
     * Ref to store the timer for handling page scroll.
     */
    const dragTimer = useRef(null); // useRef to store the timer

    /**
     * Handles the page scroll events and triggers actions based on the scroll position.
     *
     * @param {Event} e - The scroll event.
     */
    const handlePageScroll = (e) => {
        const position = e.nativeEvent.position;
        // If on the first page and dragging upwards
        if (position < 0) {
            // Clear any previous timer
            if (dragTimer.current) {
                clearTimeout(dragTimer.current);
            }

            // Start a new timer
            dragTimer.current = setTimeout(() => {
                // Refresh function goes here
                refreshContent();
            }, 500);
        }
        // If on the last page and dragging downwards
        else if (position === content.length - 1 && e.nativeEvent.offset > 0) {
            if (dragTimer.current) {
                clearTimeout(dragTimer.current);
            }

            dragTimer.current = setTimeout(() => {
                // fetchNewData function goes here
            }, 500);
        }
    };

    /**
     * Ref for accessing the pager view instance.
     */
    const pagerViewRef = useRef(null);
    const flatListRef = useRef(null);

    /**
     * Fetch the more data when last 4 posts left to scroll.
     *
     * @param {string} snapIndex - The index of current post.
     */
    const onEndReached = () => {
        setPage((page) => page + 1);
    };

    return (
        <>
            <View
                style={[styles.container, { height }]}
                ref={pagerViewRef}
                orientation="vertical"
                onPageSelected={async (e) => {
                    onPageSelected(e);
                }}
                // initialPage={currentPageIndex}
                initialPage={0}
                currentPage={currentPageIndex}
                overScrollMode="always"
                overdrag
                setScrollEnabled
            >
                {/* {content.length > 0 ? ( */}
                <FlatList
                    ref={flatListRef}
                    data={content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    keyExtractor={(item) => item.id}
                    onEndReached={onEndReached}
                    onEndReachedThreshold={4}
                    showsVerticalScrollIndicator={false}
                    pagingEnabled
                    renderItem={({ item, index }) => (
                        <PostCard
                            type="feed"
                            isERT={item.isERT}
                            height={height}
                            content={content}
                            post={item}
                            postIndex={index}
                            userId={userId}
                            loadedPages={loadedPages}
                            currentPageIndex={currentPageIndex}
                            currentPosterId={currentPosterId}
                            currentPostId={currentPostId}
                            refreshContent={refreshContent}
                            setCurrentPostId={setCurrentPostId}
                        />
                    )}
                />
                {/* ) : (
                    <View>
                        <Text style={styles.emptyText}>
                            Waiting for new posts...
                        </Text>
                    </View>
                )} */}
            </View>
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
    },
    profileImage: {
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
    footer: {
        position: "absolute",
        left: 0,
        rigth: 0,
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
        rigth: 0,
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
        paddingHorizontal: 19,
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
    description: {
        fontSize: 28,
        fontWeight: "700",
        // fontFamily: 'Montserrat',
        color: "#FFF",
        lineHeight: 33.414,
        letterSpacing: -0.56,
        paddingHorizontal: 21,
        width: "100%",
    },
    descriptionBox: {
        height: "75%",
        width: "100%",
        justifyContent: "flex-end",
    },
    postTime: {
        fontSize: 12,
        fontWeight: "400",
        color: "#0F4564",
        // fontFamily: 'SF Pro'
    },
    viewContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 20,
    },
    boundary: {
        paddingHorizontal: 13,
        paddingVertical: 13,
        backgroundColor: "white",
    },
    boundaryCover: {
        paddingBottom: "2.6%",
    },
    emptyText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#0F4564",
        textAlign: "center",
        marginTop: "30%",
    },
});

export default Hero;
