interface Directory {
  size: number;
  children: Directory[];
  parent?: Directory;
}

const totalSize = 70000000;
const targetFree = 30000000;

const findClosestChild = (dir: Directory, target: number): number => {
  const children = dir.children.map((child) => findClosestChild(child, target));
  const bestChild = children
    .filter((e) => e > target)
    .reduce((a, c) => Math.min(a, c), dir.size);
  return bestChild;
};

const buildTree = (file: string) => {
  let current: Directory = { size: 0, children: [] };

  // Build a tree from the provided shell output
  file.split("\n").forEach((line) => {
    if (line.startsWith("$ cd ..")) {
      current.parent!.size += current.size;
      current = current.parent!;
    } else if (line.startsWith("$ cd")) {
      const next: Directory = { size: 0, children: [], parent: current };
      current.children.push(next);
      current = next;
    } else {
      const matches = line.match(/^([\d])+\s/);
      if (!matches) {
        return;
      }
      const cur = parseInt(matches[0], 10);
      current.size += cur;
    }
  });

  // Descend from last entry and fill in blanks
  while (current.parent) {
    current.parent.size += current.size;
    current = current.parent;
  }
  return current;
};

const sumTree = (dir: Directory, threshold: number): number => {
  const cappedDirSize = dir.size > threshold ? 0 : dir.size;
  return dir.children
    .map((child) => sumTree(child, threshold))
    .reduce((acc, child) => acc + child, cappedDirSize);
};

const day = {
  a: (file: string): string => {
    return sumTree(buildTree(file), 100000).toString();
  },
  b: (file: string): string => {
    const current = buildTree(file);
    const bestDir = findClosestChild(
      current,
      targetFree - (totalSize - current.size)
    );

    return bestDir.toString();
  },
};
export default day;
