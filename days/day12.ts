interface Node {
  neighbors: Map<Node, number>;
  char: number;
  distanceFromStart: number;
  x: number;
  y: number;
}

const sCode = "S".charCodeAt(0);
const eCode = "E".charCodeAt(0);

const connectNodes = (a: Node, b: Node, reverse: boolean) => {
  if (!reverse) {
    if (getChar(a) - getChar(b) >= -1) {
      a.neighbors.set(b, 1);
    }
    if (getChar(b) - getChar(a) >= -1) {
      b.neighbors.set(a, 1);
    }
  } else {
    if (getChar(a) - getChar(b) >= -1) {
      b.neighbors.set(a, 1);
    }
    if (getChar(b) - getChar(a) >= -1) {
      a.neighbors.set(b, 1);
    }
  }
};

const parseMap = (map: string): Node[][] => {
  const lines = map
    .trim()
    .split("\n")
    .map((line) => line.split(""));
  return lines.map((row, i) =>
    row.map<Node>((char, j) => ({
      neighbors: new Map<Node, number>(),
      char: char.charCodeAt(0),
      distanceFromStart: char[0] === "S" ? 0 : Infinity,
      x: j,
      y: i,
    }))
  );
};

const getChar = (a: Node) => {
  if (a.char === sCode) {
    return "a".charCodeAt(0); //a
  } else if (a.char === eCode) {
    return "z".charCodeAt(0); //z
  }
  return a.char;
};

const connectMap = (map: Node[][], reverse = false) => {
  // Try to connect each cell to the ones right and below it
  map.forEach((row, i) =>
    row.forEach((_, j) => {
      if (i + 1 < map.length) {
        connectNodes(map[i][j], map[i + 1][j], reverse);
      }
      if (j + 1 < row.length) {
        connectNodes(map[i][j], map[i][j + 1], reverse);
      }
    })
  );
};

const day = {
  a: (file: string): string => {
    const map = parseMap(file);

    connectMap(map);

    // Find the start/end
    const start = map.flat().find((e) => e.char === sCode);
    const end = map.flat().find((e) => e.char === eCode);

    if (!start || !end) {
      throw new Error(`Failed to find start/end: ${start}-${end}`);
    }

    // Djikstra's algorithm
    // Start with current as the entrypoint
    djikstra(map.flat(), start);

    return end.distanceFromStart.toString();
  },
  b: (file: string): string => {
    const map = parseMap(file);
    const nodes = map.flat();

    // Find the start/end node
    const start = nodes.find((e) => e.char === eCode);
    const end = nodes.find((e) => e.char === sCode);

    if (!start || !end) {
      throw new Error(`Failed to find start/end: ${start}-${end}`);
    }

    // Hack to make part2 more like part1
    start.distanceFromStart = 0;
    end.distanceFromStart = Infinity;
    end.char = 97; // Treat the 'S' like an 'a' for part 2

    // Add connections/weights to nodes (with reversed connection logic)
    connectMap(map, true);

    // Find distances between nodes
    djikstra(nodes, start);

    return nodes
      .filter((e) => e.char === 97)
      .reduce((a, c) => Math.min(a, c.distanceFromStart), Infinity)
      .toString();
  },
};
export default day;

const djikstra = <T extends Node>(nodes: T[], start: T) => {
  const toConsider = new Set(nodes);

  let current = start;

  while (current && current.distanceFromStart < Infinity) {
    current.neighbors.forEach((dist, cell) => {
      if (cell.distanceFromStart > current!.distanceFromStart + dist) {
        cell.distanceFromStart = current!.distanceFromStart + dist;
      }
    });
    toConsider.delete(current);
    current = Array.from(toConsider).sort(
      (a, b) => a.distanceFromStart - b.distanceFromStart
    )[0];
  }
};
