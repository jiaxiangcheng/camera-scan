import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

// Context
import { Utils } from "../context/Utils";

// Dark Mode
import { useColorScheme } from "react-native-appearance";
import {
    lightColors,
    darkColors,
    defaultTheme,
} from "../themeColors/ThemeColors";

export default function ClassicButton(props) {
    var colorScheme = useColorScheme();
    if (colorScheme == "no-preference") {
        colorScheme = defaultTheme.theme;
    }
    const { title = "", style = {}, textStyle = {}, onPress } = props;

    // context
    const { actuatedNormalize } = useContext(Utils);

    // ---------------------------------------Styles---------------------------------------------
    const styles = StyleSheet.create({
        button: {
            display: "flex",
            height: "50%",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
                colorScheme == "light"
                    ? lightColors.toolBar
                    : darkColors.toolBar,
        },
        text: {
            fontSize: actuatedNormalize(14),
            textTransform: "uppercase",
            color:
                colorScheme == "light"
                    ? lightColors.textDimmed
                    : darkColors.textDimmed,
            textAlign: "center",
            fontWeight: "bold",
        },
    });

    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}
