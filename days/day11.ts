const monkeyFromText = (text: string) => {
  const lines = text.trim().split("\n").slice(1); // Trim, split, and then skip the first line
  const [_a, itemString] = lines[0].trim().split(":");
  const items = itemString.split(",").map((e) => parseInt(e, 10));
  const [_b, operation] = lines[1].split(": new =");
  const [_c, testString] = lines[2].split(": divisible by ");
  const test = parseInt(testString, 10);
  const [_d, trueTargetStr] = lines[3].split("throw to monkey");
  const [_e, falseTargetStr] = lines[4].split("throw to monkey");
  const trueTarget = parseInt(trueTargetStr, 10);
  const falseTarget = parseInt(falseTargetStr, 10);

  return {
    items,
    operation,
    test,
    trueTarget,
    falseTarget,
  };
};

const day = {
  a: (file: string): string => {
    const monkeys = file
      .trim()
      .split("\n\n")
      .map((monkeyText) => monkeyFromText(monkeyText));

    const counts: number[] = Array(monkeys.length).fill(0);
    for (let round = 0; round < 20; round++) {
      monkeys.forEach((monkey, idx) => {
        // Inspect phase
        counts[idx] += monkey.items.length;
        monkey.items
          .map((item) => {
            const op = monkey.operation.replaceAll("old", item.toString());
            const afterOp = eval(`(()=>${op})`)();
            const relieved = Math.floor(afterOp / 3);
            return relieved;
          })
          .forEach((item) => {
            if (item % monkey.test === 0) {
              monkeys[monkey.trueTarget].items.push(item);
            } else {
              monkeys[monkey.falseTarget].items.push(item);
            }
          });
        monkey.items = [];
      });
    }

    return counts
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((a, c) => a * c, 1)
      .toString();
  },
  b: (file: string): string => {
    const monkeys = file
      .trim()
      .split("\n\n")
      .map((monkeyText) => monkeyFromText(monkeyText));

    const lcm = monkeys.reduce((a, c) => a * c.test, 1); // They used all prime numbers, so this is actually the lcm

    const counts: bigint[] = Array(monkeys.length).fill(0n);
    for (let round = 0; round < 10000; round++) {
      monkeys.forEach((monkey, idx) => {
        // Inspect phase
        counts[idx] += BigInt(monkey.items.length);
        monkey.items
          .map((item) => {
            const op = monkey.operation.replaceAll("old", item.toString());
            const afterOp = eval(`(()=>${op})`)();
            return afterOp % lcm;
          })
          .forEach((item) => {
            if (item % monkey.test === 0) {
              monkeys[monkey.trueTarget].items.push(item);
            } else {
              monkeys[monkey.falseTarget].items.push(item);
            }
          });
        monkey.items = [];
      });
    }

    return counts
      .sort((a, b) => Number(b - a))
      .slice(0, 2)
      .reduce((a, c) => a * c, 1n)
      .toString();
  },
};
export default day;
