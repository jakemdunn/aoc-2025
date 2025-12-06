import run from "aocrunner"

const operations: Record<"+" | "*", (input: number[]) => number> = {
  "+": (numbers) => numbers.reduce((sum, number) => sum + number),
  "*": (numbers) => numbers.reduce((sum, number) => sum * number),
}

const solve = ({
  numbers,
  operators,
}: {
  operators: ("+" | "*")[]
  numbers: number[][]
}) =>
  operators.reduce(
    (sum, operator, index) => sum + operations[operator](numbers[index]),
    0,
  )

const part1 = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const operators = lines.pop()!.replace(/\s+/g, "").split("") as ("+" | "*")[]
  const numbers = lines.reduce((columns, line) => {
    line
      .trim()
      .replace(/\s+/g, ",")
      .split(",")
      .map((character, columnIndex) => {
        if (!columns[columnIndex]) {
          columns[columnIndex] = []
        }
        columns[columnIndex].push(parseInt(character))
      })
    return columns
  }, [] as number[][])
  return solve({ operators, numbers })
}

const part2 = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const operators = [...lines.pop()!.matchAll(/[\S](\s(?!\S))*/g)]
  const numbers = operators.reduce((groups, match) => {
    const numbers = match[0].split("").map((_, index) => {
      const numberString = lines.reduce(
        (output, line) => (output = output + line[match.index + index]),
        "",
      )
      return parseInt(numberString)
    })
    return [...groups, numbers]
  }, [] as number[][])

  return solve({
    operators: operators.map((match) => match[0].charAt(0) as "+" | "*"),
    numbers,
  })
}

const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `

run({
  part1: {
    tests: [
      {
        input,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
})
