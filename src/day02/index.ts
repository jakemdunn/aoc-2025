import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput.split(",").reduce((numbers, line) => {
    const [bottom, top] = line
      .match(/(\d+)-(\d+)/)!
      .splice(1, 2)
      .map((n) => parseInt(n))
    return [
      ...numbers,
      ...[...new Array(top - bottom + 1)].map((_, index) => bottom + index),
    ]
  }, [] as number[])

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((sum, number) => {
    const text = number.toString()
    if (text.length % 2 === 1) return sum
    if (text.substring(0, text.length / 2) === text.substring(text.length / 2))
      return sum + number
    return sum
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input.reduce((sum, number) => {
    const text = number.toString()
    rangeCheck: for (let range = 1; range <= text.length / 2; range++) {
      if (text.length % range !== 0) continue
      for (
        let comparison = range;
        comparison < text.length;
        comparison += range
      ) {
        if (
          text.substring(0, range) !==
          text.substring(comparison, comparison + range)
        )
          continue rangeCheck
      }
      return sum + number
    }
    return sum
  }, 0)
}

const input = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`
run({
  part1: {
    tests: [
      {
        input,
        expected: 1227775554,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 4174379265,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
