import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import AddToCircle from "../components/AddToCircle";
import ReturnTabs from "../components/ReturnTabs";
import SearchBar from "../components/Search";

/**
 * Renders the AddUsers component.
 * This component allows users to search and add followers to a circle.
 * @param {object} route - The route object containing parameters.
 * @param {number} route.params.level - The level parameter from the route.
 * @returns {JSX.Element} React component for adding users to a circle.
 */
const AddUsers = ({ route }) => {
    const { level } = route.params;
    const [myFollower, setMyFollower] = useState([]);

    const navigation = useNavigation();

    /**
     * Handles navigation to the previous screen.
     * @function handleGoBack
     * @returns {void}
     */
    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.SearchBar}>
                    <SearchBar
                        onChangeText={(text) => console.log(text)}
                        setSearchedUser={setMyFollower}
                        placeholder={"Search in your followers' list"}
                        searchInFollowers
                    />
                </View>
                <AddToCircle
                    myFollower={myFollower}
                    setMyFollower={setMyFollower}
                    navigation={navigation}
                    level={level}
                />
            </View>
            <ReturnTabs />
        </>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: "5%",
        paddingVertical: 40,
    },
    profileContainer: {
        flexDirection: "row",
    },
    followContainer: {
        flexDirection: "row",
    },
    SearchBar: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    username: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 20,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
    },
    logoutButton: {
        backgroundColor: "skyblue",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: "center",
    },
    logoutText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
    },
    followButton: {
        backgroundColor: "#87CEEB",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginRight: 20,
        borderRadius: 5,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
    },
    followText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default AddUsers;
