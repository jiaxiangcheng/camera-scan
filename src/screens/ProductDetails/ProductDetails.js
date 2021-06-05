import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";

// Dark Mode
import { useColorScheme } from "react-native-appearance";
import {
    lightColors,
    darkColors,
    defaultTheme,
} from "../../themeColors/ThemeColors";

export default function ProductDetails(props) {
    var productData = props.route.params.content.data;
    console.log(productData);

    // detect current theme
    var colorScheme = useColorScheme();
    if (colorScheme == "no-preference") {
        colorScheme = defaultTheme.theme;
    }

    const themeStatusstyle = colorScheme === "light" ? "dark" : "light";

    const closeBtnClicked = () => {
        props.navigation.goBack();
    };

    useFocusEffect(
        React.useCallback(() => {
            props.navigation.setOptions({
                headerTitleStyle: { alignSelf: "center" },
                headerRight: () => (
                    <TouchableOpacity
                        style={{
                            height: 30,
                            width: 30,
                            backgroundColor: "red",
                        }}
                        onPress={closeBtnClicked}
                    ></TouchableOpacity>
                ),
                headerLeft: () => <TouchableOpacity></TouchableOpacity>,
            });
        }, [])
    );

    const styleSheet = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:
                colorScheme == "light"
                    ? lightColors.background
                    : darkColors.background,
        },
    });

    return (
        <React.Fragment>
            <StatusBar style={themeStatusstyle} />
            <View style={styleSheet.container}>
                <Text>{productData}</Text>
            </View>
        </React.Fragment>
    );
}
