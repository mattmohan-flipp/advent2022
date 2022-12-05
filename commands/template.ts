import {
  Command,
  ArgumentValue,
  ValidationError,
  Type,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { Number } from "https://deno.land/x/cliffy@v0.25.4/prompt/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";

const fileExists = (fname: string): boolean => {
  try {
    Deno.statSync(fname);
    return true;
  } catch (_e) {
    return false;
  }
};
class DayType extends Type<number> {
  public parse({ label, name, value }: ArgumentValue): number {
    const day = parseInt(value, 10);
    if (isNaN(day) || day <= 0 || day > 25) {
      throw new ValidationError(
        `Invalid ${label} for '${name}': ${value} (should be 1-25)`
      );
    }
    if (fileExists(`days/day${day}`)) {
      throw new ValidationError("File already exists");
    } else {
      return day;
    }
  }
}

export const Template = new Command()
  .description("Create new source files and pull the input data from the API")
  .type("day", new DayType())
  .arguments("[day:day]")
  .option("--no-api", "Skip the AoC API request phase")
  .action(async ({ api }, dayParam) => {
    let day = dayParam;
    while (!day || day < 1 || day > 25 || fileExists(`days/day${day}.ts`)) {
      if (fileExists(`days/day${day}.ts`)) {
        console.log(
          colors.bold.red("ERROR:"),
          `File days/day${day}.ts already exists. Try again`
        );
      }
      day = await Number.prompt({
        message: "Which day?",
        min: 1,
        max: 25,
        suggestions: Array(25).map((_e, i) => i),
      });
    }
    const copyProm = Deno.copyFile(`templates/dayX.ts`, `days/day${day}.ts`);

    if (!api) {
      return copyProm;
    }
    if (fileExists(`input_data/day${day}.txt`)) {
      console.log("Input exists. Skipping download...");
      return copyProm;
    }
    const credsProm = Deno.readTextFile(".login/credentials.json");

    const creds = JSON.parse(await credsProm);

    const url = new URL(
      `https://adventofcode.com/${creds.year}/day/${day}/input`
    );
    const headers = new Headers({
      cookie: `session=${creds.token}`,
    });
    const inputReq = await fetch(url, { headers });
    if (!inputReq.ok) {
      throw new Error("Failed to fetch the input data");
    }
    const inputData = await inputReq.text();
    const writeProm = Deno.writeTextFile(`input_data/day${day}.txt`, inputData);

    return Promise.all([copyProm, writeProm]);
  });
