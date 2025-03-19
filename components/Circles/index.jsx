import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import Avatar from "./Avatar";
import EmptyAvatar from "./EmptyAvatar";
import useSocials from "../../hooks/useSocials";

const { width: ScreenWidth } = Dimensions.get("window");

const Circles = () => {
    const [circle10, setCircle10] = useState([]);
    const [circle100, setCircle100] = useState([]);
    const [circle1000, setCircle1000] = useState([]);
    const [showRemoveIcon, setShowRemoveIcon] = useState(false);
    const { getCircles } = useSocials();
    const isFocused = useIsFocused();

    /**
     * Fetches circle data based on the given number.
     * @async
     * @function fetchCircleData
     * @param {number} number - The number to determine the circle data.
     * @returns {Promise<any>} Promise that resolves to circle members' data.
     */
    const fetchCircleData = async (number) => {
        try {
            const data = getCircles(number);
            return data.members;
        } catch (error) {
            console.log("Error: ", error.toString());
        }
    };

    /**
     * Removes the avatar based on the given level.
     * @async
     * @function removeAvatar
     * @param {number} level - The level to determine the avatar removal.
     * @returns {Promise<void>} Promise that resolves when the avatar is removed.
     */
    const removeAvatar = async (level) => {
        if (level === 10) {
            const circle_10 = await fetchCircleData(10);
            setCircle10(circle_10);
        } else if (level === 100) {
            const circle_100 = await fetchCircleData(100);
            setCircle100(circle_100);
        } else {
            const circle_1000 = await fetchCircleData(1000);
            setCircle1000(circle_1000);
        }
    };

    /**
     * Fetches data for circles 10, 100, and 1000.
     * @async
     * @function fetchData
     * @returns {Promise<void>} Promise that resolves when all circle data is fetched and set.
     */
    async function fetchData() {
        try {
            const circle_10 = await fetchCircleData(10);
            setCircle10(circle_10);

            const circle_100 = await fetchCircleData(100);
            setCircle100(circle_100);

            const circle_1000 = await fetchCircleData(1000);
            setCircle1000(circle_1000);
        } catch (error) {
            console.error("Error fetching circle data:", error);
        }
    }

    // function of spliting the array into subarrays of 5 elements each
    const chunkArray = (array, size) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            const chunk = array.slice(i, i + size);
            chunkedArray.push(chunk);
        }
        return chunkedArray;
    };

    const renderAvatarRows = (list, level) => {
        // split the list into subarrays of 5 Avatars
        let chunkedArray = [[]]; // Handle empty list
        if (list && list.length > 0) {
            chunkedArray = chunkArray(list, 5); // Handle empty list
        }

        // Iterate through each sub-array and render the Avatar
        return chunkedArray
            .map((row, rowIndex) => (
                <View style={styles.profileContainer} key={rowIndex}>
                    {row.map((item, columnIndex) => (
                        <Avatar
                            key={columnIndex}
                            avatarSource={item.profileImageKey}
                            displayName={item.userName}
                            userId={item.id}
                            level={level}
                            removeAvatar={removeAvatar}
                            showRemoveIcon={showRemoveIcon}
                            setShowRemoveIcon={setShowRemoveIcon}
                        />
                    ))}

                    {/* If the line contains less than 5 characters, fill it with empty item */}
                    {row.length < 5 &&
                        Array.from({ length: 5 - row.length }).map(
                            (_, index) => (
                                <EmptyAvatar key={index} level={level} />
                            ),
                        )}

                    {/* if there are exactly 5 elements, add one more row */}
                    {/* {row.length === 5 && (
                Array.from({ length: 5 }).map((_, index) => (
                <EmptyAvatar
                key={index}
                level={level}
                />
                ))
            )} */}
                </View>
            ))
            .concat(
                // If the last item of chunkedArray is exactly a multiple of 5, you need to add another line <View style={styles.profileContainer} key={rowIndex}></View>
                chunkedArray.length > 0 &&
                    chunkedArray[chunkedArray.length - 1].length === 5 ? (
                    <View
                        style={styles.profileContainer}
                        key={chunkedArray.length}
                    >
                        {Array.from({ length: 5 }).map((_, index) => (
                            <EmptyAvatar key={index} level={level} />
                        ))}
                    </View>
                ) : null,
            );
    };
    /**
     * Handles the removal of the remove icon.
     * @returns {void}
     */
    const handleRemoveIcon = () => {
        setShowRemoveIcon(false);
    };

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={handleRemoveIcon}>
                <View style={{ flex: 1 }}>
                    <ScrollView style={{ marginBottom: "8%" }}>
                        <View style={styles.container}>
                            <Text style={styles.groupNumber}>10x</Text>
                            {renderAvatarRows(circle10, 10)}
                            <View style={styles.separator} />
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.groupNumber}>100x</Text>
                            {renderAvatarRows(circle100, 100)}
                            <View style={styles.separator} />
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.groupNumber}>1000x</Text>
                            {renderAvatarRows(circle1000, 1000)}
                        </View>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        backgroundColor: "#F0F2F5",
    },
    userContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    profileContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    avatarContainer: {},
    avatar: {
        width: ScreenWidth * 0.12,
        height: ScreenWidth * 0.12,
        marginHorizontal: ScreenWidth * 0.0375,
        marginTop: ScreenWidth * 0.02,
        borderRadius: 75,
    },
    closeIconStyle: {
        left: ScreenWidth * 0.12,
    },
    separator: {
        marginBottom: 20,
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
    },
    groupNumber: {
        fontSize: 20,
        paddingHorizontal: "5%",
    },
});

export default Circles;
