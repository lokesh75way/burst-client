import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-elements";

import { avatarPrefix, defaultAvatar } from "../../config/constants";
import FollowButton from "../FollowButton";

/**
 * Component representing an item in the list of users being followed.
 * @function FollowingItem
 * @param {object} props - The component props.
 * @param {object} props.item - The item object containing user details.
 * @param {Function} props.handleUserPage - Function to handle navigation to user's page.
 * @returns {JSX.Element} JSX element representing a user being followed.
 */

const FollowingItem = ({ item, handleUserPage, bottomSpacing = false }) => {
    /**
     * Destructuring user details from the item.
     */
    const { profileImageKey, displayName, id } = item?.following ?? item;

    /**
     * Determines the avatar to display or uses default if not available.
     */

    const avatar = profileImageKey ? profileImageKey : defaultAvatar;

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
                <FollowButton userId={id} />
            </View>
        </View>
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
        flexDirection: "row",
    },
});

export default FollowingItem;
