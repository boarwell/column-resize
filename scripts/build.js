// @ts-check
import { build } from "esbuild";

await build({
  entryPoints: ["./src/main.ts"],
  bundle: true,
  minify: true,
  outdir: "./build",
  platform: "browser",
  sourcemap: "external",
});
