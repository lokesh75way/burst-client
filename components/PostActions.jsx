import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

import { ApproveIcon, Comment, FilledApprove } from "./Svgs";

const { width } = Dimensions.get("window");
const rightValue = width * 0.05 - 10;

const PostActions = (props) => {
    const {
        counts,
        commentCount,
        userBursted,
        navigation,
        review,
        setIsScrollCardVisible,
        loadedSuccessfully,
    } = props;
    const [menuMargin, setMenuMargin] = useState({});
    const screenWidth = Dimensions.get("window").width;
    const [isBurst, setIsBurst] = useState(false);
    const [burstCount, setBurstCount] = useState(0);

    /**
     * Sets the menu's margin based on the window width.
     * @memberof MenuComponent
     * @function useEffect
     * @returns {void}
     */
    useEffect(() => {
        const windowWidth = screenWidth;
        const styleMenu = {
            marginLeft: (windowWidth - 240) / 8,
            marginRight: (windowWidth - 240) / 8,
        };
        setMenuMargin(styleMenu);
        setBurstCount(counts?.bursts);
    }, []);

    useEffect(() => {
        setIsBurst(userBursted);
    }, [userBursted]);

    /**
     * Handles the burst action if the user hasn't bursted yet, otherwise cancels the burst.
     * @memberof MenuComponent
     * @function handleBurst
     * @returns {void}
     */
    const handleBurst = () => {
        setIsBurst(!isBurst);
        setBurstCount(isBurst ? burstCount - 1 : burstCount + 1);
        review();
    };

    /**
     * Sets the scroll card visibility and initiates loading comments.
     * @memberof MenuComponent
     * @function viewChat
     * @returns {void}
     */
    const viewChat = () => {
        setIsScrollCardVisible(true);
    };

    /**
     * Formats the count number to abbreviate large numbers.
     * @memberof MenuComponent
     * @function formatCount
     * @param {number} count - The number to be formatted.
     * @returns {string | number} The formatted count as a string or the original count.
     */
    const formatCount = (count) => {
        if (count >= 1000000) {
            const formattedCount = (count / 1000000).toFixed(1); // 将大于等于1000000的数值除以100000并保留一位小数
            return formattedCount.replace(".0", "") + "M"; // 如果小数点后为0则不保留，添加 "M" 后缀
        } else if (count >= 1000) {
            const formattedCount = (count / 1000).toFixed(1); // 将大于等于1000的数值除以1000并保留一位小数
            return formattedCount.replace(".0", "") + "K"; // 如果小数点后为0则不保留，添加 "K" 后缀
        } else {
            return count; // 其他情况下直接显示数值
        }
    };

    /**
     * Navigates to the "Post" screen.
     * @memberof MenuComponent
     * @function goToPost
     * @returns {void}
     */
    const goToPost = () => {
        navigation.navigate("Post");
    };

    /**
     * Navigates to the "Profile" screen.
     * @memberof MenuComponent
     * @function goToProfile
     * @returns {void}
     */
    const goToProfile = () => {
        navigation.navigate("Profile");
    };

    return (
        <View style={styles.actions}>
            <TouchableOpacity onPress={handleBurst}>
                {isBurst ? (
                    <FilledApprove
                        fill="#687684"
                        width={32}
                        height={32}
                        stroke="#687684"
                    />
                ) : (
                    <ApproveIcon
                        fill="#687684"
                        width={32}
                        height={32}
                        stroke="#687684"
                    />
                )}
            </TouchableOpacity>
            <TouchableOpacity onPress={viewChat}>
                <Comment />
            </TouchableOpacity>
        </View>
    );
};

export default PostActions;

const styles = StyleSheet.create({
    icon: {
        height: 40,
        width: 60,
    },
    conBurst: {
        height: 43,
        width: 60,
    },

    container: {
        flexDirection: "column",
        gap: 8,
    },

    menu: {
        marginHorizontal: 0,
        width: 60,
        height: 50,
        alignSelf: "center",
    },
    count: {
        color: "black",
        fontSize: 12,
        letterSpacing: -0.1,
        alignSelf: "center",
        marginBottom: 2,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
});
