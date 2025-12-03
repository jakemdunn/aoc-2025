import run from "aocrunner"

const getJoltage = (banks: string, digits: number) => {
  let regex: string | undefined
  for (let index = 0; index < digits; index++) {
    const buffer = index > 0 ? `.*.{${index}}` : ""
    regex =
      `(?<battery${digits - index}>` +
      `9|` +
      `8(?!.*9${buffer})|` +
      `7(?!.*[89]${buffer})|` +
      `6(?!.*[7-9]${buffer})|` +
      `5(?!.*[6-9]${buffer})|` +
      `4(?!.*[5-9]${buffer})|` +
      `3(?!.*[4-9]${buffer})|` +
      `2(?!.*[3-9]${buffer})|` +
      `1(?!.*[2-9]${buffer})` +
      `).*?${regex ?? `$`}`
  }
  return [...banks.matchAll(new RegExp(regex!, "mg"))].reduce(
    (total, bank) => total + parseInt(Object.values(bank.groups!).join("")),
    0,
  )
}

const part1 = (rawInput: string) => getJoltage(rawInput, 2)
const part2 = (rawInput: string) => getJoltage(rawInput, 12)

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
