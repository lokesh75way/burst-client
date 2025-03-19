import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "react-native-elements";

import NextTabs from "../components/NextTabs";
import ProfileImage from "../components/ProfileImage"; // Import the ProfileImage component
import { avatarPrefix, defaultAvatar } from "../config/constants";
import useFeeds from "../hooks/useFeeds";
import useSocials from "../hooks/useSocials";
import useUsers from "../hooks/useUsers";

const GetStart = () => {
    const [avatarSource, setAvatarSource] = useState(defaultAvatar);
    const [displayName, setDisplayName] = useState("");
    const [userId, setUserId] = useState(-1);
    const [usersList, setUsersList] = useState([]);
    const [addedUsers, setAddedUsers] = useState([]);
    const [myFollowedId, setMyFollowedId] = useState([]);
    const [myFollowing, setMyFollowing] = useState([]);
    const [myFollowingNumber, setMyFollowingNumber] = useState(0);
    const { getFollowing, addFollowing, removeSocialFollowing } = useSocials();
    const { me } = useUsers();
    const { getFeedUsers } = useFeeds();

    /**
     * Fetches user profile data and updates relevant state variables.
     * @async
     * @function fetchProfile
     * @returns {void}
     */
    const fetchProfile = async () => {
        try {
            const data = await me();
            setAvatarSource(data.profileImageKey || defaultAvatar);
            setDisplayName(data.displayName);
            setUserId(data["id"]);
        } catch (error) {
            // deal with the internet errors
            console.log(" 1 Error: ", error);
        }
    };

    /**
     * Fetches following data and updates relevant state variables.
     * @async
     * @function fetchFollowingData
     * @returns {void}
     */
    const fetchFollowingData = async () => {
        try {
            const data = await getFollowing();
            setMyFollowing(data.followings);
            setMyFollowingNumber(data.counts.following);

            const followArray = data.followings;
            const followedId = followArray
                .map((item) => item.following && item.following.id)
                .filter((id) => id !== undefined);
            setMyFollowedId(followedId);
            setAddedUsers(followedId);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Fetches users' list data and updates relevant state variables.
     * @async
     * @function getUsersList
     * @returns {void}
     */
    const getUsersList = async () => {
        try {
            const data = await getFeedUsers();
            setUsersList(data);
        } catch (error) {
            console.log("getUsersList Error: ", error.response);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchFollowingData();
        getUsersList();
    }, []);

    /**
     * Adds a user to the following list and updates related state variables.
     * @async
     * @function addUsers
     * @param {string} userId - The ID of the user to add.
     * @returns {void}
     */
    const addUsers = async (userId) => {
        try {
            setAddedUsers((prevUsers) => [...prevUsers, userId]);
            const cur_myFollowingNumber = myFollowingNumber + 1;
            setMyFollowingNumber(cur_myFollowingNumber);
            setMyFollowedId((state) => [...state, userId]);
            await addFollowing([userId]);
        } catch (error) {
            console.error(error.response);
        }
    };

    const removeUsers = async (userId) => {
        try {
            const updatedAddedUsers = addedUsers.map((currUser) => {
                if (currUser !== userId) {
                    return currUser;
                }
            });
            const myFollowings = myFollowedId.map((id) => {
                if (id !== userId) return id;
            });
            setMyFollowedId(myFollowings);
            setAddedUsers(updatedAddedUsers);
            const cur_myFollowingNumber = myFollowingNumber - 1;
            setMyFollowingNumber(cur_myFollowingNumber);
            await removeSocialFollowing(userId);
        } catch (error) {
            console.log(error.message);
        }
    };

    /**
     * Renders a single item for the list.
     * @function renderItem
     * @param {object} item - The item data to render.
     * @returns {JSX.Element} React component representing the item.
     */
    const RenderItem = ({ item }) => {
        const userProfile = item?.following ? item.following : item;

        const { profileImageKey, displayName, id } = userProfile;

        const isUserAdded =
            addedUsers.includes(id) || myFollowedId.includes(id);

        const avatar = profileImageKey ? profileImageKey : defaultAvatar;

        return (
            <View styles={styles.itemContainer}>
                <View style={styles.userCard}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity
                            onPress={
                                () => {}
                                /*() => handleUserPage(avatar, displayName, id)*/
                            }
                        >
                            <Avatar
                                rounded
                                source={{ uri: avatarPrefix + avatar }} // Assuming profileImageKey is a valid image URL
                                size="medium"
                            />
                        </TouchableOpacity>
                        <Text style={styles.displayName}>{displayName}</Text>
                    </View>
                    <View style={styles.followButton}>
                        {item.following && (
                            <View style={styles.addUserContainer}>
                                <TouchableOpacity
                                    style={styles.addedUserButton}
                                >
                                    <Text style={styles.addUserText}>
                                        Followed
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {!item.following && (
                            <View style={styles.addUserContainer}>
                                {isUserAdded && (
                                    // <TouchableOpacity style={styles.addedUserButton} onPress={() => {removeUser(id); }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            removeUsers(id);
                                        }}
                                        style={[
                                            styles.userButton,
                                            styles.removeUserButton,
                                        ]}
                                    >
                                        {/* <Text style={styles.addUserText}>{`${level}x`}</Text> */}
                                        <Text style={styles.addUserText}>
                                            Following
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {!isUserAdded && (
                                    <TouchableOpacity
                                        style={[
                                            styles.userButton,
                                            styles.addUserButton,
                                        ]}
                                        onPress={() => {
                                            addUsers(id);
                                        }}
                                    >
                                        <Text style={styles.addUserText}>
                                            Follow
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <SafeAreaView style={styles.profileContainer}>
                <Text style={styles.title}>Welcome {displayName} !</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.scrollContainer}
                >
                    <View style={styles.profileData}>
                        <ProfileImage
                            avatarSource={avatarSource}
                            setAvatarSource={setAvatarSource}
                        />
                        <Text style={styles.uploadImageTitle}>
                            Upload your profile image here.
                        </Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.followUsersText}>
                            {" "}
                            Start from follow some users here:{" "}
                        </Text>
                    </View>
                    <View style={styles.userList}>
                        {usersList.map((item, index) => (
                            <RenderItem item={item} key={index} />
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    {myFollowingNumber >= 5 ? (
                        <NextTabs />
                    ) : (
                        <Text style={styles.footerText}>
                            Please follow at least 5 users to continue
                        </Text>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: 10,
        width: "100%",
        paddingHorizontal: 10,
        fontSize: "20",
    },
    uploadImageTitle: {
        marginTop: -15,
        color: "#87CEEB",
    },
    followUsersText: {
        fontSize: 20,
    },
    footer: {
        width: "100%",
    },
    footerText: {
        color: "red",
        textAlign: "center",
    },
    profileContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        paddingHorizontal: 20,
        marginVertical: -40,
    },
    scrollContainer: {
        width: "100%",
        maxHeight: "75%",
    },
    profileData: {
        alignItems: "center",
    },
    userList: {
        paddingBottom: "5%",
        flex: 0,
        marginHorizontal: 20,
    },
    itemContainer: {
        paddingHorizontal: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    userCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // borderBottomWidth: 1,
        // borderBottomColor: "#ccc",
        paddingVertical: 10,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    displayName: {
        paddingLeft: 20,
        fontSize: 16,
    },
    followButton: {
        width: 120,
    },
    addUserContainer: {
        flexDirection: "row",
    },
    userButton: {
        paddingVertical: 10,
        paddingHorizontal: "1%",
        marginRight: "5%",
        borderRadius: 5,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        width: "100%",
    },
    addUserButton: {
        backgroundColor: "#87CEEB",
    },
    removeUserButton: {
        backgroundColor: "#B2DFEE",
    },
    addedUserButton: {
        backgroundColor: "#87CEEB",
        paddingVertical: 10,
        paddingHorizontal: "1%",
        marginRight: "5%",
        borderRadius: 5,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
    },
    addUserText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        paddingTop: "18%",
        marginBottom: 15,
    },
});

export default GetStart;
