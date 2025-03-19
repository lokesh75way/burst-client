import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

import theme from "../../config/theme";
import { getImageUrl } from "../../helpers/commonFunction";
import Button from "../Button";

const UserItem = ({ member, isSelected, onToggle, isDisabled = false }) => {
    const title = isDisabled ? "Creator" : isSelected ? "Remove" : "Add";
    const backgroundColor = isSelected ? theme.colors.blue : theme.colors.white;
    const color = isSelected ? theme.colors.white : theme.colors.blue;

    const handleToggle = () => {
        onToggle(member);
    };

    const imageUrl = getImageUrl(member.profileImageKey);

    return (
        <TouchableOpacity activeOpacity={1} style={styles.userItemContainer}>
            <View style={styles.imageUserNameContainer}>
                <View style={styles.avatarContainer}>
                    <Image
                        height={60}
                        width={60}
                        source={{ uri: imageUrl }}
                        style={styles.avatar}
                    />
                </View>
                <View>
                    <Text style={styles.userNameText} numberOfLines={1}>
                        {member.displayName}
                    </Text>
                    <Text style={styles.userName}>@{member.userName}</Text>
                </View>
            </View>
            <View style={{ width: "25%" }} testID="add-user">
                <Button
                    label={title}
                    disabled={isDisabled}
                    borderRadius={20}
                    onPress={handleToggle}
                    bgColor={backgroundColor}
                    color={color}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = {
    userItemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: Dimensions.get("screen").width * 0.8,
        marginBottom: 20,
    },
    imageUserNameContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "55%",
    },
    userNameText: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    userName: {
        marginHorizontal: 10,
        marginVertical: 2,
        fontSize: 12,
        color: theme.colors.grey,
    },
};

export default UserItem;
