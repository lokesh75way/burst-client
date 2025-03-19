import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import Avatar from "./Circles/Avatar";
import EmptyAvatar from "./Circles/EmptyAvatar";
import useSocials from "../hooks/useSocials";

const { width: ScreenWidth } = Dimensions.get("window");

const MyViewer = ({ showRemoveIcon, setShowRemoveIcon }) => {
    const [circle10, setCircle10] = useState([]);
    const [circle100, setCircle100] = useState([]);
    const [circle1000, setCircle1000] = useState([]);
    //   const [showRemoveIcon, setShowRemoveIcon] = useState(false);
    const { getCircles } = useSocials();

    /**
     * Fetches circle data based on the provided number.
     * @async
     * @param {number} number - The circle number (10, 100, or 1000).
     * @returns {Promise<Array>} A Promise resolving to an array of circle members.
     */
    const fetchCircleData = async (number) => {
        if (number !== 10 && number !== 100 && number !== 1000) {
            console.error("wrong circle number");
        }
        try {
            const data = await getCircles(number);
            return data.members;
        } catch (error) {
            console.log("Error: ", error.toString());
        }
    };

    /**
     * Removes the avatar based on the specified level.
     * @async
     * @param {number} level - The level to remove the avatar from (10, 100, or others).
     * @returns {void}
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
     * Checks if the screen is currently focused.
     */
    const isFocused = useIsFocused();

    /**
     * Fetches circle data when the screen is focused.
     */
    useEffect(() => {
        // Only fetch data when the screen is in focus
        if (isFocused) {
            async function fetchData() {
                try {
                    const circle_10 = await fetchCircleData(10);
                    setCircle10(circle_10);
                    const circle_100 = await fetchCircleData(100);
                    setCircle100(circle_100);
                    const circle_1000 = await fetchCircleData(1000);
                    setCircle1000(circle_1000);
                } catch (error) {
                    // Handle the error
                    console.error("Error fetching circle data:", error);
                }
            }
            fetchData();
        }
    }, [isFocused]);

    // define a function for dividing an array into groups of 5 elements
    const chunkArray = (array, size) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += size) {
            const chunk = array.slice(i, i + size);
            chunkedArray.push(chunk);
        }
        return chunkedArray;
    };

    const renderAvatarRows = (list, level) => {
        // divide a list into subgroups of 5 Avatar
        let chunkedArray = [[]]; // Handle empty list
        if (list && list.length > 0) {
            chunkedArray = chunkArray(list, 5); // Handle empty list
        }

        // loop through each group and create Avatar
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

                    {/* if less than 5, use empty element for rest */}
                    {row.length < 5 &&
                        Array.from({ length: 5 - row.length }).map(
                            (_, index) => (
                                <EmptyAvatar key={index} level={level} />
                            ),
                        )}
                </View>
            ))
            .concat(
                // if the last item of chunkedArray is exactly a multiple of 5, need to add another row <View style={styles.profileContainer} key={rowIndex}></View>
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

    return (
        <View style={styles.container}>
            <Text style={styles.groupNumber}>10x</Text>
            {renderAvatarRows(circle10, 10)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        marginTop: 10,
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
        borderBottomColor: "#cccccc",
        borderBottomWidth: 1,
    },
    groupNumber: {
        fontSize: 20,
    },
});

export default MyViewer;
