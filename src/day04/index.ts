import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => line.split(""))

type Coord = [number, number]
const SPACES: Coord[] = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
]

const getRolls = (grid: string[][]): Coord[] => {
  return grid.reduce((rolls, row, rowIndex) => {
    row.forEach((gridItem, columnIndex) => {
      if (gridItem === "@") {
        rolls = [...rolls, [columnIndex, rowIndex]]
      }
    })
    return rolls
  }, [] as Coord[])
}

const removeRolls = (grid: string[][], rolls: Coord[]) => {
  return rolls.reduce(
    ({ removed, adjacent }, [rollX, rollY]) => {
      const adjacentRolls = SPACES.reduce((adjacent, [x, y]) => {
        if (grid[rollY + y]?.[rollX + x] === "@") {
          return [...adjacent, [rollX + x, rollY + y] as Coord]
        }
        return adjacent
      }, [] as Coord[])

      if (adjacentRolls.length < 4) {
        adjacentRolls.forEach((coord) => {
          adjacent.set(coord.join(","), coord)
        })
        return {
          removed: [...removed, [rollX, rollY] as Coord],
          adjacent,
        }
      }
      return { removed, adjacent }
    },
    { removed: [] as Coord[], adjacent: new Map<string, Coord>() },
  )
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  const rolls = getRolls(grid)
  return removeRolls(grid, rolls).removed.length
}

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput)
  let totalRemoved = 0
  let removal = removeRolls(grid, getRolls(grid))

  while (removal.removed.length > 0) {
    totalRemoved += removal.removed.length
    removal.removed.forEach(([x, y]) => {
      grid[y][x] = "x"
      removal.adjacent.delete(`${x},${y}`)
    })
    removal = removeRolls(grid, [...removal.adjacent.values()])
  }

  return totalRemoved
}

const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`

run({
  part1: {
    tests: [
      {
        input,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
