import { day } from "./interface.ts";

const scoreElfVsHuman = {
  A: {
    X: 3,
    Y: 6,
    Z: 0,
  },
  B: {
    X: 0,
    Y: 3,
    Z: 6,
  },
  C: {
    X: 6,
    Y: 0,
    Z: 3,
  },
};
const elfToHuman = {
  A: {
    X: "Z",
    Y: "X",
    Z: "Y",
  },
  B: {
    X: "X",
    Y: "Y",
    Z: "Z",
  },
  C: {
    X: "Y",
    Y: "Z",
    Z: "X",
  },
};
const score = {
  X: 1,
  Y: 2,
  Z: 3,
};

const day: day = {
  a: (file: string) =>
    file
      .split("\n")
      .map((round) => {
        const plays = round.split(" ");
        if (plays.length !== 2) {
          console.error(`Bad: ${round}`);
        }
        const elf = plays[0] as "A" | "B" | "C";
        const human = plays[1] as "X" | "Y" | "Z";
        return scoreElfVsHuman[elf][human] + score[human];
      })
      .reduce((cur, next) => cur + next, 0)
      .toString(),
  b: (file) =>
    file
      .split("\n")
      .map((round) => {
        const plays = round.split(" ");
        if (plays.length !== 2) {
          console.error(`Bad: ${round}`);
        }
        const elf = plays[0] as "A" | "B" | "C";
        const human = elfToHuman[elf][plays[1] as "X" | "Y" | "Z"] as
          | "X"
          | "Y"
          | "Z";
        return scoreElfVsHuman[elf][human] + score[human];
      })
      .reduce((cur, next) => cur + next, 0)
      .toString(),
};
export default day;
