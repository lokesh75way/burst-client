/*
Displays list of users we are following.  
Triggers API call to backend to fetch data about each profile we follow and their information (profile image, display name, ID)
Renders each follower as a list item. 
*/

import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";

import FollowingItem from "./FollowingItem";
import useApp from "../../hooks/useApp";
import useSocials from "../../hooks/useSocials";
import Loader from "../Loader";

/**
 * Component displaying the list of users being followed in the profile section.
 * @function ProfileFollowing
 * @param {object} props - The component props.
 * @param {Array} props.myFollowing - Array containing the user's followed list.
 * @param {Function} props.setMyFollowing - Function to set the user's followed list.
 * @returns {JSX.Element} JSX element representing the user's following list in the profile section.
 */

const ProfileFollowing = (props) => {
    const { myFollowing, setMyFollowing } = props;
    const [addedUsers, setAddedUsers] = useState([]);
    const [myFollowingNumber, setMyFollowingNumber] = useState(0);
    const [myFollowedId, setMyFollowedId] = useState([]);
    const isFocused = useIsFocused();

    /**
     * Functions obtained from the 'useSocials()' hook to manage social interactions.
     * @type {Object}
     * @property {Function} removeSocialFollowing - Function to remove a user from the followed list.
     * @property {Function} getSocialFollowing - Function to retrieve the user's followed list.
     * @property {Function} addSocialFollowing - Function to add a user to the followed list.
     * @property {Function} deleteUser - Function to delete a user.
     */

    const {
        removeSocialFollowing,
        getSocialFollowing,
        addSocialFollowing,
        deleteUser,
        loading,
    } = useSocials();
    const { storage } = useApp();
    const myId = storage.id;

    /**
     * Checks whether a user is added based on their ID.
     * @param {string} id - The ID of the user to check.
     * @returns {boolean} - Indicates whether the user is added.
     */

    const isUserAdded = (id) => {
        return myFollowedId.includes(id);
    };
    /**
     * Navigation instance obtained from the hook to facilitate navigation within the app.
     */
    const navigation = useNavigation();

    /**
     * Fetches data related to the user's following list.
     * Sets state variables based on the fetched data.
     * Handles error logging if data retrieval fails.
     */

    const fetchData = async () => {
        try {
            const data = await getSocialFollowing();
            setMyFollowing(data.followings);
            setMyFollowingNumber(data.counts.following);

            const followArray = data.followings;
            const followedId = followArray
                .map((item) => item.following && item.following.id)
                .filter((id) => id !== undefined);
            setMyFollowedId(followedId);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    /**
     * Executes the 'fetchData' function to retrieve user's following data after component mount.
     * Triggers on changes in 'setMyFollowing'.
     */

    useEffect(() => {
        fetchData();
    }, [setMyFollowing]);

    /**
     * Navigates to the user page with provided user details.
     * @param {string} avatar - The avatar URL of the user.
     * @param {string} displayName - The display name of the user.
     * @param {string} id - The ID of the user.
     */

    const handleUserPage = async (avatar, displayName, id) => {
        try {
            const userName = displayName;
            const userAvatar = avatar;
            const userId = id;
            const data = await getSocialFollowing();
            const followedId = data.followings
                .map((item) => item.following && item.following.id)
                .filter((id) => id !== undefined);
            navigation.navigate("UserPage", {
                userName,
                userAvatar,
                userId,
                myId,
            });
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Adds a user to the following list.
     * @param {string} userId - The ID of the user to be added.
     */

    const addUsers = async (userId) => {
        try {
            await addSocialFollowing([userId]);
            setAddedUsers((prevUsers) => [...prevUsers, userId]);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Handles the follow action for a user.
     * @param {string} userId - The ID of the user to follow.
     */
    const handleFollow = async (userId) => {
        const data = JSON.stringify({ followingUserId: userId });

        try {
            await addSocialFollowing([userId]);
            setMyFollowedId((prevIds) => [...prevIds, userId]);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Handles the unfollow action for a user.
     * @param {string} userId - The ID of the user to unfollow.
     */
    const handleUnfollow = async (userId) => {
        try {
            await removeSocialFollowing(userId);
            // Update local state to reflect the unfollow action
            setMyFollowedId((prevIds) => prevIds.filter((id) => id !== userId));
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Removes a user and updates the state accordingly.
     * @param {string} userId - The ID of the user to be removed.
     * @param {number} level - The level of the user.
     */
    const removeUser = async (userId, level) => {
        const data = JSON.stringify({
            userIds: [userId],
        });

        try {
            await deleteUser(level, data);
            setAddedUsers((prevUsers) =>
                prevUsers.filter((id) => id !== userId),
            );
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {myFollowing.length ? (
                <FlatList
                    data={myFollowing}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={(itemProps) => (
                        <FollowingItem
                            {...itemProps}
                            handleUserPage={handleUserPage}
                            bottomSpacing={
                                itemProps.index === myFollowing.length - 1
                            }
                        />
                    )}
                    style={{ marginBottom: "10%" }}
                />
            ) : (
                <Text style={styles.text}>No user found</Text>
            )}
        </>
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
    text: {
        fontSize: 16,
        color: "#000",
        textAlign: "center",
    },
});

export default ProfileFollowing;
