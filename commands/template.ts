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
  .type("day", new DayType())
  .arguments("[day:day]")
  .action(async (_opts, dayParam) => {
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

    await Deno.copyFile(`templates/dayX.ts`, `days/day${day}.ts`);
  });
