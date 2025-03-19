import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import EditableText from "../components/EditableName";
import MyPostList from "../components/MyPostList";
import PopUpMenu from "../components/PopUpMenu";
import ProfileImage from "../components/ProfileImage"; // Import the ProfileImage component
import ReturnTabs from "../components/ReturnTabs";
import BarsSVG from "../components/Svgs/BarsSVG";
import { defaultAvatar } from "../config/constants";
import theme from "../config/theme";
import useApp from "../hooks/useApp";
import useUsers from "../hooks/useUsers";

const Profile = ({ navigation, route }) => {
    const [avatarSource, setAvatarSource] = useState(defaultAvatar);
    const [displayName, setDisplayName] = useState("");
    const [userName, setUserName] = useState("");
    const [postList, setPostList] = useState([]);
    const [menuVisible, setMenuVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { logout, reloadProfile, setReloadProfile } = useApp();
    const { me, deleteMe, updateProfile } = useUsers();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);
    const isFirstRender = useRef(true);

    /**
     * Fetches user data.
     * @async
     * @function fetchData
     * @returns {void}
     */
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await me();
            if (data.profileImageKey) {
                setAvatarSource(data.profileImageKey);
            }
            setDisplayName(data.displayName);
            setUserName(data.userName);
            setPostList(data.posts);
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFirstRender.current || reloadProfile) {
            fetchData();
            setReloadProfile(false);
            isFirstRender.current = false;
        }
    }, [reloadProfile]);

    /**
     * Handles the user logout process.
     * @async
     * @function handleLogout
     * @returns {void}
     */
    const handleLogout = async () => {
        setMenuVisible(false);
        await updateProfile();
        await logout();
        navigation.replace("Login");
    };

    /**
     * Navigates to the follower list screen.
     * @function handleFollowerList
     * @returns {void}
     */
    const handleFollowerList = () => {
        navigation.navigate("Followers");
    };

    /**
     * Navigates to the following list screen.
     * @function handleFollowingList
     * @returns {void}
     */
    const handleFollowingList = () => {
        navigation.navigate("Following");
    };

    /**
     * Navigates to the circles formation screen.
     * @function handleCircle
     * @returns {void}
     */
    const handleCircle = () => {
        navigation.navigate("YourTeam");
    };

    /**
     * Handles the user account delete process.
     * @async
     * @function handleDeleteAccount
     * @returns {void}
     */
    const handleDeleteAccount = async () => {
        try {
            setMenuVisible(false);
            await deleteMe();
            await logout();
            navigation.navigate("Login");
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const handleDeleteModal = () => {
        setMenuVisible(false);
        Alert.alert(
            "Account Delete",
            "Are you sure, you want to delete your account?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel"),
                },
                {
                    text: "Delete",
                    onPress: () => handleDeleteAccount(),
                },
            ],
        );
    };

    const handleLogoutModal = () => {
        setMenuVisible(false);
        Alert.alert(
            "Account Logout",
            "Are you sure, you want to logout your account?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel"),
                },
                {
                    text: "Logout",
                    onPress: () => handleLogout(),
                },
            ],
        );
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            const data = await me();
            setPostList(data.posts);
        } catch (error) {
            console.error("Error while refreshing: ", error);
        } finally {
            setRefreshing(false);
        }
    };

    const ProfileMenuList = [
        {
            label: "Logout",
            onPress: handleLogoutModal,
        },
        {
            label: "Delete My Account",
            onPress: handleDeleteModal,
        },
    ];

    return (
        <SafeAreaView style={styles.wrapper}>
            {menuVisible && (
                <TouchableWithoutFeedback
                    onPress={() => {
                        setMenuVisible(false);
                    }}
                >
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}
            <View style={[styles.barContainer, { top: insets.top }]}>
                <TouchableOpacity
                    onPress={() => {
                        setMenuVisible((prev) => !prev);
                    }}
                    hitSlop={{ top: 20, bottom: 20, left: 30, right: 30 }}
                    testID="profile-more"
                >
                    <BarsSVG width={25} height={25} color="#000" />
                </TouchableOpacity>
                {menuVisible && <PopUpMenu menuList={ProfileMenuList} />}
            </View>
            <View style={styles.topContainer}>
                <View style={styles.profileContainer}>
                    <ProfileImage
                        avatarSource={avatarSource}
                        setAvatarSource={setAvatarSource}
                        setDisplayName={setDisplayName}
                    />
                    {isLoading ? (
                        <ActivityIndicator
                            style={{ marginHorizontal: 30 }}
                            color={theme.colors.lightBlue}
                        />
                    ) : (
                        <View style={{ width: "70%" }}>
                            <EditableText
                                text={displayName}
                                username={userName}
                                setText={setDisplayName}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.teamBtn}
                        onPress={() => {
                            navigation.navigate("Invitations", {
                                isProfile: true,
                            });
                        }}
                    >
                        <Text style={styles.text}>All Teams</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.teamBtn}
                        onPress={() => {
                            navigation.navigate("SendInvitation");
                        }}
                    >
                        <Text style={styles.text}>Invite Friends</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
            </View>
            {/* Rest of the code for Profile component */}
            <View style={{ paddingBottom: "15%" }}>
                {isLoading && (
                    <ActivityIndicator
                        size={"large"}
                        color={theme.colors.lightBlue}
                    />
                )}
                {postList.length > 0 && !isLoading && (
                    <MyPostList
                        postList={postList}
                        setPostList={setPostList}
                        refreshing={refreshing}
                        handleRefresh={handleRefresh}
                    />
                )}
                {postList.length === 0 && !isLoading && (
                    <Text style={styles.noPostText}>
                        No posts yet. Create your first one!
                    </Text>
                )}
            </View>
            <ReturnTabs />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        maxHeight: Dimensions.get("window").height - 90,
        backgroundColor: "#fff",
        borderColor: "red",
    },
    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 30,
    },
    topContainer: {
        paddingHorizontal: 20,
        backgroundColor: "#fff",
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    username: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: "bold",
    },
    separator: {
        borderBottomColor: "#00000070",
        borderBottomWidth: 1,
        marginTop: 20,
        marginBottom: 10,
    },
    logoutText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    teamBtn: {
        backgroundColor: "#239CE070",
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: 35,
        display: "flex",
    },
    text: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
        lineHeight: 18,
    },
    textNumber: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "bold",
    },
    deleteAccountText: {
        color: "#ffffff",
        borderRadius: 5,
        alignSelf: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
    postImage: {
        height: 20,
        width: 20,
    },
    deleteButton: {
        backgroundColor: "red",
        alignItems: "center",
        justifyContent: "center",
        width: "48%",
    },
    btnContainer: {
        justifyContent: "space-evenly",
        flexDirection: "row",
        gap: 10,
    },
    logoutButton: {
        backgroundColor: "#87CEEB",
        paddingVertical: 15,
        alignItems: "center",
        justifyContent: "center",
        width: "48%",
    },
    barContainer: {
        position: "absolute",
        right: 20,
        marginTop: 20,
        alignItems: "flex-end",
        gap: 5,
        zIndex: 100,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "transparent",
        zIndex: 2,
    },
    noPostText: {
        marginVertical: 20,
        marginHorizontal: 10,
        textAlign: "center",
        fontSize: 16,
        color: "#999",
    },
});

export default Profile;
