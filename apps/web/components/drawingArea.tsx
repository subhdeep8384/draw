"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas , PencilBrush } from "fabric";
import { useParams } from "next/navigation";

export default function DrawingArea() {
  const canvasRef = useRef(null);
  const [canvas , setCanvas ] = useState<Canvas | null>(null)


  useEffect(() =>{
    if(canvasRef.current){
      const initCanvas = new Canvas(canvasRef.current ,{
        isDrawingMode: true,
      })

      if(!initCanvas.freeDrawingBrush){
        initCanvas.freeDrawingBrush = new PencilBrush(initCanvas);
      }
      initCanvas.freeDrawingBrush.width = 5;
      initCanvas.freeDrawingBrush.color = "#FFFFFF";
      const resizeCanvas = () => {
          initCanvas.setDimensions({
            width : window.innerWidth,
            height : window.innerHeight
          })
          initCanvas.backgroundColor = "#000";
          initCanvas.renderAll();
      };
      resizeCanvas(); 
      setCanvas(initCanvas)

      initCanvas.on("path:created" , (e) =>{
        const path = e.path ;
        const data = path.toJSON();
        console.log(data)
      })
      return () => {
        window.removeEventListener("resize", resizeCanvas);
        initCanvas.dispose()
      }
    }
  }, [])
  

  return (
    <div className="fixed inset-0">
      <canvas ref={canvasRef}  />
    </div>
  );
}