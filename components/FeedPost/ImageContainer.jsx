import React, { useState } from "react";
import {
    Image as ReactImage,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Skeleton } from "react-native-skeletons";

import { picturePrefix } from "../../config/constants";
import CachedImage from "../CachedImage";

const ImageContainer = ({
    media = [],
    setSelectedImageIndex,
    setImagePreviewVisible,
}) => {
    const [containerWidth, setContainerWidth] = useState(0);
    const count = media.length;

    if (count === 0) return null;

    const getUrl = (source) => picturePrefix + source.key;

    const stylesMap = {
        1: { section: styles.sectionOne, image: styles.singleImage },
        2: { section: styles.sectionTwo, image: styles.secondImage },
        3: { section: styles.sectionThree, image: styles.thirdImage },
    };

    const { section, image: imageStyle } = stylesMap[Math.min(count, 3)];

    const renderImage = (
        item,
        style,
        key,
        resizeMode = "cover",
        isSingle = false,
    ) => {
        const uri = item.key ? getUrl(item) : item.uri || item;
        const loader = (
            <Skeleton
                borderRadius={10}
                width="100%"
                height={isSingle ? 300 : "100%"}
                color="#D9D9D980"
                style={{ maxHeight: isSingle ? 300 : "100%" }}
            />
        );

        return item.key ? (
            <TouchableOpacity
                style={[style, isSingle ? { height: style.maxHeight } : {}]}
                activeOpacity={0.9}
                onPress={() => {
                    setSelectedImageIndex(key);
                    setImagePreviewVisible(true);
                }}
                key={key}
            >
                <CachedImage
                    key={key}
                    source={{ uri }}
                    style={[
                        style,
                        !isSingle
                            ? { height: "100%", width: "100%" }
                            : { maxHeight: style.maxHeight },
                    ]}
                    resizeMode={resizeMode}
                    containerWidth={containerWidth}
                    loader={loader}
                    isSingle={isSingle}
                />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity
                style={[style, isSingle ? { height: style.maxHeight } : {}]}
                activeOpacity={0.8}
                onPress={() => {
                    setSelectedImageIndex(key);
                    setImagePreviewVisible(true);
                }}
                key={key}
            >
                <ReactImage
                    key={key}
                    source={{ uri }}
                    style={[
                        style,
                        !isSingle
                            ? { height: "100%", width: "100%" }
                            : { maxHeight: style.maxHeight },
                    ]}
                    resizeMode={resizeMode}
                />
            </TouchableOpacity>
        );
    };

    const renderRow = (items, style, startIndex = 0) => (
        <View
            style={[style]}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            {items.map((item, index) =>
                renderImage(item, styles.secondImage, startIndex + index),
            )}
        </View>
    );

    return (
        <View style={{ marginVertical: 10 }}>
            {count !== 4 && (
                <View
                    style={[section]}
                    onLayout={(e) =>
                        setContainerWidth(e.nativeEvent.layout.width)
                    }
                >
                    {media
                        .slice(0, 3)
                        .map((item, index) =>
                            renderImage(
                                item,
                                imageStyle,
                                index,
                                count === 1 ? "contain" : "cover",
                                count === 1,
                            ),
                        )}
                </View>
            )}

            {count === 4 && (
                <View style={{ gap: 10 }}>
                    {renderRow(media.slice(0, 2), styles.sectionTwo, 0)}
                    {renderRow(media.slice(2, 4), styles.sectionTwo, 2)}
                </View>
            )}

            {count > 4 && (
                <View style={styles.additionalImagesContainer}>
                    {media
                        .slice(3)
                        .map((item, index) =>
                            renderImage(item, styles.gridImage, 3 + index),
                        )}
                </View>
            )}
        </View>
    );
};

export default ImageContainer;

const styles = StyleSheet.create({
    sectionOne: {
        borderRadius: 10,
        overflow: "hidden",
        maxHeight: 500,
    },
    singleImage: {
        borderRadius: 10,
        height: 166,
    },
    secondImage: {
        width: "48%",
        height: "100%",
        borderRadius: 10,
    },
    sectionTwo: {
        height: 166,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionThree: {
        height: 100,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    thirdImage: {
        width: "32%",
        height: "100%",
        borderRadius: 10,
    },
    additionalImagesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 5,
        gap: 5,
    },
    gridImage: {
        width: "32%",
        height: 100,
        borderRadius: 10,
        marginTop: 5,
    },
});
