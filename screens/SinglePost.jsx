import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import PostCard from "../components/PostCard";
import useApp from "../hooks/useApp";

const SinglePost = ({ route }) => {
    const { item, isNotification, notificationType } = route.params ?? {};
    const { storage } = useApp();
    return (
        <SafeAreaView style={styles.container}>
            {item && (
                <PostCard
                    type="singlePost"
                    content={[item]}
                    notificationType={notificationType}
                    currentPostId={isNotification ? item?.post?.id : item.id}
                    userId={storage.id}
                    postIndex={0}
                />
            )}
        </SafeAreaView>
    );
};

export default SinglePost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        backgroundColor: "#fff",
    },
    viewContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 20,
    },
    boundary: {
        paddingHorizontal: 13,
        paddingVertical: 13,
        backgroundColor: "white",
    },
    boundaryCover: {
        paddingBottom: "2.6%",
    },
    buttonText: {
        fontSize: 30,
        lineHeight: 23,
        height: 32,
        width: 33,
        marginLeft: 10,
        // fontFamily: 'Helvetica',
        color: "skyblue",
        marginRight: "35%",
        textAlign: "center",
        textAlignVertical: "center",
        borderWidth: 3,
        borderColor: "white",
        paddingTop: 6,
        borderRadius: 10,
        fontWeight: "600",
    },
});
