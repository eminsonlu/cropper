/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from "react";

const PositionContext = createContext();

const initialState = {
    active: false,
    position: {
        x: 0,
        y: 0
    },
    width: 0,
    height: 0
};

const positionReducer = (state, action) => {
    switch (action.type) {
        case "SET_POSITION":
            return {
                ...state,
                active: true,
                position: action.position,
                width: action.width,
                height: action.height
            };
        case "CLEAR_POSITION":
            return {
                ...state,
                active: false
            };
        default:
            return state;
    }
}

export const PositionProvider = ({ children }) => {
    const [state, dispatch] = useReducer(positionReducer, initialState);

    return (
        <PositionContext.Provider value={{ state, dispatch }}>
            {children}
        </PositionContext.Provider>
    );
}

export const usePosition = () => {
    const context = useContext(PositionContext);
    if (!context) {
        throw new Error("usePosition must be used within a PositionProvider");
    }
    return context;
}