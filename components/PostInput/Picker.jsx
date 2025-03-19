// TODO: remove before commit
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import {
    ActivityIndicator,
    Alert,
    AppState,
    Dimensions,
    FlatList,
    Image,
    Linking,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { showMessage } from "react-native-flash-message";

import theme from "../../config/theme";
import { CameraSVG, ChcekIcon, GallerySVG } from "../Svgs";

const Picker = forwardRef((props, ref) => {
    const {
        setLoading,
        images,
        setImages,
        openByDefault,
        setPostStage,
        showPicker,
        setShowPicker,
    } = props;
    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [appState, setAppState] = useState(AppState.currentState);
    const [isLimited, setIsLimited] = useState(false);

    useEffect(() => {
        checkPhotoPermission();
    }, []);

    const checkPhotoPermission = async () => {
        const { status, accessPrivileges } =
            await ImagePicker.getMediaLibraryPermissionsAsync();
        setIsLimited(status === "granted" && accessPrivileges === "limited");
    };

    const addToImages = async (result) => {
        const asset = result?.assets[0];
        const minSize = 1000000;
        let resizedResult = asset;

        if (asset.type !== "image") {
            showMessage({
                message: "Please select an image",
                type: "danger",
            });
            return;
        }
        if (asset.fileSize > minSize) {
            const compress = getCompressSize(asset.fileSize);
            resizedResult = await resizeImage(asset.uri, compress);
        }

        if (!result.canceled) {
            if (images.length < 9) {
                setImages((prevImages) => [
                    ...prevImages,
                    {
                        ...resizedResult,
                        type: openByDefault ? "default" : "image",
                    },
                ]);
            }
        }
    };

    const pickFromCamera = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();
        if (granted) {
            if (images.length === 9) {
                Alert.alert("You can only select max 9 images");
            } else {
                const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                });

                // Compress and add to images
                await addToImages(result);
                setLoading(false);
            }
        } else {
            Alert.alert("Camera permission is required to take a photo.");
        }
    };

    const resizeImage = async (uri, compress) => {
        const result = await manipulateAsync(uri, [], {
            compress,
            format: SaveFormat.JPEG,
        });
        return result;
    };

    const fetchImages = async () => {
        setIsLoading(true);
        try {
            if (
                Platform.OS === "android" &&
                !(await handleAndroidPermission())
            ) {
                showMessage({
                    message: "Permission denied. Unable to access gallery.",
                    type: "danger",
                });
                return;
            }
            const result = await CameraRoll.getPhotos({
                first: 400,
                assetType: "Photos",
            });
            setGalleryImages(result.edges.map((edge) => edge.node.image));
        } catch (error) {
            console.log("Error fetching images from Image Library:", error);
            Alert.alert("Unable to Load Images", error.message, [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Open Settings",
                    onPress: () => Linking.openURL("app-settings:"),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = async (image) => {
        const isSelected = images.some((img) => img.uri === image.uri);
        const maxImages = 9;

        if (isSelected) {
            setImages((prevSelected) =>
                prevSelected.filter((img) => img.uri !== image.uri),
            );
        } else {
            if (images.length < maxImages) {
                setImages((prevImages) => [...prevImages, image]);
            } else {
                Alert.alert("You can only select max 9 images");
            }
        }
    };

    const compressAllImages = async () => {
        console.log("Compress CAlled");
        const compressedImages = await Promise.all(
            images.map(async (image) => {
                const compress = getCompressSize(image.fileSize || 1000000); // Adjust fileSize if not available
                const resizedImage = await resizeImage(image.uri, compress);
                return { ...image, uri: resizedImage.uri };
            }),
        );
        return compressedImages;
    };

    useImperativeHandle(ref, () => ({
        compressAllImages,
    }));

    useEffect(() => {
        if (showPicker) {
            fetchImages();
        }
    }, [showPicker]);

    useEffect(() => {
        if (images.length > 9) {
            alert("You can only select up to 3 images.");
            setImages(images.slice(0, 9));
        }
    }, [images]);

    const getCompressSize = (size) => {
        const MB = Math.round(size / Math.pow(1024, 2));
        if (MB === 0) return 1;
        if (MB === 1) return 0.9;
        if (MB === 2) return 0.8;
        if (MB === 3) return 0.7;
        if (MB === 4) return 0.6;
        if (MB >= 5) return 0.5;
        if (MB >= 10) return 0.4;
        if (MB >= 15) return 0.3;
        if (MB >= 20) return 0.2;
        if (MB >= 25) return 0.1;
    };
    const requestFullAccess = async () => {
        setShowPicker(false);
        if (Platform.OS === "ios") {
            Alert.alert(
                "Update Photo Library",
                "To update your photo selection,add/remove selected images or allow/revoke full access to your photo library.",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Open Settings",
                        onPress: () => Linking.openURL("app-settings:photos"),
                    },
                ],
            );
        }
    };

    const handleAndroidPermission = async () => {
        if (Platform.OS !== "android") {
            return true;
        }

        try {
            if (Platform.Version >= 33) {
                // For Android 13 (API level 33) and above: request the new permissions model
                const result = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                );
                return result === PermissionsAndroid.RESULTS.GRANTED;
            } else if (Platform.Version >= 30) {
                // For Android 11 to 12 (API levels 30-32)
                const readPermission =
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
                const granted =
                    await PermissionsAndroid.request(readPermission);
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } else {
                // For Android 10 and below
                const permissions = [
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                ];
                const granted =
                    await PermissionsAndroid.requestMultiple(permissions);
                return (
                    granted["android.permission.READ_EXTERNAL_STORAGE"] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                    granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
                        PermissionsAndroid.RESULTS.GRANTED
                );
            }
        } catch (error) {
            console.log("Error requesting permissions:", error);
            return false;
        }
    };

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (
                appState.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                // console.log("calling");
                setShowPicker(false);
                fetchImages();
            }
            setAppState(nextAppState);
        };

        const appStateListener = AppState.addEventListener(
            "change",
            handleAppStateChange,
        );

        return () => {
            appStateListener.remove();
        };
    }, [appState]);

    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View style={styles.actions}>
                    <TouchableOpacity
                        onPress={pickFromCamera}
                        style={styles.action}
                    >
                        <CameraSVG />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setShowPicker(!showPicker);
                        }}
                        onLongPress={requestFullAccess}
                        style={styles.action}
                        testID="picker-gallery"
                    >
                        <GallerySVG />
                    </TouchableOpacity>
                </View>

                {isLimited && showPicker && (
                    <Text
                        style={{
                            color: theme.colors.lightBlue,
                            marginRight: 10,
                            fontSize: 12,
                        }}
                        onPress={() => {
                            Linking.openURL("app-settings:");
                        }}
                    >
                        Edit Selection
                    </Text>
                )}
            </View>
            <View style={styles.galleryContainer}>
                {showPicker && (
                    <FlatList
                        scrollEnabled={false}
                        data={galleryImages}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleImageSelect(item)}
                                style={styles.imageContainer}
                                testID="image"
                            >
                                {!isLoading ? (
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={[
                                            styles.image,
                                            images.some(
                                                (img) => img.uri === item.uri,
                                            ) && styles.selectedImage,
                                        ]}
                                    />
                                ) : (
                                    <View
                                        style={{
                                            ...styles.image,
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ActivityIndicator
                                            color={theme.colors.lightBlue}
                                        />
                                    </View>
                                )}
                                {images.some((img) => img.uri === item.uri) && (
                                    <View style={styles.checkmarkContainer}>
                                        <ChcekIcon />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.uri}
                        numColumns={3}
                    />
                )}
            </View>
        </View>
    );
});

export default Picker;

const styles = StyleSheet.create({
    actions: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20,
    },
    action: {
        marginLeft: 18,
    },
    galleryContainer: {
        height: "100%",
        paddingHorizontal: 5,
        paddingBottom: "135%",
    },
    imageContainer: {
        width: Dimensions.get("screen").width * 0.3,
        height: Dimensions.get("screen").width * 0.3,
        margin: 5,
        borderRadius: 5,
        position: "relative",
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 5,
    },
    selectedImage: {
        opacity: 0.5,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    checkmarkContainer: {
        position: "absolute",
        top: 5,
        right: 5,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        padding: 6,
        backgroundColor: theme.colors.blue,
    },
    checkmark: {
        width: 20,
        height: 20,
        color: "blue",
    },
});
