import { useNavigation } from "@react-navigation/core";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";

import { defaultAvatar } from "../../config/constants";
import theme from "../../config/theme";
import { getImageUrl } from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import AuthorImage from "../FeedPost/AuthorImage";

const EmojiMembersList = ({
    setShowMemberListModal,
    showMemberListModal,
    membersInfo,
    curEmoji,
    loading,
    sheetRef,
}) => {
    const { storage, setActiveRoute } = useApp();
    const navigation = useNavigation();

    const goToUserProfile = (user) => {
        const { userName, id, profileImageKey, profileImage } = user;
        if (id.toString() === storage.id) {
            setActiveRoute("Profile");
            navigation.navigate("Profile");
        } else {
            navigation.navigate("UserPage", {
                userName,
                avatar: profileImageKey ?? defaultAvatar,
                userId: id,
            });
        }
        setShowMemberListModal(false);
    };

    useEffect(() => {
        if (showMemberListModal) {
            sheetRef?.current?.open();
        }
    }, [showMemberListModal]);

    return (
        <RBSheet
            ref={sheetRef}
            height={Dimensions.get("screen").height * 0.45}
            openDuration={350}
            customStyles={{ container: styles.modalContainer }}
            onClose={() => {
                setShowMemberListModal(false);
            }}
            draggable
        >
            <View style={{ width: "100%", alignItems: "center" }}>
                <Text style={styles.channelName}>{curEmoji}</Text>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.memberListContainer}
                >
                    {membersInfo.length > 0 &&
                        membersInfo.map((user, index) => (
                            <View
                                key={user.id}
                                style={styles.memberItemContainer}
                            >
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={() => goToUserProfile(user)}
                                    style={styles.user}
                                >
                                    <AuthorImage
                                        imageUrl={getImageUrl(
                                            user.profileImageKey,
                                        )}
                                        size={45}
                                        disabled={true}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.memberName}>
                                    {user.userName}
                                </Text>
                            </View>
                        ))}
                    {loading && <ActivityIndicator />}
                    {!loading && membersInfo.length === 0 && (
                        <View style={styles.noMembersContainer}>
                            <Text style={styles.noMembersText}>
                                No users in this channel
                            </Text>
                        </View>
                    )}
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        width: "100%",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: "center",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    channelName: {
        fontSize: 24,
        color: theme.colors.lightBlue,
        fontWeight: "600",
        marginBottom: 10,
    },
    memberListContainer: {
        width: "100%",
    },
    memberItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        width: "80%",
    },
    memberImage: {
        width: 50,
        height: 50,
        borderRadius: 30,
    },
    memberName: {
        marginLeft: 10,
        fontSize: 18,
    },
    noMembersContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    noMembersText: {
        textAlign: "center",
    },
});

export default EmojiMembersList;
