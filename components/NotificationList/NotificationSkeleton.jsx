import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "react-native-skeletons";
const NotificationSkeleton = () => {
    return (
        <View style={styles.item}>
            <Skeleton
                width={55}
                height={55}
                borderRadius={30}
                style={styles.mediaSkeleton}
            />
            <View style={styles.postContent}>
                <Skeleton width="90%" height={16} borderRadius={4} />
                <Skeleton
                    width="35%"
                    height={16}
                    borderRadius={4}
                    style={styles.marginTop}
                />
                <Skeleton
                    width="70%"
                    height={14}
                    borderRadius={4}
                    style={styles.marginTop}
                />
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        borderRadius: 8,
        alignItems: "flex-start",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#CED5DC",
        paddingVertical: 16,
        paddingHorizontal: 10,
        gap: 20,
    },

    mediaSkeleton: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: "#cccccc40",
    },
    postContent: {
        flex: 1,
        paddingRight: 10,
        justifyContent: "center",
    },
    marginTop: {
        marginTop: 6,
    },
});
export default NotificationSkeleton;
