const day = {
  a: (file: string): string => {
    let signal = 0;
    let register = 1;
    file
      .trim()
      .split("\n")
      .map((instruction) => {
        if (instruction.startsWith("noop")) {
          return 0;
        } else {
          const [_, operand] = instruction.split(" ");
          return [0, parseInt(operand, 10)];
        }
      })
      .flat()
      .forEach((cycleChange, idx) => {
        const cycle = idx + 1;
        if ((cycle + 20) % 40 === 0) {
          signal += cycle * register;
          console.log(cycle, register + cycleChange);
        }
        register += cycleChange;
      });
    return signal.toString();
  },
  b: (file: string): string => {
    let output = "\n";
    let register = 1;
    file
      .trim()
      .split("\n")
      .map((instruction) => {
        if (instruction.startsWith("noop")) {
          return 0;
        } else {
          const [_, operand] = instruction.split(" ");
          return [0, parseInt(operand, 10)];
        }
      })
      .flat()
      .forEach((cycleChange, idx) => {
        const col = idx % 40;
        if (col === 0) {
          output += "\n";
        }
        const start = register - 1,
          end = register + 1;

        if (col >= start && col <= end) {
          output += "#";
        } else {
          output += ".";
        }

        // Handle end of cycle
        register += cycleChange;
      });
    return output.toString();
  },
};
export default day;
