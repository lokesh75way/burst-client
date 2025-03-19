import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import PostSkeleton from "./PostSkeleton";

const FeedSkeleton = () => {
    return (
        <ScrollView style={styles.margin} showsVerticalScrollIndicator={false}>
            {Array.from({ length: 5 }).map((_, index) => (
                <PostSkeleton index={index} key={index} />
            ))}
        </ScrollView>
    );
};

export default FeedSkeleton;

const styles = StyleSheet.create({
    margin: { marginBottom: "10%" },
});
