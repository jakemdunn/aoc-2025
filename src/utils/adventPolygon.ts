export type Coordinate = { x: number; y: number }
export type Triangle = [Coordinate, Coordinate, Coordinate]

export const area = (p: Coordinate, q: Coordinate, r: Coordinate) => {
  return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
}
export const isConvex = ([a, b, c]: Triangle) => {
  return area(a, b, c) <= 0
}
export const getLeftmost = (coordinates: Coordinate[]) => {
  return coordinates.reduce<[Coordinate, number]>(
    ([leftmost, leftmostIndex], coordinate, index) =>
      coordinate.x < leftmost.x ||
      (coordinate.x === leftmost.x && coordinate.y < leftmost.y)
        ? [coordinate, index]
        : [leftmost, leftmostIndex],
    [coordinates[0], 0],
  )
}
export const expandPolygon = (input: Coordinate[]) => {
  const [, leftmostIndex] = getLeftmost(input)
  const transforms: Coordinate[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ]

  const expanded = [...input]
  let transformIndex = 0
  let index = leftmostIndex + 1
  let prevConvex = true
  do {
    const prevVertex = expanded[(index + expanded.length - 1) % expanded.length]
    const midVertex = expanded[index % expanded.length]
    const nextVertext = expanded[(index + 1) % expanded.length]

    const nextConvex = isConvex([prevVertex, midVertex, nextVertext])

    if (prevConvex === nextConvex) {
      transformIndex =
        (transformIndex + transforms.length + (nextConvex ? 1 : -1)) %
        transforms.length
    }
    expanded[index % expanded.length] = {
      x: midVertex.x + transforms[transformIndex].x,
      y: midVertex.y + transforms[transformIndex].y,
    }

    prevConvex = nextConvex
    index = (index + 1) % expanded.length
  } while (index !== leftmostIndex)

  return expanded
}
