/* eslint-disable react/prop-types */
import { createContext, useReducer, useContext } from "react";

const PositionContext = createContext();

const initialState = {
  active: false,
  file: {
    name: "",
    type: "",
    size: 0,
    lastModified: 0,
    width: 0,
    height: 0,
    preview: null,
    image: null,
  },
  position: {
    top: 0,
    left: 0,
  },
  width: 0,
  height: 0,
};

const positionReducer = (state, action) => {
  switch (action.type) {
    case "SET_POSITION":
      return {
        ...state,
        position: action.payload.position,
        width: action.payload.width,
        height: action.payload.height,
      };
    case "CLEAR_POSITION":
      return {
        ...state,
        active: false,
      };
    case "SET_FILE":
      return {
        ...state,
        active: true,
        file: action.payload,
      };
    default:
      return state;
  }
};

export const PositionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(positionReducer, initialState);

  return (
    <PositionContext.Provider value={{ state, dispatch }}>
      {children}
    </PositionContext.Provider>
  );
};

export const usePosition = () => {
  const context = useContext(PositionContext);
  if (!context) {
    throw new Error("usePosition must be used within a PositionProvider");
  }
  return context;
};
