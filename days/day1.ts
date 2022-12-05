// Split the data-set by elf, then total each elf's count and return the counts as an array
const findCounts = (file: string): number[] =>
  file
    .trim()
    .split("\n\n")
    .map((lines) =>
      lines.split("\n").reduce((acc, cur) => acc + parseInt(cur, 10), 0)
    );

const day = {
  a: (file: string): string =>
    findCounts(file)
      .reduce((acc, cur) => Math.max(acc, cur), 0)
      .toString(),
  b: (file: string): string =>
    findCounts(file)
      .sort()
      .slice(-3)
      .reduce((acc, cur) => acc + cur, 0)
      .toString(),
};
export default day;
