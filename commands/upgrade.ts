import {
  UpgradeCommand,
  GithubProvider,
} from "https://deno.land/x/cliffy@v0.25.4/command/upgrade/mod.ts";

export const Upgrade = new UpgradeCommand({
  main: "runner.ts",
  args: ["--allow-net"],
  provider: new GithubProvider({
    repository: "mattmohan-flipp/advent2022",
  }),
});
