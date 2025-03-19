import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { picturePrefix } from "../config/constants";
import { getCompressSize, resizeImage } from "../helpers/commonFunction";
import { uploadImageToS3 } from "../services/s3";

export default function MyImagePicker(props) {
    const {
        imageKeys,
        setImageKeys,
        setShowFullScreenPicture,
        setFullScreenPictureUrl,
        isLoading,
        setIsLoading,
        setModalVisible,
        uploadCounter, // Add the uploadCounter prop
        setUploadCounter, // Add the setUploadCounter prop
        sendPost,
    } = props;

    const [images, setImages] = useState([]);
    const [imageSize, setImageSize] = useState({});
    const [styleRow, setStyleRow] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [thumbnailContainer, setThumbnailContainer] = useState(null);
    const screenWidth = Dimensions.get("window").width;
    const [styleCloseIcon, setStyleCloseIcon] = useState({});
    /**
     * Sets up styles based on the screenWidth using React's useEffect hook.
     * Adjusts various style parameters such as row width, image size, thumbnail container size,
     * and close icon position to fit the screen width.
     *
     * @returns {void}
     */
    useEffect(() => {
        const windowWidth = screenWidth;
        const styleRowNew = {
            width: windowWidth - 50,
            height: (windowWidth - 50) / 3,
            // marginLeft: 15,
            marginBottom: 5,
        };
        setStyleRow(styleRowNew);

        const imageSizeHere = {
            width: (windowWidth - 80) / 3,
            height: (windowWidth - 80) / 3,
        };
        setImageSize(imageSizeHere);

        const thumbnail_container = {
            width: (windowWidth - 80) / 3,
            height: (windowWidth - 80) / 3,
            marginRight: 15,
        };
        setThumbnailContainer(thumbnail_container);

        const styleCloseIcon = {
            left: (windowWidth - 80) / 3 - 20,
            bottom: (windowWidth - 80) / 3 - 20,
        };
        setStyleCloseIcon(styleCloseIcon);
    }, []);

    const placeholderRemovedImages = (prev, index) => {
        const images = prev.filter((image) => {
            if (typeof image !== "string" && image?.index === index) {
                return false;
            }
            return true;
        });
        return images;
    };

    /**
     * Opens the image library for the user to select an image.
     * Upon image selection, it sets the selected image and updates the images state.
     * Initiates the image upload process by incrementing the uploadCounter
     * and fetching the key for the uploaded image.
     * @returns {Promise<void>} A Promise that resolves once the image is picked and processed.
     */
    const pickImage = async () => {
        setIsLoading(true);
        const index = images.length;
        setImages((prevImages) => [...prevImages, { index }]);
        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });
        if (result.canceled) {
            setImages((prevImages) =>
                prevImages.filter((obj) => obj.index !== index),
            );
            setIsLoading(false);
            return;
        }

        const asset = result.assets[0];
        const minSize = 1000000;
        let resizedResult = asset;
        if (asset.type === "image" && asset.fileSize > minSize) {
            const compress = getCompressSize(asset.fileSize);
            resizedResult = await resizeImage(asset.uri, compress);
        }

        if (!result.canceled) {
            // Increment the uploadCounter before starting an image upload
            setUploadCounter((prevCounter) => prevCounter + 1);
            await fetchKey(resizedResult);
            setImages((prevImages) => [
                ...placeholderRemovedImages(prevImages, index),
                resizedResult.uri,
            ]);
            setIsLoading(false);
        }
    };

    /**
     * Fetches the key for the uploaded image and updates states accordingly.
     * Executes the image upload process and manages loading states.
     * Decrements the uploadCounter when the image upload is completed or failed.
     * Hides the modal once all images are uploaded successfully.
     * @param {string} image - Base64 representation of the image.
     * @returns {Promise<void>} A Promise that resolves once the key for the image is fetched and processed.
     */
    const fetchKey = async (image) => {
        try {
            const data = await uploadImageToS3(image);
            const { url = "", key = "" } = data || { url: "", key: "" };

            setImageKeys((prevKeys) => [...prevKeys, key]);
            // Decrement the uploadCounter to mark completion
            setUploadCounter((prevCounter) => prevCounter - 1);
            if (uploadCounter === 0) {
                setModalVisible(false); // Hide the modal after isLoading becomes false
            }
        } catch (error) {
            console.log(error.message);
            setUploadCounter((prevCounter) => prevCounter - 1);
        }
    };

    /**
     * Calculates the number of rows required to display the images in sets of 3.
     * @type {number} The count of rows needed based on the number of images available.
     */
    const rowCount = Math.ceil(images.length / 3);

    /**
     * Handles the action when an image thumbnail is pressed.
     * Displays the image in full-screen mode if it has a corresponding key, using its URL.
     * @param {number} index - The index of the image thumbnail in the images array.
     */
    const handleImagePress = (index) => {
        if (imageKeys[index]) {
            setSelectedImage(index);
            setShowFullScreenPicture(true);
            setFullScreenPictureUrl(picturePrefix + imageKeys[index]);
        }
    };

    /**
     * Handles the action when an image is removed.
     * Updates the images and image keys by removing the specified index.
     * Decrements the upload counter to reflect the removal of an image.
     * @param {number} indexToRemove - The index of the image to be removed from the arrays.
     */
    const handleRemoveImage = (indexToRemove) => {
        setImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexToRemove),
        );
        setImageKeys((prevKeys) =>
            prevKeys.filter((_, index) => index !== indexToRemove),
        );

        setUploadCounter((prevCounter) => prevCounter - 1);
    };

    return (
        <>
            <View>
                {[...Array(rowCount)].map((_, rowIndex) => (
                    <View key={rowIndex} style={[styleRow, styles.rowOfImage]}>
                        {images
                            .slice(rowIndex * 3, (rowIndex + 1) * 3)
                            .map((image, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={thumbnailContainer}
                                    onPress={() =>
                                        handleImagePress(rowIndex * 3 + index)
                                    }
                                >
                                    {typeof image === "string" && (
                                        <Image
                                            source={{ uri: image }}
                                            style={imageSize}
                                            resizeMode="cover"
                                        />
                                    )}
                                    {isLoading &&
                                        !(typeof image === "string") && (
                                            <View
                                                style={[
                                                    imageSize,
                                                    styles.grayBox,
                                                ]}
                                            >
                                                <ActivityIndicator />
                                            </View>
                                        )}
                                    <TouchableOpacity
                                        style={[
                                            styleCloseIcon,
                                            styles.closeIconContainer,
                                        ]}
                                        onPress={() =>
                                            handleRemoveImage(
                                                rowIndex * 3 + index,
                                            )
                                        }
                                    >
                                        <Image
                                            style={styles.closeIcon}
                                            source={require("../assets/icons/CloseSquare.png")}
                                        />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        {rowIndex === rowCount - 1 &&
                            images.length % 3 !== 0 && (
                                <TouchableOpacity
                                    key={(rowIndex + 1) * 3}
                                    style={thumbnailContainer}
                                    onPress={pickImage}
                                >
                                    <View style={[imageSize, styles.grayBox]}>
                                        <Text style={styles.plus}>+</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                    </View>
                ))}
                {images.length % 3 === 0 && images.length !== 9 && (
                    <View style={[styleRow, styles.rowOfImage]}>
                        <TouchableOpacity
                            style={thumbnailContainer}
                            onPress={pickImage}
                        >
                            <View style={[imageSize, styles.grayBox]}>
                                <Text style={styles.plus}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    grayBox: {
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    plus: {
        fontSize: 48,
        color: "#ccc",
    },
    imageContainer: {
        marginTop: 5,
        maxHeight: 400,
    },
    rowOfImage: {
        zIndex: 1,
        flexDirection: "row",
    },

    closeIcon: {
        height: "100%",
        width: "100%",
    },
    closeIconContainer: {
        position: "absolute",
        height: 30,
        width: 30,
    },
});
