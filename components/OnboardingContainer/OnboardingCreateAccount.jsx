import { useNavigation } from "@react-navigation/core";
import { CommonActions } from "@react-navigation/native";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "react-native-elements";
import { showMessage } from "react-native-flash-message";

import theme from "../../config/theme";
import { getImageUrl } from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import useChannels from "../../hooks/useChannels";
import useInvitation from "../../hooks/useInvitation";
import useSocials from "../../hooks/useSocials";
import useUsers from "../../hooks/useUsers";
import ChannelItem from "../Channels/ChannelItem";
import Loader from "../Loader";
import { ArrowLeftSVG, ChannelIcon } from "../Svgs";
import UserItem from "../UserItem";
import EmailInvitedUserItem from "./EmailInvitedUserItem";

const OnboardingCreateAccount = ({
    onboardStep,
    setOnboardStep,
    inviteCount,
    setInviteCount,
    setEndReached,
    invitedUsers,
    setInvitedUsers,
    swiperRef,
    joinedChannels,
    setJoinedChannels,
    emailInviteCount,
    invitedEmails,
}) => {
    const [loading, setLoading] = useState(false);
    const { getMyChannels, searchChannel, getChannels } = useChannels();
    const { inviter, setActiveRoute, setInviter } = useApp();
    const { recommendInvitations } = useSocials();
    const { getMyInviter } = useInvitation();
    const navigation = useNavigation();
    const [searchChannelText, setSearchChannelText] = useState("");
    const [searchUserText, setSearchUserText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchedUser, setSearchedUser] = useState([]);
    // const [joinedChannels, setJoinedChannels] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [users, setUsers] = useState(searchedUser);
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [totalChannelsCount, setTotalChannelsCount] = useState(0);
    const { getAllUsers } = useUsers();

    const isEmpty = searchUserText.length === 0;
    const iconSize = { width: 18, height: 18, stroke: "#3C3C4390" };

    const next = async () => {
        setActiveRoute("Home");
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "MainTabs",
                        params: { screen: "Home" },
                    },
                ],
            }),
        );
    };

    // const getAllData = async () => {
    //     try {
    //         const userData = await getAllUsers();
    //         setTotalUsersCount(userData.length);
    //         const channelData = await getChannels();
    //         setTotalChannelsCount(channelData.length);
    //         console.log("#totalUsersCount = ", totalUsersCount);
    //         console.log("#totalChannelsCount = ", totalChannelsCount);
    //     } catch (err) {
    //         console.log("Error in getting all data ", err);
    //     }
    // };

    // useEffect(() => {
    //     getAllData();
    // }, []);

    // const getInviter = async () => {
    //     try {
    //         const data = await getMyInviter();
    //         setInviter(data);
    //     } catch (err) {
    //         console.log("Error in getting inviter info ", err);
    //     }
    // };
    // const getRecommendation = async () => {
    //     try {
    //         setLoading(true);
    //         const data = await recommendInvitations();
    //         const alreadyInvitedUser = data.filter(
    //             (obj) => obj.status === "accepted" || obj.status === "pending",
    //         );
    //         setInvitedUsers(alreadyInvitedUser);
    //     } catch (err) {
    //         console.log(err, "Error in getting recommendations");
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const getAllChannels = async () => {
        try {
            const userChannelsData = await getMyChannels();
            setJoinedChannels(userChannelsData.joinedPublicChannels);
        } catch (err) {
            console.log("Error in fetching channels", err);
        }
    };

    // useEffect(() => {
    // getInviter();
    // getChannels();
    // getRecommendation();
    // }, []);

    const handleRefresh = async () => {
        try {
            await getAllChannels();
        } catch (error) {
            console.error("Error refreshing data:", error);
        }
    };

    // const handleSearch = async (text) => {
    //     setSearchChannelText(text);
    //     try {
    //         const resp = await searchChannel(text);
    //         setSearchResults(resp);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    const { postInvitation, revertInvitation } = useInvitation();
    const inviteUser = async (inviteeId, index) => {
        try {
            setLoading(true);
            setCurrentIndex(index);
            await postInvitation(inviteeId);
            setInviteCount?.((prev) => prev + 1);
            const userToInvite = searchedUser.find(
                (user) => user.id === inviteeId,
            );
            if (userToInvite) {
                setInvitedUsers((prev) => [...prev, userToInvite]);
            }
            const updatedUsers = users.map((user) =>
                user.id === inviteeId ? { ...user, status: "pending" } : user,
            );
            setUsers(updatedUsers);
            showMessage({
                message: "Invitation sent!",
                type: "success",
            });
        } catch (err) {
            console.log("error:-", err);
        } finally {
            setLoading(false);
            setCurrentIndex(null);
        }
    };

    const revertInvite = async (inviteeId, status, index) => {
        try {
            setLoading(true);
            setCurrentIndex(index);
            await revertInvitation(inviteeId, status);
            setInviteCount?.((prev) => prev - 1);
            setInvitedUsers((prev) =>
                prev.filter((user) => user.id !== inviteeId),
            );
            const user = users[index];
            user["status"] = "Invite";
            const updatedUsers = users;
            updatedUsers.splice(index, 1, user);
            setUsers(updatedUsers);
            showMessage({
                message: "Invitation withdrawn!",
                type: "info",
            });
        } catch (err) {
            console.log("error:-", err);
        } finally {
            setLoading(false);
            setCurrentIndex(null);
        }
    };

    const onClickHandler = (inviteeId, status, index) => {
        if (status === "Invite") {
            inviteUser(inviteeId, index);
        } else if (status == "pending") {
            revertInvite(inviteeId, status, index);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    setEndReached(false);
                    setOnboardStep(onboardStep - 1);
                    swiperRef.current.scrollTo({
                        index: onboardStep > 0 ? onboardStep - 1 : 3,
                        animated: true,
                    });
                }}
            >
                <ArrowLeftSVG />
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Text style={styles.mainText}>You're all set</Text>
                <Text style={styles.subText}>
                    Here are your teams and channels. Look Good? Please make
                    sure you've invited three members and joined three channels
                    before joining the app.
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Render Team Section only when not searching channels */}
                {searchChannelText.length === 0 && (
                    <>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                alignSelf: "center",
                                flexDirection: "row",
                            }}
                        >
                            <ChannelIcon />
                            <Text style={styles.mainText}>
                                Your Team{" "}
                                {invitedUsers.length + emailInviteCount}/3
                            </Text>
                        </View>
                        {invitedUsers.length < 0 &&
                            invitedEmails.length < 0 && (
                                <Text style={styles.noResultText}>
                                    Add People to your Team to continue
                                </Text>
                            )}
                        {invitedEmails.length > 0 &&
                            invitedEmails.map((email, index) => {
                                return (
                                    <EmailInvitedUserItem
                                        email={email}
                                        key={index}
                                    />
                                );
                            })}
                        {invitedUsers.length > 0 && (
                            <View style={styles.inviteImageContainer}>
                                {invitedUsers.map((user, index) => {
                                    const status = "pending";
                                    const pending = status === "pending";
                                    const accepted = status === "accepted";
                                    const userBgColor = pending
                                        ? "#A1A0A0"
                                        : accepted
                                          ? theme.colors.white
                                          : theme.colors.green;
                                    const label = pending
                                        ? "Pending"
                                        : accepted
                                          ? "Joined"
                                          : status;
                                    const color = accepted
                                        ? theme.colors.green
                                        : theme.colors.white;
                                    const outlinedColor =
                                        status == "accepted"
                                            ? theme.colors.green
                                            : userBgColor;
                                    const labelContent =
                                        loading && currentIndex === index ? (
                                            <Loader size="small" color="#fff" />
                                        ) : (
                                            label
                                        );
                                    const disableButton =
                                        label === "Joined" || loading;
                                    return (
                                        <UserItem
                                            key={user.id}
                                            source={getImageUrl(
                                                user.profileImageKey,
                                            )}
                                            username={user.userName}
                                            label={labelContent}
                                            variant="contained"
                                            color={color}
                                            bgColor={userBgColor}
                                            outlinedColor={outlinedColor}
                                            onPress={() => {
                                                onClickHandler(
                                                    user.id,
                                                    status,
                                                    index,
                                                );
                                            }}
                                            displayName={user.displayName}
                                            disabled={disableButton}
                                        />
                                    );
                                })}
                            </View>
                        )}
                        {/* <View style={styles.inputContainer}>
                            <SearchGrey />
                            <TextInput
                                placeholder="Search People to Invite"
                                value={searchUserText}
                                style={styles.inputText}
                                onChangeText={setSearchUserText}
                            />
                        </View>
                        {!isEmpty && (
                            <InviteContainer
                                type="onboard"
                                inviteCount={inviteCount}
                                setInviteCount={setInviteCount}
                                initialText={searchUserText}
                                invitedUsers={invitedUsers}
                                setInvitedUsers={setInvitedUsers}
                                searchedUser={searchedUser}
                                setSearchedUser={setSearchedUser}
                            />
                        )} */}
                    </>
                )}

                {/* Render Channels Section only when not searching users */}
                {searchUserText.length === 0 && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.mainText}>
                                Your Channels {joinedChannels.length}/3
                            </Text>
                        </View>
                        {joinedChannels.length < 0 && (
                            <Text style={styles.noResultText}>
                                Join Channels to Continue
                            </Text>
                        )}
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
                        {/* <View style={styles.inputContainer}>
                            <SearchGrey />
                            <TextInput
                                placeholder="Search for Channels"
                                value={searchChannelText}
                                style={styles.inputText}
                                onChangeText={handleSearch}
                            />
                        </View>
                        {searchChannelText.length !== 0 &&
                            searchResults.length === 0 && (
                                <Text style={styles.noResultText}>
                                    No results found
                                </Text>
                            )}
                        {searchChannelText.length !== 0 &&
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
                                        handleSearch(searchChannelText);
                                        handleRefresh();
                                    }}
                                />
                            ))} */}
                    </>
                )}
                <View style={styles.barContainer} />
                <View style={{ height: 100 }} />
            </ScrollView>
            <View
                style={{
                    position: "absolute",
                    bottom:
                        Dimensions.get("screen").height > 700
                            ? Dimensions.get("screen").height * 0.1
                            : 20,
                    alignSelf: "center",
                    width: "100%",
                    backgroundColor: "white",
                }}
            >
                <Button
                    title="Join the App"
                    buttonStyle={{
                        marginVertical: 12,
                        borderRadius: 30,
                        padding: 12,
                        backgroundColor:
                            invitedUsers.length + emailInviteCount < 3 ||
                            joinedChannels.length < 3
                                ? "#CCCCCC"
                                : theme.colors.lightBlue,
                    }}
                    titleStyle={{
                        fontWeight: "bold",
                        fontSize: 18,
                    }}
                    disabled={
                        invitedUsers.length + emailInviteCount < 3 ||
                        joinedChannels.length < 3
                    }
                    onPress={next}
                />
            </View>
        </View>
    );
};

export default OnboardingCreateAccount;

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
    },
    section: {
        width: "100%",
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    barContainer: {
        height: 100,
        paddingHorizontal: 20,
    },
    textContainer: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
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
    searchBar: {
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        marginVertical: 20,
        backgroundColor: "#EEEEEE",
    },
});
