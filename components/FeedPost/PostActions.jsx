import React, { useEffect, useRef, useState } from "react";
import { Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Clipboard from "expo-clipboard";
import { showMessage } from "react-native-flash-message";
import { Menu } from "react-native-paper";
import useApp from "../../hooks/useApp";
import usePosts from "../../hooks/usePosts";
import BurstSpecificChannelModal from "../Modal/BurstSpecificChannelModal";
import WarningModal from "../Modal/WarningModal";
import { ShareIcon } from "../Svgs";
import QuoteSVG from "../Svgs/QuoteSVG";
import ReplySVG from "../Svgs/ReplySVG";

const PostActions = (props) => {
    const {
        id,
        replyingTo,
        isERT,
        setShowQuoteModal,
        setShowReplyModal,
        replyCount,
        quoteCount,
        userBursted,
        setUserBursted,
        burstCount,
        setBurstCount,
        authorId,
        showRipple,
        handleRipple,
        userName,
        refreshing,
        onRefresh,
        burstedChannels,
        setBurstedChannels,
        showBurstToChannelModal,
        setShowBurstToChannelModal,
        burstSpecificChannelModalSheetRef,
        setReplyCount,
        currentChannel,
        removePost,
        burstEventEmitter,
    } = props;
    const { reviewPost } = usePosts();
    const { updatedCounts, setUpdatedCounts, storage } = useApp();
    const [showModal, setShowModal] = useState(false);
    const { getPost } = usePosts();
    const [selectedItems, setSelectedItems] = useState([]);
    const [burstInfo, setBurstInfo] = useState({});
    // const [showBurstToChannelModal, setShowBurstToChannelModal] =
    //     useState(false);
    const [unBurstedChannels, setUnBurstedChannels] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const shareLink = `${process.env.EXPO_PUBLIC_SHARE_URL}?postId=${id}`;

    const userId = storage.id;
    const allowBurst = true;
    const warningModalSheetRef = useRef();
    // const allowBurst = authorId.toString() !== userId;
    const handleBurst = (channelIds, unburstIds) => {
        console.log(unBurstedChannels);
        setUnBurstedChannels((prevUnBurstedChannels) =>
            prevUnBurstedChannels.filter((id) => !channelIds.includes(id)),
        );
        let newCount;
        if (channelIds.length === 0) {
            newCount = userBursted ? burstCount - 1 : burstCount;
            // setUserBursted(false);
            if (!userBursted) {
                setShowBurstToChannelModal(false);
                burstSpecificChannelModalSheetRef.sheetRef?.close();
                return;
            }
        } else {
            newCount = userBursted ? burstCount : burstCount + 1;
            // setUserBursted(true);
        }
        if (newCount >= burstCount && channelIds.length !== 0) {
            setLatestUserBursted(true);
            setUserBursted(true);
            setIsFilled(true);
        } else {
            setLatestUserBursted(false);
            setUserBursted(false);
            setIsFilled(false);
        }
        setShowBurstToChannelModal(false);
        burstSpecificChannelModalSheetRef.sheetRef?.close();

        console.log("burstCount: " + burstCount);
        console.log("newCount: " + newCount);
        setBurstCount(newCount);

        reviewForBackend(channelIds, unburstIds);
        if (!userBursted) {
            handleRipple(burstCount + 1);
        } else {
            handleRipple();
        }
    };
    const reviewForBackend = async (channelIds, unburstIds) => {
        try {
            const reviewPostData = await reviewPost(id, channelIds, unburstIds);
            console.log(
                "reviewForBackend reviewPost: ",
                "id=",
                id,
                " channelIds=",
                channelIds,
            );
            // setTimeout(() => {
            //     onRefresh();
            // }, 2000);
            // burstEventEmitter();
        } catch (error) {
            console.error("error: " + error);
            // error is [object Object], print the error message
            console.error("error message: " + error.message);
        }
    };

    const constructShareLink = async (id, getPost) => {
        let currentId = id;
        let originalData = null;

        while (currentId) {
            originalData = await getPost(currentId);
            console.log("originalData: ", originalData);
            if (!originalData?.replyingTo) break;
            currentId = originalData.replyingTo.id;
        }

        // const token = await storage.getItem("token");

        return `${process.env.EXPO_PUBLIC_SHARE_URL}?postId=${
            originalData?.id || id
        }`;
        // return `${process.env.EXPO_PUBLIC_SHARE_URL}/post/${
        //     originalData?.id || id
        // }`;
    };

    const sharePost = async () => {
        try {
            setMenuVisible(false);
            const shareLink = await constructShareLink(id, getPost);
            await Share.share({
                url: shareLink,
                title: "Share Post",
            });
        } catch (error) {
            console.error("Error sharing the post:", error.message);
        }
    };

    const copyLink = async () => {
        try {
            const shareLink = await constructShareLink(id, getPost);
            await Clipboard.setStringAsync(shareLink);
            setMenuVisible(false);
            showMessage({
                message: "Link Copied to Clipboard",
                type: "info",
            });
        } catch (error) {
            console.error("Error copying the link:", error.message);
        }
    };

    const quotePress = () => {
        burstCount < 1
            ? warningModalSheetRef.current?.open()
            : setShowQuoteModal(true);
    };
    const currentPost = updatedCounts.find((obj) => obj.postId === id);
    const isCurrentPost = currentPost?.postId === id;
    const getCurrentPost = (keyName, value) => {
        return isCurrentPost ? currentPost?.[keyName] : value;
    };
    const [latestUserBursted, setLatestUserBursted] = useState(
        getCurrentPost("userBursted", userBursted),
    );
    const latestReplyCount = getCurrentPost("replyCount", replyCount);
    const latestQuoteCount = getCurrentPost("quoteCount", quoteCount);
    const latestBurstCount = getCurrentPost("burstCount", burstCount);
    const [isFilled, setIsFilled] = useState(currentPost?.userBursted);

    useEffect(() => {
        setReplyCount(latestReplyCount);
    }, [latestReplyCount]);

    // const testBurst = (state) => {
    //     console.log(
    //         "--------------------------",
    //         state,
    //         "----------------------------",
    //     );
    //     console.log("currentPost: ", currentPost);
    //     console.log("isFilled: ", isFilled);
    //     console.log("userName: ", userName);
    //     console.log("burstCount: ", burstCount);
    //     console.log("userBursted: ", userBursted);
    //     console.log("latestUserBursted: ", latestUserBursted);
    //     console.log("lastestBurstCount: ", latestBurstCount);
    //     console.log("selectedItems: ", selectedItems);
    //     console.log("burstInfo: ", burstInfo);
    //     console.log(
    //         "---------------------------------------------------------------",
    //     );
    // };
    useEffect(() => {
        if (showBurstToChannelModal) {
            burstSpecificChannelModalSheetRef.current?.open();
        }
    }, [showBurstToChannelModal]);

    return (
        <>
            <View style={styles.actions}>
                <View style={styles.action}>
                    <View style={styles.btn}>
                        <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={() => {
                                setShowReplyModal(true);
                            }}
                            testID="add-reply"
                        >
                            <ReplySVG />
                        </TouchableOpacity>
                    </View>

                    {latestReplyCount > 0 && (
                        <Text style={styles.countText}>{latestReplyCount}</Text>
                    )}
                </View>
                <View style={styles.action}>
                    <View style={styles.btn}>
                        <TouchableOpacity
                            style={styles.actionIcon}
                            onPress={quotePress}
                            testID="add-quote"
                        >
                            <QuoteSVG />
                        </TouchableOpacity>
                    </View>

                    {latestQuoteCount > 0 && (
                        <Text style={styles.countText}>{latestQuoteCount}</Text>
                    )}
                </View>
                {/* <View style={styles.action}>
                    <>
                        <TouchableOpacity
                            disabled={showRipple || !allowBurst}
                            style={styles.actionIcon}
                            onPress={() => {
                                if (allowBurst) {
                                    setShowBurstToChannelModal(true);
                                    // testBurst("open");
                                }
                            }}
                        >
                            {userBursted ? (
                                <FilledApprove
                                    fill="#687684"
                                    width={32}
                                    height={32}
                                    stroke="#687684"
                                />
                            ) : (
                                <ApproveIcon
                                    width={32}
                                    height={32}
                                    stroke="#687684"
                                />
                            )}
                        </TouchableOpacity>
                        {latestBurstCount > 0 && (
                            <Text style={[styles.countText, styles.extra]}>
                                {burstCount}
                            </Text>
                        )}
                    </>
                </View> */}
                <View style={styles.action}>
                    <Menu
                        anchorPosition="top"
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <TouchableOpacity
                                style={styles.actionIcon}
                                onPress={() => setMenuVisible(true)}
                                testID="share-button"
                            >
                                <ShareIcon />
                            </TouchableOpacity>
                        }
                    >
                        <Menu.Item
                            onPress={copyLink}
                            title="Copy Link"
                            titleStyle={{ fontSize: 16 }}
                            style={{ height: 30 }}
                        />
                        <Menu.Item
                            onPress={sharePost}
                            title="Share Post"
                            titleStyle={{ fontSize: 16 }}
                            style={{ height: 30 }}
                        />
                    </Menu>
                </View>
            </View>
            {/* {showModal && ( */}
            <WarningModal
                onPress={() => {
                    warningModalSheetRef?.current?.close();
                    setShowQuoteModal(true);
                    // setShowModal(false);
                }}
                onClose={() => {
                    // setShowModal(false);
                    warningModalSheetRef?.current?.close();
                }}
                userName={userName}
                sheetRef={warningModalSheetRef}
            />
            {/* )} */}
            {showBurstToChannelModal && (
                <BurstSpecificChannelModal
                    showBurstToChannelModal={showBurstToChannelModal}
                    setShowBurstToChannelModal={setShowBurstToChannelModal}
                    userName={userName}
                    handleBurst={handleBurst}
                    postId={id}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    burstInfo={burstInfo}
                    setBurstInfo={setBurstInfo}
                    burstedChannels={burstedChannels}
                    setBurstedChannels={setBurstedChannels}
                    unBurstedChannels={unBurstedChannels}
                    setUnBurstedChannels={setUnBurstedChannels}
                    sheetRef={burstSpecificChannelModalSheetRef}
                    currentChannel={currentChannel}
                    removePost={removePost}
                />
            )}
        </>
    );
};

export default PostActions;

const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
        width: "100%",
        justifyContent: "space-between",
    },
    extra: {
        marginLeft: -4,
    },
    action: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
    },
    countText: {
        color: "#687684",
        fontSize: 15,
        fontWeight: "normal",
    },
    btn: {
        padding: 4,
    },
    actionIcon: {
        height: 30,
        width: 30,
        alignItems: "center",
        justifyContent: "center",
    },
});
