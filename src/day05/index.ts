import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const [rawRanges, ingredients] = rawInput.split("\n\n")
  const ranges = rawRanges
    .split("\n")
    .map((line) => line.split("-").map((bound) => parseInt(bound)))
  ranges.sort(([a], [b]) => a - b)

  for (let index = 0; index < ranges.length; index++) {
    const range = ranges[index]
    for (let next = index + 1; next < ranges.length; next++) {
      const nextRange = ranges[next]
      if (nextRange[0] <= range[1]) {
        ranges[index][1] = Math.max(nextRange[1], range[1])
        ranges.splice(next, 1)
        next--
        continue
      }
      break
    }
  }
  return {
    ranges,
    ingredients: ingredients
      .split("\n")
      .map((ingredient) => parseInt(ingredient)),
  }
}

const part1 = (rawInput: string) => {
  const { ranges, ingredients } = parseInput(rawInput)

  const conditionals = ranges.map(
    ([bottom, top]) =>
      (ingredient: number) =>
        ingredient >= bottom && ingredient <= top,
  )
  const fresh = ingredients.filter((ingredient) =>
    conditionals.some((condition) => condition(ingredient)),
  )

  return fresh.length
}

const part2 = (rawInput: string) => {
  const { ranges } = parseInput(rawInput)
  return ranges.reduce((sum, [bottom, top]) => sum + top - bottom + 1, 0)
}

const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`

run({
  part1: {
    tests: [
      {
        input,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
