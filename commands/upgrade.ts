import { UpgradeCommand, GithubProvider } from "cliffy/command/upgrade/mod.ts";

export const Upgrade = new UpgradeCommand({
  main: "runner.ts",
  args: ["--allow-net"],
  provider: new GithubProvider({
    repository: "mattmohan-flipp/advent2022",
  }),
});
