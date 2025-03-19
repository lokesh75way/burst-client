import React, { useEffect, useRef, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import theme from "../../config/theme";
import useInvitation from "../../hooks/useInvitation";
import useUsers from "../../hooks/useUsers";
import Button from "../Button";
import ImageHolder from "./ImageHolder";

const PostInput = ({
    postText,
    setPostText,
    onCancel,
    next,
    disabled,
    images,
    setImages,
    loading,
    mentions,
    setMentions,
}) => {
    const [textHeight, setTextHeight] = useState(0);
    const [scrollHeight, setScrollHeight] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const { getYourTeam } = useInvitation();
    const scrollRef = useRef();
    const inputRef = useRef();
    const { getAllUsers } = useUsers();

    const scrollToEnd = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    };

    const removeImage = (image) => {
        const updatedImages = images.filter((i) => i !== image);
        setImages(updatedImages);
    };

    const getUsers = async () => {
        const data = await getAllUsers();
        setAllUsers(data);
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleInputChange = (input) => {
        setPostText(input);

        const lastChar = input[input.length - 1];

        if (lastChar === "@") {
            setShowSuggestions(true);
            setSuggestedUsers(allUsers.slice(0, 3)); // Show first 3 users by default
        } else if (showSuggestions && lastChar !== " ") {
            // Keep showing suggestions if input is not empty and not a space
            const lastAtIndex = input.lastIndexOf("@");
            const textAfterAt = input.slice(lastAtIndex + 1).trim();
            if (textAfterAt) {
                setSuggestedUsers(
                    allUsers
                        .filter((user) =>
                            user.userName
                                .toLowerCase()
                                .includes(textAfterAt.toLowerCase()),
                        )
                        .slice(0, 3),
                );
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }

        scrollToEnd();
    };

    const handleMentionSelect = (username, user) => {
        const textBeforeAt = postText.slice(0, postText.lastIndexOf("@"));
        setPostText(`${textBeforeAt}@${username} `);
        setShowSuggestions(false);

        // Update the mentions state with the selected user
        if (!mentions.find((mention) => mention.id === user.id)) {
            setMentions([...mentions, user]);
        }
    };
    const handleOutsideClick = () => {
        inputRef.current?.focus();
    };

    return (
        <TouchableOpacity
            style={styles.postInput}
            onPress={handleOutsideClick}
            activeOpacity={1}
            accessible={false}
        >
            <View style={styles.btnContainer}>
                <View style={styles.btn}>
                    <Button
                        label="Cancel"
                        variant="outlined"
                        outlinedColor="#268EC8"
                        color="#268EC8"
                        onPress={onCancel}
                        disabled={loading}
                    />
                </View>
                <View style={styles.btn}>
                    <Button
                        label="Post"
                        bgColor="#268EC8"
                        onPress={next}
                        outlinedColor="#268EC8"
                        disabled={disabled}
                    />
                </View>
            </View>

            <View style={styles.wrapper}>
                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    style={styles.scroll}
                    onLayout={(e) => {
                        setScrollHeight(e.nativeEvent.layout.height);
                    }}
                    scrollEnabled={textHeight > scrollHeight}
                >
                    <TextInput
                        ref={inputRef}
                        style={styles.inputField}
                        onLayout={(e) => {
                            setTextHeight(e.nativeEvent.layout.height);
                        }}
                        placeholder="What's on your mind?"
                        placeholderTextColor="#666666"
                        multiline
                        value={postText}
                        onChangeText={handleInputChange}
                    />
                </ScrollView>
                {showSuggestions && (
                    <FlatList
                        data={suggestedUsers}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    handleMentionSelect(item.userName, item)
                                }
                            >
                                <Text
                                    style={{
                                        padding: 10,
                                        color: theme.colors.lightBlue,
                                    }}
                                >
                                    {item.userName}
                                </Text>
                            </TouchableOpacity>
                        )}
                        style={styles.suggestionsList}
                    />
                )}
                {images.length > 0 && (
                    <View
                        style={{
                            height: "50%",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ImageHolder
                            images={images}
                            removeImage={removeImage}
                        />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default PostInput;
const styles = StyleSheet.create({
    postInput: {
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#00000050",
        height: "95%",
        alignItems: "center",
        marginTop: 10,
        overflow: "hidden",
    },
    btnContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    btn: {
        width: "25%",
    },
    wrapper: {
        width: "100%",
        alignItems: "center",
        flex: 1,
        paddingBottom: 8,
    },
    scroll: {
        width: "95%",
        marginBottom: 10,
        flexGrow: 1,
    },
    inputField: {
        fontSize: 20,
        maxHeight: 300,
        color: "#666666",
        textAlignVertical: "top",
        textAlign: "left",
        width: "100%",
        padding: 10,
    },
    suggestionsList: {
        maxHeight: 100,
        backgroundColor: "#fff",
        width: "90%",
        position: "absolute",
        top: 50,
        zIndex: 1,
    },
});
