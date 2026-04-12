"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Canvas , classRegistry, PencilBrush } from "fabric";
import { SocketContext } from "@/context/socketContext";
import { useParams } from "next/navigation";


export default function DrawingArea({roomId} :{
  roomId : string
}) {
  const canvasRef = useRef(null);
  const [drawData , setDrawData] = useState("")
  const [canvas , setCanvas ] = useState<Canvas | null>(null)
  const socket = useContext(SocketContext)
  

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
        setDrawData(data)
      })

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        initCanvas.dispose()
      }
    }
  }, [])

  useEffect(() => {
  if (!drawData) return;

  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({
      roomId : roomId,
      type :"draw" ,
      payload :{
        message : drawData 
      }
    }));
    setDrawData("");
  } else {
    console.log("socket not ready");
  }
}, [drawData, socket]);
  

  return (
    <div className="fixed inset-0">
      <canvas ref={canvasRef}  />
    </div>
  );
}