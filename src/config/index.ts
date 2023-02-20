import { EditorMode } from "../types";

const { COLOR_PICKER, NORMAL } = EditorMode;
export const ToolIcons: Record<EditorMode, string> = {
  [COLOR_PICKER]: "IconColorPicker.svg",
  [NORMAL]: "",
}
