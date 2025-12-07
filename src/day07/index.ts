import run from "aocrunner"

const runBeams = (rawInput: string) => {
  const lineLength = rawInput.indexOf("\n")
  const regexGroups = [
    `[\\|S].{${lineLength + 1}}`,
    `[\\|S].{${lineLength}}\\^.`,
    `[\\|S].{${lineLength}}(?=\\^)`,
  ]
  const regex = new RegExp(`\\.(?<=(${regexGroups.join("|")}))`, "gms")

  let last = rawInput
  let parsed = rawInput.replace(regex, "|")
  while (parsed !== last) {
    last = parsed
    parsed = parsed.replace(regex, "|")
  }

  const splitsRegex = new RegExp(
    `(?<=\\|)(?<!\\..{${lineLength}})\\^(?=\\|)`,
    "gms",
  )

  return { parsed, splitsRegex }
}

const part1 = (rawInput: string) => {
  const { parsed, splitsRegex } = runBeams(rawInput)
  return parsed.match(splitsRegex)?.length
}

const part2 = (rawInput: string) => {
  const { parsed, splitsRegex } = runBeams(rawInput.replace(/^\.*$\n?/gm, ""))
  const paths: Record<number, number> = {}
  parsed.split("\n").forEach((line, index, lines) => {
    ;[...(lines[index - 1] ?? "" + line).matchAll(splitsRegex)].forEach(
      (match) => {
        paths[match.index - 1] =
          (paths[match.index - 1] ?? 0) + (paths[match.index] ?? 1)
        paths[match.index + 1] =
          (paths[match.index + 1] ?? 0) + (paths[match.index] ?? 1)
        paths[match.index] = 0
      },
    )
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
