import React, { useRef, useState } from "react";
import { View } from "react-native";

import theme from "../../config/theme";
import BurstButton from "../BurstButton";
import JoinAndBurstChannelModal from "../Modal/JoinAndBurstChannelModal";

const ChannelButton = ({
    item,
    selectedItems,
    toggleSelection,
    burstInfo,
    burstCount,
    checkIsAuthor,
    onPress,
    setAddedChannels,
    addedChannels,
    removedChannels,
    setRemovedChannels,
    initialSelectedItems,
    isSuggested,
    updateBurstThreshold,
    setShowBurstToChannelModal,
}) => {
    // console.log("burstInfo[", item.id, "]: ", burstInfo[item.id]);
    const [burstThreshold, setBurstThreshold] = useState(item.threshold);
    const [showJoinAndBurstModal, setShowJoinAndBurstModal] = useState(false);
    const joinAndBurstModalSheetRef = useRef();

    const addItem = () => {
        handleThresholdUpdate();
        toggleSelection(item.id, item);
        onPress();
    };

    const handleThresholdUpdate = () => {
        const wasInitiallySelected =
            Array.isArray(initialSelectedItems) &&
            initialSelectedItems.includes(item.id);

        if (selectedItems.includes(item.id)) {
            if (!wasInitiallySelected) {
                setAddedChannels((prevAdded) => {
                    const alreadyInAdded = prevAdded.some(
                        (channel) => channel.id === item.id,
                    );
                    if (!alreadyInAdded) {
                        return [
                            ...prevAdded,
                            {
                                id: item.id,
                                tag: item.tag,
                                members: item.members,
                                isDeleted: item.isDeleted,
                                burstCount: item.burstCount,
                                burstThreshold: item.threshold,
                                isBurstedByUser: true,
                            },
                        ];
                    }
                    return prevAdded;
                });

                setRemovedChannels((prevRemoved) =>
                    prevRemoved.filter((channel) => channel.id !== item.id),
                );
            } else if (burstCount < burstThreshold) {
                setRemovedChannels((prevRemoved) => {
                    const alreadyInRemoved = prevRemoved.some(
                        (channel) => channel.id === item.id,
                    );
                    if (!alreadyInRemoved) {
                        return [
                            ...prevRemoved,
                            {
                                id: item.id,
                                tag: item.tag,
                                members: item.members,
                                burstCount: item.burstCount,
                                burstThreshold: item.threshold,
                                isBurstedByUser: true,
                            },
                        ];
                    }
                    return prevRemoved;
                });
                setAddedChannels((prevAdded) =>
                    prevAdded.filter((channel) => channel.id !== item.id),
                );
            }
        } else {
            setAddedChannels((prevAdded) =>
                prevAdded.filter((channel) => channel.id !== item.id),
            );
            setRemovedChannels((prevRemoved) =>
                prevRemoved.filter((channel) => channel.id !== item.id),
            );
        }
    };

    return (
        <View style={styles.channelItem}>
            <BurstButton
                key={item.id}
                type={item.type}
                label={item.tag}
                endLabel={`${burstCount} / ${item.threshold}`}
                bgColor={
                    selectedItems.includes(item.id)
                        ? theme.colors.lightBlue
                        : theme.colors.white
                }
                color={
                    selectedItems.includes(item.id)
                        ? theme.colors.white
                        : theme.colors.lightBlue
                }
                checkIsAuthor={checkIsAuthor}
                onPress={() => {
                    if (
                        isSuggested &&
                        !item.isMember &&
                        !selectedItems.includes(item.id)
                    ) {
                        setShowJoinAndBurstModal(true);
                    } else {
                        addItem();
                    }
                }}
            />
            {showJoinAndBurstModal && (
                <JoinAndBurstChannelModal
                    channelData={item}
                    showBurstToChannelModal={showJoinAndBurstModal}
                    onClose={() => {
                        setShowJoinAndBurstModal(false);
                        setShowBurstToChannelModal(false);
                    }}
                    setShowBurstToChannelModal={setShowBurstToChannelModal}
                    onConfirm={() => {
                        addItem();
                        setShowJoinAndBurstModal(false);
                    }}
                    sheetRef={joinAndBurstModalSheetRef}
                />
            )}
        </View>
    );
};

export default ChannelButton;

const styles = {
    channelItem: {
        marginBottom: 10,
        alignSelf: "center",
        width: "85%",
    },
};
