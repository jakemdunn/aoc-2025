import run from "aocrunner"
import { init } from "z3-solver"
import { memo } from "../utils/memo.js"

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((line) => {
    const target = line.match(/\[(.*)\]/)![1]
    const actions = [...line.matchAll(/\((.*?)\)/g)].map((action) => {
      return action[1].split(",").map((index) => parseInt(index))
    })
    const targetJoltage = line.match(/\{(.*)\}/)![1]
    const targetJoltageArray = targetJoltage
      .split(",")
      .map((joltage) => parseInt(joltage))
    return { target, actions, targetJoltage, targetJoltageArray }
  })

type Parsed = ReturnType<typeof parseInput>

const applyActions = memo(({ actions }: Parsed[0], state: string) => {
  return actions.map((action) => {
    const newState = state.split("")
    action.forEach(
      (buttonIndex) =>
        (newState[buttonIndex] = newState[buttonIndex] === "#" ? "." : "#"),
    )
    return newState.join("")
  })
})

const getSteps = (machines: Parsed) => {
  const steps = machines.reduce((sum, machine) => {
    let steps = 0
    let states = new Set([
      machine.target
        .split("")
        .map(() => ".")
        .join(""),
    ])
    let nextStates = new Set<string>()
    let maxSteps = 10
    while (maxSteps--) {
      for (let state of states) {
        if (state === machine.target) {
          return sum + steps
        }
        for (let updated of applyActions(machine, state)) {
          if (updated) nextStates.add(updated)
        }
      }
      steps++
      states = nextStates
      nextStates = new Set()
    }
    return sum
  }, 0)

  return steps
}

const { Context } = await init()
const solveMachine = async ({ targetJoltageArray, actions }: Parsed[0]) => {
  const { Int, Optimize } = new (Context as any)("main")

  const stateLength = targetJoltageArray.length
  const presses = actions.map((_, i) => Int.const(`x_${i}`))

  const optimizer = new Optimize()
  presses.forEach((p) => optimizer.add(p.ge(0)))

  // Constraint: for each state position, sum of contributing actions = target
  for (let j = 0; j < stateLength; j++) {
    const contributing = actions
      .map((indices, i) => (indices.includes(j) ? presses[i] : null))
      .filter((p): p is NonNullable<typeof p> => p !== null)

    if (contributing.length > 0) {
      optimizer.add(
        contributing.reduce((a, b) => a.add(b)).eq(targetJoltageArray[j]),
      )
    }
  }

  // Minimize total presses
  optimizer.minimize(presses.reduce((a, b) => a.add(b)))

  await optimizer.check()
  const model = optimizer.model()

  return presses.reduce((sum, p) => sum + Number(model.eval(p).toString()), 0)
}

const part1 = (rawInput: string) => {
  const machines = parseInput(rawInput)
  return getSteps(machines)
}

const part2 = async (rawInput: string) => {
  const machines = parseInput(rawInput)
  let total = 0
  for (const machine of machines) {
    total += await solveMachine(machine)
  }
  return total
}

const input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`

run({
  part1: {
    tests: [
      {
        input,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input,
        expected: 33,
      },
    ],
    solution: part2 as unknown as (input: string) => number,
  },
  trimTestInputs: true,
  onlyTests: false,
})
