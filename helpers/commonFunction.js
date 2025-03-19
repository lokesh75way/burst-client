import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import { SaveFormat, manipulateAsync } from "expo-image-manipulator";

import {
    avatarPrefix,
    defaultAvatar,
    picturePrefix,
} from "../config/constants";
import { uploadImageToS3 } from "../services/s3";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

const charFromUtf16 = (utf16) =>
    String.fromCodePoint(...utf16.split("-").map((u) => "0x" + u));
export const charFromEmojiObject = (obj) => charFromUtf16(obj.unified);

export const getImageUrl = (profileImageKey) => {
    const imageUrl = profileImageKey
        ? picturePrefix + profileImageKey
        : picturePrefix + defaultAvatar;
    return imageUrl;
};

export const getDateText = (timestamp) => {
    const date = dayjs(timestamp).fromNow(true);
    return date;
};

/**
 * It resizes the image till a compression level
 * @param {*} uri Uri of the image to resize
 * @param {*} compress level of compression to resize image
 * @returns {Promise<>} A Promise that resolves once the image is resized
 */
export const resizeImage = async (uri, compress) => {
    const result = await manipulateAsync(uri, [], {
        compress,
        format: SaveFormat.JPEG,
        base64: true,
    });
    return result;
};

/**
 * Function to determine the compression quality based on the size of the image.
 * @param {number} size - Size of the image in bytes.
 * @returns {number} - Compression quality factor between 0 and 1.
 */
export const getCompressSize = (size) => {
    // Calculate the size of the image in MB
    const MB = Math.round(size / Math.pow(1024, 2));

    // Determine compression quality based on image size
    if (MB === 0) return 1;
    if (MB === 1) return 0.9;
    if (MB === 2) return 0.8;
    if (MB === 3) return 0.7;
    if (MB === 4) return 0.6;
    if (MB >= 5) return 0.5;
    if (MB >= 10) return 0.4;
    if (MB >= 15) return 0.3;
    if (MB >= 20) return 0.2;
    if (MB >= 25) return 0.1;
};

export const isDefaultProfileImage = (imageUrl) => {
    if (!imageUrl) {
        return true;
    }
    return imageUrl === avatarPrefix + defaultAvatar;
};

export const fetchKey = async (image) => {
    try {
        const data = await uploadImageToS3(image);
        const { url = "", key = "" } = data || { url: "", key: "" };
        return key;
    } catch (error) {
        console.log(error.message);
    }
};

export const getApprovedReviewsCount = (reviews, authorId) => {
    return reviews.filter(
        (review) => review.approved && review.reviewer?.id != authorId,
    ).length;
};

export const getBurst = (reviews, userId) => {
    return reviews.filter((review) => review.reviewer.id === userId).length;
};
