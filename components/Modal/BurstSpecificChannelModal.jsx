import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Button, Divider } from "react-native-elements";

import RBSheet from "react-native-raw-bottom-sheet";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import useChannels from "../../hooks/useChannels";
import usePosts from "../../hooks/usePosts";
import ChannelButton from "../Burst/ChannelButton";
import { FilledApprove } from "../Svgs";

const BurstSpecificChannelModal = ({
    showBurstToChannelModal,
    setShowBurstToChannelModal,
    userName,
    handleBurst,
    postId,
    selectedItems,
    setSelectedItems,
    burstInfo,
    setBurstInfo,
    burstedChannels,
    setBurstedChannels,
    setUnBurstedChannels,
    sheetRef,
    currentChannel,
    removePost,
}) => {
    const [myChannels, setMyChannels] = useState([]);
    const [suggestedChannels, setSuggestedChannels] = useState([]);
    // const [selectedItems, setSelectedItems] = useState([]);
    const [initialSelectedItems, setInitialSelectedItems] = useState([]);
    // const [burstInfo, setBurstInfo] = useState({});
    const [checkIsAuthor, setCheckIsAuthor] = useState(false);
    const [isUnjoinedExcluded, setIsUnjoinedExcluded] = useState(false);
    const [userBurstChannels, setUserBurstChannels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [addedChannels, setAddedChannels] = useState([]);
    const [removedChannels, setRemovedChannels] = useState([]);
    const [burstThreshold, setBurstThreshold] = useState(1);

    const { userData } = useApp();
    const { getBurstedChannels, getSuggestedChannels, getChannels } =
        useChannels();
    const { getPost, reviewPost } = usePosts();
    useEffect(() => {
        setUnBurstedChannels([]);
    }, [showBurstToChannelModal]);
    const flattenChannels = (channels) => {
        return channels.map(({ channel, ...rest }) => ({
            ...rest,
            ...channel,
        }));
    };

    const getPrevBustedChannels = async () => {
        const resp = await getBurstedChannels(postId);
        const flattenedChannels = flattenChannels(resp);
        const channelIds = flattenedChannels.map((channel) => channel.id);
        setSelectedItems(channelIds);
        setInitialSelectedItems(channelIds);
    };

    const getBurstInfo = async (betaReviews) => {
        if (!Array.isArray(betaReviews)) {
            return;
        }
        const curBurstInfo = {};
        for (const betaReview of betaReviews) {
            if (!Array.isArray(betaReview.channels)) {
                continue;
            }
            for (const channel of betaReview.channels) {
                if (curBurstInfo.hasOwnProperty(channel.id)) {
                    curBurstInfo[channel.id].burstCount += 1;
                    if (betaReview.reviewer.id === userData.id) {
                        curBurstInfo[channel.id].currentUserBurst = true;
                    }
                } else {
                    curBurstInfo[channel.id] = {
                        burstCount: 1,
                        channelSize: channel.members.length,
                        tag: channel.tag,
                    };
                }
            }
        }

        for (const myChannel of myChannels) {
            if (!curBurstInfo.hasOwnProperty(myChannel.id)) {
                curBurstInfo[myChannel.id] = {
                    burstCount: 0,
                    channelSize: myChannel.members.length,
                    tag: myChannel.tag,
                };
            }
        }

        return curBurstInfo;
    };

    // const getPostSuggestedChannels = async () => {
    //     setIsLoading(true);
    //     const resp = await getSuggestedChannels(postId);
    //     const postInfo = await getPost(postId);
    //     const curBurstInfo = await getBurstInfo(postInfo.betaReviews);
    //     setBurstInfo(curBurstInfo);
    //     const isAuthor = postInfo.author.id === userData.id;
    //     setCheckIsAuthor(isAuthor);
    //     const filteredBetaReviews = postInfo.betaReviews.filter(
    //         (review) => review.reviewer.id === userData.id,
    //     );

    //     // Extract channel IDs from the filtered betaReviews
    //     const filteredChannelIds = filteredBetaReviews.flatMap((review) =>
    //         review.channels.map((channel) => channel.id),
    //     );

    //     // Set the selectedItems to the filtered channel IDs
    //     setSelectedItems(filteredChannelIds);
    //     // Handling suggestedChannels
    //     let suggestedChannels = resp.suggestedChannels || [];
    //     const everyoneSuggested = suggestedChannels.find(
    //         (channel) => channel.tag === "#everyone",
    //     );
    //     suggestedChannels = suggestedChannels.filter(
    //         (channel) => channel.tag !== "#everyone",
    //     );
    //     if (everyoneSuggested) {
    //         suggestedChannels.unshift(everyoneSuggested);
    //     }

    //     setSuggestedChannels(suggestedChannels);

    //     // Handling relevantChannels
    //     let relevantChannels = resp.relevantChannels || [];
    //     const everyoneRelevant = relevantChannels.find(
    //         (channel) => channel.tag === "#everyone",
    //     );
    //     relevantChannels = relevantChannels.filter(
    //         (channel) => channel.tag !== "#everyone",
    //     );
    //     if (everyoneRelevant) {
    //         relevantChannels.unshift(everyoneRelevant);
    //     }

    //     setMyChannels(relevantChannels);
    //     setIsUnjoinedExcluded(resp.isExcludedUnjoinedChannels);
    //     setIsLoading(false);
    // };

    const getPostSuggestedChannels = async () => {
        setIsLoading(true);
        const resp = await getSuggestedChannels(postId);
        const postInfo = await getPost(postId);
        const curBurstInfo = await getBurstInfo(postInfo.betaReviews);
        setBurstInfo(curBurstInfo);

        const isAuthor = postInfo.author.id === userData.id;
        setCheckIsAuthor(isAuthor);

        const filteredBetaReviews = postInfo.betaReviews.filter(
            (review) => review.reviewer.id === userData.id,
        );

        const filteredChannelIds = filteredBetaReviews.flatMap((review) =>
            review.channels.map((channel) => channel.id),
        );
        setSelectedItems(filteredChannelIds);

        // Handling suggestedChannels
        let suggestedChannels = resp.suggestedChannels || [];
        suggestedChannels = suggestedChannels.filter(
            (channel) => !(channel.type === "private" && !channel.isMember),
        );

        const everyoneSuggested = suggestedChannels.find(
            (channel) => channel.tag === "#everyone",
        );
        suggestedChannels = suggestedChannels.filter(
            (channel) => channel.tag !== "#everyone",
        );
        if (everyoneSuggested) {
            suggestedChannels.unshift(everyoneSuggested);
        }
        setSuggestedChannels(suggestedChannels);

        // Handling relevantChannels
        let relevantChannels = resp.relevantChannels || [];
        relevantChannels = relevantChannels.filter(
            (channel) => !(channel.type === "private" && !channel.isMember),
        );

        const everyoneRelevant = relevantChannels.find(
            (channel) => channel.tag === "#everyone",
        );
        relevantChannels = relevantChannels.filter(
            (channel) => channel.tag !== "#everyone",
        );
        if (everyoneRelevant) {
            relevantChannels.unshift(everyoneRelevant);
        }
        setMyChannels(relevantChannels);

        setIsUnjoinedExcluded(resp.isExcludedUnjoinedChannels);
        setIsLoading(false);
    };

    useEffect(() => {
        getPostSuggestedChannels();
        getPrevBustedChannels();
    }, [showBurstToChannelModal]);

    // useEffect(() => {
    //     const fetchBurstInfo = async () => {
    //         const curBurstInfo = await getBurstInfo();
    //         setBurstInfo(curBurstInfo);
    //     };

    //     fetchBurstInfo();
    // }, []);

    const toggleSelection = (itemId, channel) => {
        setSelectedItems((prevSelectedItems) => {
            const isCurrentlySelected = prevSelectedItems.includes(itemId);

            let newAddedChannels = [...addedChannels];
            let newRemovedChannels = [...removedChannels];
            const newBurstInfo = { ...burstInfo };

            if (isCurrentlySelected) {
                // Deselecting the item
                if (initialSelectedItems.includes(itemId)) {
                    // If the item was initially selected, add to removedChannels
                    newRemovedChannels.push({
                        id: channel.id,
                        tag: channel.tag,
                        members: channel.members,
                        isDeleted: channel.isDeleted,
                        burstCount: channel.burstCount - 1,
                        threshold: channel.threshold,
                        isBurstedByUser: true,
                    });
                } else {
                    // If not initially selected, remove from addedChannels
                    newAddedChannels = newAddedChannels.filter(
                        (item) => item.id !== channel.id,
                    );
                }
                if (newBurstInfo[itemId]) {
                    newBurstInfo[itemId] = {
                        ...newBurstInfo[itemId],
                        burstCount: Math.max(
                            newBurstInfo[itemId].burstCount - 1,
                            0,
                        ),
                    };

                    if (newBurstInfo[itemId].burstCount === 0) {
                        delete newBurstInfo[itemId];
                    }
                }
            } else {
                // Selecting the item
                if (initialSelectedItems.includes(itemId)) {
                    // If the item was initially selected, remove from removedChannels
                    newRemovedChannels = newRemovedChannels.filter(
                        (item) => item.id !== channel.id,
                    );
                    newAddedChannels.push({
                        id: channel.id,
                        tag: channel.tag,
                        members: channel.members,
                        isDeleted: channel.isDeleted,
                        burstCount: channel.burstCount,
                        threshold: channel.threshold,
                        isBurstedByUser: true,
                        type: channel.type,
                    });
                } else {
                    // If not initially selected, add to addedChannels
                    newAddedChannels.push({
                        id: channel.id,
                        tag: channel.tag,
                        members: channel.members,
                        isDeleted: channel.isDeleted,
                        burstCount: channel.burstCount,
                        threshold: channel.threshold,
                        isBurstedByUser: true,
                        type: channel.type,
                    });
                }
                newBurstInfo[itemId] = {
                    ...(newBurstInfo[itemId] || {}),
                    burstCount: (newBurstInfo[itemId]?.burstCount || 0) + 1,
                    channelSize: channel.members.length,
                    tag: channel.tag,
                };
            }
            setAddedChannels(newAddedChannels);
            setRemovedChannels(newRemovedChannels);
            setBurstInfo(newBurstInfo);

            return isCurrentlySelected
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId];
        });
    };

    const handleBurstedChannelUpdate = () => {
        let updatedBurstedChannels = [...burstedChannels];

        addedChannels.forEach((channel) => {
            const existingChannelIndex = updatedBurstedChannels.findIndex(
                (bursted) => bursted.id === channel.id,
            );

            if (existingChannelIndex === -1) {
                updatedBurstedChannels.push({
                    ...channel,
                    burstCount: channel.burstCount + 1,
                    isBurstedByUser: true,
                });
            } else {
                updatedBurstedChannels[existingChannelIndex] = {
                    ...updatedBurstedChannels[existingChannelIndex],
                    burstCount: channel.burstCount + 1,
                    isBurstedByUser: true,
                };
            }
        });

        removedChannels.forEach((channel) => {
            const existingChannelIndex = updatedBurstedChannels.findIndex(
                (bursted) => bursted.id === channel.id,
            );

            if (existingChannelIndex !== -1) {
                updatedBurstedChannels[existingChannelIndex] = {
                    ...updatedBurstedChannels[existingChannelIndex],
                    burstCount:
                        updatedBurstedChannels[existingChannelIndex]
                            .burstCount - 1,
                    isBurstedByUser: false,
                };
            }
        });

        const finalBurstedChannels = updatedBurstedChannels.filter(
            (channel) => channel.burstCount > 0,
        );
        if (
            currentChannel > 0 &&
            !finalBurstedChannels.some(
                (channel) => channel.id === currentChannel,
            )
        ) {
            removePost(postId);
        }


        setBurstedChannels((prev) => ({
            ...prev,
            [postId]: finalBurstedChannels,
        }));
    };

    return (
        <RBSheet
            ref={sheetRef}
            height={Dimensions.get("screen").height * 0.55}
            openDuration={350}
            customStyles={{ container: styles.modalContainer }}
            onClose={() => {
                setShowBurstToChannelModal(false);
            }}
            draggable
        >
            <View style={styles.modalHeader}>
                <FilledApprove
                    fill={theme.colors.lightBlue}
                    width={32}
                    height={32}
                    stroke={theme.colors.lightBlue}
                />
                <Text style={styles.titleText}>Burst</Text>
            </View>
            {isLoading && (
                <ActivityIndicator color={theme.colors.lightBlue} size={26} />
            )}
            {!isLoading && (
                <ScrollView
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {suggestedChannels.length !== 0 && (
                        <View>
                            <Text style={styles.channelsContainerTitle}>
                                {checkIsAuthor ? "You" : userName} suggests:
                            </Text>
                            {suggestedChannels.map((item, index) => (
                                <ChannelButton
                                    key={item.id}
                                    item={item}
                                    selectedItems={selectedItems}
                                    toggleSelection={toggleSelection}
                                    burstInfo={burstInfo}
                                    checkIsAuthor={checkIsAuthor}
                                    onPress={() => console.log(selectedItems)}
                                    burstCount={
                                        burstInfo[item.id]
                                            ? burstInfo[item.id].burstCount
                                            : 0
                                    }
                                    addedChannels={addedChannels}
                                    setAddedChannels={setAddedChannels}
                                    removedChannels={removedChannels}
                                    setRemovedChannels={setRemovedChannels}
                                    initialSelectedItems={initialSelectedItems}
                                    updateBurstThreshold={setBurstThreshold}
                                    isSuggested={true}
                                    setShowBurstToChannelModal={
                                        setShowBurstToChannelModal
                                    }
                                />
                            ))}
                            {suggestedChannels.length === 0 && (
                                <Text style={styles.noResultText}>
                                    No Suggested Channels
                                </Text>
                            )}
                            <Divider style={styles.dividerStyle} width={2} />
                        </View>
                    )}
                    <Text style={styles.channelsContainerTitle}>
                        Your Channels:
                    </Text>
                    {myChannels &&
                        myChannels.map((item, index) => (
                            <ChannelButton
                                key={item.id}
                                item={item}
                                selectedItems={selectedItems}
                                toggleSelection={toggleSelection}
                                burstInfo={burstInfo}
                                burstCount={
                                    burstInfo[item.id]
                                        ? burstInfo[item.id].burstCount
                                        : 0
                                }
                                checkIsAuthor={checkIsAuthor}
                                onPress={() => {}}
                                addedChannels={addedChannels}
                                setAddedChannels={setAddedChannels}
                                removedChannels={removedChannels}
                                setRemovedChannels={setRemovedChannels}
                                initialSelectedItems={initialSelectedItems}
                                updateBurstThreshold={setBurstThreshold}
                                isSuggested={false}
                                setShowBurstToChannelModal={
                                    setShowBurstToChannelModal
                                }
                            />
                        ))}
                    {myChannels && myChannels.length === 0 && (
                        <Text style={styles.noResultText}>
                            No Channels, Join or Create One
                        </Text>
                    )}
                </ScrollView>
            )}
            {!isLoading && (
                <View style={styles.buttonStyle}>
                    {!checkIsAuthor && (
                        <Button
                            title="Confirm"
                            buttonStyle={{
                                width: Dimensions.get("screen").width * 0.85,
                                borderRadius: 12,
                            }}
                            // disabled={!hasSelectionChanged()}
                            onPress={() => {
                                handleBurstedChannelUpdate();
                                const unburstIds = removedChannels.map(
                                    (channel) => channel.id,
                                );
                                handleBurst(selectedItems, unburstIds);
                            }}
                        />
                    )}
                </View>
            )}
        </RBSheet>
    );
};

export default BurstSpecificChannelModal;

const styles = StyleSheet.create({
    modalContainer: {
        zIndex: 2,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: "center",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    outerContainer: {
        height: "100%",
        backgroundColor: "#00000080",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    titleText: {
        fontSize: 24,
        fontWeight: "700",
        marginHorizontal: 10,
    },
    scrollContainer: {
        width: "100%",
    },
    channelsContainerTitle: {
        fontSize: 18,
        fontWeight: "500",
        paddingVertical: 16,
        textAlign: "center",
    },
    noResultText: {
        color: "#ccc",
        textAlign: "center",
        paddingVertical: 10,
    },
    dividerStyle: {
        paddingVertical: 10,
    },
    buttonStyle: {
        paddingVertical: 10,
        width: "90%",
        alignItems: "center",
    },
});
