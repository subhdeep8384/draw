import { Shape } from "@/canvas/shape";

export function intersectsSelectionBox(
  shape: Shape,
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  const boxLeft = Math.min(box.x, box.x + box.width);
  const boxRight = Math.max(box.x, box.x + box.width);

  const boxTop = Math.min(box.y, box.y + box.height);
  const boxBottom = Math.max(box.y, box.y + box.height);

  let shapeLeft: number;
  let shapeRight: number;
  let shapeTop: number;
  let shapeBottom: number;

  if (shape.type === "rectangle") {
    shapeLeft = Math.min(shape.x, shape.x + shape.width);
    shapeRight = Math.max(shape.x, shape.x + shape.width);
    shapeTop = Math.min(shape.y, shape.y + shape.height);
    shapeBottom = Math.max(shape.y, shape.y + shape.height);
  }

  else if (shape.type === "circle") {
    shapeLeft = shape.x - shape.radius;
    shapeRight = shape.x + shape.radius;
    shapeTop = shape.y - shape.radius;
    shapeBottom = shape.y + shape.radius;
  }

  else if (shape.type === "line") {
    shapeLeft = Math.min(shape.x1, shape.x2);
    shapeRight = Math.max(shape.x1, shape.x2);
    shapeTop = Math.min(shape.y1, shape.y2);
    shapeBottom = Math.max(shape.y1, shape.y2);
  }

  else {
    const xs = shape.points.map(p => p.x);
    const ys = shape.points.map(p => p.y);

    shapeLeft = Math.min(...xs);
    shapeRight = Math.max(...xs);
    shapeTop = Math.min(...ys);
    shapeBottom = Math.max(...ys);
  }

  return (
    boxLeft <= shapeRight &&
    boxRight >= shapeLeft &&
    boxTop <= shapeBottom &&
    boxBottom >= shapeTop
  );
}