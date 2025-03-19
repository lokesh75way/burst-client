import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-elements";

import theme from "../../config/theme";
import SuggestChannelsModal from "../Modal/SuggestChannelsModal";
import { ChannelIcon, ExcludeIcon, LeftArrowSVG } from "../Svgs";

const SuggestedChannels = ({ onChannelsSelected, isCanceled, resetCancel }) => {
    const [showSuggestChannelsModal, setShowSuggestChannelsModal] =
        useState(false);
    const [selectedChannels, setSelectedChannels] = useState([]);
    const [excludedChannels, setExcludedChannels] = useState([]);
    const [excluedNotJoined, setExcludeNotJoined] = useState(false);
    const suggestedChannelSheetRef = useRef();

    useEffect(() => {
        if (isCanceled) {
            setSelectedChannels([]);
            setExcludedChannels([]);
            setExcludeNotJoined(false);
            resetCancel();
        }
    }, [isCanceled]);

    const handleConfirmChannels = (
        suggestedChannels,
        excludedChannels,
        excluedNotJoined,
    ) => {
        setExcludeNotJoined(excluedNotJoined);
        setSelectedChannels(suggestedChannels);
        setExcludedChannels(excludedChannels);
        const suggestedChannelsIds = suggestedChannels.map(
            (channel) => channel.id,
        );
        const excludedChannelsIds = excludedChannels.map(
            (channel) => channel.id,
        );
        onChannelsSelected(
            suggestedChannelsIds,
            excludedChannelsIds,
            excluedNotJoined,
        );
        setShowSuggestChannelsModal(false);
    };

    const openSuggestedChannelSheet = () => {
        setShowSuggestChannelsModal(true);
    };

    return (
        <View style={{ paddingHorizontal: 20 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                }}
            >
                <ChannelIcon />

                <Text style={{ marginHorizontal: 6 }}>Your Team</Text>

                <View style={{ transform: [{ rotate: "180deg" }] }}>
                    <LeftArrowSVG />
                </View>
                {selectedChannels.length === 0 && (
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: theme.colors.lightBlue,
                            padding: 6,
                            borderRadius: 20,
                        }}
                        onPress={() => {
                            // setShowSuggestChannelsModal(true);
                            openSuggestedChannelSheet();
                        }}
                    >
                        <Text
                            style={{
                                color: theme.colors.lightBlue,
                                fontSize: 12,
                            }}
                        >
                            Suggest Channels to your team
                        </Text>
                    </TouchableOpacity>
                )}
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "65%",
                    }}
                >
                    {selectedChannels.length > 0 &&
                        selectedChannels.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    borderWidth: 1,
                                    borderColor: theme.colors.lightBlue,
                                    padding: 6,
                                    borderRadius: 20,
                                    marginRight: 6,
                                    marginBottom: 6,
                                }}
                                onPress={() => {
                                    // setShowSuggestChannelsModal(true);
                                    openSuggestedChannelSheet();
                                }}
                            >
                                <Text style={{ color: theme.colors.lightBlue }}>
                                    {item.tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                </View>
            </View>
            {(excludedChannels.length !== 0 || excluedNotJoined) && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 10,
                    }}
                >
                    <ExcludeIcon />
                    <View
                        style={{
                            marginHorizontal: 10,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            width: "65%",
                        }}
                    >
                        {excluedNotJoined && (
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#666",
                                    padding: 6,
                                    borderRadius: 20,
                                    marginBottom: 10,
                                }}
                                onPress={() => {
                                    // setShowSuggestChannelsModal(true);
                                    openSuggestedChannelSheet();
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#666",
                                        fontSize: 14,
                                    }}
                                >
                                    All Channels that I'm not in
                                </Text>
                            </TouchableOpacity>
                        )}
                        {excludedChannels.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#666",
                                    padding: 6,
                                    borderRadius: 20,
                                    marginRight: 6,
                                    marginBottom: 6,
                                }}
                                onPress={() => {
                                    // setShowSuggestChannelsModal(true);
                                    openSuggestedChannelSheet();
                                }}
                            >
                                <Text style={{ color: "#666" }}>
                                    {item.tag}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}
            <Divider />
            {showSuggestChannelsModal && (
                <SuggestChannelsModal
                    showSuggestChannelsModal={showSuggestChannelsModal}
                    setShowSuggestChannelsModal={setShowSuggestChannelsModal}
                    onConfirm={handleConfirmChannels}
                    initialSuggestedChannels={selectedChannels}
                    initialExcludedChannels={excludedChannels}
                    excluedNotJoined={excluedNotJoined}
                    setExcludeNotJoined={setExcludeNotJoined}
                    isCanceled={isCanceled}
                    resetCancel={resetCancel}
                    sheetRef={suggestedChannelSheetRef}
                />
            )}
        </View>
    );
};

export default SuggestedChannels;
