import esbuild from 'esbuild';
import { writeFileSync } from 'fs';

esbuild.build({
  entryPoints: ["./src/oyc.js"],
  bundle: true,
  sourcemap: 'external',
  minify: true,
  metafile: true,
  format: "esm",
  platform: "browser",
  target: ["es2022"],
  outfile: "./dist/oyc.min.js"
}).then(result => {
  writeFileSync('./dist/build.json', JSON.stringify(result.metafile))
});