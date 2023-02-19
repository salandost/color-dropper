export type CursorPosition = {
  x: number,
  y: number,
}

export type CursorColor = `#${string}`

type CursorParameters = CursorPosition & CursorColor
export default CursorParameters;
