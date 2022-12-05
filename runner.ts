import {
  Command,
  CompletionsCommand,
  HelpCommand,
} from "https://deno.land/x/cliffy@v0.25.4/command/mod.ts";
import { Solve } from "./commands/solve.ts";
import { Template } from "./commands/template.ts";
import { Login } from "./commands/login.ts";
import { colors } from "https://deno.land/x/cliffy@v0.25.4/ansi/colors.ts";
//import { Upgrade } from "./commands/upgrade.ts";

const command = new Command()
  .name("Advent")
  .version("2022.2.0")
  .description("Solve Advent of Code 2022")
  .default("help")
  .command("solve", Solve)
  .command("template", Template)
  .command("login", Login)
  //  .command("upgrade", Upgrade)
  .command("completions", new CompletionsCommand())
  .command("help", new HelpCommand().global());

try {
  command.parse();
} catch (e) {
  console.error(colors.bold.red("[FAIL] "), e);
}
