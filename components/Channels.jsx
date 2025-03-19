import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    DeviceEventEmitter,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Divider } from "react-native-elements";

import theme from "../config/theme";
import useApp from "../hooks/useApp";
import useChannels from "../hooks/useChannels";
import useDebounce from "../hooks/useDebounce";
import ChannelItem from "./Channels/ChannelItem";
import ChannelItemSkeleton from "./Channels/ChannelItemSkeleton";
import SearchInput from "./Channels/SearchInput";
import CreateChannelModal from "./Modal/CreateChannelModal";
import AddIcon from "./Svgs/AddIcon";

const Channels = ({ setRefreshBar }) => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [userChannels, setUserChannels] = useState([]);
    const [joinedChannels, setJoinedChannels] = useState([]);
    const [recommendedChannels, setRecommendedChannels] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userData, setUserJoinedChannels } = useApp();
    const createChannelSheetRef = useRef();
    const { getMyChannels, getRecommendedChannels, searchChannel } =
        useChannels();

    const ChannelItemSkeletonList = useMemo(
        () => (
            <>
                {Array.from({ length: 4 }).map((_, index) => (
                    <ChannelItemSkeleton key={index} />
                ))}
            </>
        ),
        [],
    );

    const getChannels = async (isRefreshing = false) => {
        try {
            if (!isRefreshing) setIsLoading(true);
            setRefreshBar(true);
            const userChannelsData = await getMyChannels();
            setUserChannels([
                ...userChannelsData.userPrivateChannels,
                ...userChannelsData.userPublicChannels,
            ]);
            setJoinedChannels([
                ...userChannelsData.joinedPrivateChannels,
                ...userChannelsData.joinedPublicChannels,
            ]);
            const recommendedChannelsData = await getRecommendedChannels();
            setRecommendedChannels(recommendedChannelsData);
            setUserJoinedChannels([
                ...userChannelsData.userPrivateChannels,
                ...userChannelsData.userPublicChannels,
                ...userChannelsData.joinedPrivateChannels,
                ...userChannelsData.joinedPublicChannels,
            ]);
        } catch (err) {
            console.log("Error in fetching channels", err);
        } finally {
            setIsLoading(false);
            setRefreshBar(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getChannels(true);
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        const loadChannels = async () => {
            await getChannels();
        };
        loadChannels();
    }, []);

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener(
            "refreshChannels",
            handleRefresh,
        );
        return () => subscription.remove();
    }, []);

    const handleSearch = (text) => {
        setSearchText(text);
    };

    useDebounce(
        async () => {
            if (searchText) {
                try {
                    const resp = await searchChannel(searchText);
                    setSearchResults(resp);
                } catch (e) {
                    console.log(e);
                }
            }
        },
        [searchText],
        500,
    );

    return (
        <View style={styles.rootContainer}>
            <View style={styles.topConatiner}>
                <SearchInput
                    searchText={searchText}
                    onSearchChange={handleSearch}
                    placeholder="Search for a Channel"
                    onClear={() => {
                        setSearchText("");
                        setSearchResults([]);
                    }}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.inputText}
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    searchText.length === 0 && (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            // colors={theme.colors.lightBlue}
                            // tintColor={theme.colors.lightBlue}
                        />
                    )
                }
            >
                {searchText.length === 0 ? (
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 20,
                            }}
                        >
                            <Text style={styles.channelTypeLabel}>
                                My Channels
                            </Text>
                            <TouchableOpacity
                                style={styles.createButtonContainer}
                                onPress={() => {
                                    setShowCreateChannelModal(true);
                                }}
                            >
                                <AddIcon stroke={theme.colors.blue} />
                                <Text style={styles.createText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                        {userChannels.length <= 0 &&
                            joinedChannels.length <= 0 &&
                            !isLoading && (
                                <Text style={styles.noResultText}>
                                    You haven't joined any channels. Join or
                                    create one now!
                                </Text>
                            )}
                        {isLoading && ChannelItemSkeletonList}
                        {!isLoading && (
                            <>
                                {userChannels.map((item, index) => (
                                    <ChannelItem
                                        key={index}
                                        item={item}
                                        isCreator
                                        isJoined={false}
                                        handleRefresh={handleRefresh}
                                    />
                                ))}
                                {userChannels.length > 0 &&
                                    joinedChannels.length > 0 && (
                                        <Divider
                                            style={styles.dividerStyle}
                                            width={1}
                                        />
                                    )}
                                {joinedChannels.map((item, index) => (
                                    <ChannelItem
                                        key={index}
                                        item={item}
                                        isCreator={false}
                                        isJoined
                                        handleRefresh={handleRefresh}
                                    />
                                ))}
                            </>
                        )}
                        <Text style={styles.channelTypeLabel}>
                            Recommended Channels
                        </Text>
                        {recommendedChannels.length <= 0 && !isLoading && (
                            <Text style={styles.noResultText}>
                                Nothing here yet. Check back again later!
                            </Text>
                        )}
                        {isLoading && ChannelItemSkeletonList}
                        {!isLoading &&
                            recommendedChannels.map((item, index) => (
                                <ChannelItem
                                    key={index}
                                    item={item}
                                    isCreator={false}
                                    isJoined={false}
                                    handleRefresh={handleRefresh}
                                />
                            ))}
                    </View>
                ) : searchResults.length <= 0 ? (
                    <Text style={styles.noResultText}>No results found</Text>
                ) : (
                    searchResults.map((item, index) => (
                        <ChannelItem
                            key={index}
                            item={item}
                            isCreator={item.owner.id === userData.id}
                            isJoined={item.members.some(
                                (member) => member.id === userData.id,
                            )}
                            handleRefresh={() => {
                                handleSearch(searchText);
                                handleRefresh();
                            }}
                        />
                    ))
                )}
            </ScrollView>
            <View style={styles.emptyContainer} />
            {showCreateChannelModal && (
                <CreateChannelModal
                    showCreateChannelModal={showCreateChannelModal}
                    setShowCreateChannelModal={setShowCreateChannelModal}
                    onChannelCreate={handleRefresh}
                    isEditMode={false}
                    initialValues={{}}
                    sheetRef={createChannelSheetRef}
                />
            )}
        </View>
    );
};

export default Channels;

const styles = StyleSheet.create({
    rootContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        height: "100%",
    },
    topConatiner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 16,
    },
    inputContainer: {
        backgroundColor: "#E9E9E9",
        paddingHorizontal: 30,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    inputText: {
        fontSize: 16,
        textAlign: "left",
        paddingHorizontal: 10,
        color: "#000",
        width: "100%",
    },
    channelIconContainer: { marginHorizontal: 10 },
    channelTypeLabel: {
        fontWeight: "600",
        fontSize: 18,
        paddingVertical: 10,
    },
    emptyContainer: {
        height: 150,
    },
    noResultText: {
        color: "#ccc",
        textAlign: "center",
        padding: 20,
    },
    dividerStyle: {
        marginBottom: 20,
    },
    createButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: theme.colors.lightBlue,
    },
    createText: {
        fontSize: 16,
        fontWeight: "500",
        color: theme.colors.lightBlue,
        marginHorizontal: 6,
    },
});
