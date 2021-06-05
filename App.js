import React from "react";

// Context
import ApiProvider from "./src/context/Api";

// Screens
import Home from "./src/screens/Home/Home";
import ProductDetails from "./src/screens/ProductDetails/ProductDetails";

// Navigation
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Dark Mode
import { AppearanceProvider, useColorScheme } from "react-native-appearance";
import {
    lightColors,
    darkColors,
    defaultTheme,
} from "./src/themeColors/ThemeColors";

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

export default function App() {
    var scheme = useColorScheme();
    if (scheme == "no-preference") {
        scheme = defaultTheme.theme;
    }

    const LightNavBar = {
        dark: false,
        colors: {
            ...DefaultTheme,
            card: lightColors.toolBar,
            border: lightColors.toolBar,
        },
    };

    const DarkNavBar = {
        dark: true,
        colors: {
            ...DarkTheme,
            card: darkColors.toolBar,
            border: darkColors.toolBar,
        },
    };

    const createMainStack = () => {
        return (
            <MainStack.Navigator
                screenOptions={{
                    headerTintColor:
                        scheme == "light"
                            ? lightColors.textMain
                            : darkColors.textMain,
                    headerLeftContainerStyle: {
                        paddingHorizontal: 15,
                    },
                    headerRightContainerStyle: {
                        paddingHorizontal: 15,
                    },
                }}
                headerMode={"float"}
            >
                <MainStack.Screen
                    name="Home"
                    component={Home}
                ></MainStack.Screen>
            </MainStack.Navigator>
        );
    };

    return (
        <AppearanceProvider>
            <ApiProvider>
                <NavigationContainer
                    theme={scheme === "light" ? LightNavBar : DarkNavBar}
                >
                    <RootStack.Navigator
                        mode="modal"
                        screenOptions={{
                            headerTintColor:
                                scheme == "light"
                                    ? lightColors.textMain
                                    : darkColors.textMain,
                            headerLeftContainerStyle: {
                                paddingHorizontal: 15,
                            },
                            headerRightContainerStyle: {
                                paddingHorizontal: 15,
                            },
                        }}
                    >
                        <RootStack.Screen
                            name="Main"
                            component={createMainStack}
                            options={{ headerShown: false }}
                        ></RootStack.Screen>
                        <RootStack.Screen
                            name="ProductDetails"
                            component={ProductDetails}
                        ></RootStack.Screen>
                    </RootStack.Navigator>
                </NavigationContainer>
            </ApiProvider>
        </AppearanceProvider>
    );
}
