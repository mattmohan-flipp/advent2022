import {
  GIF,
  Image,
  Frame,
  TextLayout,
} from "https://deno.land/x/imagescript@1.2.15/mod.ts";

interface point {
  x: number;
  y: number;
}

interface aState {
  h: point;
  t: point;
}

const logGrid = (currentState: point[]) => {
  const grid: string[][] = currentState.reduce(
    (grid, knot, idx) => {
      const row = 10 - (knot.y - currentState[0].y);
      grid[row][knot.x - currentState[0].x + 10] = `${idx}`;
      return grid;
    },
    Array(20)
      .fill(0)
      .map(() => Array(20).fill("."))
  );
  return grid.map((row) => row.join("")).join("\n");
};

const day = {
  a: (file: string): string => {
    const visited = new Set<string>();
    visited.add("1000-1000");
    file.split("\n").reduce(
      (state, instruction): aState => {
        const [dir, dist] = instruction.split(" ");
        const newH = { ...state.h };
        const newT = { ...state.t };

        const vertical = dir === "U" || dir === "D" ? 1 : 0;
        const posNeg = dir === "L" || dir === "D" ? -1 : 1;
        for (let distNum = parseInt(dist, 10); distNum > 0; distNum--) {
          if (vertical) {
            newH.y += posNeg;
          } else {
            newH.x += posNeg;
          }

          const yDelta = Math.abs(newH.y - state.t.y);
          const xDelta = Math.abs(newH.x - state.t.x);
          if (yDelta > 1) {
            newT.y = newH.y - posNeg;
            newT.x = newH.x;
          }
          if (xDelta > 1) {
            newT.x = newH.x - posNeg;
            newT.y = newH.y;
          }
          visited.add(`${newT.x}-${newT.y}`);
        }
        return { h: newH, t: newT };
      },
      { h: { x: 1000, y: 1000 }, t: { x: 1000, y: 1000 } } as aState
    );
    return visited.size.toString();
  },
  b: (file: string): string => {
    const visited = new Set<string>();
    visited.add("1000-1000");

    const knots = 10;

    const frames: Frame[] = [];
    const fontFile = Deno.readFileSync(
      "/Users/mattmohan/Library/Fonts/Droid Sans Mono Nerd Font Complete.otf"
    );

    file.split("\n").reduce(
      (initialState, instruction): point[] => {
        const [dir, dist] = instruction.split(" ");
        const vertical = dir === "U" || dir === "D" ? true : false;
        const posNeg = dir === "L" || dir === "D" ? -1 : 1;
        const state = initialState.map((i) => ({ ...i })); // Deep copy the state
        // Iterate over dist steps
        for (let distNum = parseInt(dist, 10); distNum > 0; distNum--) {
          // Move the head one step
          if (vertical) {
            state[0].y += posNeg;
          } else {
            state[0].x += posNeg;
          }
          // move the body/tail segments
          for (let i = 1; i < state.length; i++) {
            const previousKnot = { ...state[i - 1] };

            const xDelta = previousKnot.x - state[i].x;
            const yDelta = previousKnot.y - state[i].y;
            const totalDelta = Math.abs(xDelta) + Math.abs(yDelta);

            if (totalDelta > 2) {
              state[i].x += xDelta > 0 ? 1 : -1;
              state[i].y += yDelta > 0 ? 1 : -1;
            } else {
              if (Math.abs(xDelta) > 1) {
                state[i].x += xDelta > 0 ? 1 : -1;
              }
              if (Math.abs(yDelta) > 1) {
                state[i].y += yDelta > 0 ? 1 : -1;
              }
            }
          }
          if (frames.length < 1000) {
            const frame = Frame.from(
              Image.renderText(
                fontFile,
                24,
                logGrid(state),
                0xff0000,
                new TextLayout({
                  maxHeight: 2000,
                  maxWidth: 2000,
                  wrapStyle: "char",
                })
              ),
              100
            );

            frames.push(frame);
          }
          console.log("Added frame ", frames.length);
          visited.add(`${state[knots - 1].x}-${state[knots - 1].y}`);
        }

        return state;
      },
      Array(knots)
        .fill(0)
        .map(() => ({ x: 1000, y: 1000 }))
    );

    const gif = new GIF(frames);
    const gifOutput = gif.encode(100);
    gifOutput.then((fileContents) => {
      Deno.writeFile("out.gif", fileContents);
    });

    return visited.size.toString();
  },
};
export default day;
