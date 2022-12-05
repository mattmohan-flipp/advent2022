const day = {
  a: (file: string): string =>
    file
      .split("\n")
      .reduce(() => "n/a", "n/a")
      .toString(),
  b: (file: string): string =>
    file
      .split("\n")
      .reduce(() => "n/a", "n/a")
      .toString(),
};
export default day;
