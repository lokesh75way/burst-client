import React, { useRef, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import SettingImage from "../assets/icons/setting.png";
import { avatarPrefix, defaultAvatar } from "../config/constants";
import CachedImage from "./CachedImage";
import ImageLoader from "./ImageLoader";
import UserImageViewModal from "./Modal/UserImageViewModal";
import ProfileSetting from "./Profile/profileSetting";

/**
 * Component for displaying and updating the user's profile image.
 * @param {object} props - Component props.
 * @param {string} props.avatarSource - Source of the user's avatar.
 * @param {Function} props.setAvatarSource - Function to set the avatar source.
 */
const ProfileImage = (props) => {
    const { avatarSource, setAvatarSource, setDisplayName } = props;
    const [loading, setLoading] = useState(false);
    const [profileSettingVisible, setProfileSettingVisible] = useState(false);
    const profileSettingSheetRef = useRef();
    /**
     * Handles the action when the avatar is clicked, prompting the user to change the avatar.
     * @function handleAvatarClick
     * @returns {void}
     */
    const handleProfileSetting = () => {
        console.log("Profile Setting");
        setProfileSettingVisible(true);
    };

    const imageUrl = avatarPrefix + avatarSource;
    const isDefault = imageUrl === avatarPrefix + defaultAvatar;
    const [isModalVisible, setIsModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    setIsModalVisible(true);
                }}
                activeOpacity={0.8}
            >
                {isDefault ? (
                    <Image
                        key={avatarSource}
                        source={{ uri: imageUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                ) : (
                    <CachedImage
                        key={avatarSource}
                        source={{ uri: imageUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                        loader={<ImageLoader width={120} height={120} />}
                    />
                )}
            </TouchableOpacity>

            <TouchableOpacity
                disabled={loading}
                onPress={handleProfileSetting}
                style={styles.iconContainer}
                testID="profile-settings"
            >
                <Image source={SettingImage} style={styles.icon} />
            </TouchableOpacity>

            {profileSettingVisible && (
                <ProfileSetting
                    profileSettingVisible={profileSettingVisible}
                    setProfileSettingVisible={setProfileSettingVisible}
                    isAvatarDefault={isDefault}
                    avatarImageUrl={imageUrl}
                    avatarSource={avatarSource}
                    setAvatarSource={setAvatarSource}
                    loading={loading}
                    setLoading={setLoading}
                    setDisplayName={setDisplayName}
                    sheetRef={profileSettingSheetRef}
                />
            )}
            <UserImageViewModal
                isVisible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                }}
                avatar={avatarSource}
                imageUrl={imageUrl}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 70,
        backgroundColor: "#cccccc20",
    },
    loadingContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#cccccc20",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        width: 40,
        height: 40,
    },
    iconContainer: {
        position: "absolute",
        bottom: 35,
        right: 5,
    },
});

export default ProfileImage;
