import run from "aocrunner"

const iterateInput = (
  rawInput: string,
  iterator: (character: string, index: number) => void,
) => {
  const lineLength = rawInput.indexOf("\n") + 1
  ;[...rawInput.matchAll(/(S|\^)/gm)].map((match) =>
    iterator(match[0], match.index % lineLength),
  )
}

const part1 = (rawInput: string) => {
  const paths: Record<number, boolean> = {}
  let sum: number = 0
  iterateInput(rawInput, (character, index) => {
    if (character === "S") {
      paths[index] = true
    }
    if (character === "^" && paths[index]) {
      paths[index] = false
      paths[index + 1] = true
      paths[index - 1] = true
      sum++
    }
  })
  return sum
}

const part2 = (rawInput: string) => {
  const paths: Record<number, number> = {}
  iterateInput(rawInput, (character, index) => {
    if (character === "S") {
      paths[index] = 1
    }
    if (character === "^" && paths[index]) {
      paths[index + 1] = (paths[index + 1] ?? 0) + paths[index]
      paths[index - 1] = (paths[index - 1] ?? 0) + paths[index]
      delete paths[index]
    }
  })
  return Object.values(paths).reduce((sum, timelines) => sum + timelines)
}

const input = `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`

run({
  part1: {
    tests: [
      {
        input,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
