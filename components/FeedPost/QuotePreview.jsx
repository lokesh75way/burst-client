import dayjs from "dayjs";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ImageView from "react-native-image-viewing";
import notPublicImage from "../../assets/notPublic.png";
import { picturePrefix } from "../../config/constants";
import { getImageUrl } from "../../helpers/commonFunction";
import AuthorImage from "./AuthorImage";
import ImageContainer from "./ImageContainer";
import PostText from "./PostText";

const QuotePreview = ({ post, onPress, type, parentERT }) => {
    const { author, text, createdAt, isERT, media = [] } = post;
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
    const images = media.map((item) => ({
        uri: picturePrefix + item.key,
    }));

    const postDate = dayjs(createdAt).format("DD/MM/YYYY");
    const containerStyles = [
        isERT ? styles.maskedPreview : styles.postPreview,
        !parentERT && { backgroundColor: "#fff" },
    ];
    const isModal = type === "modal";
    const isItemOrModal = type == "modal" || type == "item";
    const lines = isItemOrModal ? 3 : 8;

    if (post.isDeleted) {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.contentText}>This post is unavailable</Text>
            </View>
        );
    }
    const imageUrl = getImageUrl(author?.profileImageKey);
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            disabled={isERT || type == "modal"}
            style={containerStyles}
        >
            {!isERT && (
                <View>
                    <View style={styles.header}>
                        <AuthorImage size={24} imageUrl={imageUrl} disabled />
                        <Text style={styles.userName}>{author?.userName}</Text>
                        <Text style={styles.dateText}>{postDate}</Text>
                    </View>
                    <PostText
                        text={text}
                        isModal={isItemOrModal}
                        textStyles={styles.contentText}
                        taggedUsers={post.tagedUsers}
                    />
                    {!isModal && (
                        <ImageContainer
                            media={media}
                            setSelectedImageIndex={setSelectedImageIndex}
                            setImagePreviewVisible={setImagePreviewVisible}
                        />
                    )}
                </View>
            )}
            {isERT && (
                <View style={styles.wrapper}>
                    <View style={styles.mask} />
                    <View style={styles.infoContainer}>
                        <Image source={notPublicImage} style={styles.image} />
                        <Text style={styles.text}>
                            This post is not yet public. Please check back later
                            as it may become visible.
                        </Text>
                    </View>
                </View>
            )}
            <ImageView
                images={images}
                imageIndex={selectedImageIndex}
                visible={imagePreviewVisible}
                onRequestClose={() => setImagePreviewVisible(false)}
            />
        </TouchableOpacity>
    );
};

export default QuotePreview;

const styles = StyleSheet.create({
    postPreview: {
        borderWidth: 1,
        borderColor: "#CED5DC",
        borderRadius: 10,
        padding: 8,
        marginVertical: 5,
        width: "100%",
    },
    header: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
    },
    emptyView: {
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#CED5DC",
        borderRadius: 10,
        padding: 8,
        marginVertical: 5,
        width: "100%",
        paddingVertical: 10,
    },
    contentText: {
        color: "#141619",
        fontSize: 13,
    },
    userName: {
        color: "#141619",
        fontSize: 16,
        fontWeight: "bold",
    },
    dateText: {
        color: "#687684",
        fontSize: 16,
    },
    authorImage: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    maskedPreview: {
        borderColor: "#66C32E",
        borderWidth: 1,
        borderRadius: 10,
        marginVertical: 5,
        width: "100%",
        height: 240,
        backgroundColor: "#66C32E",
        position: "relative",
    },
    mask: {
        backgroundColor: "#BCBCBB",
        width: "100%",
        height: 240,
        borderRadius: 10,
        opacity: 0.8,
    },
    text: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "600",
        textAlign: "center",
        paddingHorizontal: 20,
        margin: "auto",
    },
    infoContainer: {
        position: "absolute",
        top: "30%",
        alignItems: "center",
        gap: 20,
    },
    image: {
        width: 35,
        height: 35,
    },
    wrapper: {
        alignItems: "center",
    },
});
