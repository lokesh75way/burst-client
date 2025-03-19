import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

import useApp from "../../hooks/useApp";
import PostItem from "./PostItem";

/**
 * Component for rendering a list of posts.
 * @param {object} props - The properties passed to the MyPostList component.
 * @param {Array} props.postList - The list of posts to render.
 * @param {Function} props.setPostList - Function to set the post list.
 * @returns {JSX.Element} A View component containing a FlatList to display the posts.
 */

const MyPostList = (props) => {
    const { postList, setPostList, refreshing, handleRefresh } = props;
    const [myChannels, setMyChannels] = useState([]);
    const { userJoinedChannels } = useApp();
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
        <FlatList
            data={postList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
                return (
                    <PostItem
                        item={item}
                        setPostList={setPostList}
                        showActions
                        myChannels={myChannels}
                    />
                );
            }}
            showsVerticalScrollIndicator={false}
            style={{ marginBottom: "8%" }}
            refreshing={refreshing}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
            ListFooterComponent={<View style={{ marginBottom: 250 }} />}
        />
    );
};

export default MyPostList;
