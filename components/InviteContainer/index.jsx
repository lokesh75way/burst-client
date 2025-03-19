import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import useApp from "../../hooks/useApp";
import useUsers from "../../hooks/useUsers";
import Loader from "../Loader";
import SearchBar from "../SearchBar";
import UserContainer from "./UserContainer";
const InviteContainer = ({
    type,
    inviteCount,
    iconSize = { width: 25, height: 25 },
    setInviteCount,
    barStyles,
    placeholder,
    initialText = "",
    invitedUsers,
    setInvitedUsers,
    searchedUser,
    setSearchedUser,
    selectedSwitch,
}) => {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState(initialText);
    const isOnboard = type === "onboard";
    const [recommendedUsers, setRecommendedUsers] = useState([]);
    const { getAllUsers, me } = useUsers();
    const { activeRoute } = useApp();

    const getRecommendation = async () => {
        try {
            setLoading(true);
            const allUsers = await getAllUsers();
            const currentUser = await me();
            const recommendedUsers = allUsers.filter(
                (user) => user.id !== currentUser.id,
            );
            setRecommendedUsers(recommendedUsers);
        } catch (err) {
            console.log(err, "Error in getting recommendations");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setSearchText(initialText);
    }, [initialText]);

    useEffect(() => {
        setSearchText("");
    }, [activeRoute]);

    useEffect(() => {
        if (searchText.length === 0) {
            getRecommendation();
        }
    }, [searchText]);

    return (
        <View style={styles.container}>
            <View style={{ display: isOnboard ? "none" : "flex" }}>
                <SearchBar
                    value={searchText}
                    iconSize={iconSize}
                    setValue={setSearchText}
                    barStyles={barStyles}
                    placeholder={placeholder}
                    setInviteCount={setInviteCount}
                    setLoading={setLoading}
                    setSearchedUser={setSearchedUser}
                    inviteCount={inviteCount}
                    selectedSwitch={selectedSwitch}
                    showCross
                />
            </View>
            {loading && <Loader size="large" color="skyblue" />}
            {!loading && (
                <UserContainer
                    isOnboard={isOnboard}
                    invitedUsers={invitedUsers}
                    searchedUser={
                        searchText.length > 0 ? searchedUser : recommendedUsers
                    }
                    setInvitedUsers={setInvitedUsers}
                    setInviteCount={setInviteCount}
                />
            )}
        </View>
    );
};

export default InviteContainer;

const styles = StyleSheet.create({
    container: {
        height: "100%",
        marginTop: 20,
    },
    dummyContent: {
        height: 70,
    },
});
