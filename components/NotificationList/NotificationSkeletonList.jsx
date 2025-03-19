import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

import NotificationSkeleton from "./NotificationSkeleton";

const NotificationSkeletonList = () => {
    const skeletons = useMemo(
        () =>
            Array.from({ length: 10 }, (_, index) => (
                <NotificationSkeleton key={index} />
            )),
        [],
    );

    return (
        <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        >
            {skeletons}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingHorizontal: 10,
    },
});

export default NotificationSkeletonList;
