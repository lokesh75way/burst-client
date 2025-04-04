import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import RBSheet from "react-native-raw-bottom-sheet";
import { Skeleton } from "react-native-skeletons"; // Import Skeleton component
import { defaultAvatar } from "../../config/constants";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";

const MemberList = ({
    setShowMemberListModal,
    membersInfo,
    channelName,
    sheetRef,
    ownerId,
}) => {
    const { storage, setActiveRoute } = useApp();
    const navigation = useNavigation();

    const goToUserProfile = (user) => {
        const { name, id, profileImageKey, profileImage } = user;
        sheetRef.current?.close();

        if (id.toString() === storage.id) {
            setActiveRoute("Profile");
            navigation.navigate("Profile");
        } else {
            navigation.navigate("UserPage", {
                userName: name,
                avatar: profileImageKey ?? defaultAvatar,
                userId: id,
            });
        }
    };

    const sortedMembers = ownerId
        ? membersInfo.sort((a, b) =>
            a.id === ownerId ? -1 : b.id === ownerId ? 1 : 0,
        )
        : membersInfo;

    const [imageLoadedStates, setImageLoadedStates] = useState(
        new Array(sortedMembers.length).fill(false)
    );

    const handleImageLoad = (index) => {
        setImageLoadedStates((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
        });
    };

    return (
        <RBSheet
            ref={sheetRef}
            height={Dimensions.get("screen").height * 0.85}
            draggable
            openDuration={100}
            closeDuration={150}
            customStyles={{ container: styles.modalContainer }}
            onClose={() => { setShowMemberListModal(false) }}
        >
            <Text style={styles.channelName}>{channelName}</Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.memberListContainer}
            >
                {sortedMembers.length > 0 ? (
                    sortedMembers.map((user, index) => (
                        <View key={index} style={styles.memberItemContainer}>
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={() => goToUserProfile(user)}
                                style={styles.user}
                            >
                                <View style={styles.imageContainer}>
                                    {!imageLoadedStates[index] && (
                                        <Skeleton
                                            width={50}
                                            height={50}
                                            borderRadius={30}
                                            style={styles.skeleton}
                                        />
                                    )}
                                    <Image
                                        source={{
                                            uri:
                                                user.profileImage ||
                                                "https://curiouploads.s3.us-east-1.amazonaws.com/static-app-assets/default-profile",
                                        }}
                                        style={[
                                            styles.memberImage,
                                            { opacity: imageLoadedStates[index] ? 1 : 0 },
                                        ]}
                                        onLoad={() => handleImageLoad(index)}
                                    />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.memberName}>
                                {user.name || user.displayName}
                            </Text>
                            {ownerId && user.id === ownerId && (
                                <Text style={styles.creatorTag}>(Creator)</Text>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.noMembersContainer}>
                        <Text style={styles.noMembersText}>
                            No users in this channel
                        </Text>
                    </View>
                )}
            </ScrollView>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        height: "100%",
        backgroundColor: "#00000080",
        justifyContent: "flex-end",
    },
    modalContainer: {
        width: "100%",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 20,
        alignItems: "center",
        borderTopLeftRadius: 22,
        borderTopRightRadius: 22,
    },
    channelName: {
        fontSize: 24,
        color: theme.colors.lightBlue,
        fontWeight: "600",
        marginBottom: 20,
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
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 30,
        overflow: "hidden",
    },
    memberImage: {
        width: "100%",
        height: "100%",
        borderRadius: 30,
        borderColor: "#cccccc50",
        borderWidth: 1,
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
    creatorTag: {
        color: "#aaa",
        fontSize: 14,
        paddingHorizontal: 4,
    },
    skeleton: {
        position: "absolute",
    },
});

export default MemberList;
