import run from "aocrunner"

interface Coord3d {
  x: number
  y: number
  z: number
}

interface Junction extends Coord3d {
  index: number
  set?: Set<Junction>
}

const distance3d = (a: Coord3d, b: Coord3d) =>
  Math.sqrt(
    Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2),
  )

const parseInput = (rawInput: string) => {
  let connections = 1000
  const lines = rawInput.split("\n")
  if (lines[0].match(/^connect:/)) {
    connections = parseInt(lines.shift()!.split(":")[1])
  }
  const junctions = lines.map<Junction>((line, index) => {
    const [x, y, z] = line.split(",").map((coordinate) => parseInt(coordinate))
    return { x, y, z, index }
  })

  const distances = new Map<number, Junction[]>()
  for (let index = 0; index < junctions.length; index++) {
    const source = junctions[index]
    for (
      let targetIndex = index + 1;
      targetIndex < junctions.length;
      targetIndex++
    ) {
      const target = junctions[targetIndex]
      distances.set(distance3d(source, target), [source, target])
    }
  }

  const orderedJunctions = [...distances.entries()].sort(([a], [b]) => a - b)
  return {
    connections,
    junctions,
    orderedJunctions,
  }
}

const mergeCircuits = (
  a: Junction,
  b: Junction,
  circuits: Set<Set<Junction>>,
) => {
  if (a.set && b.set) {
    if (a.set === b.set) {
      return
    }
    circuits.delete(b.set)
    b.set.forEach((junction) => {
      junction.set = a.set
      a.set!.add(junction)
    })
  } else if (a.set) {
    a.set.add(b)
    b.set = a.set
  } else if (b.set) {
    b.set.add(a)
    a.set = b.set
  } else {
    const set = new Set([a, b])
    a.set = set
    b.set = set
    circuits.add(set)
  }
}

const part1 = (rawInput: string) => {
  const { connections, orderedJunctions } = parseInput(rawInput)
  const circuits = new Set<Set<Junction>>()

  for (let index = 0; index < connections; index++) {
    const [, [a, b]] = orderedJunctions[index]
    mergeCircuits(a, b, circuits)
  }

  const sizes = [...circuits.values()]
    .map((set) => set.size)
    .sort((a, b) => b - a)
    .splice(0, 3)

  return sizes.reduce((sum, count) => sum * count)
}

const part2 = (rawInput: string) => {
  const { junctions, orderedJunctions } = parseInput(rawInput)
  const circuits = new Set<Set<Junction>>()
  junctions.forEach((junction) => {
    junction.set = new Set([junction])
    circuits.add(junction.set)
  })

  let index = 0
  while (circuits.size > 1) {
    const [, [a, b]] = orderedJunctions[index]
    mergeCircuits(a, b, circuits)
    index++
  }

  const [, [a, b]] = orderedJunctions[index - 1]
  return a.x * b.x
}

const input = `connect:10
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`

run({
  part1: {
    tests: [
      {
        input,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 25272,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
