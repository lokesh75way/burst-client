import { useIsFocused } from "@react-navigation/native";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import RBSheet from "react-native-raw-bottom-sheet";

import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import useAuth from "../../hooks/useAuth";
import usePosts from "../../hooks/usePosts";
import useUsers from "../../hooks/useUsers";
import { uploadImageToS3 } from "../../services/s3";
import Button from "../Button";
import CachedImage from "../CachedImage";
import ImageLoader from "../ImageLoader";
import { EyeSVG, SlashEyeSVG } from "../Svgs";
import ProfileImageOptionsBottomSheet from "./ProfileImageOptionsBottomSheet";

const ProfileSetting = ({
    profileSettingVisible,
    setProfileSettingVisible,
    isAvatarDefault,
    avatarImageUrl,
    avatarSource,
    setAvatarSource,
    loading,
    setLoading,
    setDisplayName,
    sheetRef,
}) => {
    const [oldProfile, setOldProfile] = useState(avatarSource);
    const { uploadProfileImage } = useUsers();
    const { uploadImage } = usePosts();
    const { me } = useUsers();
    const { changeUsernameAndDisplayname } = useUsers();
    const { resetPassword } = useAuth();
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [reEnterPassword, setReEnterPassword] = useState("");
    const isFocused = useIsFocused();
    const [displayNameValue, setDisplayNameValue] = useState("");
    const [isChanged, setIsChanged] = useState(false);
    const [isUplaoding, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userData, setUserData } = useApp();
    const [displayNameError, setDisplayNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordVisible, setPassWordVisible] = useState(false);
    const [confirmPassWordVisible, setConfirmPasswordVisible] = useState(false);
    const profileImageOptionsSheetRef = useRef();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await me();
            if (data.profileImageKey) {
                setAvatarSource(data.profileImageKey);
            }
            setDisplayNameValue(data.displayName);
            setUserName(data.userName);
            setUserEmail(data.email);
            updateIsChanged();
        } catch (error) {
            console.log("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    useEffect(() => {
        if (profileSettingVisible) {
            sheetRef?.current?.open();
        }
    }, [profileSettingVisible]);

    const updateIsChanged = () => {
        if (
            displayNameValue !== userData.displayName ||
            userPassword.length > 0 ||
            reEnterPassword.length > 0
        ) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    };

    useEffect(() => {
        updateIsChanged();
    }, [displayNameValue, userName, userPassword, reEnterPassword]);

    const removeProfileImage = () => {
        Alert.alert(
            "Remove Profile Image",
            "Are you sure you want to remove your profile image? You can set a new one anytime.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            //remove image key
                            setAvatarSource(null);
                            profileImageOptionsSheetRef?.current?.close();
                        } catch (error) {
                            console.error(
                                "Error removing profile image:",
                                error,
                            );
                        }
                    },
                },
            ],
        );
    };

    const handleAvatarClick = () => {
        profileImageOptionsSheetRef.current?.open();
    };

    // Function to open image picker
    const openImagePicker = () => {
        pickImage();
    };

    /**
     * Opens the image picker to select an image.
     * @async
     * @function pickImage
     */
    const pickImage = async (type) => {
        const requestPermission =
            type === "gallery"
                ? ImagePicker.requestMediaLibraryPermissionsAsync
                : ImagePicker.requestCameraPermissionsAsync;

        const { status } = await requestPermission();
        if (status !== "granted") {
            return Alert.alert(
                "Permission Denied",
                `Please allow ${
                    type === "gallery" ? "Image Library" : "Camera"
                } access in settings to proceed.`,
            );
        }

        const launchPicker =
            type === "gallery"
                ? ImagePicker.launchImageLibraryAsync
                : ImagePicker.launchCameraAsync;

        const result = await launchPicker({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.assets?.length > 0) {
            const originalUri = result.assets[0].uri;
            const originalInfo = await fetch(originalUri);
            const originalBlob = await originalInfo.blob();
            const originalSizeMB = originalBlob.size / (1024 * 1024);
            const compressionQuality = getCompressionQuality(originalSizeMB);
            const compressedImage = await ImageManipulator.manipulateAsync(
                originalUri,
                [],
                {
                    compress: compressionQuality,
                    format: ImageManipulator.SaveFormat.JPEG,
                },
            );

            profileImageOptionsSheetRef?.current?.close();
            setIsUploading(true);
            await fetchKey(compressedImage);
        }
    };

    const getCompressionQuality = (sizeMB) => {
        if (sizeMB > 10) return 0.1;
        if (sizeMB > 8) return 0.2;
        if (sizeMB > 5) return 0.3;
        if (sizeMB > 3) return 0.4;
        if (sizeMB > 2) return 0.5;
        return 0.8;
    };

    /**
     * Fetches the key for the selected image and uploads it.
     * @async
     * @function fetchKey
     * @param {string} image - Base64 representation of the selected image.
     */
    const fetchKey = async (image) => {
        try {
            setLoading(true);
            const data = await uploadImageToS3(image);
            const { url = "", key = "" } = data || { url: "", key: "" };
            await uploadAvatar(key);
        } catch (error) {
            showMessage({
                message: "Error while uploading the image",
                type: "danger",
            });
            console.error("Error:", error.response);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Uploads the selected image as the user's new profile avatar.
     * @async
     * @function uploadAvatar
     * @param {string} newKey - Key representing the new avatar image.
     */
    const uploadAvatar = async (newKey) => {
        try {
            setIsUploading(true);
            setAvatarSource(newKey);
            const data = JSON.stringify({
                profileImageKey: newKey,
            });
            await uploadProfileImage(data);
            setOldProfile(newKey);
            setLoading(false);
        } catch (error) {
            setAvatarSource(oldProfile);
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const updateDisplayName = async () => {
        try {
            const finalDisplayName = displayNameValue.trim();
            const data = await changeUsernameAndDisplayname(
                userName,
                finalDisplayName,
            );
            setUserData({
                ...userData,
                displayName: finalDisplayName,
            });
            setDisplayName(finalDisplayName);
        } catch (e) {
            showMessage({
                message: e.message,
                type: "danger",
            });
        }
    };

    const updatePassword = async () => {
        try {
            const data = await resetPassword(userEmail, userPassword);
            showMessage({
                message: "Password Updated.",
                type: "success",
            });
        } catch (e) {
            showMessage({
                message: "Error while updating password",
                type: "danger",
            });
        }
    };

    const handleConfirm = async () => {
        setDisplayNameError("");
        setPasswordError("");
        setConfirmPasswordError("");

        if (displayNameValue.trim().length < 3) {
            setDisplayNameError(
                "Display Name must be at least 3 characters long.",
            );
            return;
        }

        if (userPassword && userPassword.length < 4) {
            setPasswordError("Password must be at least 4 characters long.");
            return;
        }

        if (userPassword !== reEnterPassword) {
            setConfirmPasswordError("Password does not match.");
            return;
        }
        try {
            setIsSubmitting(true);

            if (displayNameValue !== userData.displayName) {
                updateDisplayName();
            }
            if (userPassword !== "") {
                updatePassword();
            }
            // await ResetPassword(userEmail, userPassword);
        } catch (error) {
            console.error(error);
        } finally {
            setProfileSettingVisible(false);
            setIsSubmitting(false);
            sheetRef?.current?.close();
        }
    };

    return (
        <RBSheet
            ref={sheetRef}
            height={Dimensions.get("screen").height * 0.85}
            draggable
            openDuration={400}
            customStyles={{ container: styles.modalContainer }}
            onClose={() => {
                setProfileSettingVisible(false);
            }}
        >
            <Text style={styles.title}>Profile Setting</Text>
            <ScrollView
                contentContainerStyle={{
                    width: Dimensions.get("screen").width * 0.85,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.ImageContainer}>
                    {isAvatarDefault ? (
                        <Image
                            key={avatarSource}
                            source={{ uri: avatarImageUrl }}
                            style={styles.avatar}
                            resizeMode="cover"
                        />
                    ) : !isUplaoding ? (
                        <CachedImage
                            key={avatarSource}
                            source={{ uri: avatarImageUrl }}
                            style={styles.avatar}
                            resizeMode="cover"
                            loader={<ImageLoader width={120} height={120} />}
                        />
                    ) : (
                        <View
                            style={{
                                borderRadius: 60,
                                width: 120,
                                height: 120,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ActivityIndicator
                                color={theme.colors.lightBlue}
                                size={"small"}
                            />
                        </View>
                    )}
                    <TouchableOpacity
                        disabled={loading}
                        onPress={handleAvatarClick}
                    >
                        <Text style={styles.editProfileText}>
                            Edit Profile Image
                        </Text>
                    </TouchableOpacity>
                </View>
                {isLoading && (
                    <ActivityIndicator
                        color={theme.colors.lightBlue}
                        size={"large"}
                    />
                )}
                {!isLoading && (
                    <View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.subTitle}>Display Name: </Text>
                            <TextInput
                                style={{
                                    ...styles.inputField,
                                    ...styles.inputBarStyle,
                                }}
                                value={displayNameValue}
                                onChangeText={(text) => {
                                    const trimmedText = text.trimStart();
                                    if (trimmedText !== "") {
                                        setDisplayNameValue(trimmedText);
                                    } else {
                                        setDisplayNameValue("");
                                    }
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                testID="displayName-edit"
                            />
                            {displayNameError ? (
                                <Text style={styles.errorText}>
                                    {displayNameError}
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.subTitle}>User Name: </Text>
                            <TextInput
                                style={{
                                    ...styles.inputField,
                                    ...styles.inputBarStyle,
                                    backgroundColor: "#eee",
                                }}
                                value={userName}
                                editable={false}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.subTitle}>Email: </Text>
                            <TextInput
                                style={{
                                    ...styles.inputField,
                                    ...styles.inputBarStyle,
                                    backgroundColor: "#eee",
                                }}
                                value={userEmail}
                                editable={false}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.subTitle}>New Password: </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    ...styles.inputBarStyle,
                                }}
                            >
                                <TextInput
                                    style={{
                                        ...styles.inputField,
                                        marginLeft: 0,
                                        width: "90%",
                                    }}
                                    placeholder="Enter New Password"
                                    value={userPassword}
                                    onChangeText={(text) =>
                                        setUserPassword(text.replace(/\s/g, ""))
                                    }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={!passwordVisible}
                                    testID="new-password-edit"
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setPassWordVisible((prev) => !prev);
                                    }}
                                    style={styles.icon}
                                >
                                    {passwordVisible ? (
                                        <EyeSVG />
                                    ) : (
                                        <SlashEyeSVG />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {passwordError ? (
                                <Text style={styles.errorText}>
                                    {passwordError}
                                </Text>
                            ) : null}
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={styles.subTitle}>
                                Re-type Password:{" "}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    ...styles.inputBarStyle,
                                }}
                            >
                                <TextInput
                                    style={{
                                        ...styles.inputField,
                                        marginLeft: 0,
                                        width: "90%",
                                    }}
                                    placeholder="Enter New Password"
                                    value={reEnterPassword}
                                    onChangeText={(text) =>
                                        setReEnterPassword(
                                            text.replace(/\s/g, ""),
                                        )
                                    }
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    secureTextEntry={!confirmPassWordVisible}
                                    testID="confirm-password-edit"
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        setConfirmPasswordVisible(
                                            (prev) => !prev,
                                        );
                                    }}
                                    style={styles.icon}
                                >
                                    {confirmPassWordVisible ? (
                                        <EyeSVG />
                                    ) : (
                                        <SlashEyeSVG />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {confirmPasswordError ? (
                                <Text style={styles.errorText}>
                                    {confirmPasswordError}
                                </Text>
                            ) : null}
                        </View>
                        {!isSubmitting && (
                            <Button
                                label={isChanged ? "Confirm" : "Cancel"}
                                borderRadius={20}
                                bgColor={theme.colors.lightBlue}
                                marginTop={40}
                                onPress={() => {
                                    isChanged
                                        ? handleConfirm()
                                        : sheetRef.current?.close();
                                }}
                            />
                        )}
                        {isSubmitting && (
                            <ActivityIndicator
                                color={theme.colors?.lightBlue}
                                size={24}
                            />
                        )}
                    </View>
                )}
            </ScrollView>
            <ProfileImageOptionsBottomSheet
                sheetRef={profileImageOptionsSheetRef}
                onPickImage={() => {
                    pickImage("gallery");
                }}
                onRemoveImage={removeProfileImage}
                onCaptureImage={() => {
                    pickImage("camera");
                }}
                showRemoveImage={false}
            />
        </RBSheet>
        // </View>
        // </View>
        // </Modal>
    );
};

const styles = StyleSheet.create({
    ImageContainer: {
        paddingTop: 20,
        paddingBottom: 40,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 70,
        backgroundColor: "#cccccc20",
        marginBottom: 10,
        borderColor: "#cccccc25",
        borderWidth: 1,
    },
    rowContainer: {
        width: "98%",
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: "start",
        marginBottom: 20,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    editProfileText: {
        color: theme.colors.lightBlue,
        fontSize: 16,
        fontWeight: "400",
    },
    subTitle: {
        color: theme.colors.black,
        fontSize: 16,
        fontWeight: "600",
        textAlign: "left",
    },
    inputField: {
        color: theme.colors.black,
        fontSize: 16,
        fontWeight: "400",
        textAlign: "left",
        marginLeft: 40,
    },
    loadingContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#cccccc20",
        alignItems: "center",
        justifyContent: "center",
    },
    outerContainer: {
        height: "100%",
        backgroundColor: "#00000080",
        justifyContent: "flex-end",
        width: "100%",
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
    title: {
        fontSize: 24,
        color: theme.colors.lightBlue,
        fontWeight: "600",
        marginBottom: 20,
    },

    inputBarStyle: {
        marginLeft: 0,
        padding: 10,
        borderRadius: 8,
        borderColor: "#bbb",
        borderWidth: 1,
        width: "100%",
        marginTop: 10,
    },
    errorText: {
        color: "red",
        fontSize: 10,
        marginTop: 5,
    },
    icon: {
        width: 18,
        height: 18,
        position: "absolute",
        right: 8,
    },
});

export default ProfileSetting;
