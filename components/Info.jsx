import { useIsFocused } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import OnePicture from ".//OnePicture";
import PictureSwiper from "./PictureSwiper";
import { defaultAvatar } from "../config/constants";
import useApp from "../hooks/useApp";
import usePosts from "../hooks/usePosts";

/**
 * Displays information related to a post including author details, text content, and pictures if available.
 * @param {object} props - The properties passed to the component.
 * @param {object} navigation - The navigation object for navigating between screens.
 * @param {string} [avatar=defaultAvatar] - The URL of the author's avatar image.
 * @param {object} author - The author object containing details like displayName and id.
 * @param {string} text - The text content of the post.
 * @param {string[]} picture - The array of picture URLs related to the post.
 * @param {function} setShowFullScreenPicture - Function to toggle the display of a full-screen picture.
 * @param {function} setFullScreenPictureUrl - Function to set the URL for the full-screen picture.
 * @param {string} createdAt - The timestamp indicating the post creation date.
 * @returns {JSX.Element} The component rendering the post information.
 */
const Info = (props) => {
    const {
        navigation,
        avatar = defaultAvatar,
        author,
        picture,
        text,
        showText,
        postId,
        setTouchStart,
        toggleFullScreen,
    } = props;

    const { storage } = useApp();
    const { timeSpendOnPost } = usePosts();
    const isFocused = useIsFocused();
    const [startTime, setStartTime] = useState();

    /**
     * Navigates to the user's profile page or another user's page based on comparison between user IDs.
     * @async
     * @function handleUserPage
     * @returns {void}
     */
    const handleUserPage = async () => {
        const userName = author.displayName;
        const userAvatar = avatar;
        const userId = author.id;
        const myId = storage.id;
        if (String(userId) === String(myId)) {
            navigation.navigate("Profile");
        } else {
            navigation.navigate("UserPage", {
                userName,
                userAvatar,
                userId,
                myId,
            });
        }
    };

    /**
     * Capitalizes the first letter of a string.
     * @param {string} str - The input string.
     * @returns {string} The string with the first letter capitalized.
     */
    const Capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    /**
     * Function to start and set start watch time
     * @returns { Date } The current timestamp
     */
    const startWatching = () => {
        const date = new Date();
        setStartTime(date);
        // return date;
    };

    /**
     * Function to stop watch time and send it to server
     */
    const stopWatching = async () => {
        const endTime = new Date();
        const duration = endTime - startTime;

        const data = JSON.stringify({
            startTime,
            endTime,
            duration,
        });

        try {
            await timeSpendOnPost(postId, data);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            startWatching();
        }
        if (!isFocused) {
            stopWatching();
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            {picture.length > 1 && (
                <PictureSwiper
                    setTouchStart={setTouchStart}
                    toggleFullScreen={toggleFullScreen}
                    images={picture}
                    showText={showText}
                    text={text}
                />
            )}
            {picture.length < 2 && (
                <OnePicture
                    setTouchStart={setTouchStart}
                    source={picture[0] ?? null}
                    showText={showText}
                    text={text}
                />
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    userAvatar: {
        width: 50,
        height: 50,
        marginBottom: 13,
        marginRight: 10,
    },
    avatar: {
        width: "100%",
        height: "100%",
        borderRadius: 48,
    },
    container: {
        display: "fixed",
        height: "100%",
        width: "100%",
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        marginTop: "22%",
    },
    userNameText: {
        fontSize: 19,
        color: "black",
        fontWeight: "bold",
        letterSpacing: -0.3,
        height: "50%",
        bottom: 2,
    },
    description: {
        fontSize: 18,
        color: "black",
        letterSpacing: -0.2,
        marginTop: 10,
        marginBottom: 10,
    },
    timestamp: {
        color: " #828282",
        fontSize: 15,
        bottom: 2,
    },
});
export default Info;
