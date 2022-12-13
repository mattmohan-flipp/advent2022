import { Node, djikstra } from "../helpers/graph.ts";

interface MapNode extends Node {
  char: number;
}

const sCode = "S".charCodeAt(0);
const eCode = "E".charCodeAt(0);
const aCode = "a".charCodeAt(0);
const zCode = "z".charCodeAt(0);

const parseMap = (map: string): MapNode[][] =>
  map
    .trim()
    .split("\n")
    .map((line) =>
      line.split("").map((char) => ({
        neighbors: new Map<MapNode, number>(),
        char: char.charCodeAt(0),
        distance: char[0] === "S" ? 0 : Infinity,
      }))
    );

const getChar = (a: MapNode) =>
  a.char === sCode ? aCode : a.char === eCode ? zCode : a.char;

const connectMap = (
  map: MapNode[][],
  connectNodes: (a: MapNode, b: MapNode) => void
) => {
  // Try to connect each cell to the ones right and below it
  map.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (i + 1 < map.length) {
        connectNodes(cell, map[i + 1][j]);
      }
      if (j + 1 < row.length) {
        connectNodes(cell, map[i][j + 1]);
      }
    })
  );
};

const day = {
  a: (file: string): string => {
    const map = parseMap(file);

    connectMap(map, (a: MapNode, b: MapNode) => {
      if (getChar(a) - getChar(b) >= -1) {
        a.neighbors.set(b, 1);
      }
      if (getChar(b) - getChar(a) >= -1) {
        b.neighbors.set(a, 1);
      }
    });

    // Find the start/end
    const start = map.flat().find((e) => e.char === sCode);
    const end = map.flat().find((e) => e.char === eCode);

    if (!start || !end) {
      throw new Error(`Failed to find start/end: ${start}-${end}`);
    }

    // Djikstra's algorithm
    // Start with current as the entrypoint
    djikstra(map.flat(), start);

    return end.distance.toString();
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
    start.distance = 0;
    end.distance = Infinity;
    end.char = aCode; // Treat the 'S' like an 'a' for part 2

    // Add connections/weights to nodes (with reversed connection logic)
    connectMap(map, (a: MapNode, b: MapNode) => {
      if (getChar(a) - getChar(b) >= -1) {
        b.neighbors.set(a, 1);
      }
      if (getChar(b) - getChar(a) >= -1) {
        a.neighbors.set(b, 1);
      }
    });

    // Find distances between nodes
    djikstra(nodes, start);

    return nodes
      .filter((e) => e.char === aCode)
      .reduce((a, c) => Math.min(a, c.distance), Infinity)
      .toString();
  },
};
export default day;
