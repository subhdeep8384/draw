export interface BaseShape {
  id: string;
}

export interface Rectangle extends BaseShape {
    type : "rectangle";
    x :number ;
    y:number ;
    width : number ;
    height : number ;
}


export interface Line extends BaseShape{
    type:"line";
    x1:number; 
    y1:number ;  
    x2:number;
    y2:number ;
}

export interface circle extends BaseShape{
  type: "circle";
  x: number;
  y: number;
  radius: number;
}

export interface freeDraw extends BaseShape{
    type : "free-Draw",
    points: { x: number; y: number }[];
}

export type Shape = | Rectangle | Line | circle  | freeDraw