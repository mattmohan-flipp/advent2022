import { day } from "./interface.ts";

const scoreElfVsHuman = [
  3, //"A X"
  6, //"A Y"
  0, //"A Z"
  0, //"B X"
  3, //'B Y'
  6, //'B Z'
  6, //'C X'
  0, //'C Y'
  3, //'C Z'
];
const elfToHuman = [
  2, //"A X" = "Z"
  0, //"A Y" = "X"
  1, //"A Z" = "Y"
  0, //"B X" = "X"
  1, //'B Y' = "Y"
  2, //'B Z' = "Z"
  1, //'C X' = "Y"
  2, //'C Y' = "Z"
  0, //'C Z' = "X"
];

const day: day = {
  a: (file) =>
    file
      .split("\n")
      .map((round) => {
        const elf = 3 * (round.charCodeAt(0) - 65);
        const human = round.charCodeAt(2) - 88;
        return scoreElfVsHuman[elf + human] + human + 1;
      })
      .reduce((cur, next) => cur + next, 0)
      .toString(),
  b: (file) =>
    file
      .split("\n")
      .map((round) => {
        const elf = 3 * (round.charCodeAt(0) - 65);
        const human = elfToHuman[elf + (round.charCodeAt(2) - 88)];
        return scoreElfVsHuman[elf + human] + human + 1;
      })
      .reduce((cur, next) => cur + next, 0)
      .toString(),
};
export default day;
