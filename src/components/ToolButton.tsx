import { FC, useState } from "react";
import { EditorMode } from "../types";
import { ToolIcons } from "../config";

type ToolButtonProps = {
  toolType: EditorMode;
  onChange?: (isActive: boolean ) => void;
}

// Could've been implemented with checkbox input, controlled style
const ToolButton: FC<ToolButtonProps> = ({ toolType, onChange }) => {
  const [isActive, setIsActive] = useState(false)
  return <div className={`toolIconContainer ${isActive ? "active" : ""}`}>
    <button onClick={() => { onChange && onChange(!isActive); setIsActive(!isActive); }}>
      <img src={require(`../assets/${ToolIcons[toolType]}`)} alt={"Color Picker"}/>
    </button>
  </div>
};

export default ToolButton;
