/*
Displays list of user followers 
Triggers API call to backend to fetch data about user's followers and the follower's information (profile image, display name, ID)
Renders each follower as a list item. 

*/

import { useIsFocused } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";

import FollowerItem from "./FollowerItem";
import useSocials from "../../hooks/useSocials";
import Loader from "../Loader";

/**
 * Component displaying a user's followers in their profile.
 * @function ProfileFollowers
 * @param {object} props - The component props.
 * @param {object} props.navigation - The navigation object from React Navigation.
 * @returns {JSX.Element} JSX element representing the user's followers in the profile.
 */

const ProfileFollowers = ({ navigation, myFollowers, setMyFollowers }) => {
    /**
     * State variables for managing user followers.
     */

    const [myFollowersNumber, setMyFollowersNumber] = useState(0);
    const { getFollowers, getFollowing, loading } = useSocials();
    const [followingIds, setFollowingIds] = useState([]);
    const isFocused = useIsFocused();

    /**
     * Fetches the user's followers on component mount.
     * Retrieves data and sets state accordingly.
     * Logs error if encountered.
     */

    const fetchData = async () => {
        try {
            const data = await getFollowers();
            const followings = await getFollowing();
            setFollowingIds(followings.followings.map((f) => f.following.id));
            setMyFollowers(data.followers);
            setMyFollowersNumber(data.counts.followers);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {myFollowers.length ? (
                <FlatList
                    data={myFollowers}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={(props) => (
                        <FollowerItem
                            {...props}
                            followingIds={followingIds}
                            navigation={navigation}
                            bottomSpacing={
                                props.index === myFollowers.length - 1
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

export default ProfileFollowers;

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: "#000",
        textAlign: "center",
    },
});
