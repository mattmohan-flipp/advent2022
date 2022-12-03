// Convert char to score
const charToScore = (c: string) =>
  c.charCodeAt(0) < 97 ? c.charCodeAt(0) - 38 : c.charCodeAt(0) - 96;

// Convert string to bitfield
const strToBitfield = (s: string) =>
  Array.from(s).reduce((f, c) => f | (1n << BigInt(charToScore(c))), 0n);

// Convert a bitfield back into a score
const bitfieldToScore = (n: bigint) => {
  let i = 0n;
  while (n >> i > 1n) {
    i++;
  }

  return i;
};

const day = {
  a: (file: string) =>
    file
      .split("\n")
      .map((sack) => {
        const midPoint = sack.length / 2;
        const first = strToBitfield(sack.slice(0, midPoint));
        const second = strToBitfield(sack.slice(midPoint));

        const answer = first & second;

        return bitfieldToScore(answer);
      })
      .reduce((cur, next) => cur + next, 0n)
      .toString(),
  b: (file: string) => {
    const lines = file.split("\n");

    let score = 0n;
    for (let i = 0; i < lines.length - 2; i += 3) {
      score += bitfieldToScore(
        strToBitfield(lines[i]) &
          strToBitfield(lines[i + 1]) &
          strToBitfield(lines[i + 2])
      );
    }

    return score.toString();
  },
};
export default day;
