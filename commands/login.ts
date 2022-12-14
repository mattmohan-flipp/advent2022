import { Command } from "cliffy/command/command.ts";
import { Input } from "cliffy/prompt/mod.ts";

export const Login = new Command()
  .description("Provide the user session required to access the AoC API")
  .action(async () => {
    const token = await Input.prompt({
      message: "What is the session token?",
    });
    const output = JSON.stringify({ token, year: new Date().getFullYear() });
    await Deno.mkdir(".login", { mode: 0o700, recursive: true });
    return Deno.writeTextFile(".login/credentials.json", output, {
      create: true,
      mode: 0o600,
    });
  });
