import React, { useEffect, useRef } from "react";
import {
    Keyboard,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import useDebounce from "../../hooks/useDebounce";
import useSocials from "../../hooks/useSocials";
import { CloseSVG, SearchSVG } from "../Svgs";
const SearchBar = ({
    value,
    setValue,
    iconSize,
    onSubmitEditing,
    barStyles,
    placeholder,
    showCross,
    setInviteCount,
    setLoading,
    setSearchedUser,
    inviteCount,
    selectedSwitch,
}) => {
    const { searchSocialUser } = useSocials();
    const inputRef = useRef(null);

    const searchInAllUsers = async () => {
        try {
            setLoading(true);
            const data = await searchSocialUser(value);
            if (value.length !== 0) {
                setSearchedUser(data);
            } else {
                setSearchedUser([]);
            }
            const alreadyInvitedUserCount = data.filter(
                (obj) => obj.status === "accepted" || obj.status === "pending",
            ).length;
            if (alreadyInvitedUserCount > inviteCount ?? 0) {
                setInviteCount?.(alreadyInvitedUserCount);
            }
        } catch (error) {
            console.log("Error: ", error.toString());
        } finally {
            setLoading(false);
        }
    };
    useDebounce(
        () => {
            searchInAllUsers();
        },
        [value],
        800,
    );

    useEffect(() => {
        const showKeyboard = () => {
            if (selectedSwitch === 1 && inputRef.current) {
                inputRef.current.focus();
            }
        };

        const hideKeyboard = () => {
            Keyboard.dismiss();
        };

        if (selectedSwitch === 1) {
            requestAnimationFrame(showKeyboard);
        } else if (selectedSwitch === 0) {
            hideKeyboard();
        }

        return () => {
            Keyboard.dismiss();
        };
    }, [selectedSwitch]);

    return (
        <View style={barStyles}>
            <SearchSVG {...iconSize} />
            <TextInput
                ref={inputRef}
                style={styles.inputField}
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
                placeholderTextColor="#20202037"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={onSubmitEditing}
            />
            {showCross && value.length > 0 && (
                <TouchableOpacity onPress={() => setValue("")}>
                    <CloseSVG />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SearchBar;

const styles = StyleSheet.create({
    inputField: {
        flex: 1,
        height: 42,
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
        color: "#202020",
    },
});
