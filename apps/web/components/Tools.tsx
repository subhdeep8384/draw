"use client"
import { Tool, tools } from "@/types/Tools";


export function Tools({setSelectedTool} :{
  setSelectedTool : React.Dispatch<React.SetStateAction<Tool | null>>
}){

      
    return (
        <div className="w-full flex justify-center fixed top-4 left-0 z-50">
        <div className="flex gap-6 border-2 bg-slate-900 rounded-2xl px-8 py-4">
          {tools.map((tool) => {
            return (
              <div
                key={tool.shortcut}
                onClick={() => setSelectedTool(tool)}
                className="flex items-center justify-center"
              >
                {tool.icon}
              </div>
            );
          })}
        </div>
      </div>
    )
}