import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import ProfileFollowers from "../components/ProfileFollowers";
import ReturnTabs from "../components/ReturnTabs";
import SearchBar from "../components/Search";
import { defaultAvatar } from "../config/constants";

/**
 * Renders the Followers component.
 * This component displays a user's followers and provides navigation options.
 * @returns {JSX.Element} React component for managing followers.
 */
const Followers = () => {
    const [avatarSource, setAvatarSource] = useState(defaultAvatar);
    const [displayName, setDisplayName] = useState("");
    const navigation = useNavigation();
    const [myFollowers, setMyFollowers] = useState([]);

    /**
     * Handles navigation to the previous screen.
     * @function handleGoBack
     * @returns {void}
     */
    const handleGoBack = () => {
        navigation.goBack();
    };

    /**
     * Navigates to the user's profile.
     * @function goToProfile
     * @returns {void}
     */
    const goToProfile = () => {
        navigation.navigate("Profile");
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <SearchBar
                        placeholder="Search in followers"
                        onChangeText={(text) => console.log(text)}
                        setSearchedUser={setMyFollowers}
                        searchInFollowers
                    />
                </View>
                <ProfileFollowers
                    myFollowers={myFollowers}
                    setMyFollowers={setMyFollowers}
                    navigation={navigation}
                />
            </View>
            <ReturnTabs />
        </SafeAreaView>
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
    searchBar: {
        paddingTop: 10,
        paddingBottom: 20,
    },
});

export default Followers;
