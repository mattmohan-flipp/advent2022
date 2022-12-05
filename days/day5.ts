interface DoublyLinkedNode<T> {
  left?: DoublyLinkedNode<T>;
  right?: DoublyLinkedNode<T>;
  value?: T;
}

const insertRight = <T>(value: T, destination: DoublyLinkedNode<T>): void =>
  insertNodeRight({ value }, destination);

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
  console.log(
    `Moving ${depth} crates ${_reduceStack(source)} from ${_reduceStack(
      startStack
    )} to ${_reduceStack(endStack)}`
  );
  source.left!.right = undefined;
  source.left = destination;
  destination.right = source;
};
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

const day = {
  a: (file: string): string => {
    const [a, b] = file.split("\n\n");
    const aLines = a.split("\n");
    const stackCount = (aLines.at(-1)!.length + 1) / 4;

    const stacks: DoublyLinkedNode<string>[] = [];

    for (let i = 0; i < stackCount; i++) {
      stacks[i] = {};
    }

    const crateInput = aLines.slice(0, -1);
    for (let i = 0; i < crateInput.length; i++) {
      for (let j = 0; j < stackCount; j++) {
        const cell = j * 4 + 1;
        if (crateInput[i][cell] !== " ") {
          insertRight(crateInput[i][cell], stacks[j]);
        }
      }
    }

    b.split("\n").forEach((instruction) => {
      const parts = instruction.split(" ");

      flipOnto(
        stacks[parseInt(parts[3], 10) - 1], //source stack
        stacks[parseInt(parts[5], 10) - 1], //destination stack
        parseInt(parts[1], 10) // count
      );
    });

    return stacks.reduce((acc, curr) => acc + findRightmost(curr).value, "");
  },
  b: (file: string): string => {
    const [a, b] = file.trimEnd().split("\n\n");
    const aLines = a.split("\n");
    const stackCount = (aLines.at(-1)!.length + 1) / 4;

    const stacks: DoublyLinkedNode<string>[] = [];

    for (let i = 0; i < stackCount; i++) {
      stacks[i] = {};
    }

    const crateInput = aLines.slice(0, -1);
    for (let i = 0; i < crateInput.length; i++) {
      for (let j = 0; j < stackCount; j++) {
        const cell = j * 4 + 1;
        if (crateInput[i][cell] && crateInput[i][cell] !== " ") {
          insertRight(crateInput[i][cell], stacks[j]);
          console.log("Inserting ", crateInput[i][cell]);
        }
      }
    }

    b.split("\n").forEach((instruction) => {
      const parts = instruction.split(" ");
      console.log(
        `Instruction: ${parts} ${stacks.map((stack) => _reduceStack(stack))}`
      );
      liftOnto(
        stacks[parseInt(parts[3], 10) - 1], //source stack
        stacks[parseInt(parts[5], 10) - 1], //destination stack
        parseInt(parts[1], 10) // count
      );
    });

    return stacks.reduce((acc, curr) => acc + findRightmost(curr).value, "");
  },
};
export default day;
