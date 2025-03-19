import { useNavigation } from "@react-navigation/core";
import React, { useRef, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import PostSkeleton from "../components/FeedSkeleton/PostSkeleton";
import PostInput from "../components/PostInput";
import Picker from "../components/PostInput/Picker";
import SuggestedChannels from "../components/PostInput/SuggestedChannels";
import theme from "../config/theme";
import useApp from "../hooks/useApp";
import usePosts from "../hooks/usePosts";
import { uploadImageToS3 } from "../services/s3";

const PostScreen = () => {
    const { setActiveRoute } = useApp();
    const { addPost } = usePosts();
    const [postText, setPostText] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const [selectedChannelIds, setSelectedChannelIds] = useState([]);
    const [excludedChannelsIds, setExcludedChannelsIds] = useState([]);
    const [excluedNotJoined, setExcludeNotJoined] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const navigation = useNavigation();
    const pickerRef = useRef(null);
    const [mentions, setMentions] = useState([]);
    const { setReloadProfile } = useApp();
    const conatinerHeight =
        images.length <= 3 ? 350 : images.length <= 6 ? 550 : 750;

    const goToHome = (reloadFeedCheck) => {
        setIsCanceled(true);
        setShowPicker(false);
        setImages([]);
        setMentions([]);
        setPostText("");
        setActiveRoute("Home");
        console.log("reloadFeedCheck=", reloadFeedCheck);
        setReloadProfile(reloadFeedCheck);
        navigation.navigate("Home", {
            scrollToTop: true,
            reloadFeed: reloadFeedCheck,
        });
    };

    const sendPost = async () => {
        setLoading(true);
        const imageKeys = [];
        try {
            const compressedImages =
                await pickerRef.current.compressAllImages();
            setImages(compressedImages);

            for (const image of compressedImages) {
                const key = await fetchKey(image);
                imageKeys.push(key);
            }

            const data = JSON.stringify({
                text: postText.trim(),
                mediaKeys: imageKeys,
                suggestedChannels: selectedChannelIds,
                excludedChannels: excludedChannelsIds,
                isExcludedUnjoinedChannels: excluedNotJoined,
                tagedUsers: mentions.map((user) => user.id),
            });
            const resp = await addPost(data);
            if (resp && resp.success === false) {
                Alert.alert(resp.message);
                return;
            }
            setSelectedChannelIds([]);
            setMentions([]);
            goToHome(true);
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

    const postDisbaled = !(postText.trim().length || images.length);

    return (
        <SafeAreaView style={styles.container}>
            {loading && (
                <View
                    style={styles.loadingContainer}
                    onLayout={(e) => {
                        setContainerWidth(e.nativeEvent.layout.width);
                    }}
                >
                    <PostSkeleton width={containerWidth / 1.5} />
                    <Text style={styles.uploadText}>Uploading post...</Text>
                </View>
            )}

            {!loading && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    // scrollEnabled={showPicker}
                >
                    <View
                        style={{
                            ...styles.postContainer,
                            height: conatinerHeight,
                            maxHeight: conatinerHeight,
                        }}
                    >
                        <PostInput
                            postText={postText}
                            setPostText={setPostText}
                            next={sendPost}
                            onCancel={() => goToHome(false)}
                            disabled={postDisbaled}
                            images={images}
                            setImages={setImages}
                            loading={loading}
                            mentions={mentions}
                            setMentions={setMentions}
                        />
                    </View>
                    <SuggestedChannels
                        onChannelsSelected={(
                            suggestedIds,
                            excludedIds,
                            excludeNotJoined,
                        ) => {
                            setSelectedChannelIds(suggestedIds);
                            setExcludedChannelsIds(excludedIds);
                            setExcludeNotJoined(excludeNotJoined);
                        }}
                        isCanceled={isCanceled}
                        resetCancel={() => setIsCanceled(false)}
                    />
                    <Picker
                        ref={pickerRef}
                        images={images}
                        setImages={setImages}
                        showPicker={showPicker}
                        setShowPicker={setShowPicker}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default PostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    postContainer: {
        marginHorizontal: 20,
    },
    galleryContainer: {
        height: "50%",
    },
    loadingContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    uploadText: {
        fontSize: 16,
        color: theme.colors.primary,
    },
    actions: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20,
    },
    action: {
        marginLeft: 18,
    },
});
