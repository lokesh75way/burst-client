import { Text, TouchableOpacity, useColorScheme } from "react-native";

import { Categories } from "../../config/data";

/**
 * Renders the tab bar component with categories.
 * @param {object} props - The properties passed to the TabBar component.
 * @param {object} props.theme - The theme object containing styles.
 * @param {object} props.activeCategory - The currently active category.
 * @param {Function} props.onPress - The function triggered on pressing a tab.
 * @param {number} props.width - The width of the tab bar.
 * @param {object} props.styles - The styles for the tab bar.
 * @returns {JSX.Element[]} The array of JSX elements representing tabs.
 */
const TabBar = (props) => {
    const { theme, activeCategory, onPress, width, styles } = props;
    const categories = Object.keys(Categories);
    const tabSize = Math.min(width / categories.length, 56);
    const colorScheme = useColorScheme();

    return categories.map((c) => {
        const category = Categories[c];
        if (c !== "all")
            return (
                <TouchableOpacity
                    key={category.name}
                    onPress={() => onPress(category)}
                    activeOpacity={0.5}
                    style={[
                        {
                            height: tabSize,
                            borderColor: "#F0F2F5",
                        },
                        styles.tab,
                    ]}
                >
                    <Text style={[{ fontSize: tabSize - 24 }, styles.tabInner]}>
                        {category.symbol}
                    </Text>
                </TouchableOpacity>
            );
    });
};

export default TabBar;
