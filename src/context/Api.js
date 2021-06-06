import React, { createContext } from "react";

// API Context
export const API = createContext();

const ApiProvider = (props) => {
    const checkIfProductExists = async (code) => {
        return code == "7892342342342" || code == "8847382452132";
    };

    const getDummyData = async (code) => {
        return fetch(`https://randomuser.me/api/?seed=${code}`, {
            method: "get",
            headers: {
                Accept: "application/json, text/plain, */*",
            },
        })
            .then((response) => {
                const statusCode = response.status;
                const data = response.json();
                return Promise.all([statusCode, data]);
            })
            .then((res) => {
                return { statusCode: res[0], data: res[1] };
            })
            .then((res) => {
                if (res.statusCode != 200 && res.statusCode != 201) {
                    console.log(res.statusCode);
                } else {
                    // console.log(res.data);
                    return res.data;
                }
            })
            .catch((error) => {
                console.error(error);
                return { name: "network error", description: "" };
            });
    };

    return (
        <API.Provider
            value={{
                checkIfProductExists,
                getDummyData,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default ApiProvider;
