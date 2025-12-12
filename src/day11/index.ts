import run from "aocrunner"
import { memo } from "../utils/memo.js"

interface Node {
  id: string
  neighbors: Map<string, number>
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const graph = new Map<string, Node>()
  lines.forEach((line) => {
    const [, key, connections] = line.match(/([^:]+):\s(.*)$/)!
    graph.set(key, {
      id: key,
      neighbors: new Map(connections.split(" ").map((id) => [id, 1])),
    })
  })
  return graph
}

const part1 = (rawInput: string) => {
  const graph = parseInput(rawInput)
  graph.set("out", { id: "out", neighbors: new Map() })

  const getPathCount = memo((nodeId: string): number => {
    const node = graph.get(nodeId)!

    const total = [...node.neighbors.keys()].reduce((sum, neighbor) => {
      const pathCount = neighbor === "out" ? 1 : getPathCount(neighbor)
      return sum + pathCount
    }, 0)
    return total
  })
  return getPathCount("you")
}

const part2 = (rawInput: string) => {
  const graph = parseInput(rawInput)
  graph.set("out", { id: "out", neighbors: new Map() })

  type Counts = Record<"out" | "dac" | "fft", number>
  const getPathCount = memo((nodeId: string): Counts => {
    const node = graph.get(nodeId)!

    const total = [...node.neighbors.keys()].reduce(
      (sum, neighbor) => {
        const pathCount =
          neighbor === "out"
            ? { out: 1, dac: 0, fft: 0 }
            : getPathCount(neighbor)
        return {
          out: sum.out + pathCount.out,
          dac: sum.dac + pathCount.dac,
          fft: sum.fft + pathCount.fft,
        }
      },
      {
        dac: 0,
        fft: 0,
        out: 0,
      } as Counts,
    )
    if (nodeId === "dac") {
      total.dac = total.fft ? total.fft : total.out
    }
    if (nodeId === "fft") {
      total.fft = total.dac ? total.dac : total.out
    }
    return total
  })
  const paths = getPathCount("svr")
  return Math.min(paths.dac, paths.fft, paths.out)
}

run({
  part1: {
    tests: [
      {
        input: `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out
`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
