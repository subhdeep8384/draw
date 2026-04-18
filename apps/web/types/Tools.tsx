import {
    Square,
    Circle,
    Minus,
    Pencil,
    Eraser,
    Diamond,
    Hand,
    MousePointer,
    MoveRight,
    TextIcon
} from "lucide-react"

export type ToolType =
  | "selection"
  | "grab"
  | "rectangle"
  | "diamond"
  | "circle"
  | "line"
  | "arrow"
  | "free-draw"
  | "eraser"
  | "text";


export type Tool = {
  type: ToolType;
  icon: React.ReactNode;
  label: string;
  shortcut: number;
};

export const tools: Tool[] = [
    {
        type: "selection",
        icon: <MousePointer />,
        shortcut: 1,
        label: 'Select'
    },
    {
        type: "grab",
        icon: <Hand />,
        shortcut: 2,
        label: 'Grab'
    },
    {
        type: "rectangle",
        icon: <Square />,
        shortcut: 3,
        label: 'Rectangle'
    },
    {
        type: "circle",
        icon: <Circle />,
        shortcut: 4,
        label: 'circle'
    },
    {
        type: "diamond",
        icon: <Diamond />,
        shortcut: 5,
        label: 'Diamond'
    },
    {
        type: "line",
        icon: <Minus />,
        shortcut: 6,
        label: 'Line'
    },
    {
        type: "free-draw",
        icon: <Pencil />,
        shortcut: 7,
        label: 'Free Draw'
    },
    {
        type: "arrow",
        icon: <MoveRight />,
        shortcut: 8,
        label: 'Arrow'
    },
    {
        type: "text",
        icon: <TextIcon className="" />,
        shortcut: 9,
        label: 'Text'
    },
    {
        type: "eraser",
        icon: <Eraser />,
        shortcut: 10,
        label: 'Eraser'
    }
]