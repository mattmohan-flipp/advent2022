import { boolean } from "https://deno.land/x/cliffy@v0.25.4/flags/types/boolean.ts";
import { string } from "https://deno.land/x/cliffy@v0.25.4/flags/types/string.ts";
import { day, DayHalfFunc } from "../days/interface.ts";

interface TestCase {
  in: string;
  out: string;
}

interface TestCases {
  a: TestCase[];
  b: TestCase[];
}
interface TestCaseResult {
  in: string;
  out: string;
  expected: string;
  got: string;
  msg: string;
}
export interface TestCaseResults {
  a: TestCaseResult[];
  b: TestCaseResult[];
}

export const getTestCases = async (day: number): Promise<TestCases> => {
  const files = new Set<string>();
  const inputs: TestCases = { a: [], b: [] };
  const dir = `test_data/day${day}/`;
  for await (const file of Deno.readDir(dir)) {
    if (!file.isFile) {
      continue;
    }
    files.add(`${dir}${file.name}`);
  }
  for (const file of files) {
    if (file.endsWith(".in.txt")) {
      const base = file.slice(0, -7);
      const aName = `${base}.a.out.txt`;
      const bName = `${base}.b.out.txt`;

      if (files.has(aName)) {
        inputs.a.push({ in: file, out: aName });
      }
      if (files.has(bName)) {
        inputs.b.push({ in: file, out: bName });
      }
    }
  }
  return inputs;
};

export const runTest = async (
  testCase: TestCase,
  executor: DayHalfFunc
): Promise<TestCaseResult> => {
  try {
    const inProm = Deno.readTextFile(testCase.in);
    const outProm = Deno.readTextFile(testCase.out);
    const [a, b] = await Promise.all([inProm, outProm]);
    const got = executor(a);
    return { ...testCase, expected: b, got, msg: "" };
  } catch (e) {
    return {
      ...testCase,
      expected: "N/A",
      got: "",
      msg: `Exception Thrown: ${JSON.stringify(e)}`,
    };
  }
};
