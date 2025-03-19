import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Divider } from "react-native-elements";
import { showMessage } from "react-native-flash-message";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ONBOARD_LIST_THREE } from "../../config/data";
import theme from "../../config/theme";
import { getImageUrl } from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import useInvitation from "../../hooks/useInvitation";
import useSocials from "../../hooks/useSocials";
import useUsers from "../../hooks/useUsers";
import { inviteSchema } from "../../services/yup";
import InviteContainer from "../InviteContainer";
import UserContainer from "../InviteContainer/UserContainer";
import Loader from "../Loader";
import SearchBar from "../SearchBar";
import { ChannelIcon } from "../Svgs";
import UserItem from "../UserItem";
import EmailInvitedUserItem from "./EmailInvitedUserItem";

const OnboardingInvite = ({
    onboardStep,
    setOnboardStep,
    inviteCount,
    setInviteCount,
    invitedUsers,
    setInvitedUsers,
    emailInviteCount,
    setEmailInviteCount,
    invitedEmails,
    setInvitedEmails,
}) => {
    const { inviter, setActiveRoute, setInviter } = useApp();
    const { recommendInvitations } = useSocials();
    const { getMyInviter } = useInvitation();
    const [loading, setLoading] = useState(false);
    const [emailInvLoading, setEmailInvLoading] = useState(false);
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState("");
    const [searchedUser, setSearchedUser] = useState([]);
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [users, setUsers] = useState(searchedUser);
    const [teamUsers, setTeamUsers] = useState([]);
    const textData = ONBOARD_LIST_THREE;
    const { getAllUsers, me } = useUsers();
    const {
        control,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(inviteSchema),
    });

    const getInviter = async () => {
        try {
            const data = await getMyInviter();
            setInviter(data);
        } catch (err) {
            console.log("Error in getting inviter info ", err);
        }
    };

    useEffect(() => {
        getInviter();
    }, []);

    const bgColor = inviteCount <= 3 && "#B7B7B7";
    const outlinedColor = inviteCount > 1 ? theme.colors.lightBlue : "#B7B7B7";
    const iconSize = { width: 18, height: 18, stroke: "#3C3C4390" };
    const [refreshKey, setRefreshKey] = useState(0);
    const { postInvitation, revertInvitation, postEmailInvitation } =
        useInvitation();
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

            updateUserStatus(inviteeId, "Invite");
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
            updateUserStatus(inviteeId, "pending");
        } else if (status === "pending") {
            revertInvite(inviteeId, status, index);
            updateUserStatus(inviteeId, "Invite");
        }
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const updateUserStatus = (inviteeId, newStatus) => {
        setTeamUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === inviteeId ? { ...user, status: newStatus } : user,
            ),
        );
        setRecommendedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === inviteeId ? { ...user, status: newStatus } : user,
            ),
        );
    };

    const fetchRecommendedAndInvited = async () => {
        try {
            setLoading(true);
            const allUsers = await getAllUsers();
            const currentUser = await me();

            const invitedUsers = allUsers.filter(
                (obj) =>
                    obj?.status === "accepted" || obj?.status === "pending",
            );

            setTeamUsers(invitedUsers);
            setInvitedUsers(invitedUsers);

            const recommendedUsers = allUsers
                .slice(0, 10)
                .filter((user) => user.id !== currentUser.id);

            setRecommendedUsers((prevUsers) =>
                recommendedUsers.map((user) => {
                    const invitedUser = invitedUsers.find(
                        (obj) => obj.id === user.id,
                    );
                    return invitedUser ? invitedUser : user;
                }),
            );
        } catch (err) {
            console.log(err, "Error fetching users data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendedAndInvited();
    }, [inviteCount]);

    const onSubmit = async () => {
        try {
            setEmailInvLoading(true);
            const res = await postEmailInvitation(getValues("inviteeEmail"));
            if (res && res.success === false) {
                Alert.alert(res.message);
                return;
            }
            showMessage({ message: "Invitation sent!", type: "success" });
            setInvitedEmails((prev) => [...prev, getValues("inviteeEmail")]);
            setEmailInviteCount(emailInviteCount + 1);
            reset();
        } catch (err) {
            console.log("Error:- ", err);
        } finally {
            setEmailInvLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.mainText}> Pick Your Team </Text>
                <Text style={styles.subText}>
                    Invite at least{" "}
                    <Text style={{ fontWeight: "bold" }}>three</Text> trusted
                    people to your team to help you share your post across
                    channels.
                </Text>
            </View>
            <View style={styles.section}>
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
                        Your Team {teamUsers.length + emailInviteCount}/3
                    </Text>
                </View>
                {/* {inviter && (
                    <UserItem
                        source={getImageUrl(inviter.profileImageKey)}
                        username={inviter.userName}
                        label="Added"
                        variant="outlined"
                        color={theme.colors.lightBlue}
                        disabled
                    />
                )} */}
                <Text style={styles.subText}>
                    You can also invite your friends to the app and become part
                    of your team!
                </Text>
                <View style={styles.inviteContainer}>
                    <Controller
                        defaultValue=""
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.inviteBox}
                                value={value}
                                onChangeText={onChange}
                                cursorColor="#58B2E3"
                                placeholder="Enter your friends email"
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                textContentType="emailAddress"
                            />
                        )}
                        name="inviteeEmail"
                    />

                    <TouchableOpacity
                        disabled={emailInvLoading}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.btn}
                    >
                        {emailInvLoading ? (
                            <Loader size="small" color="#fff" />
                        ) : (
                            <Text style={styles.btnText}>Send</Text>
                        )}
                    </TouchableOpacity>
                </View>
                {errors.inviteeEmail && (
                    <Text style={styles.errorText}>
                        {errors.inviteeEmail.message}
                    </Text>
                )}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {invitedEmails.length > 0 && (
                    <View style={{ paddingHorizontal: 10 }}>
                        {invitedEmails.map((email, index) => {
                            return (
                                <EmailInvitedUserItem
                                    email={email}
                                    key={index}
                                />
                            );
                        })}
                        <Divider style={{ marginHorizontal: 10 }} />
                    </View>
                )}
                {teamUsers.length > 0 && (
                    <View style={styles.inviteImageContainer}>
                        {teamUsers.map((user, index) => {
                            const status = user.status || "pending";
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
                                status === "accepted"
                                    ? theme.colors.green
                                    : userBgColor;
                            const labelContent =
                                loading && currentIndex === index ? (
                                    <Loader size="small" color="#fff" />
                                ) : (
                                    label
                                );
                            const disableButton = label === "Joined" || loading;
                            return (
                                <UserItem
                                    key={user.id}
                                    source={getImageUrl(user.profileImageKey)}
                                    username={user.userName}
                                    label={labelContent}
                                    variant="contained"
                                    color={color}
                                    bgColor={userBgColor}
                                    outlinedColor={outlinedColor}
                                    displayName={user.displayName}
                                    onPress={() => {
                                        onClickHandler(
                                            user.id,
                                            user.status,
                                            index,
                                        );
                                    }}
                                    disabled={disableButton}
                                    isOnboarding={true}
                                />
                            );
                        })}
                    </View>
                )}

                <View style={styles.barContainer}>
                    <SearchBar
                        value={searchText}
                        iconSize={iconSize}
                        setValue={setSearchText}
                        barStyles={styles.searchBar}
                        placeholder="Search People to invite"
                        showCross
                        inviteCount={inviteCount}
                        setInviteCount={setInviteCount}
                        setLoading={setLoading}
                        setSearchedUser={setSearchedUser}
                    />
                </View>
                {searchText.length === 0 && (
                    <View style={styles.teamContainer}>
                        <View style={[styles.section, { flex: 1 }]}>
                            {loading && <Loader size="large" color="skyblue" />}
                            {!loading && recommendedUsers.length !== 0 && (
                                <Text style={styles.recommend}>
                                    Recommended Users
                                </Text>
                            )}
                            {!loading && (
                                <UserContainer
                                    isOnboard
                                    searchedUser={recommendedUsers}
                                    setLoading={setLoading}
                                    setInviteCount={setInviteCount}
                                    invitedUsers={invitedUsers}
                                    setInvitedUsers={setInvitedUsers}
                                />
                            )}
                        </View>
                    </View>
                )}
                {!(searchText.length === 0) && (
                    <View style={styles.releaseContainer} key={refreshKey}>
                        <InviteContainer
                            type="onboard"
                            inviteCount={inviteCount}
                            setInviteCount={setInviteCount}
                            initialText={searchText}
                            invitedUsers={teamUsers}
                            setInvitedUsers={setInvitedUsers}
                            searchedUser={searchedUser}
                            setSearchedUser={setSearchedUser}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default OnboardingInvite;

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        overflow: "hidden",
    },
    header: {
        height: "20%",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    subHeader: {
        marginTop: 20,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    iconImage: {
        width: 50,
        height: 50,
    },
    userItemContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // width: '80%',
        marginBottom: 20,
    },
    usersContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    imageUserNameContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    userNameText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    mainText: {
        color: "#189AE2",
        fontSize: 28,
        textAlign: "center",
        fontWeight: "bold",
        marginHorizontal: 10,
    },
    subText: {
        marginTop: 10,
        fontSize: 18,
        textAlign: "center",
    },
    infoText: {
        color: "#46464E",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "600",
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    subtitle: {
        color: "#189AE2",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "600",
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    section: {
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    imageContainer: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        marginBottom: 10,
    },
    inviteImageContainer: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 0,
    },
    text: {
        fontSize: 18,
        color: "#0091E2",
        fontWeight: "bold",
    },
    endBtnContainer: {
        width: 100,
    },
    releaseContainer: {
        height: "60%",
        paddingHorizontal: 20,
        marginTop: -45,
    },
    searchBar: {
        borderRadius: 26,
        paddingHorizontal: 15,
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        marginTop: 10,
        marginBottom: 0,
        backgroundColor: "#EEEEEE",
    },
    recommend: {
        fontWeight: "600",
        fontSize: 18,
        marginTop: -10,
        marginBottom: 10,
    },
    teamContainer: {
        height: "60%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    barContainer: {
        // height: "10%",
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    textContainer: {
        paddingVertical: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        width: "100%",
    },
    inviteContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    inviteBox: {
        borderWidth: 2,
        borderColor: "#E9E9E9",
        backgroundColor: "#E9E9E9",
        borderRadius: 32,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        // textAlign: "center",
        fontSize: 18,
        width: "78%",
    },
    btn: {
        width: 75,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        backgroundColor: "#58B2E3",
        height: 52,
    },
    btnText: {
        color: theme.colors.white,
        fontSize: 20,
        fontWeight: "700",
    },
    errorText: {
        fontSize: 14,
        color: "red",
        textAlign: "left",
        marginBottom: 5,
    },
});
