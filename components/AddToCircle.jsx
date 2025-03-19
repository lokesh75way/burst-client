import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "react-native-elements";

import { avatarPrefix, defaultAvatar } from "../config/constants";
import useApp from "../hooks/useApp";
import useSocials from "../hooks/useSocials";

const AddToCircle = (props) => {
    /**
     * Component for handling followers and their actions.
     *
     * @param {Object} props - The properties passed to the component.
     * @param {UserFollower[]} props.myFollower - The list of followers.
     * @param {Function} props.setMyFollower - Function to update the followers list.
     * @param {number} props.level - The follower level.
     */
    const { myFollower, setMyFollower, level } = props;
    const [addedUsers, setAddedUsers] = useState([]);
    const { storage } = useApp();
    const [myFollowerNumber, setMyFollowerNumber] = useState(0);

    const navigation = useNavigation();

    const { getFollowers, addUser, deleteUser } = useSocials();

    /**
     * Fetches follower data and updates the state with fetched data.
     */
    useEffect(() => {
        const fetchData = async () => {
            console.log("profile followers fetchData");
            try {
                const data = await getFollowers();
                setMyFollower(data.followers);
                setMyFollowerNumber(data.counts.followers);
            } catch (error) {
                console.log("Error: ", error);
            }
        };
        fetchData();
    }, []);

    /**
     * Navigates to the user's page with provided details.
     *
     * @param {string} avatar - The avatar of the user.
     * @param {string} displayName - The display name of the user.
     * @param {number} id - The unique identifier of the user.
     */
    const handleUserPage = async (avatar, displayName, id) => {
        const userName = displayName;
        const userAvatar = avatar;
        const userId = id;
        navigation.navigate("UserPage", {
            userName,
            userAvatar,
            userId,
            myId: storage.id,
        });
    };

    /**
     * Adds a user to the specified level.
     *
     * @param {number} userId - The unique identifier of the user to add.
     */
    const addUsers = async (userId) => {
        const data = JSON.stringify({
            userIds: [userId],
        });

        try {
            await addUser(level, data);
            setAddedUsers((prevUsers) => [...prevUsers, userId]);
        } catch (error) {
            console.error(error.response);
        }
    };

    /**
     * Removes a user from the specified level.
     *
     * @param {number} userId - The unique identifier of the user to remove.
     */
    const removeUser = async (userId) => {
        console.log("addUsers, id: " + userId);
        const data = JSON.stringify({
            userIds: [userId],
        });

        try {
            await deleteUser(level, data);
            setAddedUsers((prevUsers) =>
                prevUsers.filter((id) => id !== userId),
            );
        } catch (error) {
            console.error(error.response);
        }
    };

    /**
     * Renders user profile details and handles user actions like adding or removing users.
     *
     * @param {Object} param0 - The item object containing user profile details.
     * @param {Object} param0.item - The user profile details.
     * @param {Object} param0.item.follower - The follower details.
     * @param {string} param0.item.profileImageKey - The profile image key.
     * @param {string} param0.item.displayName - The display name of the user.
     * @param {number} param0.item.id - The unique identifier of the user.
     * @param {boolean} param0.item.following - Indicates if the user is being followed.
     */
    const renderItem = ({ item }) => {
        let userProfile;

        if (item.follower) {
            userProfile = item.follower;
        } else {
            userProfile = item;
        }

        const { profileImageKey, displayName, id } = userProfile;

        const isUserAdded = addedUsers.includes(id);

        let avatar = defaultAvatar;
        if (profileImageKey) {
            avatar = profileImageKey;
        }
        return (
            <View style={styles.itemContainer}>
                <View style={styles.userInfo}>
                    <TouchableOpacity
                        onPress={() => handleUserPage(avatar, displayName, id)}
                    >
                        <Avatar
                            rounded
                            source={{ uri: avatarPrefix + avatar }} // Assuming profileImageKey is a valid image URL
                            size="medium"
                        />
                    </TouchableOpacity>
                    <Text style={styles.displayName}>{displayName}</Text>
                </View>
                {item.following && (
                    <View style={styles.addUserContainer}>
                        <TouchableOpacity style={styles.addedUserButton}>
                            <Text style={styles.addUserText}>Followed</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!item.following && (
                    <View style={styles.addUserContainer}>
                        {isUserAdded && (
                            <TouchableOpacity
                                style={styles.addedUserButton}
                                onPress={() => {
                                    removeUser(id);
                                }}
                            >
                                {/* <TouchableOpacity style={styles.addedUserButton} > */}
                                <Text
                                    style={styles.addUserText}
                                >{`${level}x`}</Text>
                                {/* <Text style={styles.addUserText}>Followed</Text> */}
                            </TouchableOpacity>
                        )}
                        {!isUserAdded && (
                            <TouchableOpacity
                                style={styles.addUserButton}
                                onPress={() => {
                                    addUsers(id);
                                }}
                            >
                                <Text style={styles.addUserText}>Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <FlatList
            data={myFollower}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            style={{ marginBottom: "8%" }}
        />
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    displayName: {
        paddingLeft: 20,
        fontSize: 16,
    },
    addUserContainer: {
        width: "20%",
        flexDirection: "row",
    },
    addUserButton: {
        backgroundColor: "#87CEEB",
        paddingVertical: 10,
        paddingHorizontal: "1%",
        marginRight: "5%",
        borderRadius: 5,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        width: "100%",
    },
    addedUserButton: {
        backgroundColor: "#B2DFEE",
        paddingVertical: 10,
        paddingHorizontal: "1%",
        marginRight: "5%",
        borderRadius: 5,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        width: "100%",
    },
    addUserText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default AddToCircle;
