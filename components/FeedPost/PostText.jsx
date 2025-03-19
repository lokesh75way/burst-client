import { useNavigation } from "@react-navigation/core";
import React from "react";
import { Text, View } from "react-native";

import { defaultAvatar } from "../../config/constants";
import theme from "../../config/theme";
import useApp from "../../hooks/useApp";
import useUsers from "../../hooks/useUsers";
import UrlPreview from "../UrlPreview";

const PostText = ({ text, textStyles, taggedUsers = [], isModal }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const { getProfile } = useUsers();
    const { setActiveRoute, userData } = useApp();
    const navigation = useNavigation();

    const extractMentionWords = (taggedUsers) => {
        const mentionWords = new Set();
        taggedUsers.forEach((user) => {
            const username = user.userName.trim();
            const words = username.split(" ");
            words.forEach((word, index) => {
                if (index === 0) {
                    mentionWords.add(`@${word}`);
                } else {
                    mentionWords.add(word);
                }
            });
        });
        return mentionWords;
    };

    const mentionWords = extractMentionWords(taggedUsers);

    const navigateToTaggedUser = async (user) => {
        if (user) {
            if (user.id === userData.id) {
                setActiveRoute("Profile");
                navigation.navigate("Profile");
            } else {
                const data = await getProfile(user.id);
                const { userName, profileImageKey, id } = data;
                navigation.navigate("UserPage", {
                    userName,
                    avatar: profileImageKey ?? defaultAvatar,
                    userId: id,
                });
            }
        }
    };

    const renderTextWithHighlights = (text) => {
        const mentionRegex = /@?[a-zA-Z0-9_]+/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            const mention = match[0];
            const startIdx = match.index;
            const endIdx = startIdx + mention.length;

            if (startIdx > lastIndex) {
                parts.push({
                    text: text.slice(lastIndex, startIdx),
                    isMention: false,
                });
            }

            if (mentionWords.has(mention)) {
                parts.push({
                    text: mention,
                    isMention: true,
                });
            } else {
                parts.push({
                    text: mention,
                    isMention: false,
                });
            }

            lastIndex = endIdx;
        }

        if (lastIndex < text.length) {
            parts.push({
                text: text.slice(lastIndex),
                isMention: false,
            });
        }

        return parts;
    };

    const renderContent = (text) => {
        const parts = text.split(urlRegex);
        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                if (!isModal) {
                    return <UrlPreview key={index} part={part} />;
                }
            } else {
                return (
                    <Text key={index} style={textStyles}>
                        {renderTextWithHighlights(part).map((part, idx) => {
                            if (part.isMention) {
                                const user = taggedUsers.find(
                                    (u) =>
                                        `@${u.userName.split(" ")[0]}` ===
                                        part.text,
                                );
                                return (
                                    <Text
                                        key={idx}
                                        style={{
                                            color: theme.colors.lightBlue,
                                        }}
                                        onPress={() => {
                                            navigateToTaggedUser(user);
                                        }}
                                    >
                                        {part.text}
                                    </Text>
                                );
                            } else {
                                return <Text key={idx}>{part.text}</Text>;
                            }
                        })}
                    </Text>
                );
            }
            return null;
        });
    };

    return <View>{renderContent(text)}</View>;
};

export default PostText;
