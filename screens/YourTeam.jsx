import { useIsFocused } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import Swiper from "react-native-swiper";

import CustomSwitch from "../components/CustomSwitch";
import InviteContainer from "../components/InviteContainer";
import TeamContainer from "../components/TeamContainer";
import { TEAM_SWITCH_TYPES } from "../config/data";

const YourTeam = () => {
    const [selectedSwitch, setSelectedSwitch] = useState(0);
    const isFocused = useIsFocused();
    const [invitedUsers, setInvitedUsers] = useState([]);
    const [searchedUser, setSearchedUser] = useState([]);

    useEffect(() => {
        if (selectedSwitch < 0 || selectedSwitch >= TEAM_SWITCH_TYPES.length) {
            setSelectedSwitch(0);
        }
    }, [selectedSwitch]);

    const handleIndexChanged = (index) => {
        setSelectedSwitch(index);
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <CustomSwitch
                selectedSwitch={selectedSwitch}
                switchContent={TEAM_SWITCH_TYPES}
                setSelectedSwitch={setSelectedSwitch}
            />
            <Swiper
                index={selectedSwitch}
                onIndexChanged={handleIndexChanged}
                loop={false}
                showsPagination={false}
                horizontal
            >
                <View style={styles.container}>
                    <TeamContainer isFocused={isFocused} />
                </View>
                <View style={styles.container}>
                    <InviteContainer
                        iconSize={{ width: 22, height: 22 }}
                        barStyles={styles.searchBar}
                        placeholder="Search"
                        invitedUsers={invitedUsers}
                        setInvitedUsers={setInvitedUsers}
                        searchedUser={searchedUser}
                        setSearchedUser={setSearchedUser}
                        selectedSwitch={selectedSwitch}
                    />
                </View>
            </Swiper>
        </SafeAreaView>
    );
};

export default YourTeam;
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
    },
    searchBar: {
        borderRadius: 16,
        borderColor: "#00000060",
        borderWidth: 1,
        paddingHorizontal: 15,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        marginVertical: 10,
    },
    wrapper: {
        flex: 1,
        backgroundColor: "#fff",
    },
});
