import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
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

const ProfileSearching = (props) => {
    const { searchedUser, setSearchedUser, level } = props;
    const [addedUsers, setAddedUsers] = useState([]);
    const { storage } = useApp();
    const myId = storage.id;

    const navigation = useNavigation();
    const { addUser, deleteUser } = useSocials();

    /**
     * Navigates to the UserPage screen for a specific user.
     * @param {string} avatar - The avatar of the user.
     * @param {string} displayName - The display name of the user.
     * @param {string} id - The ID of the user.
     * @returns {void}
     */
    const handleUserPage = async (avatar, displayName, id) => {
        const userName = displayName;
        const userAvatar = avatar;
        const userId = id;
        navigation.navigate("UserPage", { userName, userAvatar, userId, myId });
    };

    /**
     * Adds users to a certain level.
     * @param {string} userId - The ID of the user to be added.
     * @returns {void}
     */
    const addUsers = async (userId) => {
        try {
            const data = JSON.stringify({
                userIds: [userId],
            });
            await addUser(level, data);
            setAddedUsers((prevUsers) => [...prevUsers, userId]);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Removes a user from a certain level.
     * @param {string} userId - The ID of the user to be removed.
     * @returns {void}
     */
    const removeUser = async (userId) => {
        try {
            const data = JSON.stringify({
                userIds: [userId],
            });
            await deleteUser(level, data);
            setAddedUsers((prevUsers) =>
                prevUsers.filter((id) => id !== userId),
            );
        } catch (error) {
            console.error(error.response); // 处理错误
        }
    };

    /**
     * Renders an item for the list, displaying user information and the add/remove button based on their status.
     * @param {object} item - The item to render containing user information.
     * @returns {JSX.Element} - React element representing the rendered item.
     */
    const renderItem = ({ item }) => {
        const { profileImageKey, displayName, id } = item;
        const isUserAdded = addedUsers.includes(id);

        const avatar = profileImageKey ? profileImageKey : defaultAvatar;

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
                <View style={styles.addUserContainer}>
                    {isUserAdded && (
                        <TouchableOpacity
                            style={styles.addedUserButton}
                            onPress={() => {
                                removeUser(id);
                            }}
                        >
                            <Text
                                style={styles.addUserText}
                            >{`${level}x`}</Text>
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
            </View>
        );
    };

    return (
        <FlatList
            data={searchedUser}
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

export default ProfileSearching;
