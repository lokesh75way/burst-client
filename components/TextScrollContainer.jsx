import React, { useState } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";

import UrlPreview from "./UrlPreview";
import theme from "../config/theme";

const TextScrollContainer = ({ text }) => {
    const [textHeight, setTextHeight] = useState(0);
    const textContent = text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = textContent.split(urlRegex);

    return (
        <ScrollView
            style={[styles.textScroll, { maxHeight: textHeight }]}
            showsVerticalScrollIndicator={false}
            scrollEnabled
        >
            <View
                style={styles.descriptionBox}
                onLayout={(e) => {
                    setTextHeight(e.nativeEvent.layout.height);
                }}
                onStartShouldSetResponder={() => true}
            >
                {parts.map((part, index) => {
                    if (!part.match(urlRegex)) {
                        return (
                            <Text key={index} style={styles.textContent}>
                                {part.trim()}
                            </Text>
                        );
                    }
                    return (
                        <View key={index} style={styles.wrapper}>
                            <Text
                                key={index}
                                onPress={() => {
                                    Linking.openURL(part);
                                }}
                                style={styles.hyperLink}
                            >
                                {part}
                            </Text>
                            <UrlPreview part={part} />
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default TextScrollContainer;

const styles = StyleSheet.create({
    textScroll: {
        position: "absolute",
        width: "100%",
        marginTop: "8%",
        height: "82%",
        zIndex: 10,
    },
    textContent: {
        fontSize: 22,
        fontWeight: "normal",
        color: "#FFF",
        paddingHorizontal: 15,
    },
    hyperLink: {
        color: theme.colors.lightBlue,
        fontSize: 20,
        fontWeight: "normal",
        textDecorationLine: "underline",
    },
    descriptionBox: {
        width: "90%",
    },
    wrapper: {
        marginHorizontal: "5%",
        marginVertical: 5,
        width: "100%",
    },
});
