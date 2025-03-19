import { LinkPreview } from "@flyerhq/react-native-link-preview";
import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Skeleton } from "react-native-skeletons";

import TwitterPreview from "./TwitterPreview";

// TODO: remove before commit

const UrlPreview = ({ part }) => {
    const [contentHeight, setContentHeight] = useState(0);
    const navigation = useNavigation();
    const extractHostName = (url) => {
        if (!url) {
            return "";
        }
        const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/:]+)/i;
        const match = url.match(regex);
        return match ? match[1].replace(/^www\./, "") : match ? match[1] : null;
    };
    const layoutHeight = (e) => {
        setContentHeight(e.nativeEvent.layout.height);
    };
    const previewStyle = [
        styles.previewContainer,
        { maxHeight: 166 + contentHeight },
    ];

    const handleBurstShareUrl = (url) => {
        const postIdExist = url.match(/postId=(\d+)/);
        if (postIdExist) {
            const postId = postIdExist[1];

            navigation.push("PostDetailStack", {
                screen: "PostDetail",
                params: {
                    post: { id: postId },
                    isShared: true,
                },
            });
        }
    };

    if (part.includes("x.com") || part.includes("twitter.com")) {
        return <TwitterPreview part={part} />;
    }
    return (
        <LinkPreview
            text={part}
            renderLinkPreview={({ previewData }) => {
                const isBurstShare = part.includes(
                    "stanfordhci.github.io/burst-share",
                );

                const hasImage = !!previewData?.image?.url;
                const hasDescription = !!previewData?.description;

                return (
                    <TouchableOpacity
                        style={previewStyle}
                        activeOpacity={0.8}
                        onPress={() =>
                            isBurstShare
                                ? handleBurstShareUrl(part)
                                : Linking.openURL(part)
                        }
                    >
                        {hasImage ? (
                            <Image
                                source={{ uri: previewData.image.url }}
                                resizeMode="cover"
                                style={styles.previewImage}
                            />
                        ) : (
                            <Skeleton height={0} />
                        )}

                        <View
                            style={styles.textContainer}
                            onLayout={layoutHeight}
                        >
                            <Text style={styles.domain}>
                                {extractHostName(previewData?.link)}
                            </Text>
                            <Text numberOfLines={3} style={styles.header}>
                                {previewData?.title}
                            </Text>
                            <Text
                                numberOfLines={3}
                                ellipsizeMode="tail"
                                style={styles.description}
                            >
                                {hasDescription
                                    ? previewData.description
                                    : part}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
};

export default UrlPreview;

const styles = StyleSheet.create({
    textContainer: {
        padding: 8,
    },
    previewContainer: {
        borderRadius: 10,
        // marginTop: 10,
        borderWidth: 0.5,
        borderColor: "#CED5DC",
        backgroundColor: "#fff",
    },
    header: {
        fontWeight: "600",
        fontSize: 15,
        color: "#000",
        lineHeight: 18,
    },
    description: {
        color: "#141619",
        fontSize: 14,
    },
    previewImage: {
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        maxHeight: 166,
    },
    skeletonImage: {
        width: "100%",
        height: 100,
        backgroundColor: "#E1E1E1",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    domain: {
        color: "#687684",
        lineHeight: 24,
    },
});
