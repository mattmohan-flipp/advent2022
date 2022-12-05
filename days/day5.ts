interface DoublyLinkedNode<T> {
  left?: DoublyLinkedNode<T>;
  right?: DoublyLinkedNode<T>;
  value?: T;
}

const insertNodeRight = <T>(
  source: DoublyLinkedNode<T>,
  destination: DoublyLinkedNode<T>
): void => {
  const oldLeft = source.left;
  const oldRight = source.right;
  if (destination.right) {
    destination.right.left = source;
  }
  source.right = destination.right;
  source.left = destination;

  destination.right = source;
  if (oldLeft) {
    oldLeft.right = oldRight;
  }
  if (oldRight) {
    oldRight.left = oldLeft;
  }
};

const findRightmost = <T>(source: DoublyLinkedNode<T>) => {
  let curr = source;
  while (curr && curr.right) {
    curr = curr.right;
  }
  return curr;
};

const flipOnto = (
  startStack: DoublyLinkedNode<string>,
  endStack: DoublyLinkedNode<string>,
  depth: number
) => {
  let source = findRightmost(startStack);
  let destination = findRightmost(endStack);

  for (let i = 0; i < depth && source.left; i++) {
    const nextSource = source.left;
    insertNodeRight(source, destination);
    destination = destination.right!;
    source = nextSource;
    source.right = undefined;
  }
};

const liftOnto = (
  startStack: DoublyLinkedNode<string>,
  endStack: DoublyLinkedNode<string>,
  depth: number
) => {
  let source = findRightmost(startStack);
  const destination = findRightmost(endStack);

  for (let i = 0; i < depth - 1 && source.left; i++) {
    source = source.left;
  }
  source.left!.right = undefined;
  source.left = destination;
  destination.right = source;
};

// Debugging function to print a stack as a string
const _reduceStack = (stack: DoublyLinkedNode<string>): string => {
  let result = "";
  let curr = stack;
  result += curr.value || "*";
  while (curr && curr.right) {
    curr = curr.right;
    result += curr.value || "*";
  }
  return result;
};

const parseFile = (
  file: string
): {
  stacks: DoublyLinkedNode<string>[];
  instructions: { count: number; source: number; destination: number }[];
} => {
  const [topInput, bottomInput] = file.split("\n\n"); // split the file into crate stacks and instructions

  const stackInput = topInput.split("\n");
  const stackCount = (stackInput.at(-1)!.length + 1) / 4; // use the length of the stack index row to determine stack count

  const stacks: DoublyLinkedNode<string>[] = Array(stackCount)
    .fill(0)
    .map(() => ({}));

  const crateInput = stackInput.slice(0, -1);
  for (let i = 0; i < crateInput.length; i++) {
    for (let j = 0; j < stackCount; j++) {
      const cell = j * 4 + 1;
      if (crateInput[i][cell] !== " ") {
        insertNodeRight({ value: crateInput[i][cell] }, stacks[j]);
      }
    }
  }

  const instructions = bottomInput
    .trim()
    .split("\n")
    .map((instruction) => instruction.split(" "))
    .map((parts) => ({
      count: parseInt(parts[1], 10),
      source: parseInt(parts[3], 10) - 1, //source stack
      destination: parseInt(parts[5], 10) - 1,
    }));

  return { stacks, instructions };
};

const day = {
  a: (file: string): string => {
    const { stacks, instructions } = parseFile(file);

    instructions.forEach(({ source, destination, count }) => {
      flipOnto(stacks[source], stacks[destination], count);
    });

    return stacks.reduce((acc, curr) => acc + findRightmost(curr).value, "");
  },
  b: (file: string): string => {
    const { stacks, instructions } = parseFile(file);

    instructions.forEach(({ source, destination, count }) => {
      liftOnto(stacks[source], stacks[destination], count);
    });

    return stacks.reduce((acc, curr) => acc + findRightmost(curr).value, "");
  },
};
export default day;
