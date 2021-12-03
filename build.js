const production = process.argv[2] === "--production";
const watch = process.argv[2] === "--watch";
const { exec } = require("child_process");

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
    watch: watch && {
      onRebuild(error) {
        if (error) console.error("watch build failed:", error);
        else {
          exec("npm run compile:rust", (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });

          console.log("watch build succeeded");
        }
      },
    },
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
