import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";

import AddCirclesList from "../components/AddCirclesList";
import Loader from "../components/Loader";
import NextTabsPost from "../components/NextTabsPost";
import ReturnTabs from "../components/ReturnTabs";
import useFeeds from "../hooks/useFeeds";
import useSocials from "../hooks/useSocials";

const CirclesFormation = () => {
    const [circle10Ids, setCircle10Ids] = useState([]);
    const [circle100Ids, setCircle100Ids] = useState([]);
    const [showMessage, setShowMessage] = useState(true);
    const [myFollower, setMyFollower] = useState([]);
    const { getFollowing, getCircles, loading } = useSocials();
    const { getFeedUsers } = useFeeds();
    const [myFollowedId, setMyFollowedId] = useState([]);
    const [myFollowing, setMyFollowing] = useState([]);
    const [myFollowingNumber, setMyFollowingNumber] = useState(0);
    const [usersList, setUsersList] = useState([]);

    /**
     * Fetches following data and updates states accordingly.
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
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Fetches users' list data and sets the state.
     * @async
     * @function getUsersList
     * @returns {void}
     */
    const getUsersList = async () => {
        try {
            const data = await getFeedUsers();
            setUsersList(data);
        } catch (error) {
            console.log("getUsersList Error: ", error);
        }
    };

    /**
     * Fetches circle data based on the given level and updates the state.
     * @async
     * @function fetchCircleData
     * @param {number} level - The level of circles to fetch.
     * @returns {void}
     */
    const fetchCircleData = async (level) => {
        try {
            const circleData = await getCircles(level);
            const circleIds = circleData.map((item) => item.id);
            if ([10, 100].includes(level)) {
                setCircle10Ids(circleIds);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    /**
     * Updates the display of messages based on circle ids' lengths.
     * @function updateMessageDisplay
     * @returns {void}
     */
    const updateMessageDisplay = () => {
        if (circle10Ids.length < 10 && circle100Ids.length < 10) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    };

    /**
     * Fetches necessary data upon component mount.
     * @async
     * @function fetchData
     * @returns {void}
     */
    const fetchData = async () => {
        await fetchFollowingData();
        await getUsersList();
        await fetchCircleData(10);
        await fetchCircleData(100);
        updateMessageDisplay(); // Update the showMessage state based on circle ids lengths
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20 }}>
                    {" "}
                    Your followers are initially placed in the 100x group. For
                    close friends to view your posts ahead of others, move them
                    to the 10x and 100x groups!{" "}
                </Text>
            </View>
            {loading && <Loader />}
            {!loading && (
                <AddCirclesList
                    myFollower={myFollower}
                    setMyFollower={setMyFollower}
                    circle10Ids={circle10Ids}
                    setCircle10Ids={setCircle10Ids}
                    circle100Ids={circle100Ids}
                    setCircle100Ids={setCircle100Ids}
                />
            )}
            <View style={styles.footer}>
                {circle10Ids.length < 1 && circle100Ids.length < 1 ? (
                    <View style={styles.message}>
                        <Text style={{ color: "red" }}>
                            Without followers in 10x or 100x groups, your posts
                            won't be seen!
                        </Text>
                    </View>
                ) : (
                    <View style={styles.message}>
                        <Text style={{ color: "red" }}> </Text>
                    </View>
                )}
                <View styles={styles.footerIcons}>
                    <View style={styles.returnIconContainer}>
                        <ReturnTabs />
                    </View>
                    <View style={styles.nextIconContainer}>
                        <NextTabsPost />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        paddingTop: "10%",
        paddingBottom: "5%",
        width: "100%",
        paddingHorizontal: "5%",
        fontSize: 20,
    },
    footer: {
        flex: 1,
        top: 0,
        height: 200,
        marginTop: -70,
        flexDirection: "column",
        alignItems: "center",
    },
    message: {
        width: "80%",
        height: 35,
        top: -10,
        marginHorizontal: 15,
        bottom: 0,
    },
    footerIcons: {
        position: "absolute",
        flex: 1,
        width: "100%",
        marginVertical: -20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    nextIconContainer: {
        top: 15,
        marginLeft: 310,
        marginRight: 0,
        marginHorizontal: 15,
    },
    returnIconContainer: {
        top: 15,
        marginRight: 310,
        marginLeft: 0,
        marginHorizontal: 16,
    },
    Text: {},
});

export default CirclesFormation;
