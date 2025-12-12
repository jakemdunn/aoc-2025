import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const presents = rawInput.split("\n\n")
  const demands = presents
    .pop()!
    .split("\n")
    .map((line) => {
      const [, x, y, quantities] = line.match(/([\d]+)x([\d]+): (.*)/)!
      return {
        x: parseInt(x),
        y: parseInt(y),
        quantities: quantities
          .split(" ")
          .reduce((sum, quantity) => sum + parseInt(quantity), 0),
      }
    })
  return { presents, demands }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.demands.filter(({ x, y, quantities }) => quantities * 9 <= x * y)
    .length
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return "not a thing"
}

run({
  part1: {
    tests: [
      {
        input: `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`,
        expected: "who cares",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
