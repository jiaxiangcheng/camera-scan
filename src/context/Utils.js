import React, { createContext } from "react";
import { Platform, PixelRatio, Dimensions } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

// Utils Context
export const Utils = createContext();

const UtilsProvider = (props) => {
    // based on iphone 5s's scale
    const { width, height } = Dimensions.get("window");
    const scale = width / 320;

    const actuatedNormalize = (size) => {
        const newSize = size * scale;
        if (Platform.OS === "ios") {
            return Math.round(PixelRatio.roundToNearestPixel(newSize));
        } else {
            return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
        }
    };

    const changeScreenOrientation = async (orientation) => {
        /*OrientationLock.ALL -- All four possible orientations
        OrientationLock.PORTRAIT_UP -- Right-side up portrait only.
        OrientationLock.LANDSCAPE -- Any landscape orientation.
        OrientationLock.LANDSCAPE_LEFT -- Left landscape only.
        OrientationLock.LANDSCAPE_RIGHT -- Right landscape only.*/

        switch (orientation) {
            case "all":
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.ALL
                );
                break;
            case "portrait":
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
                break;
            case "landscape":
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.LANDSCAPE
                );
                break;
            case "landscapeLeft":
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
                );
                break;
            case "landscapeRight":
                await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
                );
                break;
            default:
                break;
        }
    };

    return (
        <Utils.Provider
            value={{
                actuatedNormalize,
                changeScreenOrientation,
            }}
        >
            {props.children}
        </Utils.Provider>
    );
};

export default UtilsProvider;
