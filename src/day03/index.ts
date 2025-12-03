import run from "aocrunner"

const parseInput = (rawInput: string) => rawInput.split("\n")
const findNextBattery = (bank: string, remainingIndexes: number) => {
  const regex = new RegExp(
    `(` +
      `9|` +
      `8(?!.*9.*.{${remainingIndexes}})|` +
      `7(?!.*[98].*.{${remainingIndexes}})|` +
      `6(?!.*[987].*.{${remainingIndexes}})|` +
      `5(?!.*[9876].*.{${remainingIndexes}})|` +
      `4(?!.*[98765].*.{${remainingIndexes}})|` +
      `3(?!.*[987654].*.{${remainingIndexes}})|` +
      `2(?!.*[9876543].*.{${remainingIndexes}})|` +
      `1(?!.*[98765432].*.{${remainingIndexes}})` +
      `)(.*.{${remainingIndexes}})$`,
  )

  return bank.match(regex)!
}
const findBankJoltage = (bank: string, digits: number) => {
  let batteries = ""
  let remaining = bank
  while (batteries.length < digits) {
    const nextBattery = findNextBattery(
      remaining,
      digits - batteries.length - 1,
    )
    batteries = batteries + nextBattery[1]
    remaining = nextBattery[2]
  }
  return parseInt(batteries)
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
