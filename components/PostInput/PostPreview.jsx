import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

import ImageGallery from "./ImageGallery";
import PostSkeleton from "./PostSkeleton";
import theme from "../../config/theme";
import usePosts from "../../hooks/usePosts";
import useUsers from "../../hooks/useUsers";
import { uploadImageToS3 } from "../../services/s3";
import Button from "../Button";
const PostPreview = ({
    back,
    images,
    setImages,
    defaultBgs,
    postText,
    goToHome,
    currentIndex,
}) => {
    const { addPost } = usePosts();
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const data = [...images, ...defaultBgs, { type: "icon" }];
    const { me } = useUsers();

    const fetchData = async () => {
        try {
            const data = await me();
            setUserName(data.userName);
        } catch (error) {
            console.log("Error: ", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const sendPost = async () => {
        setLoading(true);
        const imageKeys = [];
        try {
            if (currentIndex < images.length) {
                // user's selected images
                for (const image of images) {
                    const key = await fetchKey(image);
                    imageKeys.push(key);
                }
            } else if (currentIndex >= images.length) {
                // default background selected
                const defaultIndex = currentIndex - images.length;
                const itemKey = defaultBgs[defaultIndex].key;
                if (itemKey) {
                    imageKeys.push(itemKey);
                }
            }
            const data = JSON.stringify({
                text: postText.trim(),
                mediaKeys: imageKeys,
            });
            const resp = await addPost(data);
            if (resp && resp.success === false) {
                Alert.alert(resp.message);
                return;
            }
            goToHome();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchKey = async (image) => {
        try {
            const data = await uploadImageToS3(image);
            const { url = "", key = "" } = data || { url: "", key: "" };
            return key;
        } catch (error) {
            console.log(error.message);
        }
    };

    const postDisbaled = loading || currentIndex == data.length - 1;

    return (
        <>
            <View style={styles.btnContainer}>
                <View style={styles.btn}>
                    <Button
                        label="Back"
                        variant="outlined"
                        outlinedColor="#268EC8"
                        color="#268EC8"
                        onPress={back}
                        disabled={loading}
                    />
                </View>
                <View style={styles.btn}>
                    <Button
                        label="Post"
                        bgColor="#268EC8"
                        onPress={sendPost}
                        outlinedColor="#268EC8"
                        disabled={postDisbaled}
                    />
                </View>
            </View>

            {loading ? (
                <>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="skyblue" />
                        <Text style={styles.uploadText}>Uploading...</Text>
                    </View>
                    {currentIndex < images.length && (
                        <View style={styles.galleryContainer}>
                            <ImageGallery
                                images={images}
                                setImages={setImages}
                                blurred
                            />
                        </View>
                    )}
                </>
            ) : (
                <>
                    <View style={styles.content}>
                        <PostSkeleton
                            postText={postText}
                            userName={userName}
                            media={images}
                        />
                    </View>
                </>
            )}
        </>
    );
};

export default PostPreview;

const styles = StyleSheet.create({
    swiper: {
        height: "100%",
        borderRightWidth: 2,
        borderRightColor: "#00000005",
    },
    btnContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        height: "auto",
    },
    btn: {
        width: "25%",
    },
    postSwiper: {
        flex: 1,
    },
    plusIcon: {
        width: 70,
        height: 70,
        borderRadius: 40,
        borderColor: theme.colors.lightBlue,
        borderWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    addBtn: {
        width: "60%",
        marginTop: 20,
    },
    removeBtn: {
        width: "60%",
        marginTop: 10,
    },
    defaultBtn: {
        width: "60%",
        marginTop: 20,
    },
    emptyBtn: {
        height: 42,
        marginTop: 20,
    },
    plusContainer: {
        height: "75%",
        width: "73%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
    },
    galleryContainer: {
        height: "45%",
        position: "absolute",
        bottom: 10,
    },
    loadingContainer: {
        height: "30%",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    uploadText: {
        fontSize: 16,
        color: theme.colors.primary,
    },
    pagingDots: {
        flexDirection: "row",
        justifyContent: "center",
        width: 100,
        alignSelf: "center",
        gap: 8,
        position: "absolute",
        bottom: "3%",
    },
    defaultImage: {
        marginTop: 52,
    },
});
