import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import PostItem from "../MyPostList/PostItem";

/**
 * Renders a list of posts belonging to a user.
 *
 * @param {object} props - Component props.
 * @param {array} props.postList - List of posts to display.
 * @param {function} props.setPostList - Function to update the post list.
 * @returns {JSX.Element} - Rendered list of posts.
 */
const UsersPostList = (props) => {
    const { postList, setPostList, refreshing, handleRefresh } = props;
    const { userJoinedChannels } = useApp();
    const [myChannels, setMyChannels] = useState([]);
    const getUserChannels = async () => {
        setMyChannels(userJoinedChannels);
    };
    useEffect(() => {
        const fetchChannels = async () => {
            await getUserChannels();
        };
        fetchChannels();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={postList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostItem
                        item={item}
                        setPostList={setPostList}
                        showActions={false}
                        myChannels={myChannels}
                    />
                )}
                style={{ marginBottom: "10%" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
                ListEmptyComponent={
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "500",
                            color: theme.colors.grey,
                            marginVertical: 20,
                            textAlign: "center",
                        }}
                    >
                        No visible posts available.
                    </Text>
                }
            />
        </View>
    );
};

export default UsersPostList;
