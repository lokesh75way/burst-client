import React, { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

import Picker from "./Picker";
import theme from "../../config/theme";
import { getCompressSize, resizeImage } from "../../helpers/commonFunction";
import useUsers from "../../hooks/useUsers";
import { uploadImageToS3 } from "../../services/s3";
import Button from "../Button";

const PostBackground = ({ back, setDefaultBgs, setPostStage }) => {
    const { uploadDefaultBg } = useUsers();
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [bgImages, setBgImages] = useState([]);

    const uploadDefaultBackground = async () => {
        setImageLoading(true);
        const asset = bgImages[bgImages.length - 1];
        const minSize = 1000000;
        let resizedResult = asset;
        if (asset.type === "image" && asset.fileSize > minSize) {
            const compress = getCompressSize(asset.fileSize);
            resizedResult = await resizeImage(asset.uri, compress);
        }
        await fetchKey(resizedResult);
    };

    const fetchKey = async (image) => {
        try {
            const data = await uploadImageToS3(image);
            const { url = "", key = "" } = data || { url: "", key: "" };
            const background = await uploadDefaultBg(key);
            setDefaultBgs((bgs) => [
                ...bgs,
                {
                    image: bgImages[bgImages.length - 1],
                    key,
                    id: background.id,
                },
            ]);
            back();
            setImageLoading(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            <View style={styles.postBackground}>
                <View style={styles.btnContainer}>
                    <View style={styles.btn}>
                        <Button
                            label="Cancel"
                            variant="outlined"
                            outlinedColor="#268EC8"
                            color="#268EC8"
                            bgColor={theme.colors.white}
                            onPress={back}
                        />
                    </View>
                    <View style={styles.btn}>
                        <Button
                            label="Done"
                            bgColor="#268EC8"
                            outlinedColor="#268EC8"
                            onPress={uploadDefaultBackground}
                            disabled={imageLoading}
                        />
                    </View>
                </View>

                {bgImages.length > 0 && !imageLoading && (
                    <Image
                        source={{ uri: bgImages[bgImages.length - 1].uri }}
                        style={styles.image}
                    />
                )}
                {imageLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="skyblue" />
                        <Text style={styles.uploadText}>
                            Uploading background...
                        </Text>
                    </View>
                )}
            </View>
            <Picker
                images={bgImages}
                openByDefault
                setLoading={setLoading}
                setPostStage={setPostStage}
                setImages={setBgImages}
            />
        </>
    );
};

export default PostBackground;

const styles = StyleSheet.create({
    postBackground: {
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#00000050",
        alignItems: "center",
        marginTop: 10,
        height: "50%",
        marginHorizontal: 20,
    },
    btnContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 10,
        position: "absolute",
        zIndex: 1,
    },
    btn: {
        width: "25%",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 16,
        zIndex: 0,
    },
    pickContainer: {
        marginVertical: 20,
        marginLeft: 20,
    },
    loadingContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
    },
    uploadText: {
        fontSize: 16,
        color: theme.colors.primary,
    },
});
