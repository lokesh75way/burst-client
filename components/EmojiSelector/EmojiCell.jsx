import { Text, TouchableOpacity } from "react-native";

import { charFromEmojiObject } from "../../helpers/commonFunction";

/**
 * Component representing an emoji cell.
 * @param {object} props - Props for the EmojiCell component.
 * @param {string} props.emoji - The emoji to be displayed.
 * @param {number} props.colSize - The size of the column.
 * @returns {JSX.Element} JSX for the EmojiCell component.
 */
const EmojiCell = (props) => {
    const { emoji, colSize, ...other } = props;
    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={{
                width: colSize,
                height: colSize,
                alignItems: "center",
                justifyContent: "center",
            }}
            {...other}
        >
            <Text style={{ color: "#FFFFFF", fontSize: colSize - 12 }}>
                {charFromEmojiObject(emoji)}
            </Text>
        </TouchableOpacity>
    );
};

export default EmojiCell;
