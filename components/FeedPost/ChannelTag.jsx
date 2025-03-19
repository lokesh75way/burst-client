import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import theme from "../../config/theme";
import usePosts from "../../hooks/usePosts";
import JoinAndBurstChannelModal from "../Modal/JoinAndBurstChannelModal";
import { StarAddIcon } from "../Svgs";

const ChannelTag = ({
    postId,
    burstedChannels,
    setBurstedChannels,
    isProfilePage = false,
    myChannels,
    setShowBurstToChannelModal,
    burstSpecificChannelModalSheetRef,
    handleRipple,
    disabled = false,
    currentChannel,
    removePost,
    burstEventEmitter,
}) => {
    const [processedChannels, setProcessedChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState();
    const joinAndBurstModalSheetRef = useRef();
    const [showJoinAndBurstModal, setShowJoinAndBurstModal] = useState(false);
    const { reviewPost } = usePosts();
    const [alreadyBurstedIds, setAlreadyBurstedIds] = useState([]);

    useEffect(() => {
        if (!burstedChannels || !Array.isArray(burstedChannels)) {
            setProcessedChannels([]);
            return;
        }

        const getSortIndex = (channel) => {
            if (!channel) return 1;
            const {
                isBurstedByUser = false,
                burstCount = 0,
                threshold = 1,
            } = channel;
            return (
                (isBurstedByUser ? 0 : 1) * 2 +
                (burstCount >= threshold ? 0 : 1)
            );
        };
        const sortedChannels = [...burstedChannels]
            .filter((channel) => channel !== undefined)
            .sort((a, b) => getSortIndex(a) - getSortIndex(b));

        setProcessedChannels(sortedChannels);
    }, [burstedChannels]);

    const filterMyChannels = (bursted = [], mine = []) => {
        if (!Array.isArray(bursted) || !Array.isArray(mine)) {
            console.warn("bursted or mine is not an array", { bursted, mine });
            return [];
        }

        const myChannelIds = new Set(mine.map((channel) => channel.id));

        return bursted.map((channel) => ({
            ...channel,
            isCommon: myChannelIds.has(channel.id),
        }));
    };

    useEffect(() => {
        const data = filterMyChannels(burstedChannels, myChannels);

        const alreadyBursted = data
            .filter((item) => item.isBurstedByUser)
            .map((item) => item.id);

        setAlreadyBurstedIds((prev) => {
            return JSON.stringify(prev) === JSON.stringify(alreadyBursted)
                ? prev
                : alreadyBursted;
        });

        setProcessedChannels((prev) => {
            return JSON.stringify(prev) === JSON.stringify(data) ? prev : data;
        });
    }, [burstedChannels, myChannels]);

    const burstPost = async (channel) => {
        try {
            await reviewPost(postId, [...alreadyBurstedIds, channel?.id], []);
            setBurstedChannels((prevData = {}) => {
                const prevChannels = prevData[postId] || [];
                return {
                    ...prevData,
                    [postId]: prevChannels.map((ch) =>
                        ch.id === channel.id
                            ? {
                                  ...ch,
                                  burstCount: ch.burstCount + 1,
                                  isBurstedByUser: true,
                              }
                            : ch,
                    ),
                };
            });
            setAlreadyBurstedIds((prevIds) => [...prevIds, channel.id]);
            handleRipple();
        } catch (error) {
            console.error(error.message);
        }
    };

    const unBurstPost = async (channel) => {
        try {
            const updatedBurstedIds = alreadyBurstedIds.filter(
                (id) => id !== channel.id,
            );
            await reviewPost(postId, updatedBurstedIds, [channel.id]);

            setAlreadyBurstedIds(updatedBurstedIds);

            setBurstedChannels((prevData = {}) => {
                const prevChannels = prevData[postId] || [];
                const updatedChannels = prevChannels
                    .map((ch) =>
                        ch.id === channel.id
                            ? {
                                  ...ch,
                                  burstCount: ch.burstCount - 1,
                                  isBurstedByUser: false,
                              }
                            : ch,
                    )
                    .filter((ch) => ch.burstCount > 0);

                return {
                    ...prevData,
                    [postId]: updatedChannels,
                };
            });
            if (
                currentChannel > 0 &&
                currentChannel === channel.id &&
                channel.burstCount - 1 === 0
            ) {
                removePost(postId);
            }
            handleRipple();
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            {processedChannels.map((channel, index) => {
                const isBurstedByUser = channel.isBurstedByUser;
                const isBursted = channel.burstCount >= channel.threshold;
                const bgColor = isBursted ? theme.colors.lightBlue : "#B0B0B0";
                const bdrColor = isBursted ? theme.colors.lightBlue : "#B0B0B0";
                const textColor = theme.colors.white;
                const isCurrentUserMember = channel.isCommon;
                if (channel.type === "private" && !isCurrentUserMember) {
                    return null;
                }

                return (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.75}
                        disabled={disabled}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginRight: 6,
                            borderRadius: isProfilePage ? 12 : 20,
                            borderColor: bdrColor,
                            borderWidth: isProfilePage ? 1 : 2,
                            backgroundColor: bgColor,
                            marginVertical: 4,
                            paddingHorizontal: 12,
                            paddingVertical: isProfilePage ? 2 : 6,
                        }}
                        onPress={() => {
                            // if (!isCurrentUserMember) return;
                            const isJoined = channel.isCommon;

                            setSelectedChannel(channel);
                            if (!isBurstedByUser) {
                                if (!isJoined) {
                                    setShowJoinAndBurstModal(true);
                                } else {
                                    burstPost(channel);
                                }
                            } else {
                                unBurstPost(channel);
                            }
                            // burstEventEmitter();
                        }}
                        testID="burst-channel-chip"
                    >
                        {channel.type === "private" && (
                            <FontAwesome5
                                name="lock"
                                size={12}
                                color={textColor}
                                style={{ marginRight: 4 }}
                            />
                        )}
                        <Text
                            style={{
                                borderRadius: isProfilePage ? 12 : 20,
                                color: textColor,
                                fontWeight: "500",
                                fontSize: isProfilePage ? 12 : 14,
                            }}
                            numberOfLines={2}
                            ellipsizeMode="middle"
                        >
                            {channel.tag}
                            {` ${channel.burstCount}/${channel.threshold}`}
                        </Text>
                    </TouchableOpacity>
                );
            })}
            {!isProfilePage && (
                <TouchableOpacity
                    style={{
                        borderWidth: 2,
                        borderColor: "#479ae2",
                        borderRadius: 30,
                        alignItems: "center",
                        justifyContent: "center",
                        height: 32,
                        width: 32,
                        backgroundColor: theme.colors.white,
                        marginVertical: 4,
                    }}
                    onPress={() => {
                        setShowBurstToChannelModal(true);
                        burstSpecificChannelModalSheetRef.current?.open();
                    }}
                    testID="burst-sheet-button"
                >
                    {/* <AddIcon stroke={"#479ae2"} /> */}
                    <StarAddIcon />
                </TouchableOpacity>
            )}
            {showJoinAndBurstModal && (
                <JoinAndBurstChannelModal
                    channelData={selectedChannel}
                    showBurstToChannelModal={showJoinAndBurstModal}
                    onClose={() => {
                        setShowJoinAndBurstModal(false);
                        joinAndBurstModalSheetRef?.current?.close();
                    }}
                    setShowBurstToChannelModal={setShowBurstToChannelModal}
                    onConfirm={() => {
                        burstPost(selectedChannel);
                        joinAndBurstModalSheetRef?.current?.close();
                    }}
                    sheetRef={joinAndBurstModalSheetRef}
                />
            )}
        </View>
    );
};

export default ChannelTag;
