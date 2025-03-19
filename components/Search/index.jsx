import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import styles, { container, textInput } from "./index.style";
import useSocials from "../../hooks/useSocials";

const { width: ScreenWidth } = Dimensions.get("window");

function SearchBar(props) {
    /**
     * Props for a custom search component.
     * @typedef {Object} SearchProps
     * @property {number} width - The width of the search component.
     * @property {number} height - The height of the search component.
     * @property {number} borderWidth - The width of the border around the search component.
     * @property {string} borderColor - The color of the border around the search component.
     * @property {string} placeholder - The placeholder text for the search input.
     * @property {string} closeImageSource - The source of the close image icon.
     * @property {string} backgroundColor - The background color of the search component.
     * @property {boolean} buttonsDisable - Indicates whether the buttons should be disabled.
     * @property {string} leftImageButtonSource - The source of the left image button.
     * @property {function} onPressLeftImageButton - The callback function for the left image button press event.
     * @property {function} onChangeText - The callback function for text change in the search input.
     * @property {function} setSearchedUser - The function to set the searched user.
     * @property {boolean} searchInFollowers - Indicates whether to search in followers.
     * @property {function} onCancel - The callback function for the cancel action.
     */
    const {
        width,
        height,
        borderWidth,
        borderColor,
        placeholder,
        closeImageSource,
        backgroundColor,
        buttonsDisable,
        leftImageButtonSource,
        onPressLeftImageButton,
        onChangeText,
        setSearchedUser,
        searchInFollowers,
        searchInFollowing,
        onCancel,
    } = props;

    const animation = new Animated.Value(0);
    const [visibleCloseButton, setVisibleCloseButton] = useState(true);
    const [searchText, setSearchText] = useState("");
    const textInputRef = useRef();
    const { searchSocialUser, searchSocialFollower, searchSocialFollowing } =
        useSocials();

    /**
     * Handles the change in the search text.
     * @param {string} text - The text entered in the search input.
     */
    const handleTextChange = (text) => {
        setSearchText(text);
        onChangeText?.(text);
    };

    /**
     * Searches for users in all users' list based on the entered text.
     * @returns {Promise<Object>} The search result data.
     */
    const searchInAllUsers = async () => {
        try {
            const data = await searchSocialUser(searchText);
            setSearchedUser?.(data);
            // textInputRef.current.clear();
            return data;
        } catch (error) {
            // 处理网络请求异常
            console.log("Error: ", error.toString());
        }
    };

    /**
     * Searches for users in the followers list based on the entered text.
     * @returns {Promise<Object>} The search result data.
     */
    const searchInFollowersList = async () => {
        try {
            const data = await searchSocialFollower(searchText);
            setSearchedUser?.(data.followers);
            return data;
        } catch (error) {
            // 处理网络请求异常
            console.log("Error: ", error.toString());
        }
    };

    const searchInFollowingList = async () => {
        try {
            const data = await searchSocialFollowing(searchText);
            setSearchedUser?.(data.followings);
            return data;
        } catch (error) {
            // 处理网络请求异常
            console.log("Error: ", error.toString());
        }
    };

    /**
     * Handles the action of sending the search query to the appropriate search function.
     * Determines whether to search in followers or all users and initiates the search action.
     */
    const handleSend = async () => {
        const action = searchInFollowing
            ? searchInFollowingList
            : searchInFollowers
              ? searchInFollowersList
              : searchInAllUsers;
        action();
    };
    /**
     * Initiates the start of an animation.
     */
    const startAnimation = () => {
        setVisibleCloseButton(true);
    };

    /**
     * Ends the ongoing animation and clears the search input.
     * Triggers cancellation actions if defined.
     */
    const endAnimation = () => {
        setSearchText("");
        setVisibleCloseButton(false);
        onCancel?.();
    };

    useEffect(() => {
        if (searchText?.length === 0) {
            handleSend();
        }
    }, [searchText]);

    return (
        <TouchableWithoutFeedback onPress={startAnimation}>
            <View
                style={container(
                    height,
                    width,
                    borderWidth,
                    borderColor,
                    backgroundColor,
                )}
            >
                <Animated.View
                    style={{
                        width: 25,
                        marginLeft: 8,
                        top: 10,
                        left: width / 2.3,
                        zIndex: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        transform: [{ translateX: animation }],
                    }}
                >
                    <View style={{ width: 25, height: 25 }} />
                </Animated.View>
                {visibleCloseButton && (
                    <View
                        style={{
                            bottom: 26,
                            height,
                            alignItems: "center",
                        }}
                    >
                        <TextInput
                            // ref={textInputRef}
                            value={searchText}
                            placeholder={placeholder}
                            onSubmitEditing={handleSend}
                            onChangeText={handleTextChange}
                            style={textInput(height, width)}
                            autoCorrect={false}
                            autoCapitalize="none"
                        />
                        <View
                            style={{
                                bottom: 32,
                                marginLeft: "auto",
                                marginRight: 5,
                            }}
                        >
                            <TouchableWithoutFeedback onPress={endAnimation}>
                                <Image
                                    source={closeImageSource}
                                    style={styles.imageStyle}
                                />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                )}
                {!visibleCloseButton && !buttonsDisable && (
                    <View
                        style={{
                            bottom: 26,
                            height,
                            flexDirection: "row",
                            zIndex: 1,
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                marginRight: "auto",
                                marginLeft: 10,
                            }}
                        >
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    onPressLeftImageButton &&
                                        onPressLeftImageButton();
                                }}
                            >
                                <Image
                                    source={leftImageButtonSource}
                                    style={styles.leftAndRightimageStyle}
                                />
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{ marginLeft: "auto", marginRight: 5 }} />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default SearchBar;

SearchBar.propTypes = {
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    borderWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

SearchBar.defaultProps = {
    width: ScreenWidth * 0.9,
    height: 50,
    borderWidth: 1,
    placeholder: "Search new friends..",
    searchInFollowers: false,
    borderColor: "black",
    backgroundColor: "transparent",
    searchImageSource: require("../../assets/searchBar/searchblue.png"),
    closeImageSource: require("../../assets/searchBar/close.png"),
    leftImageButtonSource: require("../../assets/searchBar/searchblue.png"),
    rightImageButtonSource: require("../../assets/searchBar/graph.png"),
};
