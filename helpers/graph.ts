export interface Node {
  neighbors: Map<Node, number>;
  distance: number;
}
export const djikstra = <T extends Node>(
  nodes: T[],
  start: T,
  comparator = (a: T, b: T) => a.distance - b.distance
) => {
  const toConsider = new Set(nodes);

  let current = start;

  while (current && current.distance < Infinity) {
    current.neighbors.forEach((dist, cell) => {
      if (cell.distance > current!.distance + dist) {
        cell.distance = current!.distance + dist;
      }
    });
    toConsider.delete(current);
    current = Array.from(toConsider).sort(comparator)[0];
  }
};
