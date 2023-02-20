import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import {cursorIsOnEditor, rgbToHex} from "./helpers";
import { CursorPosition, CursorType, EditorMode, EditorSize, HexColor } from "./types";
import './App.css';
import {COLOR_MATRIX_SIZE, HEADER_HEIGHT} from "./constants";
import CustomCursor from "./components/CustomCursor";
import ToolButton from "./components/ToolButton";

// This component could be refactored to 2-3 smaller components
// Would be a good Idea to move the logic for each tool to separate files (contexts, slices)
function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const secondaryCanvasRef = useRef<HTMLCanvasElement>(null);

  const [cursorType, setCursorType] = useState<CursorType>(CursorType.DEFAULT);
  const [position, setPosition] = useState<CursorPosition>({
    x: 0,
    y: 100,
  });
  const [centerColor, setCenterColor] = useState<HexColor>("#000000");
  const [canvasSize, setCanvasSize] = useState<EditorSize>({
    width: 0,
    height: 0,
  });

  const [selectedColor, setSelectedColor] = useState<HexColor | "">("");

  useEffect(() => {
    function handleResize() {
      setCanvasSize({
        height: window.innerHeight - HEADER_HEIGHT,
        width: window.innerWidth
      })
    }
    handleResize();
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handlePickerActivation = useCallback((isActive: boolean) => {
    if( isActive && cursorType !== CursorType.COLOR_PICKER )
      setCursorType(CursorType.COLOR_PICKER);
    else if( cursorType !== CursorType.DEFAULT )
      setCursorType(CursorType.DEFAULT);
  }, [cursorType]);

  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if( canvasRef.current ) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const canvasParams = canvas.getBoundingClientRect();
      const halfOfMatrix = COLOR_MATRIX_SIZE / 2;
      const matrixImageData = context &&
        context.getImageData(
          e.clientX - canvasParams.x - halfOfMatrix,
          e.clientY - canvasParams.y - halfOfMatrix,
          COLOR_MATRIX_SIZE,
          COLOR_MATRIX_SIZE
        );
      if( matrixImageData ) {
        const colors = matrixImageData.data;
        const matrixCenterPixelIndex = COLOR_MATRIX_SIZE * COLOR_MATRIX_SIZE * 2 - 2 ;
        setCenterColor(rgbToHex(
          colors[matrixCenterPixelIndex],
          colors[matrixCenterPixelIndex + 1],
          colors[matrixCenterPixelIndex + 2]
        ))
      }

      if( secondaryCanvasRef.current ) {
        const secondaryContext = secondaryCanvasRef.current.getContext("2d");
        matrixImageData && createImageBitmap(matrixImageData).then( imageBitmap => {
          secondaryContext && matrixImageData?.data && secondaryContext.drawImage( imageBitmap, 0, 0);
        })
      }

      setPosition({
        x: e.clientX - 80, // 80 => half of custom cursor size, to center it
        y: e.clientY - 80 - (canvasParams?.top || 0)
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas && canvas.getContext("2d");
    const img = new Image();
    img.addEventListener("load", () => {
      if( context ) {
        context.drawImage(img, 0, 0, img.width, img.height);
      }
    });
    img.src = require("./assets/1920x1080-4598441-beach-water-pier-tropical-sky-sea-clouds-island-palm-trees.jpg");
  }, []);

  return (
    <div className="App">
      <header className="App-header" style={{height: HEADER_HEIGHT}}>
        <ToolButton
          toolType={EditorMode.COLOR_PICKER}
          onChange={handlePickerActivation}
        />
        <h3>{selectedColor}</h3>
      </header>
      <div
        className="editor"
        onMouseMove={onMouseMove}
      >
        {cursorType === CursorType.COLOR_PICKER
          && cursorIsOnEditor(position.x, position.y + HEADER_HEIGHT)
          && <div
              onClick={() => setSelectedColor(centerColor)}
              className="customCursorContainer"
              style={position && {
                top: position.y,
                left: position.x,
              }}
            >
              <CustomCursor color={centerColor} canvasRef={secondaryCanvasRef}/>
            </div>}
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="mainCanvas"
        />
      </div>
    </div>
  );
}

export default App;
