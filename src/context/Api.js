import React, { createContext } from "react";

// API Context
export const API = createContext();

const ApiProvider = (props) => {
    const checkIfProductExists = async (code) => {
        return code == "7892342342342" || code == "8847382452132";
    };

    return (
        <API.Provider
            value={{
                checkIfProductExists,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default ApiProvider;
