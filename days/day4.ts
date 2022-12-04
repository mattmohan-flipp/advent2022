import { day } from "./interface.ts";
const day: day = {
  a: (file) =>
    file
      .split("\n")
      .map((line) => line.split(","))
      .map((pair) => pair.map((p) => p.split("-").map((e) => parseInt(e, 10))))
      .filter(
        ([a, b]) =>
          (a[0] >= b[0] && a[1] <= b[1]) || (b[0] >= a[0] && b[1] <= a[1])
      )
      .length.toString(),
  b: (file) =>
    file
      .split("\n")
      .map((line) => line.split(","))
      .map((pair) => pair.map((p) => p.split("-").map((e) => parseInt(e, 10))))
      .filter(
        ([a, b]) =>
          (a[0] <= b[0] && a[1] >= b[0]) || (b[0] <= a[0] && b[1] >= a[0])
      )
      .length.toString(),
};
export default day;
