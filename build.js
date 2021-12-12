const production = process.argv[2] === "--production";
const watch = process.argv[2] === "--watch";
const wasmpack = require("esbuild-plugin-wasm-pack").wasmPack;

require("esbuild")
  .build({
    entryPoints: ["./extension.ts", "server.ts"],
    bundle: true,
    outdir: "./dist",
    external: ["vscode"],
    format: "cjs",
    sourcemap: !production,
    minify: production,
    target: ["ES2020"],
    platform: "node",
    plugins: [
      wasmpack({
        target: "nodejs",
        outDir: "dist",
      }),
    ],
    watch: watch && {
      onRebuild(error) {
        if (error) console.error("watch build failed:", error);
        else {
          console.log("build successful");
        }
      },
    },
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
