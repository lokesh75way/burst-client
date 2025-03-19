import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "react-native-skeletons";

const ChannelItemSkeleton = () => {
    const avatars = useMemo(
        () =>
            [...Array(3)].map((_, index) => (
                <Skeleton
                    key={index}
                    width={30}
                    height={30}
                    borderRadius={15}
                />
            )),
        [],
    );

    const rightSectionSkeletons = useMemo(
        () =>
            [...Array(2)].map((_, index) => (
                <Skeleton
                    key={index}
                    height={40}
                    width="60%"
                    borderRadius={30}
                />
            )),
        [],
    );

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Skeleton width="80%" height={20} />
                <Skeleton width="60%" height={16} />
                <View style={styles.avatars}>{avatars}</View>
            </View>
            <View style={styles.rightSection}>{rightSectionSkeletons}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    leftSection: {
        flex: 1,
        gap: 10,
    },
    avatars: {
        flexDirection: "row",
    },
    rightSection: {
        flex: 1,
        gap: 10,
        alignItems: "flex-end",
    },
});

export default ChannelItemSkeleton;
