// @ts-check
import { build } from "esbuild";

const watch = process.argv[2] === "watch";

await build({
  entryPoints: ["./src/main.ts"],
  bundle: true,
  format: "esm",
  outdir: "./build",
  platform: "browser",
  sourcemap: "external",
  watch,
});
