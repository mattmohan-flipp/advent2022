import {
  Command,
  ArgumentValue,
  ValidationError,
  Type,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";

import { DayHalfFunc } from "../days/interface.ts";
import { Table } from "https://deno.land/x/cliffy@v0.25.4/table/mod.ts";

import { getTestCases, runTest } from "../helpers/tests.ts";

class DayType extends Type<number> {
  public parse({ label, name, value }: ArgumentValue): number {
    const day = parseInt(value, 10);
    if (isNaN(day) || day <= 0 || day > 25) {
      throw new ValidationError(
        `Invalid ${label} for '${name}': ${value} (should be 1-25)`
      );
    }
    try {
      Deno.statSync(`days/day${value}.ts`);
      return day;
    } catch (_e) {
      throw new ValidationError(`Module days/day${value}.ts not found`);
    }
  }
  public complete(): string[] {
    return Array.from(Deno.readDirSync("days"))
      .filter((file) => file.isFile && file.name.match(/^day[\d]{1,2}.ts/))
      .map((file) => file.name);
  }
}
export const Solve = new Command()
  .option("-t, --test", "Run on test data instead of production")
  .group("Day halves")
  .option("--one", "Run only the first half")
  .option("--two", "Run only the second half", { conflicts: ["one"] })
  .type("day", new DayType())
  .arguments("<day:day>")
  .action(async ({ test, one, two }, day) => {
    const { a, b } = (await import(`../days/day${day}.ts`)).default as {
      a: DayHalfFunc;
      b: DayHalfFunc;
    };
    if (test) {
      const { a: aCases, b: bCases } = await getTestCases(day);

      const aResults = !two
        ? (
            await Promise.all(aCases.map((testCase) => runTest(testCase, a)))
          ).map((res) => ["a", res.in, res.expected, res.got, res.msg])
        : [];
      const bResults = !one
        ? (
            await Promise.all(bCases.map((testCase) => runTest(testCase, b)))
          ).map((res) => ["b", res.in, res.expected, res.got, res.msg])
        : [];

      new Table()
        .header(["Part", "In", "Expected", "Got", "Message"])
        .body([...aResults, ...bResults])
        .render();
    } else {
      const file = await Deno.readTextFile(`input_data/day${day}.txt`);
      !two && console.log("Part 1: ", a(file));
      !one && console.log("Part 2: ", b(file));
    }
  });
