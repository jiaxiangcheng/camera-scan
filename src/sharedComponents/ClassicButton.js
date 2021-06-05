import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

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

    // ---------------------------------------Styles---------------------------------------------
    const styles = StyleSheet.create({
        button: {
            display: "flex",
            height: "50%",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",

            backgroundColor: "red",
            // shadowColor: "#2AC062",
            // shadowOpacity: 0.4,
            // shadowOffset: { height: 10, width: 0 },
            // shadowRadius: 20,
        },

        text: {
            fontSize: 16,
            textTransform: "uppercase",
            color: "#FFFFFF",
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
