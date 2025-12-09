import run from "aocrunner"
import { Coordinate, expandPolygon } from "../utils/adventPolygon.js"

const getSquare = (a: Coordinate, b: Coordinate): Coordinate[] => {
  if (a.x < b.x) {
    if (a.y < b.y) {
      return expandPolygon([a, { x: b.x, y: a.y }, b, { x: a.x, y: b.y }])
    } else {
      return expandPolygon([{ x: a.x, y: b.y }, b, { x: b.x, y: a.y }, a])
    }
  } else {
    if (b.y < a.y) {
      return expandPolygon([b, { x: a.x, y: b.y }, a, { x: b.x, y: a.y }])
    } else {
      return expandPolygon([{ x: b.x, y: a.y }, a, { x: a.x, y: b.y }, b])
    }
  }
}

const getSquares = (polygon: Coordinate[]) => {
  const areas = new Map<number, Coordinate[]>()
  for (let aIndex = 0; aIndex < polygon.length; aIndex++) {
    for (let bIndex = aIndex + 1; bIndex < polygon.length; bIndex++) {
      const a = polygon[aIndex]
      const b = polygon[bIndex]
      const square = getSquare(a, b)
      areas.set(
        (square[2].x - square[0].x) * (square[2].y - square[0].y),
        square,
      )
    }
  }
  return [...areas.entries()].sort(([a], [b]) => b - a)
}

const parseInput = (rawInput: string) => {
  const aocPolygon = rawInput.split("\n").map<Coordinate>((line) => {
    const [x, y] = line.split(",").map((value) => parseInt(value))
    return { x, y }
  })
  const polygon = expandPolygon(aocPolygon)
  const squares = getSquares(aocPolygon)
  return {
    polygon,
    squares,
  }
}

const withinBounds = (min: number, max: number, value: number) =>
  min < max ? value > min && value < max : value < min && value > max

const isCollision = (
  square: Coordinate[],
  segment: [Coordinate, Coordinate],
) => {
  return square.some((point, index) => {
    const next = square[index + 1] ?? square[0]
    const squareSegmentAxis = point.x === next.x ? "x" : "y"
    const segmentAxis = segment[0].x === segment[1].x ? "x" : "y"
    if (squareSegmentAxis === segmentAxis) return false

    const collisionOnAxis = withinBounds(
      point[segmentAxis],
      next[segmentAxis],
      segment[0][segmentAxis],
    )

    const collisionOffAxis = withinBounds(
      segment[0][squareSegmentAxis],
      segment[1][squareSegmentAxis],
      point[squareSegmentAxis],
    )
    return collisionOnAxis && collisionOffAxis
  })
}

const offset = (from: Coordinate, offset: [number, number]) => ({
  x: from.x + offset[0],
  y: from.y + offset[1],
})
const shrunkSquare = ([a, b, c, d]: Coordinate[]) => {
  return [
    offset(a, [0.5, 0.5]),
    offset(b, [-0.5, 0.5]),
    offset(c, [-0.5, -0.5]),
    offset(d, [0.5, -0.5]),
  ]
}

const part1 = (rawInput: string) => parseInput(rawInput).squares[0][0]
const part2 = (rawInput: string) => {
  const { polygon, squares } = parseInput(rawInput)
  for (let [squareArea, square] of squares) {
    const contained = !polygon.some((point, index) => {
      const next = polygon[index + 1] ?? polygon[0]
      return isCollision(shrunkSquare(square), [point, next])
    })
    if (contained) {
      return squareArea
    }
  }
}

const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`

run({
  part1: {
    tests: [
      {
        input,
        expected: 50,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 24,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
