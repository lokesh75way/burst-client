import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { showMessage } from "react-native-flash-message";
import { avatarPrefix, defaultAvatar } from "../../config/constants";
import theme from "../../config/theme";
import useChannels from "../../hooks/useChannels";
import Button from "../Button";
import Loader from "../Loader";
import CreateChannelModal from "../Modal/CreateChannelModal";
import { ChcekIcon } from "../Svgs";
import MemberList from "./MemberList";
import StackedImages from "./StackedImages";

const ChannelItem = ({
    item,
    isCreator,
    isJoined,
    handleRefresh,
    isDisabled = false,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [memberVisible, setMemberVisible] = useState(false);
    const [label, setLabel] = useState("");
    const { addRemoveUser } = useChannels();
    const navigation = useNavigation();
    const editChannelSheetRef = useRef();
    const membersListShitRef = useRef();
    const isEveryone =
        item.id === parseInt(process.env.EXPO_PUBLIC_EVERYONE_CHANNEL_ID);

    const membersProfileImageKeys = item.members.map(
        (member) => member.profileImageKey,
    );
    const members = item.members.map((member) => ({
        name: member.displayName,
        id: member.id,
        profileImageKey: member.profileImageKey,
        profileImage: member.profileImageKey
            ? avatarPrefix + member.profileImageKey
            : avatarPrefix + defaultAvatar,
    }));
    const memberProfileImages = membersProfileImageKeys.map(
        (profileImageKey) => {
            return profileImageKey
                ? avatarPrefix + profileImageKey
                : avatarPrefix + defaultAvatar;
        },
    );
    const firstThreeImages = memberProfileImages.slice(0, 3);

    const toggleJoin = async () => {
        if (isEveryone) {
            showMessage({
                message: "You can't leave #everyone channel.",
                type: "info",
            });
            return;
        }
        const type = isJoined ? "remove" : "add";
        try {
            setIsLoading(true);
            await addRemoveUser(item.id, { type });
            handleRefresh();
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (isCreator) {
            setLabel("Edit");
        } else if (isJoined) {
            setLabel("Joined");
        } else {
            setLabel("Join");
        }
    }, [isCreator, isJoined]);

    return (
        <View style={styles.container}>
            <View style={{ width: isCreator ? "50%" : "60%" }}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        disabled={isDisabled}
                        onPress={() => {
                            navigation.navigate("ChannelDetails", {
                                channelId: item.id,
                                channelTag: item.tag,
                                isCreator,
                                isJoined,
                            });
                        }}
                    >
                        <Text style={styles.channelName} numberOfLines={1}>
                            {item.type === "private" && (
                                <>
                                    <FontAwesome5
                                        name="lock"
                                        size={14}
                                        color={theme.colors.lightBlue}
                                    />{" "}
                                </>
                            )}
                            {item.tag}
                        </Text>
                    </TouchableOpacity>
                    {isCreator && (
                        <Text style={styles.creatorTag}> (Creator)</Text>
                    )}
                </View>
                <Text numberOfLines={1}>{item.description}</Text>
                <Text style={styles.memberCountText}>
                    {item.members.length} Members
                </Text>
                <View style={styles.imagesContainer}>
                    <StackedImages images={firstThreeImages} />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    label={!isLoading && label}
                    startIcon={
                        isLoading && (
                            <View
                                style={{ alignSelf: "center", marginRight: 10 }}
                            >
                                <Loader
                                    size="small"
                                    color={
                                        isJoined
                                            ? theme.colors.white
                                            : theme.colors.lightBlue
                                    }
                                />
                            </View>
                        )
                    }
                    endIcon={
                        isJoined && !isCreator && !isLoading && <ChcekIcon />
                    }
                    borderRadius={20}
                    bgColor={!isJoined && !isCreator && theme.colors.white}
                    color={
                        isJoined || isCreator
                            ? theme.colors.white
                            : theme.colors.lightBlue
                    }
                    onPress={() => {
                        if (isCreator) {
                            setModalVisible(true);
                        } else {
                            toggleJoin();
                        }
                    }}
                />
                {!isDisabled && (
                    <Button
                        label="Members"
                        borderRadius={20}
                        bgColor={!isJoined && !isCreator && theme.colors.white}
                        color={
                            isJoined || isCreator
                                ? theme.colors.white
                                : theme.colors.lightBlue
                        }
                        marginTop={10}
                        onPress={() => {
                            membersListShitRef.current?.open();
                        }}
                    />
                )}
            </View>

            {isCreator && modalVisible && (
                <CreateChannelModal
                    showCreateChannelModal={modalVisible}
                    setShowCreateChannelModal={setModalVisible}
                    onChannelCreate={handleRefresh}
                    isEditMode
                    initialValues={{
                        channelName: item.tag,
                        description: item.description,
                        id: item.id,
                        addedMembers: item.members,
                        type: item.type,
                    }}
                    sheetRef={editChannelSheetRef}
                />
            )}

            {/* {memberVisible && ( */}
            {!isDisabled && (
                <MemberList
                    setShowMemberListModal={setMemberVisible}
                    membersInfo={members}
                    channelName={item.tag}
                    sheetRef={membersListShitRef}
                    ownerId={item.owner.id}
                />
            )}
            {/* )} */}
        </View>
    );
};

export default ChannelItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    channelName: {
        fontSize: 16,
        fontWeight: "600",
        color: theme.colors.lightBlue,
    },
    creatorTag: {
        fontSize: 14,
        color: "#BABABA",
    },
    memberCountText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#BABABA",
    },
    imagesContainer: {
        marginTop: 10,
        marginBottom: 60,
    },
    buttonContainer: {
        width: "30%",
    },
});
