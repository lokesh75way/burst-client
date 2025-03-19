import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "react-native-skeletons";

const PostSkeleton = ({ index = 0, width }) => {
    return (
        <View key={index} style={styles.container}>
            <View style={styles.row}>
                <Skeleton circle width={50} height={50} />
                <Skeleton height={20} style={styles.flex} />
            </View>

            <View style={[styles.text, width && { width }]}>
                <Skeleton count={3} width="100%" height={18} borderRadius={0} />
            </View>
        </View>
    );
};

export default PostSkeleton;
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        alignItems: "flex-end",
        marginVertical: 30,
    },
    row: {
        flexDirection: "row",
        gap: 8,
    },
    text: {
        width: "80%",
    },
    flex: {
        flex: 1,
    },
});
