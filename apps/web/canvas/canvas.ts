
import { Line, Rectangle, Shape , circle, freeDraw } from "./shape";

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offset = { x: 0, y: 0 };
  private scale = 1; //zoom effectt


  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("2D context not supported");
    }

    this.canvas = canvas;
    this.ctx = ctx;
  }

  
  pan(dx: number, dy: number) {
    this.offset.x += dx;
    this.offset.y += dy;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


getOffset() {
  return this.offset;
} 
getViewport() {
  return {
    scale: this.scale,
    offset: this.offset
  };
}

setViewport(scale: number, offset: { x: number; y: number }) {
  this.scale = scale;
  this.offset = offset;
}

render(shapes: Shape[]) {
    const ctx = this.ctx;
    this.clear();

    this.ctx.save();
    this.ctx.translate(this.offset.x, this.offset.y);
    this.ctx.scale(this.scale, this.scale);

    shapes.forEach((shape) => {
      ctx.beginPath();
      ctx.strokeStyle = "white"; 
      ctx.lineWidth = 2 / this.scale;

      if (shape.type === "rectangle") {
        this.drawRectangle(shape)
      }

      if (shape.type === "line") {
        this.drawLine(shape)
      }
      if(shape.type === "circle"){
        this.drawCircle(shape)
      }
      if(shape.type === "free-Draw"){
        this.freeDraw(shape)
      }
    });
    this.ctx.restore();
}

  private freeDraw(shape : freeDraw){
    const points = shape.points;
    if (points.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.stroke();
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

  zoom(delta: number, mouseX: number, mouseY: number) {
    const zoomFactor = 1.1;

    const newScale =
      delta > 0 ? this.scale / zoomFactor : this.scale * zoomFactor;

    
    const worldX = (mouseX - this.offset.x) / this.scale;
    const worldY = (mouseY - this.offset.y) / this.scale;

    this.scale = newScale;

    
    this.offset.x = mouseX - worldX * this.scale;
    this.offset.y = mouseY - worldY * this.scale;
  }
}