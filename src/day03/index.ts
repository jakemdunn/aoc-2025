import run from "aocrunner"

const parseInput = (rawInput: string) =>
  rawInput
    .split("\n")
    .map((bank) => bank.split("").map((battery) => parseInt(battery)))
const findMaxIndex = (
  bank: number[],
  startingIndex: number,
  remainingIndexes: number,
) => {
  let maxIndex = startingIndex
  for (
    let index = startingIndex + 1;
    index < bank.length - remainingIndexes && bank[maxIndex] !== 9;
    index++
  ) {
    if (bank[index] > bank[maxIndex]) {
      maxIndex = index
    }
  }
  return maxIndex
}
const findBankJoltage = (bank: number[], digits: number) => {
  const indexes: number[] = []
  for (let digit = 0; digit < digits; digit++) {
    const lastIndex = indexes[indexes.length - 1]
    indexes.push(
      findMaxIndex(
        bank,
        lastIndex !== undefined ? lastIndex + 1 : 0,
        digits - indexes.length - 1,
      ),
    )
  }
  return parseInt(indexes.map((index) => bank[index]).join(""))
}

const part1 = (rawInput: string) => {
  const banks = parseInput(rawInput)
  return banks.reduce((total, bank) => {
    return total + findBankJoltage(bank, 2)
  }, 0)
}

const part2 = (rawInput: string) => {
  const banks = parseInput(rawInput)
  return banks.reduce((total, bank) => {
    return total + findBankJoltage(bank, 12)
  }, 0)
}

const input = `987654321111111
811111111111119
234234234234278
818181911112111`

run({
  part1: {
    tests: [
      {
        input,
        expected: 357,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 3121910778619,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
