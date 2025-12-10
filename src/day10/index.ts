import run from "aocrunner"
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

const getSteps = (
  machines: Parsed,
  initialState: (machine: Parsed[0]) => string,
  target: keyof Parsed[0] = "target",
  actionCallback = applyActions,
) => {
  const steps = machines.reduce((sum, machine) => {
    let steps = 0
    let states = new Set([initialState(machine)])
    let nextStates = new Set<string>()
    let maxSteps = 10
    while (maxSteps--) {
      for (let state of states) {
        if (state === machine[target]) {
          return sum + steps
        }
        for (let updated of actionCallback(machine, state)) {
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

const part1 = (rawInput: string) => {
  const machines = parseInput(rawInput)
  return getSteps(machines, (machine) =>
    machine.target
      .split("")
      .map(() => ".")
      .join(""),
  )
}

interface JoltageOption {
  state: number[]
  distance: ReturnType<typeof getJoltageGap>
  steps: 0
  key: string
}

const getJoltageGap = (current: number[], target: number[]) =>
  target.reduce(
    ({ gap, max, matched }, joltage, index) => {
      return {
        gap: gap + joltage - current[index],
        max: Math.max(max, joltage - current[index]),
        matched: matched + (joltage === current[index] ? 1 : 0),
      }
    },
    { gap: 0, max: 0, matched: 0 },
  )

// 1989 TOO LOW
const part2 = (rawInput: string) => {
  const machines = parseInput(rawInput)
  const steps = machines.reduce((sum, machine, index) => {
    const initialState = machine.targetJoltage.split(",").map(() => 0)
    const initialStateKey = initialState.join(",")
    const options = new Map<string, JoltageOption>()
    options.set(initialStateKey, {
      state: initialState,
      distance: getJoltageGap(initialState, machine.targetJoltageArray),
      steps: 0,
      key: initialStateKey,
    })

    const appliedJoltages = new Set<string>()
    const applyJoltages = (
      { actions, targetJoltageArray }: Parsed[0],
      option: JoltageOption,
    ) => {
      return actions.reduce((newOptions, action) => {
        const newOption = { ...option, state: [...option.state] }
        for (let joltageIndex of action) {
          const updated = newOption.state[joltageIndex] + 1
          if (updated > targetJoltageArray[joltageIndex]) return newOptions
          newOption.state[joltageIndex] = updated
        }
        newOption.key = newOption.state.join(",")
        if (appliedJoltages.has(newOption.key)) return newOptions
        newOption.steps++
        newOption.distance = getJoltageGap(newOption.state, targetJoltageArray)
        return [...newOptions, newOption]
      }, [] as JoltageOption[])
    }

    const getNextOption = () => {
      let option: JoltageOption = options.values().next().value!
      for (let compared of options.values()) {
        if (compared.distance.gap < option.distance.gap) option = compared
        if (
          compared.distance.gap === option.distance.gap &&
          compared.distance.max < option.distance.max
        )
          option = compared
        if (
          compared.distance.gap === option.distance.gap &&
          compared.distance.max === option.distance.max &&
          compared.distance.matched < option.distance.matched
        )
          option = compared
      }
      return option
    }

    let maxSteps = 1000
    while (maxSteps-- && options.size) {
      const option = getNextOption()
      options.delete(option.key)
      appliedJoltages.add(option.key)
      // console.log(
      //   "checking",
      //   machine.targetJoltage,
      //   option.key,
      //   option.steps,
      //   option.distance,
      // )
      if (option.key === machine.targetJoltage) {
        console.log(
          `found path for ${index + 1} of ${machines.length}`,
          JSON.stringify(option),
          machine.targetJoltage,
          maxSteps,
        )
        return sum + option.steps
      }
      for (let updated of applyJoltages(machine, option)) {
        if (!options.has(updated.key)) {
          options.set(updated.key, updated)
        }
      }
      // for (let state of states) {
      //   if (state === machine.targetJoltage) {
      //     return sum + steps
      //   }
      //   for (let updated of applyJoltages(machine, state)) {
      //     if (updated) nextStates.add(updated)
      //   }
      // }
      // steps++
      // states = nextStates
      // nextStates = new Set()
    }
    console.log(
      `no path found for ${index + 1} of ${machines.length}`,
      JSON.stringify(getNextOption()),
      machine.targetJoltage,
    )
    return sum
  }, 0)

  return steps
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
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
