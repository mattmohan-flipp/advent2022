const day = {
  a: (file: string): string => {
    for (let i = 3; i < file.length; i++) {
      if (
        file[i] !== file[i - 1] &&
        file[i] !== file[i - 2] &&
        file[i] !== file[i - 3] &&
        file[i - 1] !== file[i - 2] &&
        file[i - 1] !== file[i - 3] &&
        file[i - 2] !== file[i - 3]
      ) {
        return (i + 1).toString();
      }
    }
    return "N/A";
  },
  b: (file: string): string => {
    const field = Array(26).fill(0);
    for (let i = 0; i < 13; i++) {
      const char = file.charCodeAt(i) - 97;
      field[char]++;
    }
    for (let i = 13; i < file.length; i++) {
      const char = file.charCodeAt(i) - 97;
      field[char]++;
      if (field.filter((i) => i === 1).length === 14) {
        return (i + 1).toString();
      }

      const trailingChar = file.charCodeAt(i - 13) - 97;
      field[trailingChar]--;
    }

    return "N/A";
  },
};
export default day;
