// FollowButton.js

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import useSocials from "../hooks/useSocials";

/**
 * Component representing a Follow/Unfollow button for a user.
 *
 * @param {Object} props - The component's props.
 * @param {string} props.userId - ID of the user to follow/unfollow.
 * @returns {JSX.Element} A button to follow/unfollow a user.
 */
const FollowButton = (props) => {
    const { userId, isFollowing: following = true } = props;
    const { addFollowing, removeSocialFollowing } = useSocials(); // Assuming 'useSocials' is a custom hook for social functionalities
    const [isFollowing, setIsFollowing] = useState(following);

    /**
     * Handles the follow/unfollow action based on the current status.
     * Invoked when the FollowButton is pressed.
     */
    const handleFollowUnfollow = async () => {
        const action = isFollowing === true ? unfollowUser : followUser;
        action();
    };

    /**
     * Follows a user.
     * Updates the 'isFollowing' state on success.
     */
    const followUser = async () => {
        // Follow user logic
        try {
            await addFollowing([userId]);
            setIsFollowing(true);
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Unfollows a user.
     * Updates the 'isFollowing' state on success.
     */
    const unfollowUser = async () => {
        // Unfollow user logic
        try {
            await removeSocialFollowing(userId);
            setIsFollowing(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setIsFollowing(following);
    }, [following]);

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: isFollowing ? "#B0E0E6" : "#87CEEB" },
            ]}
            onPress={handleFollowUnfollow}
        >
            <Text style={styles.buttonText}>
                {isFollowing ? "Following" : "Follow"}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        width: 100,
    },
    buttonText: {
        color: "#ffffff", // White text color
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default FollowButton;
