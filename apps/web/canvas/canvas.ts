
import { Line, Rectangle, Shape , circle } from "./shape";

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("2D context not supported");
    }

    this.canvas = canvas;
    this.ctx = ctx;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  

  render(shapes: Shape[]) {
  const ctx = this.ctx;

  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  shapes.forEach((shape) => {
    ctx.beginPath();
    ctx.strokeStyle = "white"; 
    ctx.lineWidth = 2;

    if (shape.type === "rectangle") {
      this.drawRectangle(shape)
    }

    if (shape.type === "line") {
      this.drawLine(shape)
    }
    if(shape.type === "circle"){
      this.drawCircle(shape)
    }
  });
}



  private drawCircle(circle: circle) {
  
    this.ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private drawRectangle(rect: Rectangle) {
    this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  }

  private drawLine(line: Line) {
    this.ctx.moveTo(line.x1, line.y1);
    this.ctx.lineTo(line.x2, line.y2);
    this.ctx.stroke();
  }
}