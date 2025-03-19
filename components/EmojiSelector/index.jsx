import emoji_datasource from "emoji-datasource";
import React from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import EmojiCell from "./EmojiCell";
import TabBar from "./TabBar";
import VariationPicker from "./VariationPicker";
import { Categories } from "../../config/data";
import { charFromEmojiObject } from "../../helpers/commonFunction";

const filteredEmojis = emoji_datasource.filter((e) => !e["obsoleted_by"]);
const emojiByCategory = (category) =>
    filteredEmojis.filter((e) => e.category === category);
const sortEmoji = (list) => list.sort((a, b) => a.sort_order - b.sort_order);
const categoryKeys = Object.keys(Categories);

// TODO: Move all these styles to defaultStyles and allow for overrides

const storage_key = "@react-native-emoji-selector:HISTORY";
const EmojiSelector = (props) => {
    const {
        category,
        columns,
        placeholder,
        showHistory,
        showSearchBar,
        showSectionTitles,
        showTabs,
        onEmojiSelected,
        shouldInclude,
        setEmojiVisible,
        emojiVisible,
        overrideStyles = {},
        ...other
    } = props;

    const [state, setState] = React.useState({
        searchQuery: "",
        category: category ?? Categories.people,
        isReady: false,
        history: [],
        emojiList: null,
        colSize: 0,
        width: 0,
    });
    const [selectedEmoji, setSelectedEmoji] = React.useState(null);
    const [showVariations, setShowVariations] = React.useState(false);

    const scrollviewRef = React.useRef(null);
    const styles = {
        ...defaultStyles,
        ...overrideStyles,
    };
    /**
     * Handles the layout event and updates state based on the width change.
     * @param {object} event - The native event object containing layout information.
     * @returns {void}
     */
    const handleLayout = ({ nativeEvent: { layout } }) => {
        if (layout.width !== state.width) {
            setState({
                ...state,
                width: layout.width,
            });
        }
    };
    /**
     * Handles the selection of a tab category.
     * @param {object} category - The selected category object.
     * @returns {void}
     */
    const handleTabSelect = (category) => {
        if (state.isReady) {
            if (category.name == "Return") {
                setEmojiVisible(false);
            }
            scrollviewRef.current?.scrollToOffset({
                x: 0,
                y: 0,
                animated: false,
            });
            setState({
                ...state,
                searchQuery: "",
                category,
            });
        }
    };
    /**
     * Generates data for the section containing emojis based on the current state.
     * @returns {Array} An array of emoji data objects for rendering.
     */
    const returnSectionData = () => {
        const { history, emojiList, searchQuery, category } = state;
        const emojiData = (function () {
            if (category === Categories.all && searchQuery === "") {
                //TODO: OPTIMIZE THIS
                let largeList = [];
                categoryKeys.forEach((c) => {
                    const name = Categories[c].name;
                    //   const list =
                    //     name === Categories.history.name ? history : emojiList[name];
                    const list = emojiList[name];
                    if (c !== "all" && c !== "history")
                        largeList = largeList.concat(list);
                });

                return largeList.map((emoji) => ({
                    key: emoji.unified,
                    emoji,
                }));
            } else {
                let list;
                const hasSearchQuery = searchQuery !== "";
                const name = category.name;
                if (hasSearchQuery) {
                    const filtered = emoji_datasource.filter((e) => {
                        let display = false;
                        e.short_names.forEach((name) => {
                            if (name.includes(searchQuery.toLowerCase()))
                                display = true;
                        });
                        return display;
                    });
                    list = sortEmoji(filtered);
                }
                // else if (name === Categories.history.name) {
                //   list = history;
                // }
                else {
                    list = emojiList[name];
                }
                return list.map((emoji) => ({ key: emoji.unified, emoji }));
            }
        })();
        return shouldInclude
            ? emojiData.filter((e) => shouldInclude(e.emoji))
            : emojiData;
    };
    /**
     * Pre-renders emojis and sets initial state for the component.
     * @returns {void}
     */
    const prerenderEmojis = () => {
        const emojiList = {};
        categoryKeys.forEach((c) => {
            const name = Categories[c].name;
            emojiList[name] = sortEmoji(emojiByCategory(name));
        });

        setState({
            ...state,
            emojiList,
            colSize: Math.floor(state.width / columns),
            isReady: true,
        });
    };

    /**
     * Handles the selection of an emoji and manages related states.
     * @param {object} emoji - The selected emoji object.
     * @returns {void}
     */

    const handleEmojiSelect = (emoji) => {
        // TODO: Figure out history bullshit
        // if (showHistory) {
        //   addToHistoryAsync(emoji);
        // }
        onEmojiSelected(charFromEmojiObject(emoji));
        if (showVariations) {
            setShowVariations(false);
        }
        setEmojiVisible(false);
    };

    /**
     * Handles the long press event on an emoji, manages the display of variations or selects the emoji.
     * @param {object} emoji - The emoji object that is long-pressed.
     * @returns {void}
     */

    const handleEmojiLongPress = (emoji) => {
        if (emoji.skin_variations) {
            setSelectedEmoji(emoji);
            setShowVariations(true);
        } else {
            handleEmojiSelect(emoji);
        }
        setEmojiVisible(false);
    };

    /**
     * Renders the individual cell for each emoji in the FlatList.
     * @param {object} item - An item containing emoji data.
     * @returns {JSX.Element} The rendered EmojiCell component.
     */

    const renderEmojiCell = ({ item }) => (
        <EmojiCell
            key={item.key}
            emoji={item.emoji}
            onPress={() => handleEmojiSelect(item.emoji)}
            onLongPress={() => handleEmojiLongPress(item.emoji)}
            colSize={state.colSize}
        />
    );

    /**
     * Handles the search functionality to filter emojis based on the provided search query.
     * @param {string} searchQuery - The query string used for filtering emojis.
     * @returns {void}
     */

    const handleSearch = (searchQuery) => {
        setState({ ...state, searchQuery });
    };

    React.useEffect(() => {
        if (state.width > 0) {
            prerenderEmojis();
        }
    }, [state.width]);

    return (
        <View style={styles.frame} {...other} onLayout={handleLayout}>
            <VariationPicker
                emoji={selectedEmoji}
                visible={showVariations}
                onEmojiSelected={handleEmojiSelect}
                onRequestClose={() => setShowVariations(false)}
            />
            <View style={styles.tabBar}>
                {showTabs && (
                    <TabBar
                        activeCategory={state.category}
                        onPress={handleTabSelect}
                        // theme={theme}
                        styles={styles}
                        width={state.width}
                    />
                )}
            </View>
            <View style={{ flex: 1 }}>
                {showSearchBar && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.search}
                            placeholder={placeholder}
                            clearButtonMode="always"
                            returnKeyType="done"
                            autoCorrect={false}
                            // underlineColorAndroid={theme}
                            value={state.searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                )}
                {state.isReady ? (
                    <View style={{ flex: 1 }}>
                        <View style={styles.container}>
                            {showSectionTitles && (
                                <Text style={styles.sectionHeader}>
                                    {state.searchQuery !== ""
                                        ? "Search Results"
                                        : state.category.name}
                                </Text>
                            )}
                            <FlatList
                                style={styles.scrollview}
                                contentContainerStyle={{
                                    paddingBottom: state.colSize,
                                }}
                                data={returnSectionData()}
                                renderItem={renderEmojiCell}
                                horizontal={false}
                                numColumns={columns}
                                keyboardShouldPersistTaps="always"
                                ref={scrollviewRef}
                                removeClippedSubviews
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.loader} {...other}>
                        <ActivityIndicator
                            size="large"
                            // color={Platform.OS === "android" ? theme : "#000000"}
                            color="#000000"
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

EmojiSelector.defaultProps = {
    // theme: PlatformColor("link") /* TODO: Android */,
    category: Categories.all,
    showTabs: true,
    showSearchBar: true,
    showHistory: false,
    showSectionTitles: true,
    columns: 6,
    placeholder: "Search...",
};

export const defaultStyles = StyleSheet.create({
    frame: {
        flex: 1,
        width: "100%",
        overflow: "hidden",
        // backgroundColor: PlatformColor("systemBackground") /*TODO: Android */,
        backgroundColor: "#fff" /*TODO: Android */,
    },
    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get("screen").width,
    },
    tab: {
        flex: 1,
        borderBottomWidth: 2,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 8,
    },
    tabInner: {
        textAlign: "center",
        paddingBottom: 8,
    },
    tabBar: {
        flexDirection: "row",
    },
    scrollview: {
        flex: 1,
    },
    searchContainer: {
        width: "100%",
        zIndex: 1,
    },
    search: {
        ...Platform.select({
            ios: {
                height: 36,
                paddingLeft: 8,
                borderRadius: 10,
                // color: PlatformColor("label") /* TODO: Android */,
                color: "#000" /* TODO: Android */,
                // backgroundColor: PlatformColor("systemGray6") /* TODO: Android */,
                backgroundColor: "#F0F2F5",
                borderColor: "#ccc",
                borderWidth: 1,
            },
        }),
        margin: 8,
    },
    container: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
    },
    sectionHeader: {
        marginHorizontal: 8,
        fontSize: 16,
        width: "100%",
        // color: PlatformColor("secondaryLabel") /* TODO: Android */,
        color: "black" /* TODO: Android */,
    },
    tabContainer: {
        borderColor: "#F0F2F5",
        paddingTop: 8,
    },
});

export default EmojiSelector;
