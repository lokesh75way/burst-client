import * as FileSystem from "expo-file-system";
import React, { useEffect, useRef, useState } from "react";
import { Image as ReactImage, StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";
import Image from "react-native-scalable-image";
const getImgXtension = (uri) => {
    const basename = uri.split(/[\\/]/).pop();
    return /[.]/.exec(basename) ? /[^.]+$/.exec(basename) : undefined;
};
const findImageInCache = async (uri) => {
    try {
        const info = await FileSystem.getInfoAsync(uri);
        return { ...info, err: false };
    } catch (error) {
        return {
            exists: false,
            err: true,
            msg: error,
        };
    }
};
const cacheImage = async (uri, cacheUri, callback) => {
    try {
        const downloadImage = FileSystem.createDownloadResumable(
            uri,
            cacheUri,
            {},
            callback,
        );
        const downloaded = await downloadImage.downloadAsync();
        return {
            cached: true,
            err: false,
            path: downloaded.uri,
        };
    } catch (error) {
        return {
            cached: false,
            err: true,
            msg: error,
        };
    }
};
const CachedImage = (props) => {
    const {
        source: { uri },
        style,
        resizeMode,
        loader,
        isSingle,
        containerWidth,
    } = props;
    const cacheKey = uri.split("image-uploads/")[1];
    const isMounted = useRef(true);
    const [imgUri, setUri] = useState("");
    const [isGif, setIsGif] = useState(false);

    const showErrorMessage = () => {
        showMessage({
            message: "Couldn't load Image!",
            type: "danger",
        });
    };
    useEffect(() => {
        const loadImg = async () => {
            let imgXt = getImgXtension(uri);
            if (!imgXt || !imgXt.length) {
                imgXt = ["jpg"];
            }
            if (imgXt[0] === "gif") {
                setIsGif(true);
            }
            const cacheFileUri = `${FileSystem.cacheDirectory}${cacheKey}.${imgXt[0]}`;
            const imgXistsInCache = await findImageInCache(cacheFileUri);
            if (imgXistsInCache.exists) {
                // console.log("cached!");
                setUri(cacheFileUri);
            } else {
                const cached = await cacheImage(uri, cacheFileUri, () => {});
                if (cached.cached) {
                    console.log("cached new!");
                    setUri(cached.path);
                } else {
                    showErrorMessage();
                }
            }
        };
        loadImg();
        return () => (isMounted.current = false);
    }, []);

    return (
        <>
            {imgUri ? (
                isSingle && containerWidth > 0 && !isGif ? (
                    <Image source={{ uri: imgUri }} width={containerWidth} />
                ) : (
                    <ReactImage
                        source={{ uri: imgUri }}
                        style={style}
                        resizeMode={resizeMode ?? "cover"}
                    />
                )
            ) : (
                loader
            )}
        </>
    );
};
export default CachedImage;

const styles = StyleSheet.create({
    photoGradient: {
        flex: 1,
        borderRadius: 20,
        opacity: 0.5,
    },
    textGradient: {
        flex: 1,
        borderRadius: 20,
        opacity: 0.56,
    },
});
