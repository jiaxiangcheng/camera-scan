import React, { useState, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Dimensions } from "react-native";

// Context
import { Utils } from "../../../context/Utils";

// Dark Mode
import { useColorScheme } from "react-native-appearance";
import {
    lightColors,
    darkColors,
    defaultTheme,
} from "../../../themeColors/ThemeColors";

import * as Progress from "react-native-progress";

export default function Punctuation(props) {
    var colorScheme = useColorScheme();
    if (colorScheme == "no-preference") {
        colorScheme = defaultTheme.theme;
    }

    const [sustainabilityIndicator, setSustainabilityIndicator] = useState(0);
    const [calorieIndicator, setCalorieIndicator] = useState(0);
    const [healthIndicator, setHealthIndicator] = useState(0);
    const [ecologyIndicator, setEcologyIndicator] = useState(0);
    const [recyclableIndicator, setRecyclableIndicator] = useState(0);

    const viewWidth = Dimensions.get("window").width;

    // context
    const { actuatedNormalize } = useContext(Utils);

    useFocusEffect(
        React.useCallback(() => {
            delayLoading();
        }, [])
    );

    const delayLoading = () => {
        var count = 0;
        var result1 = 0;
        var result2 = 0;
        var result3 = 0;
        var result4 = 0;
        var result5 = 0;

        var loadingIntervalId = setInterval(() => {
            if (count < 5) {
                result1 += Math.random() / 5;
                result2 += Math.random() / 5;
                result3 += Math.random() / 5;
                result4 += Math.random() / 5;
                result5 += Math.random() / 5;
                setSustainabilityIndicator(result1);
                setCalorieIndicator(result2);
                setHealthIndicator(result3);
                setEcologyIndicator(result4);
                setRecyclableIndicator(result5);
            }
            count += 1;
        }, 25);
        setTimeout(() => {
            loadingIntervalId;
        }, 3000);

        setTimeout(function () {}, 3000);
    };

    const ProgressBarItem = (props) => {
        var isFirstRow = props.isFirstRow;
        var progressBarVal = props.progressBarVal;
        var name = props.name;
        var description = props.description;
        var value = props.value;

        return (
            <View style={styleSheet.itemContainer}>
                <View style={styleSheet.firstRow}>
                    <View style={firstRow.nameContainer}>
                        {isFirstRow ? (
                            <Text style={firstRow.bigName}>{name}</Text>
                        ) : (
                            <Text style={firstRow.name}>{name}</Text>
                        )}
                    </View>
                    <View style={firstRow.descriptionContainer}>
                        {isFirstRow ? (
                            <Text style={firstRow.bigDescription}>
                                {description}
                            </Text>
                        ) : (
                            <Text style={firstRow.description}>
                                {description}
                            </Text>
                        )}
                    </View>

                    <View style={firstRow.valueContainer}>
                        {isFirstRow ? (
                            <Text style={firstRow.bigValue}>{`${value}`}</Text>
                        ) : (
                            <Text style={firstRow.value}>{`${value}`}</Text>
                        )}
                    </View>
                </View>
                <View style={styleSheet.secondRow}>
                    <Progress.Bar
                        animated={true}
                        progress={progressBarVal}
                        width={viewWidth - 50}
                        color={
                            isFirstRow != undefined
                                ? colorScheme == "light"
                                    ? lightColors.greenBarFilled
                                    : darkColors.greenBarFilled
                                : colorScheme == "light"
                                ? lightColors.greyBarFilled
                                : darkColors.greyBarFilled
                        }
                        unfilledColor={
                            colorScheme == "light"
                                ? lightColors.greyBarUnfilled
                                : darkColors.greyBarUnfilled
                        }
                        borderColor={"transparent"}
                        borderWidth={0}
                        height={5}
                        borderRadius={10}
                    />
                </View>
            </View>
        );
    };

    // ---------------------------------------Styles---------------------------------------------
    const styleSheet = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "column",
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 10,
        },
        itemContainer: {
            height: 50,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            //backgroundColor: "purple",
            //borderWidth: 2,
        },
        firstRow: {
            flex: 1,
            flexDirection: "row",
            width: "95%",
            justifyContent: "center",
            alignItems: "center",
        },
        secondRow: {
            height: 20,
            flexDirection: "column",
            width: "95%",
            justifyContent: "flex-start",
            alignItems: "center",
            //backgroundColor: "gold",
            paddingTop: 5,
        },
    });

    const firstRow = StyleSheet.create({
        nameContainer: {
            flex: 2,
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingLeft: 15,
            // backgroundColor: "red",
        },
        name: {
            fontSize: actuatedNormalize(13),
            color:
                colorScheme == "light"
                    ? lightColors.textDimmed
                    : darkColors.textDimmed,
        },
        bigName: {
            fontSize: actuatedNormalize(14),
            fontWeight: "bold",
            color:
                colorScheme == "light"
                    ? lightColors.textDimmed
                    : darkColors.textDimmed,
        },
        descriptionContainer: {
            flex: 2,
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-end",
            // backgroundColor: "blue",
        },
        description: {
            fontSize: actuatedNormalize(13),
            color:
                colorScheme == "light"
                    ? lightColors.textInfo
                    : darkColors.textInfo,
        },
        bigDescription: {
            fontSize: actuatedNormalize(13),
            fontWeight: "bold",
            color:
                colorScheme == "light"
                    ? lightColors.textInfo
                    : darkColors.textInfo,
        },
        valueContainer: {
            flex: 1,
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
            alignItems: "flex-end",
            paddingRight: 15,
            // backgroundColor: "green",
        },
        value: {
            fontSize: actuatedNormalize(13),
            color:
                colorScheme == "light"
                    ? lightColors.textMain
                    : darkColors.textMain,
        },
        bigValue: {
            fontSize: actuatedNormalize(13),
            fontWeight: "bold",
            color:
                colorScheme == "light"
                    ? lightColors.textMain
                    : darkColors.textMain,
        },
    });

    const multiView = StyleSheet.create({
        container: {
            flex: 1,
            width: "95%",
            flexDirection: "column",
            height: 300,
            marginLeft: "2.5%",
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
            borderRadius: 15,
        },
        firstRow: {
            flex: 1,
            width: "100%",
            flexDirection: "row",
            marginVertical: 10,
        },
        secondRow: {
            flex: 1,
            width: "100%",
            flexDirection: "row",
            marginVertical: 10,
        },
    });

    const firstRowMultiView = StyleSheet.create({
        leftContainer: {
            flex: 1,
            backgroundColor: "orange",
            width: "100%",
            marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignContent: "center",
        },
        rightContainer: {
            flex: 1,
            backgroundColor: "blue",
            width: "100%",
            marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignContent: "center",
        },
    });

    const secondRowMultiView = StyleSheet.create({
        leftContainer: {
            flex: 1,
            backgroundColor: "gold",
            width: "100%",
            marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignContent: "center",
        },
        rightContainer: {
            flex: 1,
            backgroundColor: "green",
            width: "100%",
            marginHorizontal: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignContent: "center",
        },
    });

    return (
        <View style={styleSheet.container}>
            <ProgressBarItem
                isFirstRow={true}
                name={"Sustainability"}
                description={"acceptable"}
                value={(sustainabilityIndicator * 100).toFixed(2)}
                progressBarVal={sustainabilityIndicator}
            ></ProgressBarItem>
            <ProgressBarItem
                name={"Health"}
                description={"acceptable"}
                value={(calorieIndicator * 100).toFixed(2)}
                progressBarVal={calorieIndicator}
            ></ProgressBarItem>
            <ProgressBarItem
                name={"Calorie"}
                description={"acceptable"}
                value={(healthIndicator * 100).toFixed(2)}
                progressBarVal={healthIndicator}
            ></ProgressBarItem>
            <ProgressBarItem
                name={"Ecology"}
                description={"acceptable"}
                value={(ecologyIndicator * 100).toFixed(2)}
                progressBarVal={ecologyIndicator}
            ></ProgressBarItem>
            <ProgressBarItem
                name={"Recyclable"}
                description={"acceptable"}
                value={(recyclableIndicator * 100).toFixed(2)}
                progressBarVal={recyclableIndicator}
            ></ProgressBarItem>
            <View style={[multiView.container, { height: 300 }]}>
                <View style={multiView.firstRow}>
                    <View style={firstRowMultiView.leftContainer}>
                        <Text style={{ textAlign: "center" }}>Chart</Text>
                    </View>
                    <View style={firstRowMultiView.rightContainer}>
                        <Text style={{ textAlign: "center" }}>Chart</Text>
                    </View>
                </View>
                <View style={multiView.secondRow}>
                    <View style={secondRowMultiView.leftContainer}>
                        <Text style={{ textAlign: "center" }}>Chart</Text>
                    </View>
                    <View style={secondRowMultiView.rightContainer}>
                        <Text style={{ textAlign: "center" }}>Chart</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
