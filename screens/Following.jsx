import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

import ProfileFollowing from "../components/ProfileFollowing";
import ReturnTabs from "../components/ReturnTabs";
import SearchBar from "../components/Search";

/**
 * Renders the Following component.
 * This component displays the user's following list and provides a search functionality.
 * @returns {JSX.Element} React component for managing following users.
 */
const Following = () => {
    const [myFollowing, setMyFollowing] = useState([]);
    const [isFollowing, setIsFollowing] = useState({});
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <SearchBar
                        placeholder="Search in following"
                        onChangeText={(text) => console.log(text)}
                        setSearchedUser={setMyFollowing}
                        searchInFollowing
                    />
                </View>
                <ProfileFollowing
                    myFollowing={myFollowing}
                    setMyFollowing={setMyFollowing}
                    isFollowing={isFollowing}
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
    searchBar: {
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
        color: "#ffff",
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

export default Following;
