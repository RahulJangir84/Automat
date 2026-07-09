import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "scripts/cli.ts",   // input: scripts/cli.ts → output: dist/cli.js
  },
  format: ["esm"],           // ESM output (matches "type": "module" in package.json)
  target: "node18",
  outDir: "dist",
  clean: true,               // wipe dist/ before each build
  splitting: false,          // single file output
  bundle: true,              // bundle all imports into one file
  platform: "node",          // target Node.js platform (prevents dynamic require failures for built-ins)
});
