export const textInput = (height, width) => ({
    height,
    width,
    borderRadius: 24,
    paddingRight: 32,
    paddingLeft: 40,
    justifyContent: "center",
    alignItems: "center",
});

export const container = (
    height,
    width,
    borderWidth,
    borderColor,
    backgroundColor,
) => ({
    width,
    height,
    borderWidth,
    borderColor,
    backgroundColor,
    borderRadius: 44,
});

export default {
    imageStyle: { width: 16, height: 16, marginRight: 8, zIndex: 2 },
    leftAndRightimageStyle: {
        width: 24,
        height: 24,
        marginRight: 8,
        zIndex: 2,
    },
};
