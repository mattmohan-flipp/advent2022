export const teeLog = <T>(header: string, transformer: (arg0: T) => string) => {
  const headerRow = `= ${header} =`;
  const headerText = [
    "",
    headerRow[0].repeat(headerRow.length),
    headerRow,
    headerRow[0].repeat(headerRow.length),
  ].join("\n");
  console.log(headerText);
  return (e: T, idx: number) => {
    console.log(`${idx} => ${transformer(e)}`);
    return e;
  };
};
