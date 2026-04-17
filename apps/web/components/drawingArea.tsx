"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { Canvas } from "../canvas/canvas";
import { Shape } from "../canvas/shape";
import { ToolsArray } from "./toolsArray";
import { Tool, ToolType } from "@/types/Tools";
import { SocketContext } from "@/context/socketContext";
import { parse } from "path";
import { toast } from "sonner";



export default function DrawingArea({session , roomId} : any  ) {
  const {session : data , user } = session
  const [renderTick, forceRender] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstanceRef = useRef<Canvas | null>(null);

  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [tool, setTool] = useState<ToolType>("circle");

  const isDrawing = useRef(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);
  const [previewShape, setPreviewShape] = useState<Shape | null>(null);

  const panStart = useRef<{ x: number; y: number } | null>(null);
  const { socket , isConnected } = useContext(SocketContext)

  const getScreenPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

const getWorldPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const offset = canvasInstanceRef.current?.getOffset() || { x: 0, y: 0 };

  return {
    x: x - offset.x,
    y: y - offset.y,
  };
};


 const getPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  
 const offset = canvasInstanceRef.current?.getOffset() || { x: 0, y: 0 };

  return {
    x: x - offset.x,
    y: y - offset.y,
  };
};


  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "grab") {
      panStart.current = getScreenPoint(e);
      return;
    }
    startPoint.current = getWorldPoint(e);
    isDrawing.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {

    const current = getWorldPoint(e)
    
    
    if (tool === "grab" && panStart.current && canvasInstanceRef.current) {
      const current = getScreenPoint(e);
      const dx = current.x - panStart.current.x;
      const dy = current.y - panStart.current.y;
      
      canvasInstanceRef.current.pan(dx, dy);
      
      panStart.current = current;
      
      forceRender((p) => p + 1);      
      return;
    }
    
    if (!isDrawing.current || !startPoint.current) return;

    if (tool === "rectangle") {
      setPreviewShape({
        type: "rectangle",
        x: startPoint.current.x,
        y: startPoint.current.y,
        width: current.x - startPoint.current.x,
        height: current.y - startPoint.current.y,
      });
    } else if (tool === "circle") {

      const current = getPoint(e);
      const dx = current.x - startPoint.current.x;
      const dy = current.y - startPoint.current.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      setPreviewShape({
        type: "circle",
        x: startPoint.current.x,
        y: startPoint.current.y,
        radius
      })
    }
    else {
      setPreviewShape({
        type: "line",
        x1: startPoint.current.x,
        y1: startPoint.current.y,
        x2: current.x,
        y2: current.y,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "grab") {
      panStart.current = null;
      return;
    }

    if (!isDrawing.current || !startPoint.current) return;

    const end = getPoint(e);

    let newShape: Shape;

    if (tool === "rectangle") {
      newShape = {
        type: "rectangle",
        x: startPoint.current.x,
        y: startPoint.current.y,
        width: end.x - startPoint.current.x,
        height: end.y - startPoint.current.y,
      };
    } else if (tool === "circle") {
      const dx = end.x - startPoint.current.x;
      const dy = end.y - startPoint.current.y;

      const radius = Math.sqrt(dx * dx + dy * dy);

      newShape = {
        type: "circle",
        x: startPoint.current.x,
        y: startPoint.current.y,
        radius,
      };
    }

    else {
      newShape = {
        type: "line",
        x1: startPoint.current.x,
        y1: startPoint.current.y,
        x2: end.x,
        y2: end.y,
      };
    }
   
    socket?.send(JSON.stringify({
      type : "draw" ,
      roomId : roomId,
      userId : user.id,
      payload : {
        message : newShape
      }
    }))
    setShapes((prev) => [...prev, newShape]);  
    isDrawing.current = false;
    startPoint.current = null;
    setPreviewShape(null);
  };


  useEffect(() =>{
    console.log("socket is " , socket)
    const handleDraw = (e: MessageEvent) => {
    const data = JSON.parse(e.data);

    if (data.type === "draw") {
      setShapes((prev) =>[...prev , data.payload.message])
    }
  };

    socket?.addEventListener("message" , handleDraw)

    if(!isConnected){
      toast.loading("waiting to connect to the room" )
    }else{
      toast.success("connected to the room " , roomId)
    }

    return () =>{
      socket?.removeEventListener("message" , handleDraw)
    }
  } , [isConnected])

  useEffect(() => {

    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener("resize", resize);
    canvasInstanceRef.current = new Canvas(canvas);
    
    
    return () => window.removeEventListener("resize", resize);
  }, []);


  useEffect(() => {
    if (!canvasInstanceRef.current) return;

    const canvas = canvasInstanceRef.current;
    const allShapes = [...shapes];

    if (previewShape) {
      allShapes.push(previewShape);
    }

    canvas.render(allShapes);
  }, [shapes, previewShape , renderTick]);


   useEffect(() => {
    if (selectedTool) {
      setTool(selectedTool.type as ToolType);
    }
  }, [selectedTool]);

  

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex justify-center items-center pt-4 z-10">
        <ToolsArray setSelectedTool={setSelectedTool} />
      </div>
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" ,cursor: tool === "grab" ? "grab" : "crosshair",}}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>

    </div>
  );
}