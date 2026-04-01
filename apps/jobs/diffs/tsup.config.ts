import { builtinModules } from "node:module";
import { defineConfig } from "tsup";

const nodeBuiltins = [...builtinModules, ...builtinModules.map((m) => `node:${m}`)];

export default defineConfig({
    entry: { index: "src/index.ts" },
    format: ["esm"],
    target: "node24",
    outDir: "dist",
    clean: true,
    sourcemap: true,
    minify: true,
    splitting: false,
    bundle: true,
    noExternal: [/.*/],
    external: [...nodeBuiltins, /^@prisma\//, /^\.\/generated\//, "pg"],
    platform: "node",
    banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" },
});
