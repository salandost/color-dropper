import {HexColor} from "../types";

const rgbToHex = (r: number, g: number, b: number): HexColor =>
  `#${("000000" + (( r << 16) | (g << 8) | b).toString(16)).slice(-6)}`;

export default rgbToHex;
