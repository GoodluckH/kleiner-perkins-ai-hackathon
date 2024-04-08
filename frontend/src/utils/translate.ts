export function translatePoint(
  x: number,
  y: number,
  canvasWidth: number,
  canvasHeight: number
) {
  // Calculate canvas center
  var centerX = canvasWidth / 2;
  var centerY = canvasHeight / 2;

  // Scale and translate x-coordinate
  var canvasX = centerX + x * (canvasWidth / 2);
  // Scale and translate y-coordinate (Note: y is inverted in canvas)
  var canvasY = centerY - y * (canvasHeight / 2);

  return { x: canvasX, y: canvasY };
}
