export const teeLog = <T>(header: string, transformer: (arg0: T) => string) => {
  const headerRow = `= ${header} =`;
  const headerText = [
    "",
    headerRow[0].repeat(headerRow.length),
    headerRow,
    headerRow[0].repeat(headerRow.length),
  ].join("\n");
  console.log(headerText);
  return tee((e: T, idx: number) => {
    console.log(`${idx} => ${transformer(e)}`);
  });
};

export const tee =
  <T>(callback: (e: T, idx: number) => void) =>
  (e: T, idx: number) => {
    callback(e, idx);
    return e;
  };

export const add = (a: number, b: number) => a + b;
export const clamp = (min: number, max: number) => (a: number) =>
  Math.min(Math.max(a, min), max);
