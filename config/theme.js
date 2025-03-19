// import { DefaultTheme } from "@react-navigation/native";

/**
 * Object containing color values used in the theme.
 * @typedef {Object} Colors
 * @property {string} primary - The primary color.
 * @property {string} black - The color black in hex format.
 * @property {string} white - The color white in hex format.
 */

/**
 * Theme object containing color definitions.
 * @typedef {Object} Theme
 * @property {Colors} colors - Object containing color values.
 */

/** @type {Colors} */
const colors = {
    primary: "#3F80A2", // Add your primary color value here
    black: "#000",
    white: "#fff",
    lightBlue: "#189AE2",
    skyBlue: "skyblue",
    green: "#70B47B",
    blue: "#58B2E3",
    lightgreen: "#66C32E",
    grey: "#A1A0A0",
};

/** @type {Theme} */
const theme = {
    // ...DefaultTheme,
    colors,
};

export default theme;
