import {createContext, FC, ReactNode} from "react";
import {CursorPosition, EditorMode, HexColor} from "../types";

type MainContextType = {
  mode: EditorMode,
  cursorPosition?: CursorPosition,

  colorPickerState?: {
    currentColor: HexColor,
  },
};

type MainContextProviderProps = {
  children: ReactNode;
};

const defaultValue = { mode: EditorMode.NORMAL };

const MainContext = createContext<MainContextType>(defaultValue);
const MainContextProvider: FC<MainContextProviderProps> = ({children}) => {
  return <MainContext.Provider value={defaultValue}>{children}</MainContext.Provider>
};

export default MainContextProvider;
