import React, {useCallback, useRef, useState, MouseEvent, useEffect} from 'react';
import { rgbToHex } from "./helpers";
import { CursorPosition, CursorType } from "./types";
import './App.css';


function App() {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cursorType, setCursorType] = useState<CursorType>(CursorType.DEFAULT);
  const [position, setPosition] = useState<CursorPosition>();
  const [color, setColor] = useState<string>("#000000");

  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if(cursorType !== CursorType.COLOR_PICKER)
      setCursorType(CursorType.COLOR_PICKER)

    const canvas = canvasRef.current;
    const context = canvas && canvas.getContext("2d");
    const canvasParams = canvas && canvas.getBoundingClientRect();
    const col = context && context.getImageData(e.clientX, e.clientY - 108, 1, 1).data;

    if(col)
      setColor(rgbToHex(col[0], col[1], col[2]))
    console.log(color, e.clientX, e.clientY)

    setPosition({
      x: e.clientX - 25,
      y: e.clientY - 25 - (canvasParams?.top || 0)
    });
  }, [color, cursorType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas && canvas.getContext("2d");
    const img = new Image();
    img.addEventListener("load", () => {
      if( context ) {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    });
    img.src = require("./assets/1920x1080-4598441-beach-water-pier-tropical-sky-sea-clouds-island-palm-trees.jpg");
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="editor" onMouseMove={onMouseMove} onMouseLeave={() => setCursorType(CursorType.DEFAULT)}>
        {
          cursorType === CursorType.COLOR_PICKER
          && <div className="customCursorContainer" style={position && { top: position.y, left: position.x, backgroundColor: color}}/>
        }
        <canvas ref={canvasRef} width="1920" height="928px" className="mainCanvas"/>
      </div>
    </div>
  );
}

export default App;
