export interface Rectangle {
    type : "rectangle";
    x :number ;
    y:number ;
    width : number ;
    height : number ;
}

export interface Line {
    type:"line";
    x1:number; 
    y1:number ;  
    x2:number;
    y2:number ;
}

export interface circle {
  type: "circle";
  x: number;
  y: number;
  radius: number;
}

export type Shape = | Rectangle | Line | circle 