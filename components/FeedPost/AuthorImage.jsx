import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Skeleton } from "react-native-skeletons";

import { avatarPrefix, defaultAvatar } from "../../config/constants";
import { isDefaultProfileImage } from "../../helpers/commonFunction";
import useApp from "../../hooks/useApp";
import CachedImage from "../CachedImage";

const AuthorImage = (props) => {
    const { imageUrl, isERT, imageBorder, size, author, disabled, fromTeam } = props;
    const { storage, setActiveRoute } = useApp();
    const navigation = useNavigation();
    const goToUserProfile = () => {
        const { userName, profileImageKey, id } = author;
        if (id.toString() === storage.id) {
            setActiveRoute("Profile");
            navigation.navigate("Profile");
        } else {
            navigation.navigate("UserPage", {
                userName,
                avatar: profileImageKey ?? defaultAvatar,
                userId: id,
                fromTeam: fromTeam
            });
        }
    };

    const isDefault = isDefaultProfileImage(imageUrl);
    const imageSrc = {
        uri: isDefault ? avatarPrefix + defaultAvatar : imageUrl,
    };
    const imageStyle = [
        styles.profileImage,
        isERT && styles.ertCircle,
        imageBorder && imageBorder,
    ];
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
                if (!disabled) {
                    goToUserProfile();
                }
            }}
            disabled={disabled}
            style={[styles.user, { width: size, height: size }]}
        >
            {isDefault ? (
                <Image
                    height={size}
                    width={size}
                    source={imageSrc}
                    style={imageStyle}
                />
            ) : (
                <CachedImage
                    height={size}
                    width={size}
                    source={imageSrc}
                    style={imageStyle}
                    loader={
                        <Skeleton
                            circle
                            width={size}
                            height={size}
                            color="#D9D9D980"
                        />
                    }
                />
            )}
        </TouchableOpacity>
    );
};

export default AuthorImage;

const styles = StyleSheet.create({
    user: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
    ertCircle: {
        borderWidth: 2,
        borderColor: "#66C32E",
    },
});
