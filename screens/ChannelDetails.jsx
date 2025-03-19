import { FontAwesome5, Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    DeviceEventEmitter,
    FlatList,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Divider } from "react-native-elements";
import { showMessage } from "react-native-flash-message";

import Button from "../components/Button";
import MemberList from "../components/Channels/MemberList";
import StackedImages from "../components/Channels/StackedImages";
import FeedPost from "../components/FeedPost";
import Loader from "../components/Loader";
import CreateChannelModal from "../components/Modal/CreateChannelModal";
import { ArrowLeftSVG } from "../components/Svgs";
import AddIcon from "../components/Svgs/AddIcon";
import { avatarPrefix, defaultAvatar } from "../config/constants";
import theme from "../config/theme";
import useApp from "../hooks/useApp";
import useChannels from "../hooks/useChannels";
import useFeeds from "../hooks/useFeeds";
import useInvitation from "../hooks/useInvitation";

const ChannelDetails = ({ route }) => {
    const {
        channelId,
        channelTag,
        isCreator = false,
        isJoined: channelJoined,
    } = route.params;
    const isEveryone =
        channelId === parseInt(process.env.EXPO_PUBLIC_EVERYONE_CHANNEL_ID, 10);
    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const { communityFeed } = useFeeds();
    const { addRemoveUser, getChannelById } = useChannels();
    const [channelInfo, setChannelInfo] = useState({
        tag: "",
        description: "",
        members: [],
    });
    const [channelFeedData, setChannelFeedData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [firstThreeImages, setFirstThreeImages] = useState([]);
    const [memberVisible, setMemberVisible] = useState(false);
    const [members, setMembers] = useState([]);
    const [isJoined, setIsJoined] = useState(channelJoined);
    const [myChannels, setMyChannels] = useState([]);
    const { userData, userJoinedChannels, totalMemory } = useApp();
    const [page, setPage] = useState(1);
    const [channelFeedCount, setChannelFeedCount] = useState(0);
    const editChannelSheetRef = useRef();
    const memberListSheetRef = useRef();
    const { getInvitations } = useInvitation();
    const [isUnavailable, setIsUnavailable] = useState(false);

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
        setMyChannels(userJoinedChannels);
    };

    useEffect(() => {
        const fetchChannels = async () => {
            await getUserChannels();
        };
        fetchChannels();
    }, []);

    const getChannelData = async () => {
        setIsLoading(true);
        try {
            const channelData = await getChannelById(channelId);
            // console.log(channelData);
            setChannelInfo(channelData);

            const formattedMembers = channelData.members.map((member) => ({
                name: member.displayName,
                id: member.id,
                profileImageKey: member.profileImageKey,
                profileImage: member.profileImageKey
                    ? avatarPrefix + member.profileImageKey
                    : avatarPrefix + defaultAvatar,
            }));
            setMembers(formattedMembers);

            const isUserJoined = channelData.members.some(
                (member) => member.id === userData.id,
            );
            setIsJoined(isUserJoined);

            const membersProfileImageKeys = channelData.members.map(
                (member) => member.profileImageKey,
            );

            const memberProfileImages = membersProfileImageKeys.map(
                (profileImageKey) => {
                    return profileImageKey
                        ? avatarPrefix + profileImageKey
                        : avatarPrefix + defaultAvatar;
                },
            );

            setFirstThreeImages(memberProfileImages.slice(0, 3));
        } catch (error) {
            console.error("Error fetching channel data:", error);
            setIsUnavailable(true);
        } finally {
            setIsLoading(false);
        }
    };

    const getChannelFeed = async () => {
        if (isDataLoading) return;
        try {
            setIsDataLoading(true);
            const channelFeed = await communityFeed(channelId, page);
            setChannelFeedCount(channelFeed.count);
            setChannelFeedData(channelFeed.posts);
        } catch (error) {
            console.error("Error fetching channel feed:", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    useEffect(() => {
        const loadChannelInfo = async () => {
            await getChannelData();
            await getChannelFeed();
        };
        loadChannelInfo();
    }, []);

    const toggleJoin = async () => {
        if (isLoading) {
            return;
        }
        if (isEveryone) {
            showMessage({
                message: "You can't leave #everyone channel.",
                type: "info",
            });
            return;
        }
        const type = isJoined ? "remove" : "add";
        try {
            setIsLoading(true);
            await addRemoveUser(channelId, { type });
            DeviceEventEmitter.emit("getChannels");
            setIsJoined(!isJoined);
            route.params.isJoined = !isJoined;
            await getChannelData();
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
            invokeRefresh();
        }
    }; const removePost = (id) => {
        setChannelFeedData((prevFeedData) =>
            prevFeedData.filter((post) => post.id !== id),
        );
    };
    const invokeRefresh = () => {
        DeviceEventEmitter.emit("refreshChannels");
    };
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

    const getNextPage = async () => {
        if (isDataLoading || isFetchingNextPage || isLoading)
            return;

        if (channelFeedCount <= channelFeedData.length)
            return;

        if (isDataLoading || isFetchingNextPage || isLoading) return;
        if (channelFeedCount <= channelFeedData.length) return;
        setIsFetchingNextPage(true);
        try {

            const nextChannelFeed = await communityFeed(channelId, page);

            if (nextChannelFeed?.posts?.length > 0) {
                setChannelFeedData((prevData) => {
                    const existingIds = new Set(prevData.map((item) => item.id));
                    const newData = nextChannelFeed.posts.filter((item) => !existingIds.has(item.id));
                    return [...prevData, ...newData];
                });
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Error fetching next page:", error);
        } finally {
            setIsFetchingNextPage(false);
        }
    };

    const ChannelInfoCard = () => {
        return (
            <View style={{ paddingHorizontal: 16 }}>
                <View
                    style={{
                        alignSelf: "center",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {channelInfo.description && (
                        <Text
                            style={{
                                textAlign: "center",
                                marginBottom: 10,
                            }}
                        >
                            {channelInfo.description}
                        </Text>
                    )}
                    <TouchableOpacity
                        style={{
                            paddingRight: "40%",
                            paddingBottom: 40,
                            paddingLeft: "20%",
                        }}
                        onPress={() => {
                            memberListSheetRef?.current?.open();
                        }}
                    >
                        <StackedImages images={firstThreeImages} />
                    </TouchableOpacity>
                    <Text style={{ marginBottom: 5 }}>
                        {channelInfo.members?.length || 0} Members
                    </Text>
                </View>
                <View style={{ alignSelf: "center" }}>
                    {!(isCreator || isJoined) && (
                        <View style={{ width: 125 }}>
                            <Button
                                label={isLoading || isDataLoading ? "" : "Join"}
                                endIcon={
                                    isLoading || isDataLoading ? (
                                        <Loader
                                            size="small"
                                            color={theme.colors.white}
                                        />
                                    ) : (
                                        <AddIcon />
                                    )
                                }
                                borderRadius={20}
                                onPress={toggleJoin}
                            />
                        </View>
                    )}
                    {isCreator && (
                        <View style={{ width: 125 }}>
                            <Button
                                label="Edit"
                                borderRadius={20}
                                onPress={() => {
                                    setModalVisible(true);
                                }}
                            />
                        </View>
                    )}
                    {isJoined && !isCreator && (
                        <View style={{ width: 125 }}>
                            <Button
                                label={
                                    isLoading || isDataLoading ? "" : "Joined"
                                }
                                borderRadius={20}
                                bgColor={theme.colors.white}
                                color={theme.colors.lightBlue}
                                endIcon={
                                    (isLoading || isDataLoading) && (
                                        <Loader
                                            size="small"
                                            color={theme.colors.lightBlue}
                                        />
                                    )
                                }
                                onPress={toggleJoin}
                            />
                        </View>
                    )}
                </View>
                <Divider
                    width={2}
                    color="#ccc"
                    style={{ paddingVertical: 8 }}
                />
            </View>
        );
    };
    const ListFooterComponent = () => {
        return channelFeedData.length < channelFeedCount ? (
            <ActivityIndicator color={theme.colors.lightBlue} />
        ) : (
            <View style={{ height: 200 }} />
        );
    };

    return (
        <View>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" />
            <SafeAreaView>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.goBack();
                        }}
                        style={{
                            padding: 10,
                        }}
                    >
                        <ArrowLeftSVG />
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        {channelInfo.type === "private" && (
                            <FontAwesome5
                                name="lock"
                                size={18}
                                color={theme.colors.lightBlue}
                            />
                        )}

                        <Text
                            style={{
                                fontSize: 24,
                                color: theme.colors.lightBlue,
                                fontWeight: "600",
                            }}
                        >
                            {channelTag}
                        </Text>
                    </View>
                    <View style={{ width: 30 }} />
                </View>
                {isUnavailable && (
                    <View
                        style={{
                            alignItems: "center",
                            padding: 12,
                            borderRadius: 10,
                            backgroundColor: "#D3D3D380",
                            margin: 20,
                            height: 200,
                            justifyContent: "center",
                        }}
                    >
                        <View style={{ marginBottom: 20 }}>
                            <Octicons name="blocked" size={42} />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                textAlign: "center",
                            }}
                        >
                            Channel details couldn't be loaded. It must have
                            been deleted.
                        </Text>
                    </View>
                )}
                {isDataLoading && isJoined && (
                    <View style={{ marginTop: 20 }}>
                        <Loader color={theme.colors.lightBlue} />
                    </View>
                )}
                {!isUnavailable && channelInfo && channelFeedData && (
                    <>
                        {(channelFeedData.length === 0 || !isJoined) && (
                            <ChannelInfoCard />
                        )}
                        {channelFeedData.length > 0 &&
                            !isDataLoading &&
                            isJoined && (
                                <FlatList
                                    removeClippedSubviews={totalMemory <= 4}
                                    scrollEnabled
                                    initialNumToRender={4}
                                    maxToRenderPerBatch={4}
                                    ref={flatListRef}
                                    data={channelFeedData}
                                    keyExtractor={(item) => item.id}
                                    ListHeaderComponent={<ChannelInfoCard />}
                                    renderItem={({ item, index }) => (
                                        <FeedPost
                                            content={channelFeedData}
                                            postIndex={index}
                                            post={item}
                                            type="feed"
                                            userData={userData}
                                            isMainFeed={true}
                                            myChannels={myChannels}
                                            currentChannel={channelId}
                                            removePost={removePost}
                                            isChannelDetail={true}
                                            ERTVersionUserIds={
                                                ERTVersionUserIds
                                            }
                                        />
                                    )}
                                    onEndReached={getNextPage}
                                    onEndReachedThreshold={0.5}
                                    ListFooterComponent={
                                        <ListFooterComponent />
                                    }
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                />
                            )}
                        {channelFeedCount === 0 &&
                            !isDataLoading &&
                            isJoined && (
                                <Text
                                    style={{
                                        padding: 20,
                                        color: "#888",
                                        fontSize: 16,
                                        textAlign: "center",
                                    }}
                                >
                                    No Post in this Channel
                                </Text>
                            )}
                        {!isJoined && !isDataLoading && (
                            <Text
                                style={{
                                    padding: 20,
                                    color: "#888",
                                    fontSize: 16,
                                    textAlign: "center",
                                }}
                            >
                                Join Channel to View Posts
                            </Text>
                        )}
                    </>
                )}
            </SafeAreaView>

            {!isDataLoading && modalVisible && (
                <CreateChannelModal
                    showCreateChannelModal={modalVisible}
                    setShowCreateChannelModal={setModalVisible}
                    onChannelCreate={async () => {
                        setModalVisible(false);
                        await getChannelData();
                    }}
                    isEditMode
                    initialValues={{
                        channelName: channelInfo.tag,
                        description: channelInfo.description,
                        id: channelInfo.id,
                        addedMembers: channelInfo.members,
                        type: channelInfo.type,
                    }}
                    sheetRef={editChannelSheetRef}
                />
            )}

            {!isUnavailable && members && channelInfo && (
                <MemberList
                    setShowMemberListModal={setMemberVisible}
                    membersInfo={members}
                    channelName={channelInfo.tag}
                    sheetRef={memberListSheetRef}
                    ownerId={channelInfo.owner && channelInfo.owner.id}
                />
            )}
        </View>
    );
};

export default ChannelDetails;
