import run from "aocrunner"
import { Grid, MaybeIndex } from "../utils/grid.js"

type Rolls = "@" | "x" | "."
const removeRolls = (grid: Grid<Rolls>, rolls: MaybeIndex[]) => {
  const adjacent = new Set<number>()
  const removed = new Set<number>()
  rolls.forEach((roll) => {
    const adjacentRolls = grid
      .getItemsAtDeltas(roll, Grid.DELTAS.SURROUNDING)
      .filter((item) => item.value === "@")

    if (adjacentRolls.length < 4) {
      adjacentRolls.forEach((coord) => {
        adjacent.add(coord.index)
      })
      removed.add(grid.getMaybeIndex(roll))
    }
  })
  return { removed, adjacent }
}

const part1 = (rawInput: string) => {
  const grid = new Grid<Rolls>(rawInput)
  const rolls = grid.findItems("@")
  return removeRolls(grid, rolls).removed.size
}

const part2 = (rawInput: string) => {
  const grid = new Grid<Rolls>(rawInput)
  let totalRemoved = 0
  let { removed, adjacent } = removeRolls(grid, grid.findItems("@"))
  while (removed.size > 0) {
    totalRemoved += removed.size
    removed.forEach((item) => {
      grid.set(item, "x")
      adjacent.delete(item)
    })
    ;({ removed, adjacent } = removeRolls(grid, [...adjacent.values()]))
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
