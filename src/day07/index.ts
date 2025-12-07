import run from "aocrunner"
import { memo } from "../utils/memo.js"

const runBeams = memo((rawInput: string) => {
  let parsed = rawInput.replace(/^\.*$\n?/gm, "")
  const lineLength = parsed.indexOf("\n")
  const regexGroups = [
    `[\\|S].{${lineLength + 1}}`,
    `[\\|S].{${lineLength}}\\^.`,
    `[\\|S].{${lineLength}}(?=\\^)`,
  ]
  const regex = new RegExp(`\\.(?<=(${regexGroups.join("|")}))`, "gms")

  parsed = parsed
    .split("\n")
    .reduce((lines, line, index) => {
      if (index === 0) return [line]
      return [
        ...lines,
        `${lines[lines.length - 1]}\n${line}`
          .replace(regex, "|")
          .substring(lineLength + 1),
      ]
    }, [] as string[])
    .join("\n")

  const splitsRegex = new RegExp(
    `(?<=\\|)(?<!\\..{${lineLength}})\\^(?=\\|)`,
    "gms",
  )

  return { parsed, splitsRegex, lineLength }
})

const part1 = (rawInput: string) => {
  const { parsed, splitsRegex } = runBeams(rawInput)
  return parsed.match(splitsRegex)?.length
}

const part2 = (rawInput: string) => {
  const { parsed, splitsRegex, lineLength } = runBeams(rawInput)
  const paths: Record<number, number> = {}
  ;[...parsed.matchAll(splitsRegex)].forEach((match) => {
    const column = match.index % (lineLength + 1)
    paths[column - 1] = (paths[column - 1] ?? 0) + (paths[column] ?? 1)
    paths[column + 1] = (paths[column + 1] ?? 0) + (paths[column] ?? 1)
    paths[column] = 0
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
