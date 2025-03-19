import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";

import { avatarPrefix, defaultAvatar } from "../../config/constants";
import useApp from "../../hooks/useApp";
import FollowButton from "../FollowButton";

/**
 * Represents an individual follower item.
 * @function FollowerItem
 * @param {object} props - The component props.
 * @param {object} props.item - The data for the follower item.
 * @param {object} props.navigation - The navigation object from React Navigation.
 * @returns {JSX.Element} JSX element representing the follower item.
 */

const FollowerItem = (props) => {
    /**
     * Destructuring necessary data from props.
     */

    const {
        item,
        navigation,
        followingIds = [],
        bottomSpacing = false,
    } = props;
    const { follower } = item;
    const { profileImageKey, displayName, id } = follower;

    /**
     * Determines the avatar for the follower.
     */

    const avatar = profileImageKey || defaultAvatar;
    /**
     * Retrieves the user's storage information.
     */
    const { storage } = useApp();
    const myId = storage.id;

    /**
     * Navigates to the user's page on press.
     * @function handleUserPage
     * @param {string} avatar - The avatar URL of the user.
     * @param {string} displayName - The display name of the user.
     * @param {string} id - The ID of the user.
     */

    const handleUserPage = async (avatar, displayName, id) => {
        const userName = displayName;
        const userAvatar = avatar;
        const userId = id;
        navigation.navigate("UserPage", { userName, userAvatar, userId, myId });
    };

    return (
        <View
            style={[
                styles.itemContainer,
                { marginBottom: bottomSpacing ? 20 : 0 },
            ]}
        >
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
                <FollowButton
                    userId={id}
                    isFollowing={followingIds.includes(id)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    displayName: {
        marginLeft: 10,
        fontSize: 16,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    addUserContainer: {
        flexDirection: "row",
    },
});

export default FollowerItem;
