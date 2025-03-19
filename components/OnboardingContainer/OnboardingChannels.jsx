import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import theme from "../../config/theme";
import useChannels from "../../hooks/useChannels";
import ChannelItem from "../Channels/ChannelItem";
import SearchInput from "../Channels/SearchInput";
const OnboardingChannels = ({
    onboardStep,
    setOnboardStep,
    joinedChannels,
    setJoinedChannels,
}) => {
    const { getMyChannels, getChannels, searchChannel } = useChannels();
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // const [joinedChannels, setJoinedChannels] = useState([]);
    const [recommendedChannels, setRecommendedChannels] = useState([]);

    const isEmpty = searchText.length === 0;
    const iconSize = { width: 18, height: 18, stroke: "#3C3C4390" };

    const getDisplayChannels = async () => {
        try {
            const userChannelsData = await getMyChannels();
            const filteredJoined = userChannelsData.joinedPublicChannels.filter(
                (channel) => channel.tag !== "#everyone",
            );
            setJoinedChannels(filteredJoined);
            const recommendedChannelsData = await getChannels();
            const filteredRecommended = recommendedChannelsData
                .slice(0, 10)
                .filter((channel) => channel.tag !== "#everyone");
            setRecommendedChannels(filteredRecommended);
        } catch (err) {
            console.log("Error in fetching channels", err);
        }
    };

    useEffect(() => {
        getDisplayChannels();
    }, []);

    const handleRefresh = async () => {
        try {
            await getDisplayChannels();
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    const handleSearch = async (text) => {
        setSearchText(text);
        try {
            const resp = await searchChannel(text);
            const filterSeacrh = resp.filter(
                (channel) => channel.tag !== "#everyone",
            );
            setSearchResults(filterSeacrh);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.mainText}>Join Channels</Text>
                <Text style={styles.subText}>
                    Join as many channels as interest you for a more vibrant and
                    diverse feed. To enhance your experience, please join at
                    least <Text style={{ fontWeight: "bold" }}>three</Text>{" "}
                    channels.
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.mainText}>
                        Your Channels {joinedChannels.length}/3{" "}
                    </Text>
                </View>
                {joinedChannels.map((item, index) => (
                    <ChannelItem
                        key={index}
                        item={item}
                        isCreator={false}
                        isJoined
                        handleRefresh={handleRefresh}
                        isDisabled
                    />
                ))}
                <SearchInput
                    searchText={searchText}
                    onSearchChange={handleSearch}
                    placeholder="Search for Channels"
                    onClear={() => {
                        setSearchText("");
                        setSearchResults([]);
                    }}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                />
                {searchText.length === 0 && (
                    <View>
                        <Text style={styles.channelTypeLabel}>
                            Recommended Channels
                        </Text>
                        {recommendedChannels.map((item, index) => (
                            <ChannelItem
                                key={index}
                                item={item}
                                isCreator={false}
                                isJoined={joinedChannels.some(
                                    (channel) => channel.id === item.id,
                                )}
                                handleRefresh={handleRefresh}
                                isDisabled
                            />
                        ))}
                    </View>
                )}
                {searchText.length !== 0 && searchResults.length === 0 && (
                    <Text style={styles.noResultText}>No results found</Text>
                )}
                {searchText.length !== 0 &&
                    searchResults.length !== 0 &&
                    searchResults.map((item, index) => (
                        <ChannelItem
                            key={index}
                            item={item}
                            isCreator={false}
                            isJoined={joinedChannels.some(
                                (channel) => channel.id === item.id,
                            )}
                            handleRefresh={() => {
                                handleSearch(searchText);
                                handleRefresh();
                            }}
                            isDisabled
                        />
                    ))}
                <View style={styles.barContainer} />
            </ScrollView>
        </View>
    );
};

export default OnboardingChannels;

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        overflow: "hidden",
        paddingHorizontal: 20,
    },
    mainText: {
        color: theme.colors.lightBlue,
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold",
        marginHorizontal: 10,
    },
    subText: {
        marginTop: 10,
        fontSize: 18,
        textAlign: "center",
        width: "100%",
    },
    section: {
        width: "100%",
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    barContainer: {
        height: 100,
        paddingHorizontal: 20,
    },
    textContainer: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        width: "100%",
    },
    inputContainer: {
        backgroundColor: "#E9E9E9",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    inputText: {
        fontSize: 16,
        textAlign: "left",
        paddingHorizontal: 10,
        color: "#000",
        width: "100%",
    },
    channelTypeLabel: {
        fontWeight: "600",
        fontSize: 18,
        paddingVertical: 10,
    },
    noResultText: {
        color: "#ccc",
        textAlign: "center",
        padding: 20,
    },
});
