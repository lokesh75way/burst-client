import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { avatarPrefix, defaultAvatar } from "../../config/constants";
import useUsers from "../../hooks/useUsers";
import ImageContainer from "../FeedPost/ImageContainer";
import PostText from "../FeedPost/PostText";
import QuoteSVG from "../Svgs/QuoteSVG";
import ReactSVG from "../Svgs/ReactSVG";
import ReplySVG from "../Svgs/ReplySVG";

const PostSkeleton = (props) => {
    const { postText, userName, media } = props;
    const [avatarSource, setAvatarSource] = useState(defaultAvatar);
    const { me } = useUsers();

    const fetchData = async () => {
        try {
            const data = await me();
            if (data.profileImageKey) {
                setAvatarSource(data.profileImageKey);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.ertContainer}>
            <View style={styles.replyHeader}>
                <Text style={styles.ertText}>Your Team</Text>
            </View>
            <View style={styles.singleContainer}>
                <View style={styles.infoContainer}>
                    <View
                        activeOpacity={1}
                        style={[styles.user, { width: 48, height: 48 }]}
                    >
                        <Image
                            height={48}
                            width={48}
                            source={{
                                uri: avatarPrefix + avatarSource,
                            }}
                            style={[styles.profileImage, styles.ertCircle]}
                        />
                    </View>
                    <View style={styles.authorInfo}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.userName}>{userName}</Text>
                            <Text style={styles.lightText}>a few seconds</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.postContainer]}>
                    <PostText text={postText} textStyles={styles.text} />
                    <ImageContainer media={media} />
                    <View style={styles.plusIcon}>
                        <ReactSVG />
                    </View>

                    <View style={styles.actions}>
                        <ReplySVG />
                        <QuoteSVG />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PostSkeleton;

const styles = StyleSheet.create({
    singleContainer: {
        alignItems: "flex-start",
        gap: 8,
        paddingTop: 14,
        paddingHorizontal: 15,
    },
    ertContainer: {
        backgroundColor: "#E2F4E1",
        width: "100%",
    },
    postContainer: {
        width: "85%",
        marginLeft: 58,
        marginTop: -40,
    },
    authorInfo: {
        flexDirection: "column",
    },
    userName: {
        color: "#141619",
        fontSize: 13,
        fontWeight: "bold",
    },
    lightText: {
        color: "#687684",
        fontSize: 13,
        marginLeft: 8,
    },
    text: {
        color: "#141619",
        fontSize: 13,
    },
    replyHeader: {
        borderLeftColor: "#CED5DC",
        borderLeftWidth: 2,
        backgroundColor: "#66C32E",
        paddingVertical: 8,
        marginBottom: 2,
    },
    ertText: {
        textAlign: "center",
        fontSize: 12,
        color: "#fff",
        fontWeight: "bold",
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "felx-start",
        gap: 8,
    },
    plusIcon: {
        height: 32,
        width: 44,
        backgroundColor: "#E7E7E7",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
    },
    actions: {
        flexDirection: "row",
        width: "50%",
        justifyContent: "space-between",
        marginVertical: 13,
    },
    user: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileImage: {
        width: "100%",
        height: "100%",
        borderRadius: 24,
    },
    ertCircle: {
        borderWidth: 2,
        borderColor: "#66C32E",
    },
});
