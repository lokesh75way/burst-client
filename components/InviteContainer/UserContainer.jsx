import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";
import theme from "../../config/theme";
import { getImageUrl } from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import useInvitation from "../../hooks/useInvitation";
import Loader from "../Loader";
import UserItem from "../UserItem";

const UserContainer = ({
    searchedUser,
    invitedUsers,
    setInvitedUsers,
    setInviteCount,
    isOnboard,
}) => {
    const { activeRoute } = useApp();
    const scrollViewRef = useRef(null);
    const { postInvitation, revertInvitation } = useInvitation();
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [users, setUsers] = useState(searchedUser);

    useEffect(() => {
        if (activeRoute === "YourTeam" && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [activeRoute]);

    const inviteUser = async (inviteeId, index) => {
        try {
            setLoading(true);
            setCurrentIndex(index);
            await postInvitation(inviteeId);
            setInviteCount?.((prev) => prev + 1);
            const userToInvite = searchedUser.find(
                (user) => user.id === inviteeId,
            );
            if (userToInvite) {
                setInvitedUsers((prev) => [...prev, userToInvite]);
            }
            const updatedUsers = users.map((user) =>
                user.id === inviteeId ? { ...user, status: "pending" } : user,
            );
            setUsers(updatedUsers);
            showMessage({
                message: "Invitation sent!",
                type: "success",
            });
        } catch (err) {
            console.log("error:-", err);
        } finally {
            setLoading(false);
            setCurrentIndex(null);
        }
    };

    const revertInvite = async (inviteeId, status, index) => {
        try {
            setLoading(true);
            setCurrentIndex(index);
            await revertInvitation(inviteeId, status);
            setInviteCount?.((prev) => prev - 1);
            setInvitedUsers((prev) =>
                prev.filter((user) => user.id !== inviteeId),
            );
            const user = users[index];
            user["status"] = "Invite";
            const updatedUsers = users;
            updatedUsers.splice(index, 1, user);
            setUsers(updatedUsers);
            showMessage({
                message: "Invitation withdrawn!",
                type: "info",
            });
        } catch (err) {
            console.log("error:-", err);
        } finally {
            setLoading(false);
            setCurrentIndex(null);
        }
    };

    const onClickHandler = (inviteeId, status, index) => {
        if (status === "Invite") {
            inviteUser(inviteeId, index);
        } else if (status == "pending") {
            revertInvite(inviteeId, status, index);
        }
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={!isOnboard && styles.userContainer}
            contentContainerStyle={styles.scrollContent}
        >
            {users.length > 0 &&
                users.map((user, index) => {
                    const status = invitedUsers.includes(user.id)
                        ? "pending"
                        : user?.status || "Invite";
                    const pending = status === "pending";
                    const accepted = status === "accepted";
                    const bgColor = pending
                        ? "#A1A0A0"
                        : accepted
                          ? theme.colors.white
                          : theme.colors.green;
                    const label = pending
                        ? "Pending"
                        : accepted
                          ? "Joined"
                          : status;
                    const color = accepted
                        ? theme.colors.green
                        : theme.colors.white;
                    const outlinedColor =
                        status == "accepted" ? theme.colors.green : bgColor;
                    const labelContent =
                        loading && currentIndex === index ? (
                            <Loader size="small" color="#fff" />
                        ) : (
                            label
                        );
                    const disableButton = label === "Joined" || loading;
                    const invitedTo = {
                        userName: user.userName,
                        id: user.id,
                        displayName: user.displayName,
                        profileImageKey: user.profileImageKey,
                    };
                    return (
                        <UserItem
                            key={user.id}
                            source={getImageUrl(user.profileImageKey)}
                            username={user.userName}
                            invitedTo={invitedTo}
                            label={labelContent}
                            variant="contained"
                            color={color}
                            bgColor={bgColor}
                            outlinedColor={outlinedColor}
                            onPress={() => {
                                onClickHandler(user.id, status, index);
                            }}
                            disabled={disableButton}
                            displayName={user.displayName}
                            isOnboarding={isOnboard}
                        />
                    );
                })}
        </ScrollView>
    );
};

export default UserContainer;
const styles = StyleSheet.create({
    userContainer: {
        maxHeight: "80%",
    },
    scrollContent: {
        paddingBottom: 200,
    },
});
