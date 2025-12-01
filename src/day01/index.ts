import run from "aocrunner"

const mod = (input: number, modulo: number) => ((input % modulo) + modulo) % modulo
const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((line) => parseInt(line.replace("L", "-").replace("R", "")))

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const result = input.reduce(
    ({ dial, zeros }, line) => {
      const step = mod(dial + line, 100)
      if(step === 0) {
        zeros ++
      }
      return { dial: step, zeros }
    },
    { dial: 50, zeros: 0 },
  )

  return result.zeros
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const result = input.reduce(
    ({ dial, zeros }, line) => {
      const step = mod(dial + line, 100)
      if(line > 0) {
        zeros += Math.floor((dial + line) / 100)
      }
      if(line < 0) {
        const diff = Math.ceil((dial + line) / 100)
        if(diff <= 0) {
          zeros -= diff - (dial !== 0 ? 1 : 0)
        }
      }
      return { dial: step, zeros }
    },
    { dial: 50, zeros: 0 },
  )

  return result.zeros
}

const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`

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
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
