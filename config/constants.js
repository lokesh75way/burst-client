/**
 * Default avatar path for user profiles.
 * @type {string}
 */
export const defaultAvatar = "static-app-assets/default-profile";

/**
 * Placeholder image URL for user profiles with an additional avatar image.
 * @type {string}
 */
export const avatarPlus = "image-uploads/693c61a7-5659-4460-b8ef-b68605af1f45";

/**
 * Prefix for picture URLs.
 * @type {string}
 */
export const picturePrefix = "https://curiouploads.s3.us-east-1.amazonaws.com/";

/**
 * Prefix for avatar URLs.
 * @type {string}
 */
export const avatarPrefix = "https://curiouploads.s3.us-east-1.amazonaws.com/";

/**
 * Default name used when no user name is available.
 * @type {string}
 */
export const defaultName = "someone";

/**
 * Path for a greyed-out default profile picture.
 * @type {string}
 */
export const avatarGrey = "static-app-assets/default-profile-grayed-out";

/**
 * Number of notifications.
 * @type {number}
 */
export const notificationNumber = 9962;

/**
 * Code for notifications.
 * @type {string}
 */
export const notificationCode = "CO1oza7TLb2JI5hdb9ej25";

/**
 * Base URL for API calls.
 * @type {string}
 */
export const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || "";

/**
 * Base URL for notification API.
 * @type {string}
 */
export const notificationApiBaseUrl = "https://app.nativenotify.com/api";

/**
 * URL for static images.
 * @type {string}
 */
export const imageBaseUrl = process.env.EXPO_PUBLIC_IMAGE_URL || "";

export const reviewThreshold = 1;

export const AWS_ACCESS_KEY_ID = process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY =
    process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY;
export const AWS_S3_ENDPOINT = process.env.EXPO_PUBLIC_AWS_S3_ENDPOINT;
export const AWS_S3_BUCKET = process.env.EXPO_PUBLIC_AWS_S3_BUCKET;
export const AWS_S3_REGION = process.env.EXPO_PUBLIC_AWS_S3_REGION;

/**
 * constants for post linear gradient
 */
export const photoLocations = [0.13, 0.28, 0.48, 0.85, 1.0];
export const textLocations = [0, 1.0];
export const photoColors = [
    "transparent",
    "rgba(15, 162, 246, 0)",
    "rgba(27, 140, 204, 0.03)",
    "#29729C",
    "#01030B",
];
export const textColors = ["#00080D", "#004973"];
