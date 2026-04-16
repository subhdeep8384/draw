import { Tool, tools } from "@/types/Tools"

export function ToolsArray({setSelectedTool} :{
    setSelectedTool : React.Dispatch<React.SetStateAction<Tool | null >>
}) {
    return <div className="bg-slate-800 flex px-10 py-2 rounded-4xl border-2">{
        tools.map((tool) => {
            return (<div
                className="flex mx-2"
                onClick={() => setSelectedTool(tool)}
                key={tool.label}>
                {tool.icon}
            </div>)
        })
    } </div>
}