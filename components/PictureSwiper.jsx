import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Swiper from "react-native-swiper";

import CachedImage from "./CachedImage";
import Loader from "./Loader";
import TextScrollContainer from "./TextScrollContainer";
import { picturePrefix } from "../config/constants";

const PictureSwiper = ({ images, showText, setTouchStart, text }) => {
    return (
        <>
            <Swiper
                horizontal
                scrollEnabled
                loop={false}
                autoplay={false}
                renderPagination={(index, total) => {
                    return (
                        <View style={styles.dotContainer}>
                            {Array.from({ length: total }).map(
                                (_, currentIndex) => (
                                    <View
                                        key={currentIndex}
                                        style={[
                                            styles.dot,
                                            index === currentIndex &&
                                                styles.activeDot,
                                        ]}
                                    />
                                ),
                            )}
                        </View>
                    );
                }}
            >
                {images.map((image) => {
                    const imageUrl = picturePrefix + image.key;
                    return (
                        <Pressable
                            activeOpacity={1}
                            key={image.key}
                            style={styles.imageContainer}
                            onLongPress={() => {
                                setTouchStart(true);
                            }}
                            onPressOut={() => {
                                setTouchStart(false);
                            }}
                        >
                            <CachedImage
                                source={{ uri: imageUrl }}
                                style={styles.thumbnail}
                                resizeMode="cover"
                                isFeed
                                showText={showText}
                                loader={
                                    <View style={styles.loadingContainer}>
                                        <Loader color="skyblue" />
                                    </View>
                                }
                            />
                        </Pressable>
                    );
                })}
            </Swiper>
            {showText && <TextScrollContainer text={text} />}
        </>
    );
};
const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        width: "100%",
    },
    thumbnail: {
        flex: 1,
        width: "100%",
        height: "100%",
        borderRadius: 20,
    },
    loadingContainer: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 0,
        bottom: 0,
    },
    dot: {
        backgroundColor: "#fff",
        width: 12,
        height: 6,
        borderRadius: 4,
    },
    activeDot: {
        backgroundColor: "#268EC8",
        width: 14,
        height: 8,
        borderRadius: 4,
    },
    dotContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        gap: 8,
        bottom: 5,
        left: 0,
        right: 0,
    },
});
export default PictureSwiper;
