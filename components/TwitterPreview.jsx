import LinkPreview from "expo-link-preview";
import React from "react";
import { Linking } from "react-native";

const TwitterPreview = ({ part }) => {
    return (
        <LinkPreview
            link={part}
            onPress={() => {
                Linking.openURL(part);
            }}
        />
    );
};

export default TwitterPreview;
