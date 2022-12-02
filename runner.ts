import {
  Command,
  CompletionsCommand,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { Solve } from "./commands/solve.ts";
import { Upgrade } from "./commands/upgrade.ts";

new Command()
  .name("Advent")
  .version("2022.2.0")
  .description("Solve Advent of Code 2022")
  .command("solve", Solve)
  .command("upgrade", Upgrade)
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
