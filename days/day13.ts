type NumberOrNumberArray = number | number[] | NumberOrNumberArray[];

const parseBrackets = (input: string): NumberOrNumberArray => JSON.parse(input);

// Values manually set to hack the sort function
enum State {
  VALID = -1,
  INVALID = 1,
  UNKNOWN = 0,
}

const compare = (
  left: NumberOrNumberArray,
  right: NumberOrNumberArray
): State => {
  // Compare numbers first
  if (!Array.isArray(left) && !Array.isArray(right)) {
    if (left < right) {
      return State.VALID;
    } else if (left > right) {
      return State.INVALID;
    }
    return State.UNKNOWN;
  }
  // If either side isn't an array convert and compare
  if (!Array.isArray(left)) {
    return compare([left], right);
  }
  if (!Array.isArray(right)) {
    return compare(left, [right]);
  }

  // Otherwise compare the array elements
  for (let i = 0; i < left.length && i < right.length; i++) {
    const res = compare(left[i], right[i]);
    if (res !== State.UNKNOWN) {
      return res;
    }
  }
  if (left.length > right.length) {
    return State.INVALID;
  }
  if (left.length < right.length) {
    return State.VALID;
  }
  return State.UNKNOWN;
};

// Check if the input conforms to [[num]]
const isDoublyNestedNumber =
  (num: number) =>
  (arr: NumberOrNumberArray): boolean =>
    Array.isArray(arr) &&
    arr.length === 1 &&
    Array.isArray(arr[0]) &&
    arr[0].length === 1 &&
    arr[0][0] === num;

const day = {
  a: (file: string): string =>
    file
      .trim()
      .split("\n\n") // Split into packets
      .map((pair) => pair.split("\n").map(parseBrackets)) //Parse into a tuple of [left,right]
      .map(([left, right]) => compare(left, right)) // Compare each pair
      .map((e, idx) => (e === State.VALID ? idx + 1 : 0)) // Adjust for 1-indexed output and skip invalid
      .reduce((a, c) => a + c, 0)
      .toString(),
  b: (file: string): string => {
    const packets = file
      .trim()
      .split("\n")
      .filter((e) => e) // remove empty lines
      .map((pair) => pair.split("\n").map(parseBrackets)) // Parse lines into packets
      .concat([[[2]]], [[[6]]]) // Inject the markers
      .sort((a, b) => compare(a, b)); // Sort packets

    // Find the markers in the sorted packets
    const start = packets.findIndex(isDoublyNestedNumber(2));
    const end = packets.findIndex(isDoublyNestedNumber(6));

    // Adjust for 1-indexed output and multiply
    return ((start + 1) * (end + 1)).toString();
  },
};
export default day;
