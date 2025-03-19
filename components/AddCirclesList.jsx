import React, { useEffect } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar } from "react-native-elements";

import { avatarPrefix, defaultAvatar } from "../config/constants";
import useSocials from "../hooks/useSocials";

const AddCirclesList = (props) => {
    const {
        myFollower,
        setMyFollower,
        circle10Ids,
        setCircle10Ids,
        circle100Ids,
        setCircle100Ids,
    } = props;
    const { getFollowers, getCircles, addUser, deleteUser } = useSocials();

    /**
     * Fetches data for all followers.
     *
     * @async
     * @function fetchAllFollowersData
     * @returns {Promise<void>}
     */
    const fetchAllFollowersData = async () => {
        try {
            const data = await getFollowers();
            setMyFollower(data.followers);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Fetches circle data based on the provided level.
     *
     * @async
     * @function fetchCircleData
     * @param {number} level - The level of the circle for which data should be fetched.
     * @returns {Promise<void>}
     */
    const fetchCircleData = async (level) => {
        try {
            const data = await getCircles(level);
            const circleData = data.members;
            const circleIds = circleData.map((item) => item.id);
            if (level == 10) {
                setCircle10Ids(circleIds);
            } else if (level == 100) {
                setCircle100Ids(circleIds);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        fetchAllFollowersData();
        fetchCircleData(10);
        fetchCircleData(100);
    }, []);

    /**
     * Handles changing the circle of a user.
     *
     * @async
     * @function changeCircle
     * @param {string} userId - The unique identifier of the user.
     * @param {number} targetLevel - The level of the circle to which the user should be moved.
     * @returns {Promise<void>}
     */
    const changeCircle = async (userId, targetLevel) => {
        const checkCircle10 = circle10Ids.includes(userId);
        const checkCircle100 = circle100Ids.includes(userId);
        let origin_circle;
        if (checkCircle10) {
            origin_circle = 10;
            setCircle10Ids((prevCircle10Ids) =>
                prevCircle10Ids.filter((item) => item !== userId),
            );
        } else if (checkCircle100) {
            origin_circle = 100;
            setCircle100Ids((prevCircle100Ids) =>
                prevCircle100Ids.filter((item) => item !== userId),
            );
        } else {
            origin_circle = 1000;
        }

        // add id
        if (targetLevel === 10) {
            setCircle10Ids((prevCircle10Ids) => [...prevCircle10Ids, userId]);
        } else if (targetLevel === 100) {
            setCircle100Ids((prevCircle10Ids) => [...prevCircle10Ids, userId]);
        }

        addUsers(userId, targetLevel);
        removeUser(userId, origin_circle);
    };

    /**
     * Adds users to a specific circle level.
     *
     * @async
     * @function addUsers
     * @param {string} userId - The unique identifier of the user.
     * @param {number} level - The level of the circle to which the user should be added.
     * @returns {Promise<void>}
     */
    const addUsers = async (userId, level) => {
        const data = JSON.stringify({
            userIds: [userId],
        });
        try {
            addUser(level, data);
        } catch (error) {
            console.error(error.response);
        }
    };

    /**
     * Removes a user from a specific circle level.
     *
     * @async
     * @function removeUser
     * @param {string} userId - The unique identifier of the user.
     * @param {number} level - The level of the circle from which the user should be removed.
     * @returns {Promise<void>}
     */
    const removeUser = async (userId, level) => {
        // console.log("function: removeUser");
        const data = JSON.stringify({
            userIds: [userId],
        });
        try {
            await deleteUser(level, data);
        } catch (error) {
            console.error(error.response);
        }
    };

    // for each follower

    /**
     * Renders a single item in the list.
     *
     * @callback renderItem
     * @param {Object} params - Parameters for rendering the item.
     * @param {Object} params.item - The item data to be rendered.
     * @param {Object} params.item.follower - Follower's profile data.
     * @param {Object} params.item - User profile data.
     * @returns {JSX.Element} A single item view.
     */
    const renderItem = ({ item }) => {
        let userProfile;
        // console.log("renderItem: item = ", item);
        if (item.follower) {
            userProfile = item.follower;
        } else {
            userProfile = item;
        }
        const checkCircle10 = circle10Ids.includes(userProfile.id);
        const checkCircle100 = circle100Ids.includes(userProfile.id);
        const checkCircle1000 = !checkCircle10 && !checkCircle100;
        const { profileImageKey, displayName, id } = userProfile;

        let avatar = defaultAvatar;
        if (profileImageKey) {
            avatar = profileImageKey;
        }
        return (
            <View style={styles.itemContainer}>
                {/* Follower's profile */}
                <View style={styles.userInfo}>
                    <TouchableOpacity
                        onPress={
                            () => {}
                            /*handleUserPage(avatar, displayName, id)*/
                        }
                    >
                        <Avatar
                            rounded
                            source={{ uri: avatarPrefix + avatar }} // Assuming profileImageKey is a valid image URL
                            size="medium"
                        />
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                        <Text style={styles.displayName}>{displayName}</Text>
                    </View>
                </View>
                <View style={styles.addUserContainer}>
                    <TouchableOpacity
                        style={
                            checkCircle10
                                ? styles.addedUserButton
                                : styles.addUserButton
                        }
                        onPress={() => {
                            changeCircle(id, 10);
                        }}
                    >
                        <Text style={styles.addUserText}>10x</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.addUserContainer}>
                    <TouchableOpacity
                        style={
                            checkCircle100
                                ? styles.addedUserButton
                                : styles.addUserButton
                        }
                        onPress={() => {
                            changeCircle(id, 100);
                        }}
                    >
                        <Text style={styles.addUserText}>100x</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.addUserContainer}>
                    <TouchableOpacity
                        style={
                            checkCircle1000
                                ? styles.addedUserButton
                                : styles.addUserButton
                        }
                        onPress={() => {
                            changeCircle(id, 1000);
                        }}
                    >
                        <Text style={styles.addUserText}>1000x</Text>
                    </TouchableOpacity>
                </View>
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
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    userInfo: {
        width: "30%",
        flexDirection: "column",
        alignItems: "center",
    },
    textContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    displayName: {
        paddingTop: 5,
        fontSize: 12,
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
        backgroundColor: "#ced4da",
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

export default AddCirclesList;
